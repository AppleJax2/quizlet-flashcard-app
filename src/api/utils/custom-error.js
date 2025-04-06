const { StatusCodes } = require('http-status-codes');

/**
 * Base custom error class
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for when a resource is not found
 */
class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, StatusCodes.NOT_FOUND);
  }
}

/**
 * Error for bad requests (validation errors, etc.)
 */
class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

/**
 * Error for unauthorized access (no authentication)
 */
class UnauthenticatedError extends CustomError {
  constructor(message = 'Authentication required') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

/**
 * Error for forbidden access (authenticated but not allowed)
 */
class ForbiddenError extends CustomError {
  constructor(message = 'Access forbidden') {
    super(message, StatusCodes.FORBIDDEN);
  }
}

/**
 * Error for duplicate resources (conflicts)
 */
class ConflictError extends CustomError {
  constructor(message = 'Resource already exists') {
    super(message, StatusCodes.CONFLICT);
  }
}

/**
 * Error for when a service is unavailable
 */
class ServiceUnavailableError extends CustomError {
  constructor(message = 'Service unavailable') {
    super(message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

/**
 * Error for when processing fails internally
 */
class ProcessingError extends CustomError {
  constructor(message = 'Processing failed', details = null) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    this.details = details;
  }
}

/**
 * Error for when a request times out
 */
class TimeoutError extends CustomError {
  constructor(message = 'Request timed out') {
    super(message, StatusCodes.REQUEST_TIMEOUT);
  }
}

/**
 * Error for when a resource exceeds size limits
 */
class PayloadTooLargeError extends CustomError {
  constructor(message = 'Payload too large') {
    super(message, StatusCodes.PAYLOAD_TOO_LARGE);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  ConflictError,
  ServiceUnavailableError,
  ProcessingError,
  TimeoutError,
  PayloadTooLargeError,
}; 