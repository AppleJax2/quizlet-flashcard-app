const express = require('express');
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const flashcardSetsRoutes = require('./flashcard-sets.routes');
const processorRoutes = require('./processor.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/flashcard-sets', flashcardSetsRoutes);
router.use('/processor', processorRoutes);

// Export the main router as default
module.exports = router;

// Export individual route objects for direct mounting
router.auth = authRoutes;
router.users = usersRoutes;
router.flashcardSets = flashcardSetsRoutes;
router.processor = processorRoutes; 