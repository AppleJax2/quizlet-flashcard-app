const express = require('express');
const { authController } = require('../controllers');
const { validateRequest, authLimiter, authenticationMiddleware } = require('../middleware');
const { validationSchemas } = require('../utils');

const router = express.Router();

// Public routes with auth rate limiting
router.post(
  '/register',
  authLimiter,
  (req, res, next) => {
    console.log('==== REGISTER REQUEST BODY ====');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('==============================');
    next();
  },
  validateRequest(validationSchemas.registerSchema),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validateRequest(validationSchemas.loginSchema),
  authController.login
);

router.post(
  '/forgot-password',
  authLimiter,
  validateRequest(validationSchemas.forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  validateRequest(validationSchemas.resetPasswordSchema),
  authController.resetPassword
);

// Protected routes
router.get(
  '/me',
  authenticationMiddleware,
  authController.getCurrentUser
);

module.exports = router; 