const winston = require('winston');
const env = require('./env');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? '\n' + JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Create transports array based on environment
const transports = [];

// Always log to console
transports.push(
  new winston.transports.Console({
    format: consoleFormat,
    level: env.isDevelopment() ? 'debug' : 'info',
  })
);

// In production, also log to file
if (env.isProduction()) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: logFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    })
  );
}

// Create and configure the logger
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels: winston.config.npm.levels,
  format: logFormat,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan integration
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger; 