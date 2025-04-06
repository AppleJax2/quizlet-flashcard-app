const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');
const { asyncHandler, errors } = require('../utils');

/**
 * @route PUT /api/v1/users/profile
 * @desc Update user profile
 * @access Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { username, email, currentPassword, newPassword } = req.body;
  
  // Get the user
  const user = await User.findById(userId);
  
  if (!user) {
    throw new errors.NotFoundError('User not found');
  }
  
  // If changing username, check if new username is available
  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new errors.ConflictError('Username already taken');
    }
    user.username = username;
  }
  
  // If changing email, check if new email is available
  if (email && email.toLowerCase() !== user.email) {
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw new errors.ConflictError('Email already in use');
    }
    user.email = email.toLowerCase();
  }
  
  // If changing password, verify current password first
  if (newPassword) {
    if (!currentPassword) {
      throw new errors.BadRequestError('Current password is required to set a new password');
    }
    
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      throw new errors.UnauthenticatedError('Current password is incorrect');
    }
    
    user.password = newPassword;
  }
  
  // Save the user
  await user.save();
  
  // Generate a new token with updated info
  const token = user.createJWT();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toDTO(),
    token,
  });
});

/**
 * @route DELETE /api/v1/users/profile
 * @desc Delete user account
 * @access Private
 */
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { password } = req.body;
  
  // Get the user
  const user = await User.findById(userId);
  
  if (!user) {
    throw new errors.NotFoundError('User not found');
  }
  
  // Verify password for security
  if (!password) {
    throw new errors.BadRequestError('Password is required to delete account');
  }
  
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new errors.UnauthenticatedError('Password is incorrect');
  }
  
  // Here, in a real application, we would:
  // 1. Delete or anonymize related data (flashcard sets, etc.)
  // 2. Potentially mark the account as deleted rather than actually deleting it
  // 3. Implement a grace period for account recovery
  
  // For this implementation, we'll just delete the user
  await User.findByIdAndDelete(userId);
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Account deleted successfully',
  });
});

module.exports = {
  updateProfile,
  deleteAccount,
}; 