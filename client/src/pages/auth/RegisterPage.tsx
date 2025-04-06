import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { registerFormSchema } from '@/utils/validation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register: registerUser, error: apiError, isLoading, clearError } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resetOptions: {
      keepValues: true,
      keepErrors: true,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false,
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => {
      clearTimeout(timer);
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: RegisterFormValues) => {
    clearError();
    try {
      const success = await registerUser(data);
    } catch (error: any) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-secondary-400 opacity-20 blur-[100px] animate-pulse-subtle"></div>
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-primary-400 opacity-20 blur-[100px] animate-pulse-subtle animation-delay-200"></div>
      <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-accent-400 opacity-10 blur-[80px] animate-pulse-subtle animation-delay-300"></div>
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
      
      <Card 
        className={`w-full max-w-md border-neutral-200/50 backdrop-blur-xs shadow-soft transition-all duration-500 overflow-hidden ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-secondary-500 via-accent-500 to-primary-500"></div>
        
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white ring-4 ring-secondary-100 shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-secondary-800">Sign Up</h1>
            <p className="mt-2 text-neutral-600">
              Create your account to get started.
            </p>
          </div>

          {apiError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 animate-fadeIn shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-red-500">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                {apiError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className={`transition-all duration-300 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Input
                label="Username"
                type="text"
                error={errors.username?.message}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>}
                fullWidth
                className="group-focus:shadow-sm"
                {...register('username')}
                disabled={isSubmitting}
              />
            </div>

            <div className={`transition-all duration-300 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>}
                fullWidth
                className="group-focus:shadow-sm"
                {...register('email')}
                disabled={isSubmitting}
              />
            </div>

            <div className={`transition-all duration-300 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Input
                label="Password"
                type="password"
                error={errors.password?.message}
                hint="At least 8 characters with uppercase, lowercase and numbers"
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                  <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.75-.75V15h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75V9.03a8.358 8.358 0 00.091-1.53A6.75 6.75 0 0015.75 1.5zm-3 8.25a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" clipRule="evenodd" />
                </svg>}
                fullWidth
                className="group-focus:shadow-sm"
                {...register('password')}
                disabled={isSubmitting}
              />
            </div>

            <div className={`transition-all duration-300 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Input
                label="Confirm Password"
                type="password"
                error={errors.confirmPassword?.message}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400">
                  <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.75-.75V15h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75V9.03a8.358 8.358 0 00.091-1.53A6.75 6.75 0 0015.75 1.5zm-3 8.25a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" clipRule="evenodd" />
                </svg>}
                fullWidth
                className="group-focus:shadow-sm"
                {...register('confirmPassword')}
                disabled={isSubmitting}
              />
            </div>

            <div className={`transition-all duration-300 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Button
                type="submit"
                fullWidth
                variant="secondary"
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
                className="py-2.5 shadow-md shadow-secondary-500/10 hover:shadow-lg hover:shadow-secondary-500/20"
              >
                <span className="flex items-center gap-2">Sign Up</span>
              </Button>
            </div>
          </form>

          <div className={`mt-8 text-center text-sm text-neutral-600 transition-all duration-300 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="relative z-10">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-secondary-600 hover:text-secondary-700 relative group"
              >
                Log in
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </span>
          </div>
          
          <div className="absolute -right-3 -bottom-3 h-12 w-12 rounded-lg bg-secondary-500 opacity-10 blur-sm"></div>
          <div className="absolute -left-3 -top-3 h-12 w-12 rounded-lg bg-primary-500 opacity-10 blur-sm"></div>
        </CardContent>
      </Card>
    </div>
  );
} 