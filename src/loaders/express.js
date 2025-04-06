const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');

// Import middleware
const { errorHandlerMiddleware, apiLimiter } = require('../api/middleware');

// Import routes
const routes = require('../api/routes');

// Import config
const env = require('../config/env');
const logger = require('../config/logger');

// Create directory for logs if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Initialize Express server
 * @param {Object} app - Express app instance
 */
const initExpress = (app) => {
  // CORS must be enabled BEFORE any other middleware
  // Always allow requests from the Netlify frontend
  const allowedOrigins = ['https://lustrous-tartufo-9102a1.netlify.app', 'http://localhost:3000', 'http://localhost:5173'];
  
  // Force enable CORS for development and troubleshooting
  app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || env.isDevelopment()) {
        return callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        // During troubleshooting, allow all origins
        return callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-HTTP-Method-Override', 'Accept'],
    exposedHeaders: ['X-Total-Count', 'X-Pagination-Total', 'X-Request-ID'],
    credentials: true,
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }));
  
  // Handle preflight requests for all routes (crucial for CORS)
  app.options('*', cors());
  
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: env.isProduction() ? undefined : false
  }));

  // Request ID middleware for request tracking
  app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  });
  
  // Request logging
  if (env.isDevelopment()) {
    // Verbose logging for development
    app.use(morgan('dev'));
  } else {
    // Create a write stream for access logs
    const accessLogStream = fs.createWriteStream(
      path.join(logsDir, 'access.log'),
      { flags: 'a' }
    );
    
    // Define a custom logging format to include request ID
    const customFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :req[x-request-id]';
    
    // Log to file in production
    app.use(morgan(customFormat, { stream: accessLogStream }));
    
    // Also log to console for non-development
    app.use(morgan(customFormat, { stream: logger.stream }));
  }
  
  // Body parsers with increased limits
  app.use(express.json({ 
    limit: '2mb',
    strict: true,
    verify: (req, res, buf) => {
      // Store raw body for signature verification if needed
      if (buf && buf.length) {
        req.rawBody = buf;
      }
    }
  }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '2mb',
    parameterLimit: 1000
  }));
  
  // Rate limiting for all API requests
  app.use(apiLimiter);
  
  // API routes
  app.use(env.API_PREFIX, routes);
  
  // Direct route handlers for backward compatibility with clients
  // This ensures requests work even without the API prefix
  app.use('/auth', cors(), routes.auth);
  
  // Add more direct routes for other API endpoints if needed
  app.use('/flashcard-sets', cors(), routes.flashcardSets);
  app.use('/processor', cors(), routes.processor);
  app.use('/users', cors(), routes.users);
  
  // Health check endpoint with explicit CORS
  app.get('/health', cors({ origin: '*' }), (req, res) => {
    res.status(StatusCodes.OK).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    });
  });
  
  // Root endpoint for API discovery
  app.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({
      name: 'Quizlet Flashcard Generator API',
      version: process.env.npm_package_version || '1.0.0',
      docs: `${req.protocol}://${req.get('host')}/api-docs`,
      health: `${req.protocol}://${req.get('host')}/health`,
      api: `${req.protocol}://${req.get('host')}${env.API_PREFIX}`,
      environment: env.NODE_ENV,
      status: 'UP'
    });
  });
  
  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Resource not found',
      code: 'RESOURCE_NOT_FOUND',
      timestamp: new Date().toISOString(),
    });
  });
  
  // Global error handler
  app.use(errorHandlerMiddleware);
  
  return app;
};

module.exports = initExpress; 