const rateLimit = require('express-rate-limit');
const { StatusCodes } = require('http-status-codes');
const env = require('../../config/env');

/**
 * API Rate Limiter
 * Limits the number of requests from a single IP within a time window
 */
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // Default: 15 minutes
  max: env.RATE_LIMIT_MAX, // Default: 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});

/**
 * Authentication Rate Limiter
 * More strict limits for authentication routes to prevent brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again later',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});

/**
 * Upload Rate Limiter
 * Limits file uploads and document processing
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many upload requests from this IP, please try again later',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});

/**
 * Generation Rate Limiter
 * Limits flashcard generation requests which are CPU-intensive
 */
const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 generation requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many generation requests from this IP, please try again later',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  generationLimiter,
}; 