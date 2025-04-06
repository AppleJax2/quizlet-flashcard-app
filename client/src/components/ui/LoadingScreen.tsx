import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  transparent?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'progress';
  className?: string;
}

export default function LoadingScreen({
  message = 'Loading...',
  fullScreen = false,
  transparent = false,
  color = 'primary',
  size = 'md',
  variant = 'spinner',
  className,
}: LoadingScreenProps) {
  // Color classes for different states
  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    accent: 'text-accent-500',
    neutral: 'text-neutral-500',
  };

  // Size values for different components
  const sizeValues = {
    sm: {
      spinner: 'h-6 w-6',
      container: 'p-4',
      text: 'text-sm',
      dots: 'h-1.5 w-1.5',
      spacing: 'space-y-3',
      bar: 'h-1',
    },
    md: {
      spinner: 'h-10 w-10',
      container: 'p-6',
      text: 'text-base',
      dots: 'h-2 w-2',
      spacing: 'space-y-4',
      bar: 'h-1.5',
    },
    lg: {
      spinner: 'h-14 w-14',
      container: 'p-8',
      text: 'text-lg',
      dots: 'h-2.5 w-2.5',
      spacing: 'space-y-5',
      bar: 'h-2',
    },
    xl: {
      spinner: 'h-20 w-20',
      container: 'p-10',
      text: 'text-xl',
      spacing: 'space-y-6',
      dots: 'h-3 w-3',
      bar: 'h-2.5',
    },
  };

  // Render different loader variants
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn('relative', sizeValues[size].spinner)}>
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-neutral-200"></div>
            <div 
              className={cn(
                'absolute inset-0 rounded-full border-t-2 border-r-2 animate-spin',
                colorClasses[color]
              )}
              style={{ animationDuration: '0.8s' }}
            ></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full',
                  sizeValues[size].dots,
                  colorClasses[color],
                  'animate-bounce'
                )}
                style={{ 
                  animationDuration: '1.2s', 
                  animationDelay: `${i * 0.15}s` 
                }}
              ></div>
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div 
            className={cn(
              'relative rounded-full',
              sizeValues[size].spinner,
              colorClasses[color]
            )}
          >
            <div 
              className="absolute inset-0 rounded-full bg-current animate-ping opacity-75"
            ></div>
            <div className="relative rounded-full bg-current w-full h-full"></div>
          </div>
        );
      
      case 'progress':
        const progressBarWidth = Math.floor(Math.random() * 60) + 20; // Random width between 20% and 80%
        return (
          <div className={cn('w-full bg-neutral-200 rounded-full overflow-hidden', sizeValues[size].bar)}>
            <div
              className={cn(
                'animate-pulse-subtle duration-2000 rounded-full transition-all ease-in-out',
                colorClasses[color],
                sizeValues[size].bar
              )}
              style={{ 
                width: `${progressBarWidth}%`, 
                backgroundColor: 'currentColor' 
              }}
            ></div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (fullScreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 flex flex-col items-center justify-center z-50',
          transparent ? 'bg-white/80 backdrop-blur-xs' : 'bg-white',
          className
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            sizeValues[size].spacing,
            sizeValues[size].container,
            transparent && 'bg-white rounded-2xl shadow-soft'
          )}
        >
          {renderLoader()}
          {message && (
            <p className={cn('font-medium animate-pulse-subtle', sizeValues[size].text, colorClasses[color])}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full h-full min-h-[120px]',
        sizeValues[size].spacing,
        className
      )}
    >
      {renderLoader()}
      {message && (
        <p className={cn('font-medium animate-pulse-subtle', sizeValues[size].text, colorClasses[color])}>
          {message}
        </p>
      )}
    </div>
  );
} 