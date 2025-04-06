import * as z from 'zod';

// Regex patterns
export const URL_PATTERN = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const LANGUAGE_CODE_PATTERN = /^[a-z]{2,3}(-[A-Z]{2})?$/;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,20}$/;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Common schemas
export const idSchema = z.string().min(1, 'ID is required');

export const slugSchema = z.string()
  .regex(SLUG_PATTERN, 'Invalid slug format')
  .min(1, 'Slug is required')
  .max(100, 'Slug cannot exceed 100 characters');

export const languageSchema = z.string()
  .regex(LANGUAGE_CODE_PATTERN, 'Invalid language code format')
  .min(2, 'Language code must be at least 2 characters')
  .max(5, 'Language code cannot exceed 5 characters');

export const tagSchema = z.string()
  .min(1, 'Tag cannot be empty')
  .max(30, 'Tag cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9-_]+$/, 'Tag can only contain letters, numbers, hyphens, and underscores');

export const paginationSchema = z.object({
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
});

export const sortingSchema = z.object({
  sort: z.string()
    .min(1, 'Sort field is required'),
  order: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
});

export const metadataSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: idSchema,
  updatedBy: idSchema.optional(),
  isDeleted: z.boolean().optional().default(false),
  version: z.number().int().min(1).optional().default(1),
});

// Utility functions
export const createPaginatedResponse = <T extends z.ZodType>(schema: T) => {
  return z.object({
    items: z.array(schema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    pages: z.number().int().min(0),
    hasMore: z.boolean(),
  });
};

export const createErrorResponse = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  stack: z.string().optional(),
});

// Types
export type PaginationParams = z.infer<typeof paginationSchema>;
export type SortingParams = z.infer<typeof sortingSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
export type ErrorResponse = z.infer<typeof createErrorResponse>;

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
}; 