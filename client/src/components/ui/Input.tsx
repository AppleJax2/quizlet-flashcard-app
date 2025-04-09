import React, { useState } from 'react';
import { cn } from '@/utils/cn';

type BaseInputProps = {
  label?: string;
  error?: string | undefined;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  hideLabel?: boolean;
  floatingLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isValid?: boolean; 
  responsivePadding?: boolean;
  id?: string;
  ariaDescribedBy?: string;
  helpText?: string;
  maxLength?: number;
  renderCharacterCount?: boolean;
};

type InputElementProps = BaseInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps>;
type TextAreaElementProps = BaseInputProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseInputProps>;

type InputProps = InputElementProps | (TextAreaElementProps & { multiline: true });

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    hint, 
    multiline, 
    rows = 4, 
    leftIcon, 
    rightIcon, 
    fullWidth, 
    hideLabel = false,
    floatingLabel = false,
    required = false,
    disabled = false,
    readOnly = false,
    isValid = false,
    responsivePadding = true,
    id,
    ariaDescribedBy,
    helpText,
    maxLength,
    renderCharacterCount = false,
    ...props 
  }, ref) => {
    const [characterCount, setCharacterCount] = useState<number>(
      ('value' in props && typeof props.value === 'string') ? props.value.length : 0
    );
    
    // Generate IDs if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
    const helpTextId = ariaDescribedBy || `${inputId}-help`;
    const errorId = `${inputId}-error`;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (maxLength && renderCharacterCount) {
        setCharacterCount(e.target.value.length);
      }
      
      if ('onChange' in props && typeof props.onChange === 'function') {
        props.onChange(e as any);
      }
    };

    const inputClasses = cn(
      'w-full rounded-lg border bg-white text-secondary-900 shadow-sm transition-all duration-200',
      responsivePadding ? 'px-2 py-1.5 sm:px-3 sm:py-2' : 'px-3 py-2',
      'placeholder:text-neutral-400',
      'focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100',
      'read-only:bg-neutral-50 read-only:cursor-default',
      error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
        : isValid
          ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
          : 'border-neutral-300 hover:border-neutral-400',
      floatingLabel && 'pt-5 pb-2',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    );

    const labelContent = label && (
      <label 
        htmlFor={inputId}
        className={cn(
          floatingLabel
            ? "absolute left-3 top-0 z-10 origin-[0] -translate-y-0 scale-75 transform px-1 text-sm text-neutral-500 duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:-translate-y-0 peer-focus:scale-75 peer-focus:text-primary-600"
            : "block text-sm font-medium text-secondary-800 mb-1.5",
          hideLabel && "sr-only",
        )}
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    );

    const inputComponent = (
      <div className={`relative ${fullWidth ? 'w-full' : ''} group`}>
        {floatingLabel && labelContent}
        
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400 group-focus-within:text-primary-500">
            {leftIcon}
          </div>
        )}
        
        {multiline ? (
          <textarea
            id={inputId}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={cn(inputClasses, "min-h-[80px] resize-y")}
            rows={rows}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : (hint || helpText) ? helpTextId : undefined}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onChange={handleChange}
            maxLength={maxLength}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            ref={ref as React.Ref<HTMLInputElement>}
            className={cn(inputClasses, floatingLabel && "peer")}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : (hint || helpText) ? helpTextId : undefined}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onChange={handleChange}
            maxLength={maxLength}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400 group-focus-within:text-primary-500">
            {rightIcon}
          </div>
        )}
        
        {isValid && !error && !rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    );

    return (
      <div className={cn("w-full", fullWidth ? "w-full" : "")}>
        {!floatingLabel && labelContent}
        
        {inputComponent}
        
        {/* Help text, hint, or error message */}
        <div className="mt-1.5 min-h-[1.25rem]">
          {error ? (
            <p id={errorId} className="text-xs font-medium text-red-600 flex items-center" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          ) : hint ? (
            <p id={helpTextId} className="text-xs text-neutral-500">{hint}</p>
          ) : helpText ? (
            <p id={helpTextId} className="text-xs text-neutral-500">{helpText}</p>
          ) : null}
          
          {/* Character count */}
          {maxLength && renderCharacterCount && (
            <div className={cn(
              "text-xs text-right",
              characterCount > maxLength * 0.9 ? "text-amber-600" : "text-neutral-500",
              characterCount >= maxLength && "text-red-600"
            )}>
              {characterCount}/{maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 