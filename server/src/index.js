const express = require('express');
require('express-async-errors');
const env = require('./config/env');
const logger = require('./config/logger');
const loaders = require('./loaders');

// Create Express application
const app = express();

// Validate environment variables
try {
  // Perform validation and initialization
  env.validate();
  
  // Log successful initialization without sensitive data
  logger.info(`Environment validated successfully for ${env.NODE_ENV} mode`);
  logger.info(`Server will run on port ${env.PORT}`);
  logger.info(`API prefix: ${env.API_PREFIX}`);
} catch (error) {
  // Log the error with details but no sensitive data
  logger.error(`Environment validation failed: ${error.message}`);
  
  // Provide more context for the error
  if (error.message.includes('JWT_SECRET')) {
    logger.error('You must provide a secure JWT_SECRET for token encryption');
  }
  
  if (error.message.includes('MONGODB_URI')) {
    logger.error('Database connection string is invalid or missing');
  }
  
  // Exit the process with an error code
  process.exit(1);
}

// Start the application
const startServer = async () => {
  try {
    // Initialize application loaders
    await loaders.init(app);
    
    // Start the server
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`API available at ${env.API_PREFIX}`);
      
      if (env.isDevelopment()) {
        logger.info(`Health check: http://localhost:${env.PORT}/health`);
      }
    });
    
    // Handle graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received, starting graceful shutdown`);
      
      // Close server first to stop accepting new connections
      server.close(() => {
        logger.info('HTTP server closed, cleaning up resources');
        
        // Cleanup other resources here if needed
        
        // Exit the process
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        logger.error('Graceful shutdown timed out, forcing exit');
        process.exit(1);
      }, 10000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection:', err);
      
      // In production, attempt graceful shutdown
      if (env.isProduction()) {
        gracefulShutdown('unhandledRejection');
      }
    });
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      
      // Always attempt graceful shutdown for uncaught exceptions
      gracefulShutdown('uncaughtException');
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Run the server
startServer(); 