import * as z from 'zod';

// Base schemas
const flashcardSchema = z.object({
  front: z.string()
    .min(1, 'Front content is required')
    .max(1000, 'Front content cannot exceed 1000 characters'),
  back: z.string()
    .min(1, 'Back content is required')
    .max(1000, 'Back content cannot exceed 1000 characters'),
  hints: z.array(z.string())
    .max(5, 'Cannot have more than 5 hints')
    .optional(),
  tags: z.array(z.string())
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
  complexity: z.enum(['simple', 'medium', 'advanced'])
    .optional(),
});

// Form schemas
export const createFlashcardSetSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  isPublic: z.boolean()
    .default(false),
  language: z.string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code cannot exceed 5 characters')
    .optional(),
  tags: z.array(z.string())
    .max(20, 'Cannot have more than 20 tags')
    .optional(),
  complexity: z.enum(['simple', 'medium', 'advanced'])
    .optional(),
  flashcards: z.array(flashcardSchema)
    .min(1, 'At least one flashcard is required')
    .max(1000, 'Cannot have more than 1000 flashcards'),
});

export const updateFlashcardSetSchema = createFlashcardSetSchema.partial().extend({
  id: z.string()
    .min(1, 'Flashcard set ID is required'),
});

export const flashcardSetQuerySchema = z.object({
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),
  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),
  sort: z.enum(['createdAt', 'updatedAt', 'title'])
    .optional()
    .default('createdAt'),
  order: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  isPublic: z.boolean()
    .optional(),
  tags: z.union([
    z.string(),
    z.array(z.string()),
  ]).optional(),
  language: z.string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code cannot exceed 5 characters')
    .optional(),
  complexity: z.enum(['simple', 'medium', 'advanced'])
    .optional(),
});

// Types
export type FlashcardData = z.infer<typeof flashcardSchema>;
export type CreateFlashcardSetData = z.infer<typeof createFlashcardSetSchema>;
export type UpdateFlashcardSetData = z.infer<typeof updateFlashcardSetSchema>;
export type FlashcardSetQueryData = z.infer<typeof flashcardSetQuerySchema>; 