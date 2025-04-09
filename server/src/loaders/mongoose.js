const mongoose = require('mongoose');
const env = require('../config/env');
const logger = require('../config/logger');

/**
 * MongoDB connection options
 */
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 50,               // Maximum number of sockets
  minPoolSize: 10,              // Minimum number of sockets
  socketTimeoutMS: 45000,       // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000,      // Give up initial connection after 10 seconds
  serverSelectionTimeoutMS: 5000, // Timeout server selection after 5 seconds
  heartbeatFrequencyMS: 10000,  // How often to send heartbeats
  retryWrites: true,            // Retry failed writes
  writeConcern: {
    w: 'majority',              // Wait for majority write confirmation
    j: true                     // Wait for journal commit
  },
  readPreference: 'secondaryPreferred', // Prefer reading from secondaries
  readConcern: { level: 'majority' },   // Read from majority of nodes
  autoIndex: env.isProduction() ? false : true, // Disable auto-indexing in production
};

/**
 * Initialize MongoDB connection
 */
const initializeDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI, mongooseOptions);
    
    logger.info('MongoDB connected successfully');
    
    // Log connection pool information
    const db = mongoose.connection;
    
    db.on('connected', () => {
      logger.info('MongoDB connection established');
    });
    
    db.on('disconnected', () => {
      logger.warn('MongoDB connection lost');
    });
    
    db.on('reconnected', () => {
      logger.info('MongoDB connection reestablished');
    });
    
    db.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
    
    // Create indexes in development
    if (!env.isProduction()) {
      logger.info('Creating database indexes...');
      await Promise.all([
        // User indexes
        mongoose.model('User').createIndexes(),
        // FlashcardSet indexes
        mongoose.model('FlashcardSet').createIndexes(),
        // ProcessingTask indexes
        mongoose.model('ProcessingTask').createIndexes()
      ]);
      logger.info('Database indexes created successfully');
    }
    
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = initializeDB; 