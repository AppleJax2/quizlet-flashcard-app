const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const { ProcessingTask } = require('../models');
const { asyncHandler, errors } = require('../utils');
const env = require('../../config/env');

// Task expiration time in milliseconds (24 hours)
const TASK_EXPIRATION_MS = 24 * 60 * 60 * 1000;

/**
 * @route POST /api/v1/processor/text
 * @desc Process text content and extract data
 * @access Private
 */
const processText = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { content, language = 'english', title = null } = req.body;
  
  // Create a new processing task
  const taskId = uuidv4();
  const task = await ProcessingTask.create({
    taskId,
    userId,
    taskType: 'textProcessing',
    status: 'queued',
    progress: 0,
    message: 'Task queued for processing',
    expiresAt: new Date(Date.now() + TASK_EXPIRATION_MS),
    metadata: {
      contentLength: content.length.toString(),
      language,
      title: title || 'Untitled Text',
    },
  });
  
  // In a real application, we would queue this task for asynchronous processing
  // For this implementation, we'll process it in the background
  
  // Start background processing
  setTimeout(async () => {
    try {
      // Update task status to processing
      await task.updateProgress(10, 'Processing started');
      
      // Process the text (simplified implementation)
      // In a real application, this would be a much more complex NLP process
      const processedContent = {
        title: title || 'Untitled Text',
        content: content.trim(),
        metadata: {
          language,
          wordCount: content.split(/\s+/).length,
          characterCount: content.length,
          processedAt: new Date().toISOString(),
        },
      };
      
      // Complete the task
      await task.complete(processedContent, 'Text processing completed successfully');
    } catch (error) {
      // Log the error
      console.error('Text processing error:', error);
      
      // Update task status to failed
      await task.fail(error);
    }
  }, 100); // Start processing after a short delay
  
  // Respond with the task ID for status tracking
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'Text processing started',
    taskId,
  });
});

/**
 * @route POST /api/v1/processor/url
 * @desc Process a URL and extract content
 * @access Private
 */
const processUrl = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { url, language = 'english' } = req.body;
  
  // Create a new processing task
  const taskId = uuidv4();
  const task = await ProcessingTask.create({
    taskId,
    userId,
    taskType: 'urlProcessing',
    status: 'queued',
    progress: 0,
    message: 'Task queued for processing',
    expiresAt: new Date(Date.now() + TASK_EXPIRATION_MS),
    metadata: {
      url,
      language,
    },
  });
  
  // In a real application, we would queue this task for asynchronous processing
  // For this implementation, we'll simulate the process
  
  // Start background processing
  setTimeout(async () => {
    try {
      // Update task status to processing
      await task.updateProgress(10, 'URL processing started');
      
      // Simulate URL fetching and processing
      await task.updateProgress(30, 'Fetching URL content');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await task.updateProgress(50, 'Extracting main content');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await task.updateProgress(70, 'Processing content');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated processed content
      const processedContent = {
        title: `Content from ${new URL(url).hostname}`,
        content: `This is a simulation of processed content from ${url}. In a real implementation, this would contain the actual text extracted from the URL.`,
        metadata: {
          language,
          url,
          processedAt: new Date().toISOString(),
        },
      };
      
      // Complete the task
      await task.complete(processedContent, 'URL processing completed successfully');
    } catch (error) {
      // Log the error
      console.error('URL processing error:', error);
      
      // Update task status to failed
      await task.fail(error);
    }
  }, 100); // Start processing after a short delay
  
  // Respond with the task ID for status tracking
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'URL processing started',
    taskId,
  });
});

/**
 * @route POST /api/v1/processor/file
 * @desc Process an uploaded file and extract content
 * @access Private
 */
const processFile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  // Check if file was uploaded
  if (!req.file) {
    throw new errors.BadRequestError('No file uploaded');
  }
  
  const file = req.file;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  // Create a new processing task
  const taskId = uuidv4();
  const task = await ProcessingTask.create({
    taskId,
    userId,
    taskType: 'fileUpload',
    status: 'queued',
    progress: 0,
    message: 'Task queued for processing',
    expiresAt: new Date(Date.now() + TASK_EXPIRATION_MS),
    metadata: {
      filename: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size.toString(),
      filePath: file.path,
    },
  });
  
  // Start background processing
  setTimeout(async () => {
    try {
      // Update task status to processing
      await task.updateProgress(10, 'File processing started');
      
      // Determine file type and process accordingly
      let processedContent;
      
      switch (fileExtension) {
        case '.pdf':
          await task.updateProgress(30, 'Extracting text from PDF');
          // In a real implementation, we would use a PDF parsing library
          processedContent = {
            title: path.basename(file.originalname, fileExtension),
            content: `[PDF content would be extracted here from ${file.originalname}]`,
            metadata: {
              fileType: 'pdf',
              fileSize: file.size,
              pages: 'Unknown', // Would be determined by PDF parser
              processedAt: new Date().toISOString(),
            },
          };
          break;
          
        case '.docx':
        case '.doc':
          await task.updateProgress(30, 'Extracting text from Word document');
          // In a real implementation, we would use a Word document parsing library
          processedContent = {
            title: path.basename(file.originalname, fileExtension),
            content: `[Word document content would be extracted here from ${file.originalname}]`,
            metadata: {
              fileType: fileExtension === '.docx' ? 'docx' : 'doc',
              fileSize: file.size,
              processedAt: new Date().toISOString(),
            },
          };
          break;
          
        case '.txt':
          await task.updateProgress(30, 'Reading text file');
          // Read the text file
          const content = await fs.readFile(file.path, 'utf8');
          processedContent = {
            title: path.basename(file.originalname, fileExtension),
            content: content,
            metadata: {
              fileType: 'txt',
              fileSize: file.size,
              processedAt: new Date().toISOString(),
            },
          };
          break;
          
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }
      
      await task.updateProgress(90, 'Finalizing processing');
      
      // Complete the task
      await task.complete(processedContent, 'File processing completed successfully');
      
      // Clean up the file
      await fs.unlink(file.path).catch(err => {
        console.warn(`Failed to delete temporary file ${file.path}:`, err);
      });
    } catch (error) {
      // Log the error
      console.error('File processing error:', error);
      
      // Update task status to failed
      await task.fail(error);
      
      // Clean up the file
      await fs.unlink(file.path).catch(err => {
        console.warn(`Failed to delete temporary file ${file.path}:`, err);
      });
    }
  }, 100); // Start processing after a short delay
  
  // Respond with the task ID for status tracking
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'File processing started',
    taskId,
  });
});

