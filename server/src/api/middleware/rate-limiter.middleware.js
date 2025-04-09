const { StatusCodes } = require('http-status-codes');
const { errors } = require('../utils');
const redisService = require('../../services/redis.service');
const logger = require('../../config/logger');

/**
 * Rate limiting configuration
 */
const RATE_LIMIT_CONFIG = {
  // General API endpoints
  default: {
    points: 100,      // Number of requests
    duration: 60,     // Per 60 seconds
    blockDuration: 300 // Block for 5 minutes if exceeded
  },
  // Authentication endpoints
  auth: {
    points: 5,        // Number of attempts
    duration: 300,    // Per 5 minutes
    blockDuration: 900 // Block for 15 minutes if exceeded
  },
  // High-security endpoints (password reset, etc)
  secure: {
    points: 3,        // Number of attempts
    duration: 900,    // Per 15 minutes
    blockDuration: 1800 // Block for 30 minutes if exceeded
  }
};

/**
 * Generate rate limit key
 * @param {Object} req - Express request object
 * @param {string} type - Rate limit type
 * @returns {string} Rate limit key
 */
const getRateLimitKey = (req, type) => {
  const identifier = req.user ? req.user.userId : req.ip;
  return `ratelimit:${type}:${identifier}`;
};

/**
 * Create rate limiter middleware
 * @param {string} type - Rate limit type (default, auth, secure)
 * @returns {Function} Express middleware
 */
const createRateLimiter = (type = 'default') => {
  const config = RATE_LIMIT_CONFIG[type] || RATE_LIMIT_CONFIG.default;

  return async (req, res, next) => {
    try {
      const key = getRateLimitKey(req, type);
      
      // Check if IP is blocked
      const blockKey = `${key}:blocked`;
      const isBlocked = await redisService.getCached(blockKey);
      
      if (isBlocked) {
        const retryAfter = await redisService.client.ttl(blockKey);
        res.set('Retry-After', retryAfter);
        return next(new errors.TooManyRequestsError(
          `Too many requests. Please try again after ${Math.ceil(retryAfter / 60)} minutes`
        ));
      }

      // Increment request counter
      const current = await redisService.incrementRateLimit(key, config.duration);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': config.points,
        'X-RateLimit-Remaining': Math.max(0, config.points - current),
        'X-RateLimit-Reset': Math.ceil(await redisService.client.ttl(key))
      });

      // Check if limit exceeded
      if (current > config.points) {
        // Block the IP/user
        await redisService.cache(blockKey, '1', config.blockDuration);
        
        // Log rate limit violation
        logger.warn('Rate limit exceeded', {
          type,
          identifier: req.user ? req.user.userId : req.ip,
          path: req.path,
          method: req.method
        });

        res.set('Retry-After', config.blockDuration);
        return next(new errors.TooManyRequestsError(
          `Too many requests. Please try again after ${Math.ceil(config.blockDuration / 60)} minutes`
        ));
      }

      next();
    } catch (error) {
      logger.error('Rate limiter error:', error);
      // Fail open - allow request in case of Redis error
      next();
    }
  };
};

// Export pre-configured rate limiters
module.exports = {
  defaultLimiter: createRateLimiter('default'),
  authLimiter: createRateLimiter('auth'),
  secureLimiter: createRateLimiter('secure')
}; 