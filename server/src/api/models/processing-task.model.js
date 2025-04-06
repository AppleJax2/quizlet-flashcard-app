const mongoose = require('mongoose');

/**
 * Schema for tracking long-running processing tasks
 * This enables progress tracking for operations like file processing and flashcard generation
 */
const ProcessingTaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: [true, 'Task ID is required'],
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  taskType: {
    type: String,
    required: [true, 'Task type is required'],
    enum: ['fileUpload', 'urlProcessing', 'textProcessing', 'flashcardGeneration', 'export'],
    index: true,
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'queued',
    index: true,
  },
  progress: {
    type: Number,
    required: [true, 'Progress is required'],
    min: 0,
    max: 100,
    default: 0,
  },
  message: {
    type: String,
    trim: true,
  },
  error: {
    code: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    stack: {
      type: String,
    },
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    index: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      // Don't expose the stack trace in the API response
      if (ret.error && ret.error.stack) {
        delete ret.error.stack;
      }
      return ret;
    }
  }
});

// Create a compound index for efficient lookups
ProcessingTaskSchema.index({ userId: 1, createdAt: -1 });
ProcessingTaskSchema.index({ userId: 1, taskType: 1, status: 1 });

/**
 * Update the task's progress
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} message - Optional status message
 * @returns {Promise<Object>} - Updated task
 */
ProcessingTaskSchema.methods.updateProgress = async function(progress, message = null) {
  this.progress = Math.min(Math.max(0, progress), 100);
  if (message) {
    this.message = message;
  }
  
  // If we hit 100%, mark as completed unless already marked otherwise
  if (this.progress === 100 && this.status === 'processing') {
    this.status = 'completed';
  }
  
  return this.save();
};

/**
 * Mark the task as completed with a result
 * @param {Object} result - Task result data
 * @param {string} message - Optional completion message
 * @returns {Promise<Object>} - Updated task
 */
ProcessingTaskSchema.methods.complete = async function(result, message = 'Task completed successfully') {
  this.status = 'completed';
  this.progress = 100;
  this.message = message;
  this.result = result;
  return this.save();
};

/**
 * Mark the task as failed with error details
 * @param {Error|Object} error - Error object or details
 * @returns {Promise<Object>} - Updated task
 */
ProcessingTaskSchema.methods.fail = async function(error) {
  this.status = 'failed';
  
  if (error instanceof Error) {
    this.error = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      stack: error.stack,
    };
    this.message = `Task failed: ${error.message}`;
  } else {
    this.error = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      stack: error.stack,
    };
    this.message = `Task failed: ${error.message}`;
  }
  
  return this.save();
};

/**
 * Mark the task as cancelled
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} - Updated task
 */
ProcessingTaskSchema.methods.cancel = async function(reason = 'Task cancelled by user') {
  this.status = 'cancelled';
  this.message = reason;
  return this.save();
};

// Define TTL index to automatically remove expired tasks
ProcessingTaskSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ProcessingTask', ProcessingTaskSchema); 