import React from 'react';
import { cn } from '@/utils/cn';

// Card container
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
  bordered?: boolean;
  elevated?: boolean;
}

export function Card({
  className,
  noPadding = false,
  bordered = true,
  elevated = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-white',
        bordered && 'border border-neutral-200',
        elevated && 'shadow-sm',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Card header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noDivider?: boolean;
}

export function CardHeader({
  className,
  noDivider = false,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'px-6 py-4',
        !noDivider && 'border-b border-neutral-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Card content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

// Card footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  noDivider?: boolean;
}

export function CardFooter({
  className,
  noDivider = false,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        'px-6 py-4',
        !noDivider && 'border-t border-neutral-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Card title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn('text-lg font-semibold text-neutral-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

// Card description
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn('mt-1 text-sm text-neutral-500', className)}
      {...props}
    >
      {children}
    </p>
  );
} 