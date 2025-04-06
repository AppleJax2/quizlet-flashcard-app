const errorHandlerMiddleware = require('./error-handler.middleware');
const authenticationMiddleware = require('./authentication.middleware').authenticationMiddleware;
const optionalAuthMiddleware = require('./authentication.middleware').optionalAuthMiddleware;
const validateRequest = require('./validation.middleware');
const { apiLimiter, authLimiter, uploadLimiter, generationLimiter } = require('./rate-limiter.middleware');
const { 
  documentUpload, 
  imageUpload, 
  multipleUpload, 
  handleUploadErrors, 
  cleanupTempFiles 
} = require('./upload.middleware');

module.exports = {
  errorHandlerMiddleware,
  authenticationMiddleware,
  optionalAuthMiddleware,
  validateRequest,
  apiLimiter,
  authLimiter,
  uploadLimiter,
  generationLimiter,
  documentUpload,
  imageUpload,
  multipleUpload,
  handleUploadErrors,
  cleanupTempFiles
}; 