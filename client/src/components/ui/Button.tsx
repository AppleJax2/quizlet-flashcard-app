import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps<C extends React.ElementType> {
  /**
   * Button visual style variants
   * - primary: High contrast, used for main actions
   * - secondary: Medium contrast, for alternative actions
   * - accent: For important accent actions
   * - outline: Low contrast, for tertiary actions
   * - ghost: Very low contrast, for least important actions
   * - destructive: For potentially destructive actions
   * - link: For text links
   * - subtle: For subtle actions
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive' | 'link' | 'subtle';
  
  /**
   * Button size variants
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: C;
  responsive?: boolean;
  pill?: boolean;
  disabled?: boolean;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
}

type PolymorphicButtonProps<C extends React.ElementType> = ButtonProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonProps<C>>;

/**
 * Button component with enhanced contrast for action hierarchy.
 * Implements the Contrast design principle to direct attention and create visual interest.
 */
export const Button = <C extends React.ElementType = 'button'>({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  loadingText,
  children,
  fullWidth,
  leftIcon,
  rightIcon,
  as,
  responsive = true,
  pill = false,
  active = false,
  disabled,
  ...props
}: PolymorphicButtonProps<C>) => {
  const Component = as || 'button';
  
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Enhanced contrast variants for better action hierarchy
  const variants = {
    // Primary: Highest contrast for main actions
    primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow active:bg-primary-800 hover:-translate-y-0.5 active:translate-y-0',
    
    // Secondary: Medium contrast for alternative actions
    secondary: 'bg-secondary-700 text-white shadow-sm hover:bg-secondary-800 hover:shadow active:bg-secondary-900 hover:-translate-y-0.5 active:translate-y-0',
    
    // Accent: High contrast accent color
    accent: 'bg-accent-600 text-white shadow-sm hover:bg-accent-700 hover:shadow active:bg-accent-800 hover:-translate-y-0.5 active:translate-y-0',
    
    // Outline: Lower contrast for tertiary actions
    outline: 'bg-transparent border-2 border-neutral-300 text-secondary-800 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100',
    
    // Ghost: Lowest contrast for least important actions
    ghost: 'bg-transparent text-secondary-700 hover:bg-neutral-100 active:bg-neutral-200',
    
    // Destructive: High contrast warning color
    destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow active:bg-red-800 hover:-translate-y-0.5 active:translate-y-0',
    
    link: 'bg-transparent text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 p-0 h-auto',
    
    subtle: 'bg-primary-50 text-primary-800 hover:bg-primary-100 active:bg-primary-200',
  };

  const sizes = responsive 
    ? {
        xs: 'text-xs px-2 py-1 h-7 sm:px-2.5 sm:py-1 sm:h-7',
        sm: 'text-xs px-2.5 py-1.5 h-8 sm:px-3 sm:py-1.5 sm:h-9',
        md: 'text-sm px-3 py-1.5 h-9 sm:px-4 sm:py-2 sm:h-10',
        lg: 'text-sm px-4 py-2 h-10 sm:text-base sm:px-5 sm:py-2.5 sm:h-12',
        xl: 'text-base px-5 py-2.5 h-12 sm:text-lg sm:px-6 sm:py-3 sm:h-14',
        icon: 'p-1.5 h-9 w-9 sm:p-2 sm:h-10 sm:w-10',
      }
    : {
        xs: 'text-xs px-2.5 py-1 h-7',
        sm: 'text-xs px-3 py-1.5 h-9',
        md: 'text-sm px-4 py-2 h-10',
        lg: 'text-base px-5 py-2.5 h-12',
        xl: 'text-lg px-6 py-3 h-14',
        icon: 'p-2 h-10 w-10',
      };

  return (
    <Component
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        pill && 'rounded-full',
        active && 'ring-2 ring-primary-500 ring-offset-1',
        isLoading && 'opacity-70 pointer-events-none',
        className
      )}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <>
          <span className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="animate-spin h-4 w-4 text-current" 
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
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
          <span className="opacity-0">
            {loadingText || children}
          </span>
        </>
      )}
      
      {!isLoading && (
        <>
          {leftIcon && (
            <span className="mr-2 inline-flex" aria-hidden="true">{leftIcon}</span>
          )}
          
          {children}
          
          {rightIcon && (
            <span className="ml-2 inline-flex" aria-hidden="true">{rightIcon}</span>
          )}
        </>
      )}
    </Component>
  );
};

Button.displayName = 'Button';

export default Button; 