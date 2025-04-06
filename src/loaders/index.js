const connectDB = require('./database');
const initExpress = require('./express');
const logger = require('../config/logger');

/**
 * Initialize all application loaders
 * @param {Object} app - Express app instance
 * @returns {Promise<Object>} - Initialized app
 */
const init = async (app) => {
  try {
    // Connect to database first
    await connectDB();
    
    // Initialize Express app
    initExpress(app);
    
    logger.info('All loaders initialized successfully');
    
    return app;
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
};

module.exports = { init }; 