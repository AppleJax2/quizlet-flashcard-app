const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const { User } = require('../models');
const { asyncHandler, errors } = require('../utils');
const logger = require('../../config/logger');
const { emailService } = require('../services');

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { username },
    ],
  });
  
  if (existingUser) {
    if (existingUser.email === email.toLowerCase()) {
      throw new errors.ConflictError('Email already in use');
    }
    throw new errors.ConflictError('Username already taken');
  }
  
  // Create user
  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password,
  });
  
  // Generate token
  const token = user.createJWT();
  
  // Log the registration
  logger.info(`New user registered: ${username} (${email}) - IP: ${req.ip}`);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Registration successful',
    user: user.toDTO(),
    token,
  });
});

/**
 * @route POST /api/v1/auth/login
 * @desc Login a user
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Check if user exists
  if (!user) {
    logger.warn(`Failed login attempt for non-existent user: ${email} - IP: ${req.ip}`);
    throw new errors.UnauthenticatedError('Invalid credentials');
  }
  
  // Check if account is active
  if (!user.active) {
    logger.warn(`Login attempt on inactive account: ${email} - IP: ${req.ip}`);
    throw new errors.UnauthenticatedError('Account is deactivated');
  }
  
  // Check if account is locked
  if (user.isLocked()) {
    logger.warn(`Login attempt on locked account: ${email} - IP: ${req.ip}`);
    const waitTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new errors.UnauthenticatedError(`Account is temporarily locked. Try again in ${waitTime} minutes`);
  }
  
  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  
  if (!isPasswordCorrect) {
    // Register failed login attempt
    const isLocked = await user.registerLoginAttempt();
    
    logger.warn(`Failed login attempt for user: ${email} - Attempts: ${user.loginAttempts} - IP: ${req.ip}`);
    
    if (isLocked) {
      throw new errors.UnauthenticatedError('Too many failed login attempts. Account temporarily locked');
    }
    
    throw new errors.UnauthenticatedError('Invalid credentials');
  }
  
  // Reset login attempts on successful login
  await user.resetLoginAttempts();
  
  // Generate token
  const token = user.createJWT();
  
  // Log successful login
  logger.info(`User logged in: ${email} - IP: ${req.ip}`);
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login successful',
    user: user.toDTO(),
    token,
  });
});

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Don't reveal if user exists or not for security
  if (!user) {
    logger.info(`Password reset attempted for non-existent email: ${email} - IP: ${req.ip}`);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    });
  }
  
  // Check if account is active
  if (!user.active) {
    logger.warn(`Password reset attempted for inactive account: ${email} - IP: ${req.ip}`);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    });
  }
  
  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save();
  
  try {
    // Send the reset password email
    await emailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.username
    );
    
    logger.info(`Password reset email sent to: ${email} - IP: ${req.ip}`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    });
  } catch (error) {
    // If email fails, reset the token fields and log the error
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
    
    throw new errors.InternalServerError('Failed to send password reset email. Please try again later.');
  }
});

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  
  // Hash the token to compare with stored value
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  
  if (!user) {
    throw new errors.BadRequestError('Invalid or expired reset token');
  }
  
  // Update password and clear reset token fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  
  // Generate new JWT
  const newToken = user.createJWT();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password reset successful',
    token: newToken,
  });
});

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user profile
 * @access Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  const user = await User.findById(userId);
  
  if (!user) {
    throw new errors.NotFoundError('User not found');
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    user: user.toDTO(),
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
}; 