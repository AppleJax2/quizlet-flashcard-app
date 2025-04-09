const Redis = require('ioredis');
const env = require('../config/env');
const logger = require('../config/logger');

class RedisService {
  constructor() {
    this.client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        if (times > 3) {
          return null;
        }
        return Math.min(times * 100, 3000);
      }
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis Client Connected');
    });
  }

  /**
   * Add token to blacklist
   * @param {string} token - JWT token to blacklist
   * @param {number} expiresIn - Seconds until token expires
   */
  async blacklistToken(token, expiresIn) {
    try {
      await this.client.setex(`blacklist:${token}`, expiresIn, '1');
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      throw error;
    }
  }

  /**
   * Check if token is blacklisted
   * @param {string} token - JWT token to check
   * @returns {Promise<boolean>} - Whether token is blacklisted
   */
  async isTokenBlacklisted(token) {
    try {
      const exists = await this.client.exists(`blacklist:${token}`);
      return exists === 1;
    } catch (error) {
      logger.error('Error checking blacklisted token:', error);
      throw error;
    }
  }

  /**
   * Cache data with expiration
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} expiresIn - Seconds until expiration
   */
  async cache(key, data, expiresIn) {
    try {
      await this.client.setex(key, expiresIn, JSON.stringify(data));
    } catch (error) {
      logger.error('Error caching data:', error);
      throw error;
    }
  }

  /**
   * Get cached data
   * @param {string} key - Cache key
   * @returns {Promise<any>} - Cached data or null
   */
  async getCached(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Error getting cached data:', error);
      throw error;
    }
  }

  /**
   * Increment rate limit counter
   * @param {string} key - Rate limit key
   * @param {number} expiresIn - Window size in seconds
   * @returns {Promise<number>} - Current count
   */
  async incrementRateLimit(key, expiresIn) {
    const multi = this.client.multi();
    multi.incr(key);
    multi.expire(key, expiresIn);
    const results = await multi.exec();
    return results[0][1];
  }
}

// Export singleton instance
module.exports = new RedisService(); 