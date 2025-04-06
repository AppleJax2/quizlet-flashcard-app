const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const env = require('../../config/env');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create user-specific directory
    const userDir = path.join(uploadsDir, req.user ? req.user.userId.toString() : 'anonymous');
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: function(req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    // Sanitize original filename
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_').replace(/_{2,}/g, '_');
    const extension = path.extname(sanitizedName).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// File filter function to validate uploads
const fileFilter = (req, file, cb) => {
  // Validate file types
  const allowedTypes = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'text/plain': ['.txt'],
    'application/json': ['.json'],
    'text/markdown': ['.md'],
    'text/csv': ['.csv'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
  };
  
  const extension = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  
  // Check file size early (before writing to disk)
  if (parseInt(req.headers['content-length']) > maxSize) {
    return cb(new multer.MulterError('LIMIT_FILE_SIZE', file));
  }
  
  // Check if mimetype is allowed and extension matches expected types
  if (allowedTypes[mimetype] && allowedTypes[mimetype].includes(extension)) {
    return cb(null, true);
  }
  
  // If not allowed, reject with error
  cb(new Error(`File type not supported. Allowed types: PDF, DOCX, DOC, TXT, JSON, MD, CSV, JPG, PNG`));
};

// Convert bytes to MB
const maxSize = env.MAX_FILE_SIZE_MB * 1024 * 1024; // 50 MB default

// Create multer upload instance with better error handling
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxSize,
    files: 5, // Maximum number of files per request
    fieldSize: 20 * 1024 * 1024, // Maximum field value size (20MB)
  },
});

/**
 * Document upload middleware
 * Handles single document uploads for processing
 */
const documentUpload = upload.single('document');

/**
 * Image upload middleware
 * Handles single image uploads for flashcards
 */
const imageUpload = upload.single('image');

/**
 * Multiple file upload middleware
 * Handles up to 5 files for batch processing
 */
const multipleUpload = upload.array('documents', 5);

/**
 * Custom error handler for multer errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Function} - Error handler callback
 */
const handleUploadErrors = (req, res, next) => {
  return function(err) {
    if (err) {
      // Ensure any partially uploaded files are cleaned up
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
          req.file = undefined;
        } catch (cleanupErr) {
          console.error(`Error cleaning up file ${req.file.path}:`, cleanupErr);
        }
      }
      
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (cleanupErr) {
            console.error(`Error cleaning up file ${file.path}:`, cleanupErr);
          }
        });
        req.files = undefined;
      }
      
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        let message = 'File upload error';
        let status = StatusCodes.BAD_REQUEST;
        
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = `File size exceeds the ${env.MAX_FILE_SIZE_MB} MB limit`;
            break;
          case 'LIMIT_FILE_COUNT':
            message = 'Too many files uploaded';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = 'Unexpected field name in upload';
            break;
          case 'LIMIT_FIELD_KEY':
            message = 'Field name too long';
            break;
          case 'LIMIT_FIELD_VALUE':
            message = 'Field value too large';
            break;
          case 'LIMIT_FIELD_COUNT':
            message = 'Too many fields in the request';
            break;
          case 'LIMIT_PART_COUNT':
            message = 'Too many parts in multipart request';
            break;
          default:
            message = `Upload error: ${err.message}`;
        }
        
        return res.status(status).json({
          success: false,
          message,
          error: err.code
        });
      }
      
      // Other errors
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message,
        error: 'INVALID_UPLOAD'
      });
    }
    
    // No errors, proceed
    next();
  };
};

// Middleware to clean up temporary files
const cleanupTempFiles = async (req, res, next) => {
  const originalEnd = res.end;

  // Override res.end to do cleanup after response is sent
  res.end = function(...args) {
    // Call the original res.end
    originalEnd.apply(res, args);
    
    // Clean up temporary files
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        // Log error but don't fail the request
        console.error(`Error cleaning up file ${req.file.path}:`, error);
      }
    }
    
    // Clean up multiple files
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error(`Error cleaning up file ${file.path}:`, error);
        }
      });
    }
  };
  
  next();
};

module.exports = {
  documentUpload,
  imageUpload,
  multipleUpload,
  handleUploadErrors,
  cleanupTempFiles,
}; 