/**
 * @route GET /api/v1/processor/task/:taskId
 * @desc Get the status of a processing task
 * @access Private
 */
const getTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.userId;
  
  // Find the task
  const task = await ProcessingTask.findOne({ taskId, userId });
  
  if (!task) {
    throw new errors.NotFoundError('Task not found');
  }
  
  // Return the task status
  res.status(StatusCodes.OK).json({
    success: true,
    task: {
      taskId: task.taskId,
      status: task.status,
      progress: task.progress,
      message: task.message,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      result: task.result,
      error: task.error,
    },
  });
});

/**
 * @route DELETE /api/v1/processor/task/:taskId
 * @desc Cancel a processing task
 * @access Private
 */
const cancelTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.userId;
  
  // Find the task
  const task = await ProcessingTask.findOne({ taskId, userId });
  
  if (!task) {
    throw new errors.NotFoundError('Task not found');
  }
  
  // Check if the task can be cancelled
  if (task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') {
    throw new errors.BadRequestError(`Task cannot be cancelled as it is already ${task.status}`);
  }
  
  // Cancel the task
  await task.cancel('Task cancelled by user');
  
  // Return success
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Task cancelled successfully',
  });
});

/**
 * @route POST /api/v1/processor/generate
 * @desc Generate flashcards from processed content
 * @access Private
 */
const generateFlashcards = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    contentType,
    content,
    language = 'english',
    maxCards = 50,
    includeImages = false,
    complexity = 'medium',
    title,
    description,
    tags = [],
    isPublic = false,
  } = req.body;
  
  // Validate maxCards range
  if (maxCards < 1 || maxCards > 200) {
    throw new errors.BadRequestError('maxCards must be between 1 and 200');
  }
  
  // Create a new processing task
  const taskId = uuidv4();
  const task = await ProcessingTask.create({
    taskId,
    userId,
    taskType: 'flashcardGeneration',
    status: 'queued',
    progress: 0,
    message: 'Task queued for processing',
    expiresAt: new Date(Date.now() + TASK_EXPIRATION_MS),
    metadata: {
      contentType,
      language,
      maxCards: maxCards.toString(),
      includeImages: includeImages.toString(),
      complexity,
      title: title || 'Untitled Flashcard Set',
    },
  });
  
  // Start background processing
  setTimeout(async () => {
    try {
      // Update task status to processing
      await task.updateProgress(10, 'Generation started');
      
      // Process the content (simplified implementation)
      // In a real application, this would use NLP and possibly AI to generate flashcards
      
      await task.updateProgress(30, 'Analyzing content');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await task.updateProgress(50, 'Generating flashcards');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await task.updateProgress(70, 'Refining flashcards');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate some sample flashcards based on content type
      const generatedFlashcards = [];
      
      // For demonstration, create some sample flashcards
      // In a real implementation, these would be intelligently generated from the content
      for (let i = 1; i <= Math.min(maxCards, 10); i++) {
        generatedFlashcards.push({
          front: `Sample question ${i} for ${contentType} content`,
          back: `Sample answer ${i} for ${contentType} content`,
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
          tags: [],
        });
      }
      
      await task.updateProgress(90, 'Finalizing flashcards');
      
      // Create the flashcard set data
      const flashcardSetData = {
        title: title || `Generated from ${contentType}`,
        description: description || `Flashcards generated from ${contentType} content`,
        flashcards: generatedFlashcards,
        tags,
        isPublic,
        language,
        complexity,
        sourceType: contentType,
        sourceReference: contentType === 'url' ? content : null,
      };
      
      // Complete the task
      await task.complete(flashcardSetData, 'Flashcard generation completed successfully');
    } catch (error) {
      // Log the error
      console.error('Flashcard generation error:', error);
      
      // Update task status to failed
      await task.fail(error);
    }
  }, 100); // Start processing after a short delay
  
  // Respond with the task ID for status tracking
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'Flashcard generation started',
    taskId,
  });
});

module.exports = {
  processText,
  processUrl,
  processFile,
  getTaskStatus,
  cancelTask,
  generateFlashcards,
}; 