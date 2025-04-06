/**
 * Async handler utility to eliminate try/catch blocks in route handlers
 * @param {Function} fn - The async route handler function
 * @returns {Function} - Express middleware function with error handling
 */
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncHandler; 