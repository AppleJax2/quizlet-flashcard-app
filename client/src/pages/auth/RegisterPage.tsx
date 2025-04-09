import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

import { useAuth } from '@/contexts/AuthContext';
import { registerFormSchema } from '@/utils/validation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { signup, error: apiError, loading: isLoading } = useAuth();
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
    };
  }, []);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await signup(data.email, data.password, data.username, data.confirmPassword);
    } catch (error: any) {
      // The error is already set in AuthContext, no need to do anything else here
      // Just log for debugging in non-production
      if (process.env['NODE_ENV'] !== 'production') {
        console.error("Registration failed:", error.message || error);
      }
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-primary-50/60 -z-10"></div>
      <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-primary-100 opacity-30 blur-[100px] -z-10"></div>
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-accent-50 opacity-30 blur-[100px] -z-10"></div>
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px] -z-10"></div>
      
      <Card 
        className={cn(
          "w-full max-w-md border-neutral-200 shadow-sm transition-all duration-500 overflow-hidden",
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <div className="h-1 w-full bg-primary-500"></div>
        
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center mb-6 text-secondary-800 hover:text-primary-600 transition-colors"
              aria-label="Back to home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Back to home</span>
            </Link>
            
            <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 ring-4 ring-primary-50 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold font-heading text-secondary-900 mb-2">Create an account</h1>
            <p className="text-secondary-600">
              Join FlashLeap to improve your learning experience
            </p>
          </div>

          {apiError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 animate-fadeIn shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-red-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Registration failed</p>
                  <p className="text-sm">{apiError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className={cn(
              "form-group transition-all duration-300 delay-100",
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Input
                label="Username"
                type="text"
                error={errors.username?.message}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary-400">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>}
                placeholder="Choose a username"
                fullWidth
                className="group-focus:shadow-sm"
                {...register('username')}
                disabled={isSubmitting}
              />
            </div>

            <div className={cn(
              "form-group transition-all duration-300 delay-200",
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Input
                label="Email address"
                type="email"
                error={errors.email?.message}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary-400">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>}
                placeholder="your.email@example.com"
                fullWidth
                className="group-focus:shadow-sm"
                {...register('email')}
                disabled={isSubmitting}
              />
            </div>

            <div className={cn(
              "form-group transition-all duration-300 delay-300",
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Input
                label="Password"
                type="password"
                error={errors.password?.message}
                hint="At least 8 characters with uppercase, lowercase and numbers"
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary-400">
                  <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.75-.75V15h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75V9.03a8.358 8.358 0 00.091-1.53A6.75 6.75 0 0015.75 1.5zm-3 8.25a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" clipRule="evenodd" />
                </svg>}
                placeholder="Create a password"
                fullWidth
                className="group-focus:shadow-sm"
                {...register('password')}
                disabled={isSubmitting}
              />
            </div>

            <div className={cn(
              "form-group transition-all duration-300 delay-400",
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Input
                label="Confirm Password"
                type="password"
                error={errors.confirmPassword?.message}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary-400">
                  <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.75-.75V15h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75V9.03a8.358 8.358 0 00.091-1.53A6.75 6.75 0 0015.75 1.5zm-3 8.25a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" clipRule="evenodd" />
                </svg>}
                placeholder="Confirm your password"
                fullWidth
                className="group-focus:shadow-sm"
                {...register('confirmPassword')}
                disabled={isSubmitting}
              />
            </div>

            <div className={cn(
              "transition-all duration-300 delay-500",
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Button
                type="submit"
                fullWidth
                variant="primary"
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
                className="py-2.5 mt-4"
                rightIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
                  </svg>
                }
              >
                Create account
              </Button>
            </div>
          </form>

          <div className={cn(
            "mt-8 text-center transition-all duration-300 delay-600",
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="mx-3 flex-shrink text-xs text-neutral-500">OR</span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>
            
            <p className="mt-6 text-sm text-secondary-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700 relative group"
              >
                Sign in now
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 