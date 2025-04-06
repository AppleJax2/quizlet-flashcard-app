const mongoose = require('mongoose');
const env = require('../config/env');
const logger = require('../config/logger');

/**
 * Obfuscate MongoDB URI for logging (hide credentials)
 * @param {string} uri - MongoDB URI to obfuscate
 * @returns {string} Obfuscated URI with credentials hidden
 */
const obfuscateURI = (uri) => {
  try {
    if (!uri) return 'undefined';
    return uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  } catch (error) {
    return 'Error obfuscating URI';
  }
};

/**
 * Connect to MongoDB
 * @returns {Promise<typeof mongoose>} Mongoose connection
 */
const connectDB = async () => {
  try {
    logger.info(`Connecting to MongoDB at: ${obfuscateURI(env.MONGODB_URI)}`);
    
    // Increase timeouts for cloud connections
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,  // Increase from default 10000
      socketTimeoutMS: 45000,   // Increase from default 30000
      serverSelectionTimeoutMS: 30000,  // Increase from default 20000
    };
    
    // Use MongoMemory server only in development
    if (env.NODE_ENV === 'development' && !env.MONGODB_URI.includes('mongodb+srv')) {
      logger.info('Using MongoDB Memory Server for development');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const connection = await mongoose.connect(uri, connectionOptions);
      logger.info('MongoDB memory server connected successfully');
      return connection;
    }
    
    // Connect to the real MongoDB instance
    const connection = await mongoose.connect(env.MONGODB_URI, connectionOptions);
    logger.info('MongoDB connected successfully');
    
    // Listen for MongoDB connection events
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
      
      // Only exit in production - in development we want to keep trying
      if (env.NODE_ENV === 'production') {
        logger.error('MongoDB connection failure in production environment - exiting application');
        process.exit(1);
      }
    });
    
    // Debug for slow queries in development
    if (env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug(`Mongoose: ${collectionName}.${method}(${JSON.stringify(query)}, ${JSON.stringify(doc)})`);
      });
    }
    
    return connection;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    
    // Add more specific error messages to help with debugging
    if (error.name === 'MongoServerSelectionError') {
      logger.error('Could not connect to any MongoDB server - check network and credentials');
    }
    
    if (error.message.includes('authentication failed')) {
      logger.error('MongoDB authentication failed - check username and password');
    }
    
    if (error.message.includes('getaddrinfo')) {
      logger.error('DNS resolution failed - check hostname in connection string');
    }
    
    // In production, crash the application so it can be restarted
    if (env.NODE_ENV === 'production') {
      logger.error('Fatal database connection error in production - exiting');
      process.exit(1);
    }
    
    throw error;
  }
};

module.exports = connectDB; 