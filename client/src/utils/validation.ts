import { z } from 'zod';

// Email validation
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Invalid email address' });

// Password validation
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(64, { message: 'Password cannot exceed 64 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' });

// Username validation
export const usernameSchema = z
  .string()
  .min(3, { message: 'Username must be at least 3 characters' })
  .max(50, { message: 'Username cannot exceed 50 characters' })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores, and hyphens' });

// URL validation
export const urlSchema = z
  .string()
  .url({ message: 'Invalid URL' });

// Form schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' }),
});

export const registerFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

export const resetPasswordFormSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const updateProfileFormSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  currentPassword: z.string().optional(),
  newPassword: passwordSchema.optional(),
  confirmNewPassword: z.string().optional(),
}).refine(data => {
  // If newPassword is provided, currentPassword must also be provided
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required to set a new password',
  path: ['currentPassword'],
}).refine(data => {
  // If newPassword and confirmNewPassword are provided, they must match
  if (data.newPassword && data.confirmNewPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

export const flashcardSetFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(200, { message: 'Title cannot exceed 200 characters' }),
  description: z.string().min(1, { message: 'Description is required' }).max(1000, { message: 'Description cannot exceed 1000 characters' }),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().optional(),
  complexity: z.enum(['simple', 'medium', 'advanced']).optional(),
  flashcards: z.array(z.object({
    front: z.string().min(1, { message: 'Front content is required' }).max(2000, { message: 'Front content cannot exceed 2000 characters' }),
    back: z.string().min(1, { message: 'Back content is required' }).max(2000, { message: 'Back content cannot exceed 2000 characters' }),
    imageUrl: z.string().url({ message: 'Invalid image URL' }).optional().nullable(),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    tags: z.array(z.string()).optional(),
  })).min(1, { message: 'At least one flashcard is required' }),
});

export const textProcessingFormSchema = z.object({
  content: z.string().min(1, { message: 'Content is required' }),
  language: z.string().optional(),
  title: z.string().optional(),
});

export const urlProcessingFormSchema = z.object({
  url: urlSchema,
  language: z.string().optional(),
});

export const generationParamsFormSchema = z.object({
  content: z.string().min(1, { message: 'Content is required' }),
  language: z.string().optional(),
  complexity: z.enum(['simple', 'medium', 'advanced']).optional(),
  cardCount: z.number().int().positive().optional(),
  includeImages: z.boolean().optional(),
  frontLengthMax: z.number().int().positive().optional(),
  backLengthMax: z.number().int().positive().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
}); 