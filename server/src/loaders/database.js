const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const logger = require('../config/logger');
const env = require('../config/env');

let mongoServer;

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Connection options for newer MongoDB driver versions
    const options = {
      // Timeout in ms for operations
      serverSelectionTimeoutMS: 15000,
      // Heartbeat interval in ms
      heartbeatFrequencyMS: 10000,
      // Connection timeout
      connectTimeoutMS: 30000,
    };
    
    let uri = env.MONGODB_URI;

    // For development, use in-memory MongoDB server
    if (env.isDevelopment()) {
      logger.info('Using MongoDB Memory Server for development');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }
    
    // Connect to MongoDB
    const conn = await mongoose.connect(uri, options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err}`);
      
      // If we're in production, attempt to reconnect
      if (env.isProduction()) {
        logger.info('Attempting to reconnect to MongoDB...');
      }
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });
    
    // Monitor slow queries in development
    if (env.isDevelopment()) {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug(`Mongoose: ${collectionName}.${method}(${JSON.stringify(query)}) - ${JSON.stringify(doc)}`);
      });
    }
    
    // Close the connection when the Node process ends
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        if (mongoServer) {
          await mongoServer.stop();
        }
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error disconnecting Mongoose:', err);
        process.exit(1);
      }
    });
    
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    
    // More detailed error information for common issues
    if (error.name === 'MongoParseError') {
      logger.error('Invalid MongoDB connection string. Please check MONGODB_URI format.');
    } else if (error.name === 'MongoNetworkError') {
      logger.error('MongoDB network error. Please check if MongoDB server is running and network connectivity.');
    } else if (error.name === 'MongoServerSelectionError') {
      logger.error('MongoDB server selection error. Cannot connect to any servers in the replica set.');
    }
    
    // Exit with failure
    process.exit(1);
  }
};

module.exports = connectDB; 