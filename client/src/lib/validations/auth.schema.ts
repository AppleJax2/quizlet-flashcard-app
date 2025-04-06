import * as z from 'zod';

// Password validation regex
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Base schemas
const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email address');

const passwordSchema = z.string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password cannot exceed 64 characters')
  .regex(
    PASSWORD_PATTERN,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

const usernameSchema = z.string()
  .min(1, 'Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username cannot exceed 50 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// Form schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  currentPassword: z.string().optional(),
  newPassword: passwordSchema.optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  // If any password field is filled, all password fields must be filled
  const hasAnyPassword = data.currentPassword || data.newPassword || data.confirmNewPassword;
  const hasAllPasswords = data.currentPassword && data.newPassword && data.confirmNewPassword;
  return !hasAnyPassword || hasAllPasswords;
}, {
  message: "All password fields are required when changing password",
  path: ["newPassword"],
}).refine((data) => {
  // If changing password, new password must match confirmation
  if (data.newPassword && data.confirmNewPassword) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>; 