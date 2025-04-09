const { cleanEnv, str, num, bool, url } = require('envalid');

/**
 * Environment configuration with validation
 */
const env = cleanEnv(process.env, {
  // Node environment
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development'
  }),
  
  // Server configuration
  PORT: num({
    default: 3000,
    desc: 'Port to run the server on'
  }),
  API_PREFIX: str({
    default: '/api/v1',
    desc: 'API route prefix'
  }),
  
  // MongoDB configuration
  MONGODB_URI: url({
    desc: 'MongoDB connection string'
  }),
  
  // Redis configuration
  REDIS_URL: url({
    desc: 'Redis connection string',
    default: 'redis://localhost:6379'
  }),
  REDIS_PASSWORD: str({
    desc: 'Redis password',
    default: ''
  }),
  
  // JWT configuration
  JWT_SECRET: str({
    desc: 'Secret key for JWT signing',
    example: 'super-secret-key-change-me'
  }),
  JWT_LIFETIME: str({
    default: '1d',
    desc: 'JWT token lifetime'
  }),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: num({
    default: 15 * 60 * 1000,
    desc: 'Rate limit window in milliseconds'
  }),
  RATE_LIMIT_MAX: num({
    default: 100,
    desc: 'Maximum requests per window'
  }),
  
  // File upload
  MAX_FILE_SIZE: num({
    default: 5 * 1024 * 1024,
    desc: 'Maximum file size in bytes'
  }),
  UPLOAD_DIR: str({
    default: 'uploads',
    desc: 'Directory for file uploads'
  }),
  
  // Security
  CORS_ORIGIN: str({
    default: '*',
    desc: 'CORS allowed origin'
  }),
  ENABLE_HTTPS: bool({
    default: false,
    desc: 'Enable HTTPS'
  }),
  
  // Logging
  LOG_LEVEL: str({
    choices: ['error', 'warn', 'info', 'debug'],
    default: 'info',
    desc: 'Logging level'
  }),
  LOG_TO_FILE: bool({
    default: false,
    desc: 'Enable file logging'
  }),
  LOG_DIR: str({
    default: 'logs',
    desc: 'Directory for log files'
  }),
  
  // Email (optional)
  SMTP_HOST: str({
    default: '',
    desc: 'SMTP server host'
  }),
  SMTP_PORT: num({
    default: 587,
    desc: 'SMTP server port'
  }),
  SMTP_USER: str({
    default: '',
    desc: 'SMTP server username'
  }),
  SMTP_PASS: str({
    default: '',
    desc: 'SMTP server password'
  }),
  
  // Cache configuration
  CACHE_TTL: num({
    default: 3600,
    desc: 'Cache TTL in seconds'
  }),
  
  // Session configuration
  SESSION_SECRET: str({
    default: 'session-secret-change-me',
    desc: 'Session secret key'
  }),
});

// Helper methods
env.isDevelopment = () => env.NODE_ENV === 'development';
env.isTest = () => env.NODE_ENV === 'test';
env.isProduction = () => env.NODE_ENV === 'production';

module.exports = env; 