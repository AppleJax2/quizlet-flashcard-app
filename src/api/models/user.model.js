const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../../config/env');

// Security constants
const SALT_ROUNDS = 12; // Increased from 10 for better security
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
    trim: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    maxlength: [64, 'Password cannot exceed 64 characters'],
    validate: {
      validator: function(value) {
        // Skip validation when password is hashed (after save)
        if (value.startsWith('$2a$') || value.startsWith('$2b$')) return true;
        return PASSWORD_PATTERN.test(value);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpire;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  }
});

// Hash password before saving
UserSchema.pre('save', async function() {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return;
  
  // Generate a salt with increased rounds
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare a candidate password with the user's password
 * @param {string} candidatePassword - The plain password to compare
 * @returns {Promise<boolean>} - Whether the passwords match
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate a JWT for the user
 * @returns {string} - The JWT token
 */
UserSchema.methods.createJWT = function() {
  return jwt.sign(
    { 
      userId: this._id, 
      username: this.username, 
      email: this.email,
      role: this.role 
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_LIFETIME }
  );
};

/**
 * Get reset password token
 * @returns {string} - The reset token
 */
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token with more entropy
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration - 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

/**
 * Track failed login attempts
 * @returns {Promise<boolean>} - Whether the account is locked
 */
UserSchema.methods.registerLoginAttempt = async function() {
  // Increment login attempts
  this.loginAttempts += 1;
  
  // Lock account after 5 failed attempts
  if (this.loginAttempts >= 5 && !this.isLocked()) {
    // Lock for 30 minutes
    this.lockUntil = Date.now() + 30 * 60 * 1000;
  }
  
  await this.save();
  return this.isLocked();
};

/**
 * Check if account is locked
 * @returns {boolean} - Whether the account is locked
 */
UserSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

/**
 * Reset login attempts after successful login
 */
UserSchema.methods.resetLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.lastLogin = new Date();
  await this.save();
};

/**
 * Convert user to a DTO (Data Transfer Object)
 * @returns {Object} - User DTO
 */
UserSchema.methods.toDTO = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    active: this.active,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', UserSchema); 