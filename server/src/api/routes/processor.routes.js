const express = require('express');
const { processorController } = require('../controllers');
const { 
  validateRequest, 
  authenticationMiddleware, 
  uploadLimiter,
  generationLimiter,
  documentUpload,
  handleUploadErrors,
} = require('../middleware');
const { validationSchemas } = require('../utils');

const router = express.Router();

// All routes require authentication
router.use(authenticationMiddleware);

// Process text
router.post(
  '/text',
  uploadLimiter,
  validateRequest(validationSchemas.textProcessingSchema),
  processorController.processText
);

// Process URL
router.post(
  '/url',
  uploadLimiter,
  validateRequest(validationSchemas.urlProcessingSchema),
  processorController.processUrl
);

// Process file upload
router.post(
  '/file',
  uploadLimiter,
  documentUpload,
  (req, res, next) => handleUploadErrors(req, res, next),
  processorController.processFile
);

// Generate flashcards
router.post(
  '/generate',
  generationLimiter,
  validateRequest(validationSchemas.generationParamsSchema),
  processorController.generateFlashcards
);

// Task status and management
router.get(
  '/task/:taskId',
  validateRequest(validationSchemas.taskQuerySchema, 'params'),
  processorController.getTaskStatus
);

router.delete(
  '/task/:taskId',
  validateRequest(validationSchemas.taskQuerySchema, 'params'),
  processorController.cancelTask
);

module.exports = router; 