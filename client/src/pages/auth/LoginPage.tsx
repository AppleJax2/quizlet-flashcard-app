import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

import { useAuthStore } from '@/lib/store';
import { loginFormSchema } from '@/utils/validation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { login, error, isLoading, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => {
      clearTimeout(timer);
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginFormValues) => {
    clearError();
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
      
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      if (err instanceof Error && err.message === 'Login successful') {
        toast.success('Logged in successfully!');
        navigate('/dashboard', { replace: true });
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      toast.error(errorMessage);
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-accent-50/50 -z-10"></div>
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary-200 opacity-30 blur-[100px] -z-10"></div>
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent-100 opacity-30 blur-[100px] -z-10"></div>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold font-heading text-secondary-900 mb-2">Welcome back</h1>
            <p className="text-secondary-600">
              Please enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 animate-fadeIn shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-red-500">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className={cn(
              "form-group transition-all duration-300 delay-100",
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Input
                label="Email address"
                type="email"
                error={errors.email?.message || ''}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary-400">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>}
                fullWidth
                placeholder="your.email@example.com"
                className="group-focus:shadow-sm"
                {...register('email')}
              />
            </div>

            <div className={cn(
              "form-group transition-all duration-300 delay-200",
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Input
                label="Password"
                type="password"
                error={errors.password?.message || ''}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary-400">
                  <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.75-.75V15h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75V9.03a8.358 8.358 0 00.091-1.53A6.75 6.75 0 0015.75 1.5zm-3 8.25a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" clipRule="evenodd" />
                </svg>}
                fullWidth
                placeholder="Enter your password"
                className="group-focus:shadow-sm"
                {...register('password')}
              />

              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 relative group"
                >
                  Forgot password?
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>

            <div className={cn(
              "transition-all duration-300 delay-300",
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Button
                type="submit"
                fullWidth
                variant="primary"
                isLoading={isLoading}
                className="py-2.5 mt-3"
              >
                <span className="flex items-center gap-2">
                  Sign in
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
                  </svg>
                </span>
              </Button>
            </div>
          </form>

          <div className={cn(
            "mt-8 text-center transition-all duration-300 delay-400",
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="mx-3 flex-shrink text-xs text-neutral-500">OR</span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>
            
            <p className="mt-6 text-sm text-secondary-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-700 relative group"
              >
                Create one now
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 