import React from 'react';
import { cn } from '@/lib/utils';

type BaseInputProps = {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
};

type InputElementProps = BaseInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps>;
type TextAreaElementProps = BaseInputProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseInputProps>;

type InputProps = InputElementProps | (TextAreaElementProps & { multiline: true });

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, label, error, multiline, rows = 3, leftIcon, fullWidth, ...props }, ref) => {
    const inputClasses = cn(
      'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-red-500 focus-visible:ring-red-500',
      className
    );

    const inputComponent = (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {leftIcon}
          </div>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={cn(inputClasses, leftIcon && 'pl-10')}
            rows={rows}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type="text"
            className={cn(inputClasses, leftIcon && 'pl-10')}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        {inputComponent}
        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 