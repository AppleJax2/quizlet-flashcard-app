const { StatusCodes } = require('http-status-codes');
const { errors } = require('../utils');
const logger = require('../utils/logger');

/**
 * Middleware for validating request data against Joi schemas
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, query, params)
 * @returns {Function} - Express middleware
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }
    
    const dataToValidate = req[property];
    
    // Skip validation if there's no data and schema allows empty
    if (!dataToValidate && !schema.required) {
      return next();
    }
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true, // Remove unknown fields
      convert: true, // Convert types where possible
    });
    
    if (error) {
      // Log the detailed validation errors from Joi
      logger.error('Joi validation failed for property:', property);
      logger.error('Joi validation details:', JSON.stringify(error.details, null, 2));

      // Extract and format validation errors
      const validationErrors = error.details.map(detail => ({
        field: detail.context.key || detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
        type: detail.type,
      }));
      
      // Create structured error object
      const errorResponse = {
        error: 'Validation Error',
        details: validationErrors,
        message: 'The request data failed validation',
      };
      
      // Determine if this is a client or server error
      // Most validation errors should be client errors (Bad Request)
      return next(new errors.BadRequestError('Validation Error', errorResponse));
    }
    
    // Replace request data with validated and sanitized data
    req[property] = value;
    
    next();
  };
};

module.exports = validateRequest; 