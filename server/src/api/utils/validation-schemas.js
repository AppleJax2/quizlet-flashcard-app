const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

// Custom error messages
const messages = {
  'string.empty': '{#label} cannot be empty',
  'string.min': '{#label} must be at least {#limit} characters',
  'string.max': '{#label} cannot exceed {#limit} characters',
  'string.email': '{#label} must be a valid email address',
  'any.required': '{#label} is required',
  'array.min': '{#label} must contain at least {#limit} item(s)',
  'array.max': '{#label} cannot contain more than {#limit} item(s)',
  'number.min': '{#label} must be at least {#limit}',
  'number.max': '{#label} cannot exceed {#limit}',
  'object.unknown': '{#label} is not allowed',
};

// User Validation Schemas
const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required().messages(messages),
  email: Joi.string().trim().email().required().messages(messages),
  password: Joi.string()
    .min(8).message('Password must be at least 8 characters')
    .max(64).message('Password cannot exceed 64 characters')
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .message('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required()
    .messages(messages),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match', ...messages }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages(messages),
  password: Joi.string().required().messages(messages),
});

const updateUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).messages(messages),
  email: Joi.string().trim().email().messages(messages),
  currentPassword: Joi.string().min(8).messages(messages),
  newPassword: Joi.string().min(8).max(64).messages(messages),
})
.min(1)
.messages({ 'object.min': 'At least one field must be provided' });

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages(messages),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages(messages),
  password: Joi.string().min(8).max(64).required().messages(messages),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match', ...messages }),
});

// Flashcard Validation Schemas
const flashcardSchema = Joi.object({
  front: Joi.string().trim().min(1).max(2000).required().messages(messages),
  back: Joi.string().trim().min(1).max(2000).required().messages(messages),
  imageUrl: Joi.string().uri().allow('', null).messages({
    'string.uri': 'Image URL must be a valid URL',
    ...messages,
  }),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium').messages(messages),
  tags: Joi.array().items(Joi.string().trim()).default([]).messages(messages),
  metadata: Joi.object().default({}).messages(messages),
});

const createFlashcardSetSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages(messages),
  description: Joi.string().trim().min(3).max(1000).required().messages(messages),
  flashcards: Joi.array().items(flashcardSchema).min(1).required().messages(messages),
  tags: Joi.array().items(Joi.string().trim()).default([]).messages(messages),
  isPublic: Joi.boolean().default(false).messages(messages),
  language: Joi.string().trim().default('english').messages(messages),
  complexity: Joi.string().valid('simple', 'medium', 'advanced').default('medium').messages(messages),
  sourceType: Joi.string().valid('manual', 'text', 'pdf', 'url', 'docx', 'image').default('manual').messages(messages),
  sourceReference: Joi.string().trim().allow('', null).messages(messages),
  metadata: Joi.object().default({}).messages(messages),
});

const updateFlashcardSetSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).messages(messages),
  description: Joi.string().trim().min(3).max(1000).messages(messages),
  flashcards: Joi.array().items(flashcardSchema).min(1).messages(messages),
  tags: Joi.array().items(Joi.string().trim()).messages(messages),
  isPublic: Joi.boolean().messages(messages),
  language: Joi.string().trim().messages(messages),
  complexity: Joi.string().valid('simple', 'medium', 'advanced').messages(messages),
  metadata: Joi.object().messages(messages),
})
.min(1)
.messages({ 'object.min': 'At least one field must be provided' });

const flashcardSetIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Flashcard set ID is required',
    'any.required': 'Flashcard set ID is required',
  }),
});

// Content Processing Schemas
const textProcessingSchema = Joi.object({
  content: Joi.string().min(10).max(50000).required().messages({
    'string.min': 'Content must be at least 10 characters',
    'string.max': 'Content cannot exceed 50,000 characters',
    'any.required': 'Content is required',
  }),
  language: Joi.string().trim().default('english').messages(messages),
  title: Joi.string().trim().max(200).allow('', null).messages(messages),
  complexity: Joi.string().valid('simple', 'medium', 'advanced').default('medium').messages(messages),
});

const urlProcessingSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'URL must be a valid URI',
    'any.required': 'URL is required',
  }),
  language: Joi.string().trim().default('english').messages(messages),
  complexity: Joi.string().valid('simple', 'medium', 'advanced').default('medium').messages(messages),
});

// Flashcard Generation Schemas
const generationParamsSchema = Joi.object({
  contentType: Joi.string().valid('text', 'pdf', 'url', 'docx', 'image').required().messages(messages),
  content: Joi.alternatives().conditional('contentType', {
    is: 'text',
    then: Joi.string().min(10).required(),
    otherwise: Joi.string().required(),
  }).messages(messages),
  language: Joi.string().trim().default('english').messages(messages),
  maxCards: Joi.number().integer().min(1).max(200).default(50).messages(messages),
  includeImages: Joi.boolean().default(false).messages(messages),
  complexity: Joi.string().valid('simple', 'medium', 'advanced').default('medium').messages(messages),
  title: Joi.string().trim().max(200).allow('', null).messages(messages),
  description: Joi.string().trim().max(1000).allow('', null).messages(messages),
  tags: Joi.array().items(Joi.string().trim()).default([]).messages(messages),
  isPublic: Joi.boolean().default(false).messages(messages),
});

// Query Parameter Schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages(messages),
  limit: Joi.number().integer().min(1).max(100).default(20).messages(messages),
  sort: Joi.string().valid('createdAt', 'updatedAt', 'title').default('createdAt').messages(messages),
  order: Joi.string().valid('asc', 'desc').default('desc').messages(messages),
});

const searchSchema = Joi.object({
  query: Joi.string().trim().min(1).required().messages(messages),
  page: Joi.number().integer().min(1).default(1).messages(messages),
  limit: Joi.number().integer().min(1).max(100).default(20).messages(messages),
  filter: Joi.string().valid('all', 'title', 'description', 'tags', 'content').default('all').messages(messages),
  isPublic: Joi.boolean().messages(messages),
});

const flashcardSetQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages(messages),
  limit: Joi.number().integer().min(1).max(100).default(20).messages(messages),
  sort: Joi.string().valid('createdAt', 'updatedAt', 'title').default('createdAt').messages(messages),
  order: Joi.string().valid('asc', 'desc').default('desc').messages(messages),
  isPublic: Joi.boolean().messages(messages),
  tags: Joi.alternatives().try(
    Joi.string().trim(),
    Joi.array().items(Joi.string().trim())
  ).messages(messages),
  language: Joi.string().trim().messages(messages),
  complexity: Joi.string().valid('simple', 'medium', 'advanced').messages(messages),
});

const taskQuerySchema = Joi.object({
  taskId: Joi.string().required().messages(messages),
});

module.exports = {
  // User schemas
  registerSchema,
  loginSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  
  // Flashcard schemas
  flashcardSchema,
  createFlashcardSetSchema,
  updateFlashcardSetSchema,
  flashcardSetIdSchema,
  
  // Content processing schemas
  textProcessingSchema,
  urlProcessingSchema,
  
  // Generation schemas
  generationParamsSchema,
  
  // Query parameter schemas
  paginationSchema,
  searchSchema,
  flashcardSetQuerySchema,
  taskQuerySchema,
}; 