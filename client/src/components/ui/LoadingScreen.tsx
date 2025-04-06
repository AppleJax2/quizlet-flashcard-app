import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'dots';
  color?: 'primary' | 'secondary' | 'accent' | 'neutral';
  fadeIn?: boolean;
  delayMs?: number;
}

export default function LoadingScreen({
  message = 'Loading...',
  fullScreen = true,
  className,
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  fadeIn = true,
  delayMs = 300,
}: LoadingScreenProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    accent: 'text-accent-500',
    neutral: 'text-neutral-500',
  };

  const [visible, setVisible] = React.useState(!fadeIn);

  React.useEffect(() => {
    if (fadeIn) {
      const timer = setTimeout(() => setVisible(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [fadeIn, delayMs]);

  if (fadeIn && !visible) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen && 'fixed inset-0 z-50 bg-white bg-opacity-90',
        !fullScreen && 'h-full w-full py-8',
        fadeIn && 'animate-fadeIn',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {variant === 'spinner' && (
        <svg
          className={cn('animate-spin', colorClasses[color], sizeClasses[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {variant === 'dots' && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'rounded-full bg-current',
                colorClasses[color],
                size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4',
                'animate-bounce',
                i === 1 && 'animation-delay-200',
                i === 2 && 'animation-delay-400'
              )}
            ></div>
          ))}
        </div>
      )}

      {variant === 'pulse' && (
        <div 
          className={cn(
            'rounded-full', 
            colorClasses[color], 
            sizeClasses[size],
            'animate-pulse'
          )}
        ></div>
      )}

      {message && (
        <p
          className="mt-4 text-center text-lg font-medium text-neutral-800"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </div>
  );
} 