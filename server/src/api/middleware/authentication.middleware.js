const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const env = require('../../config/env');
const { User } = require('../models');
const { errors } = require('../utils');
const redisService = require('../../services/redis.service');

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user info to request
 */
const authenticationMiddleware = async (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  // Check if authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new errors.UnauthenticatedError('Authentication required'));
  }
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  
  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return next(new errors.UnauthenticatedError('Token has been revoked'));
    }

    // Verify the token
    const payload = jwt.verify(token, env.JWT_SECRET);
    
    // Check for token expiration (redundant but adds extra safety)
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return next(new errors.UnauthenticatedError('Token expired'));
    }
    
    // Check if user still exists in database
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return next(new errors.UnauthenticatedError('User no longer exists'));
    }

    // Check if user is active
    if (!user.active) {
      return next(new errors.UnauthenticatedError('Account is deactivated'));
    }
    
    // Attach user info to request object
    req.user = {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: payload.role || 'user',
    };

    // Attach token to request for potential blacklisting
    req.token = token;
    
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return next(new errors.UnauthenticatedError('Token expired'));
    } else if (error.name === 'JsonWebTokenError') {
      return next(new errors.UnauthenticatedError('Invalid token'));
    } else {
      return next(new errors.UnauthenticatedError('Authentication failed'));
    }
  }
};

/**
 * Optional authentication middleware
 * Does not require authentication but attaches user info if present
 */
const optionalAuthMiddleware = async (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  // If no authorization header, continue without authentication
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  
  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return next();
    }

    // Verify the token
    const payload = jwt.verify(token, env.JWT_SECRET);
    
    // Check for token expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return next();
    }
    
    // Check if user still exists (optional)
    const user = await User.findById(payload.userId).select('-password');
    if (user && user.active) {
      // Attach user info to request object
      req.user = {
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
        role: payload.role || 'user',
      };
      // Attach token to request
      req.token = token;
    }
  } catch (error) {
    // Token invalid, but continue anyway since auth is optional
  }
  
  next();
};

module.exports = {
  authenticationMiddleware,
  optionalAuthMiddleware,
}; 