import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  fullWidth?: boolean;
  helperText?: string;
  showSuccessState?: boolean;
  customValidation?: (value: string) => boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      helperText,
      id,
      showSuccessState = false,
      customValidation,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const [focused, setFocused] = useState(false);
    const [validated, setValidated] = useState(false);
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      if (onFocus) onFocus(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      // Validate when the user leaves the field
      if (customValidation && e.target.value) {
        setValidated(customValidation(e.target.value));
      }
      if (onBlur) onBlur(e);
    };
    
    // Determine if we should show the success state
    const showSuccess = showSuccessState && props.value && !error && 
      (!customValidation || validated);

    return (
      <div className={cn('mb-4', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-neutral-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors placeholder:text-neutral-400 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : focused
                  ? 'border-primary-500 focus:border-primary-500 focus:ring-primary-500'
                  : showSuccess
                    ? 'border-green-500'
                    : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">
              {rightIcon}
            </div>
          )}
          {showSuccess && !rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <p
            className="mt-1 text-xs text-red-500"
            id={`${inputId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            className="mt-1 text-xs text-neutral-500"
            id={`${inputId}-helper`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 