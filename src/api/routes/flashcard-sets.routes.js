const express = require('express');
const { flashcardSetsController } = require('../controllers');
const { validateRequest, authenticationMiddleware, optionalAuthMiddleware } = require('../middleware');
const { validationSchemas } = require('../utils');

const router = express.Router();

// Public routes (with optional authentication)
router.get(
  '/public',
  optionalAuthMiddleware,
  validateRequest(validationSchemas.flashcardSetQuerySchema, 'query'),
  flashcardSetsController.getPublicFlashcardSets
);

// Routes that need authentication
router.use(authenticationMiddleware);

// Create flashcard set
router.post(
  '/',
  validateRequest(validationSchemas.createFlashcardSetSchema),
  flashcardSetsController.createFlashcardSet
);

// Get user's flashcard sets
router.get(
  '/',
  validateRequest(validationSchemas.flashcardSetQuerySchema, 'query'),
  flashcardSetsController.getFlashcardSets
);

// Search flashcard sets
router.get(
  '/search',
  validateRequest(validationSchemas.searchSchema, 'query'),
  flashcardSetsController.searchFlashcardSets
);

// Get single flashcard set
router.get(
  '/:id',
  validateRequest(validationSchemas.flashcardSetIdSchema, 'params'),
  flashcardSetsController.getFlashcardSet
);

// Get flashcard set statistics
router.get(
  '/:id/stats',
  validateRequest(validationSchemas.flashcardSetIdSchema, 'params'),
  flashcardSetsController.getFlashcardSetStats
);

// Update flashcard set
router.put(
  '/:id',
  validateRequest(validationSchemas.flashcardSetIdSchema, 'params'),
  validateRequest(validationSchemas.updateFlashcardSetSchema),
  flashcardSetsController.updateFlashcardSet
);

// Duplicate flashcard set
router.post(
  '/:id/duplicate',
  validateRequest(validationSchemas.flashcardSetIdSchema, 'params'),
  flashcardSetsController.duplicateFlashcardSet
);

// Delete flashcard set
router.delete(
  '/:id',
  validateRequest(validationSchemas.flashcardSetIdSchema, 'params'),
  flashcardSetsController.deleteFlashcardSet
);

module.exports = router; 