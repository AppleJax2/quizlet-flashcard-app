const { StatusCodes } = require('http-status-codes');
const logger = require('../../config/logger');
const env = require('../../config/env');

/**
 * Global error handler middleware
 * Formats all errors for consistent API responses
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  // Log the error for internal debugging
  logger.error({
    message: 'API Error',
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.userId,
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
  
  // Default error object
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later',
    code: err.code || 'INTERNAL_ERROR',
    details: err.details || null,
  };
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.code = 'VALIDATION_ERROR';
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
      
    customError.details = Object.entries(err.errors).reduce((acc, [key, value]) => {
      acc[key] = {
        message: value.message,
        path: value.path,
        value: value.value
      };
      return acc;
    }, {});
  }
  
  // Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.CONFLICT;
    customError.code = 'DUPLICATE_ERROR';
    
    const field = Object.keys(err.keyValue)[0];
    customError.message = `Duplicate value entered for ${field}, please choose another value`;
    customError.details = { field, value: err.keyValue[field] };
  }
  
  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.code = 'INVALID_ID';
    customError.message = `Invalid ${err.path}: ${err.value}`;
    customError.details = { field: err.path, value: err.value };
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.code = 'INVALID_TOKEN';
    customError.message = 'Invalid authentication token';
  }
  
  if (err.name === 'TokenExpiredError') {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.code = 'TOKEN_EXPIRED';
    customError.message = 'Authentication token expired';
  }
  
  // CORS error
  if (err.message && err.message.startsWith('CORS')) {
    customError.statusCode = StatusCodes.FORBIDDEN;
    customError.code = 'CORS_ERROR';
    customError.message = 'Cross-Origin Request Blocked';
  }
  
  // Include error details in development but not production
  const responseBody = {
    success: false,
    message: customError.message,
    code: customError.code,
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  };
  
  // Include error details (but sanitize for production)
  if (customError.details) {
    responseBody.details = customError.details;
  }
  
  // Include error metadata in development mode
  if (!env.isProduction()) {
    responseBody.error = {
      statusCode: customError.statusCode,
      name: err.name,
      stack: err.stack?.split('\n'),
    };
  }
  
  return res.status(customError.statusCode).json(responseBody);
};

module.exports = errorHandlerMiddleware; 