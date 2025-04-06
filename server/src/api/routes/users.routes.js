const express = require('express');
const { usersController } = require('../controllers');
const { validateRequest, authenticationMiddleware } = require('../middleware');
const { validationSchemas } = require('../utils');

const router = express.Router();

// All routes require authentication
router.use(authenticationMiddleware);

// User profile management
router.put(
  '/profile',
  validateRequest(validationSchemas.updateUserSchema),
  usersController.updateProfile
);

router.delete(
  '/profile',
  usersController.deleteAccount
);

module.exports = router; 