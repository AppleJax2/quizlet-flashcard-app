import * as z from 'zod';

// Base schemas
const processingOptionsSchema = z.object({
  language: z.string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code cannot exceed 5 characters')
    .optional(),
  complexity: z.enum(['simple', 'medium', 'advanced'])
    .optional(),
  maxFlashcards: z.number()
    .int('Maximum flashcards must be an integer')
    .min(1, 'Must generate at least 1 flashcard')
    .max(100, 'Cannot generate more than 100 flashcards')
    .optional()
    .default(20),
  includeHints: z.boolean()
    .optional()
    .default(true),
  includeTags: z.boolean()
    .optional()
    .default(true),
  format: z.enum(['text', 'markdown', 'html'])
    .optional()
    .default('markdown'),
});

// Form schemas
export const textProcessingSchema = z.object({
  content: z.string()
    .min(1, 'Content is required')
    .max(50000, 'Content cannot exceed 50,000 characters'),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  options: processingOptionsSchema,
});

export const urlProcessingSchema = z.object({
  url: z.string()
    .url('Invalid URL format')
    .min(1, 'URL is required'),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  options: processingOptionsSchema,
});

export const fileProcessingSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  options: processingOptionsSchema,
});

export const processingStatusSchema = z.object({
  id: z.string()
    .min(1, 'Processing ID is required'),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  progress: z.number()
    .min(0, 'Progress cannot be negative')
    .max(100, 'Progress cannot exceed 100')
    .optional(),
  error: z.string()
    .optional(),
  result: z.object({
    flashcards: z.array(z.object({
      front: z.string(),
      back: z.string(),
      hints: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      complexity: z.enum(['simple', 'medium', 'advanced']).optional(),
    })).optional(),
    metadata: z.object({
      sourceType: z.enum(['text', 'url', 'file']),
      sourceSize: z.number().optional(),
      processingTime: z.number().optional(),
      language: z.string().optional(),
      complexity: z.enum(['simple', 'medium', 'advanced']).optional(),
    }).optional(),
  }).optional(),
});

// Types
export type ProcessingOptions = z.infer<typeof processingOptionsSchema>;
export type TextProcessingData = z.infer<typeof textProcessingSchema>;
export type UrlProcessingData = z.infer<typeof urlProcessingSchema>;
export type FileProcessingData = z.infer<typeof fileProcessingSchema>;
export type ProcessingStatus = z.infer<typeof processingStatusSchema>; 