const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Determine environment
const NODE_ENV = process.env.NODE_ENV || 'development';

// Load environment-specific .env file if it exists
const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
const fallbackPath = path.resolve(process.cwd(), '.env');

// Try environment-specific file first, then fallback to default
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (fs.existsSync(fallbackPath)) {
  dotenv.config({ path: fallbackPath });
}

/**
 * Environment configuration with validation
 */
const env = {
  // Server configuration
  NODE_ENV,
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  HOST: process.env.HOST || 'localhost',
  
  // MongoDB connection
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/quizlet-flashcard-generator',
  
  // Allowed origins for CORS (comma-separated in env)
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  
  // JWT Authentication
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_LIFETIME: process.env.JWT_LIFETIME || '1d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  JWT_REFRESH_LIFETIME: process.env.JWT_REFRESH_LIFETIME || '7d',
  
  // API Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
  AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '30', 10), // 30 auth requests per window
  
  // File upload limits
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10), // 50MB in megabytes
  UPLOAD_PATH: process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads'),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug'),
  
  // Resource limits
  TASK_TIMEOUT_MS: parseInt(process.env.TASK_TIMEOUT_MS || '300000', 10), // 5 minutes
  TASK_EXPIRY_MS: parseInt(process.env.TASK_EXPIRY_MS || '86400000', 10), // 24 hours
  
  // Security
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  
  // Validation and sanity checks
  validate() {
    const requiredVars = [
      'JWT_SECRET',
    ];
    
    const missing = requiredVars.filter(name => !this[name]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Validate MongoDB URI
    if (!this.MONGODB_URI.startsWith('mongodb://') && !this.MONGODB_URI.startsWith('mongodb+srv://')) {
      throw new Error('MONGODB_URI must be a valid MongoDB connection string');
    }
    
    // Validate port range
    if (this.PORT < 0 || this.PORT > 65535) {
      throw new Error('PORT must be between 0-65535');
    }
    
    // Validate rate limit values
    if (this.RATE_LIMIT_WINDOW_MS < 0) {
      throw new Error('RATE_LIMIT_WINDOW_MS must be a positive number');
    }
    
    if (this.RATE_LIMIT_MAX < 0) {
      throw new Error('RATE_LIMIT_MAX must be a positive number');
    }
    
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(this.UPLOAD_PATH)) {
      fs.mkdirSync(this.UPLOAD_PATH, { recursive: true });
    }
    
    return this;
  },
  
  /**
   * Determines if the application is running in production
   * @returns {boolean}
   */
  isProduction() {
    return this.NODE_ENV === 'production';
  },
  
  /**
   * Determines if the application is running in development
   * @returns {boolean}
   */
  isDevelopment() {
    return this.NODE_ENV === 'development';
  },
  
  /**
   * Determines if the application is running in test mode
   * @returns {boolean}
   */
  isTest() {
    return this.NODE_ENV === 'test';
  },
  
  /**
   * Get the app's base URL
   * @returns {string} - Base URL for the application
   */
  getBaseUrl() {
    const port = this.PORT !== 80 && this.PORT !== 443 ? `:${this.PORT}` : '';
    const protocol = this.isProduction() ? 'https' : 'http';
    return `${protocol}://${this.HOST}${port}`;
  }
};

module.exports = env; 