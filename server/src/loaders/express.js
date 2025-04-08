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
  // Define allowed origins for CORS from environment variable or fallback to defaults
  const allowedOriginsString = process.env.ALLOWED_ORIGINS || 'https://lustrous-tartufo-9102a1.netlify.app,http://localhost:3000,http://localhost:5173';
  const allowedOrigins = allowedOriginsString.split(',').map(origin => origin.trim());
  
  logger.info(`CORS allowed origins: ${JSON.stringify(allowedOrigins)}`);
  
  // Configure CORS using a single middleware instance
  const corsOptions = {
    origin: function(origin, callback) {
      // Allow requests with no origin (e.g., server-to-server, curl)
      if (!origin) return callback(null, true);
      
      // Check if the origin is allowed or if wildcard is included
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || env.isDevelopment()) {
        return callback(null, true);
      } else {
        // Block other origins in non-development environments
        logger.warn(`CORS blocked request from origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-HTTP-Method-Override', 'Accept'],
    exposedHeaders: ['X-Total-Count', 'X-Pagination-Total', 'X-Request-ID'],
    credentials: true,
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 204, // Use 204 for preflight success
  };

  // Apply CORS middleware globally
  app.use(cors(corsOptions));
  
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", ...allowedOrigins]
      }
    }
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
  app.use('/auth', routes.auth);
  
  // Add more direct routes for other API endpoints if needed
  app.use('/flashcard-sets', routes.flashcardSets);
  app.use('/processor', routes.processor);
  app.use('/users', routes.users);
  
  // Health check endpoint with explicit CORS
  app.get('/health', cors(corsOptions), (req, res) => {
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