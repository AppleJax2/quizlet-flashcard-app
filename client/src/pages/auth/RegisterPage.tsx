import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '@/contexts/AuthContext';
import { registerFormSchema } from '@/utils/validation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register: registerUser, error, isLoading, clearError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    clearError(); // Clear any previous errors
    await registerUser(data);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-neutral-900">Sign Up</h1>
            <p className="mt-2 text-neutral-600">
              Create your account to get started.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Username"
              type="text"
              error={errors.username?.message}
              fullWidth
              {...register('username')}
            />

            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              fullWidth
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              fullWidth
              helperText="At least 8 characters with uppercase, lowercase and numbers"
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword?.message}
              fullWidth
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="py-2.5"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 