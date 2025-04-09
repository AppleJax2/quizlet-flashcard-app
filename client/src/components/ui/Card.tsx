import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'filled' | 'gradient';
  hoverEffect?: boolean | 'subtle' | 'lift' | 'glow';
  isInteractive?: boolean;
  compact?: boolean;
  colorScheme?: 'primary' | 'secondary' | 'accent' | 'neutral';
  /**
   * Importance level for visual hierarchy
   * - 'primary': Highest visual prominence for key information
   * - 'secondary': Medium visual prominence
   * - 'tertiary': Lowest visual prominence for supporting content
   */
  importance?: 'primary' | 'secondary' | 'tertiary';
}

/**
 * Card component with enhanced support for visual hierarchy.
 * Implements the Hierarchy design principle for guiding users through the interface.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    children, 
    variant = 'default', 
    hoverEffect = false, 
    isInteractive = false,
    compact = false,
    colorScheme,
    importance = 'secondary',
    ...props 
  }, ref) => {
    const colorStyles = {
      primary: 'border-primary-200 bg-primary-50 text-primary-900',
      secondary: 'border-secondary-200 bg-secondary-50 text-secondary-900',
      accent: 'border-accent-200 bg-accent-50 text-accent-900',
      neutral: 'border-neutral-200 bg-neutral-50 text-neutral-900',
    };
    
    const gradientStyles = {
      primary: 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200',
      secondary: 'bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200',
      accent: 'bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200',
      neutral: 'bg-gradient-to-br from-neutral-50 to-neutral-100 border-neutral-200',
    };

    const hoverStyles = {
      true: 'hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5',
      subtle: 'hover:shadow-sm hover:border-neutral-300',
      lift: 'hover:shadow-lg hover:-translate-y-1 hover:border-neutral-300',
      glow: 'hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:border-neutral-300',
      false: '',
    };

    // Visual hierarchy styles based on importance
    const importanceStyles = {
      primary: 'shadow-md border-l-4 border-l-primary-500',
      secondary: 'shadow-sm',
      tertiary: 'shadow-none border-dashed',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200 overflow-hidden',
          // Base variants
          variant === 'default' && 'bg-white border border-neutral-200',
          variant === 'outline' && 'bg-transparent border border-neutral-200',
          variant === 'filled' && 'bg-neutral-50 border border-neutral-100',
          // Gradient variant with color schemes
          variant === 'gradient' && colorScheme && gradientStyles[colorScheme],
          // Color schemes for filled variant
          variant === 'filled' && colorScheme && colorStyles[colorScheme],
          // Importance-based hierarchy styling
          importanceStyles[importance],
          // Hover effects
          typeof hoverEffect === 'boolean' ? hoverStyles[String(hoverEffect)] : hoverStyles[hoverEffect],
          // Interactive styling
          isInteractive && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
          // Compact mode
          compact && 'p-2',
          className
        )}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  compact?: boolean;
  importance?: 'primary' | 'secondary' | 'tertiary';
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, bordered = false, compact = false, importance = 'secondary', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5',
        compact ? 'p-3' : 'p-5 sm:p-5',
        bordered && 'border-b border-neutral-200',
        importance === 'primary' && 'bg-neutral-50',
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    as?: React.ElementType;
    responsive?: boolean;
    importance?: 'primary' | 'secondary' | 'tertiary';
  }
>(({ className, as: Component = 'h3', responsive = true, importance = 'secondary', ...props }, ref) => {
  const importanceStyles = {
    primary: 'font-bold text-secondary-900',
    secondary: 'font-semibold text-secondary-800',
    tertiary: 'font-medium text-secondary-700',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'leading-tight tracking-tight', 
        importanceStyles[importance],
        responsive ? 'text-base sm:text-lg' : 'text-lg',
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    importance?: 'primary' | 'secondary' | 'tertiary';
  }
>(({ className, importance = 'secondary', ...props }, ref) => {
  const importanceStyles = {
    primary: 'text-sm sm:text-base text-secondary-700',
    secondary: 'text-xs sm:text-sm text-secondary-600',
    tertiary: 'text-xs text-secondary-500',
  };

  return (
    <p
      ref={ref}
      className={cn(importanceStyles[importance], className)}
      {...props}
    />
  );
});

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean; 
    padded?: boolean;
  }
>(({ className, compact = false, padded = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      padded && (compact ? 'p-3' : 'p-4 sm:p-5'),
      className
    )}
    {...props}
  />
));

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  compact?: boolean;
  alignRight?: boolean;
  importance?: 'primary' | 'secondary' | 'tertiary';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered = false, compact = false, alignRight = false, importance = 'secondary', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        compact ? 'p-3' : 'p-4 sm:p-5',
        bordered && 'border-t border-neutral-200',
        alignRight && 'justify-end',
        importance === 'primary' && 'bg-neutral-50',
        importance === 'tertiary' && 'text-sm text-secondary-600',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

// Export as a single object for convenience
export default {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
}; 