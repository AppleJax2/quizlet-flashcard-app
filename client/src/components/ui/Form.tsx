import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

/**************************************
 * Text Input Component
 **************************************/
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label for the input
   */
  label?: string;
  
  /**
   * Helper text to display below the input
   */
  helpText?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the input has an error
   */
  hasError?: boolean;
  
  /**
   * Left icon or element to display inside the input
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon or element to display inside the input
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Whether the input is required
   */
  required?: boolean;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Additional CSS classes for the input element
   */
  inputClassName?: string;
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Additional CSS classes for the help text
   */
  helpTextClassName?: string;
  
  /**
   * Additional CSS classes for the error message
   */
  errorClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helpText,
  error,
  disabled,
  hasError,
  leftIcon,
  rightIcon,
  required,
  containerClassName,
  inputClassName,
  labelClassName,
  helpTextClassName,
  errorClassName,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const helpTextId = helpText ? `help-text-${inputId}` : undefined;
  const errorId = error ? `error-${inputId}` : undefined;
  
  // Compute error state
  const isError = hasError || !!error;
  
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-neutral-700',
            disabled && 'opacity-60',
            labelClassName
          )}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          aria-describedby={cn(helpTextId, errorId)}
          aria-invalid={isError}
          disabled={disabled}
          className={cn(
            'w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm',
            'placeholder:text-neutral-400',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-70',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            isError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            inputClassName,
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p 
          id={helpTextId}
          className={cn('text-sm text-neutral-500', helpTextClassName)}
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className={cn('text-sm text-red-600', errorClassName)}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**************************************
 * Textarea Component
 **************************************/
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label for the textarea
   */
  label?: string;
  
  /**
   * Helper text to display below the textarea
   */
  helpText?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the textarea is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the textarea has an error
   */
  hasError?: boolean;
  
  /**
   * Whether the textarea is required
   */
  required?: boolean;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Additional CSS classes for the textarea element
   */
  textareaClassName?: string;
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Additional CSS classes for the help text
   */
  helpTextClassName?: string;
  
  /**
   * Additional CSS classes for the error message
   */
  errorClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  helpText,
  error,
  disabled,
  hasError,
  required,
  containerClassName,
  textareaClassName,
  labelClassName,
  helpTextClassName,
  errorClassName,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;
  const helpTextId = helpText ? `help-text-${textareaId}` : undefined;
  const errorId = error ? `error-${textareaId}` : undefined;
  
  // Compute error state
  const isError = hasError || !!error;
  
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label 
          htmlFor={textareaId}
          className={cn(
            'block text-sm font-medium text-neutral-700',
            disabled && 'opacity-60',
            labelClassName
          )}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        ref={ref}
        aria-describedby={cn(helpTextId, errorId)}
        aria-invalid={isError}
        disabled={disabled}
        className={cn(
          'w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm',
          'placeholder:text-neutral-400',
          'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
          'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-70',
          isError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          textareaClassName,
          className
        )}
        {...props}
      />
      
      {helpText && !error && (
        <p 
          id={helpTextId}
          className={cn('text-sm text-neutral-500', helpTextClassName)}
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className={cn('text-sm text-red-600', errorClassName)}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

/**************************************
 * Select Component
 **************************************/
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  /**
   * Label for the select
   */
  label?: string;
  
  /**
   * Helper text to display below the select
   */
  helpText?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the select has an error
   */
  hasError?: boolean;
  
  /**
   * Options for the select
   */
  options: SelectOption[];
  
  /**
   * Placeholder option text
   */
  placeholder?: string;
  
  /**
   * Value of the selected option
   */
  value?: string | string[];
  
  /**
   * Group options by optgroup
   */
  groups?: {
    label: string;
    options: SelectOption[];
  }[];
  
  /**
   * Whether the select is required
   */
  required?: boolean;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Additional CSS classes for the select element
   */
  selectClassName?: string;
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Additional CSS classes for the help text
   */
  helpTextClassName?: string;
  
  /**
   * Additional CSS classes for the error message
   */
  errorClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  helpText,
  error,
  disabled,
  hasError,
  options,
  placeholder,
  value,
  groups,
  required,
  containerClassName,
  selectClassName,
  labelClassName,
  helpTextClassName,
  errorClassName,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  const helpTextId = helpText ? `help-text-${selectId}` : undefined;
  const errorId = error ? `error-${selectId}` : undefined;
  
  // Compute error state
  const isError = hasError || !!error;
  
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label 
          htmlFor={selectId}
          className={cn(
            'block text-sm font-medium text-neutral-700',
            disabled && 'opacity-60',
            labelClassName
          )}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          aria-describedby={cn(helpTextId, errorId)}
          aria-invalid={isError}
          disabled={disabled}
          value={value}
          className={cn(
            'w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm appearance-none',
            'pl-3 pr-10',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-70',
            isError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            selectClassName,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          
          {groups ? (
            // Render option groups
            groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          ) : (
            // Render flat options
            options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          )}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {helpText && !error && (
        <p 
          id={helpTextId}
          className={cn('text-sm text-neutral-500', helpTextClassName)}
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className={cn('text-sm text-red-600', errorClassName)}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

/**************************************
 * Checkbox Component
 **************************************/
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label for the checkbox
   */
  label?: string;
  
  /**
   * Helper text to display below the checkbox
   */
  helpText?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the checkbox has an error
   */
  hasError?: boolean;
  
  /**
   * Whether the checkbox is required
   */
  required?: boolean;
  
  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;
  
  /**
   * Indeterminate state of the checkbox
   */
  indeterminate?: boolean;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Additional CSS classes for the checkbox element
   */
  checkboxClassName?: string;
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Additional CSS classes for the help text
   */
  helpTextClassName?: string;
  
  /**
   * Additional CSS classes for the error message
   */
  errorClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  helpText,
  error,
  disabled,
  hasError,
  required,
  checked,
  indeterminate,
  containerClassName,
  checkboxClassName,
  labelClassName,
  helpTextClassName,
  errorClassName,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const checkboxId = id || `checkbox-${generatedId}`;
  const helpTextId = helpText ? `help-text-${checkboxId}` : undefined;
  const errorId = error ? `error-${checkboxId}` : undefined;
  
  // Compute error state
  const isError = hasError || !!error;
  
  // Handle indeterminate state
  React.useEffect(() => {
    if (ref && 'current' in ref && ref.current && indeterminate !== undefined) {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);
  
  return (
    <div className={cn('space-y-2', containerClassName)}>
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            aria-describedby={cn(helpTextId, errorId)}
            aria-invalid={isError}
            disabled={disabled}
            checked={checked}
            required={required}
            className={cn(
              'h-4 w-4 rounded border-neutral-300 text-primary-600',
              'focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-70',
              isError && 'border-red-500 focus:ring-red-500',
              checkboxClassName,
              className
            )}
            {...props}
          />
        </div>
        
        {label && (
          <div className="ml-3 text-sm">
            <label 
              htmlFor={checkboxId}
              className={cn(
                'font-medium text-neutral-700',
                disabled && 'opacity-60',
                labelClassName
              )}
            >
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </label>
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p 
          id={helpTextId}
          className={cn('text-sm text-neutral-500 pl-7', helpTextClassName)}
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className={cn('text-sm text-red-600 pl-7', errorClassName)}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

/**************************************
 * Radio Component
 **************************************/
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label for the radio button
   */
  label?: string;
  
  /**
   * Helper text to display below the radio button
   */
  helpText?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the radio button is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the radio button has an error
   */
  hasError?: boolean;
  
  /**
   * Whether the radio button is required
   */
  required?: boolean;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Additional CSS classes for the radio element
   */
  radioClassName?: string;
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Additional CSS classes for the help text
   */
  helpTextClassName?: string;
  
  /**
   * Additional CSS classes for the error message
   */
  errorClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  helpText,
  error,
  disabled,
  hasError,
  required,
  containerClassName,
  radioClassName,
  labelClassName,
  helpTextClassName,
  errorClassName,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const radioId = id || `radio-${generatedId}`;
  const helpTextId = helpText ? `help-text-${radioId}` : undefined;
  const errorId = error ? `error-${radioId}` : undefined;
  
  // Compute error state
  const isError = hasError || !!error;
  
  return (
    <div className={cn('space-y-2', containerClassName)}>
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            id={radioId}
            ref={ref}
            type="radio"
            aria-describedby={cn(helpTextId, errorId)}
            aria-invalid={isError}
            disabled={disabled}
            required={required}
            className={cn(
              'h-4 w-4 border-neutral-300 text-primary-600',
              'focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-70',
              isError && 'border-red-500 focus:ring-red-500',
              radioClassName,
              className
            )}
            {...props}
          />
        </div>
        
        {label && (
          <div className="ml-3 text-sm">
            <label 
              htmlFor={radioId}
              className={cn(
                'font-medium text-neutral-700',
                disabled && 'opacity-60',
                labelClassName
              )}
            >
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </label>
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p 
          id={helpTextId}
          className={cn('text-sm text-neutral-500 pl-7', helpTextClassName)}
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className={cn('text-sm text-red-600 pl-7', errorClassName)}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

/**************************************
 * Radio Group Component
 **************************************/
export interface RadioGroupOption {
  value: string;
  label: string;
  helpText?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /**
   * Label for the radio group
   */
  label?: string;
  
  /**
   * Helper text to display below the radio group
   */
  helpText?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Options for the radio group
   */
  options: RadioGroupOption[];
  
  /**
   * Value of the selected option
   */
  value?: string;
  
  /**
   * Name attribute for the radio inputs
   */
  name: string;
  
  /**
   * Whether the radio group is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the radio group has an error
   */
  hasError?: boolean;
  
  /**
   * Whether the radio group is required
   */
  required?: boolean;
  
  /**
   * Layout direction for the radio options
   */
  direction?: 'horizontal' | 'vertical';
  
  /**
   * Callback when the value changes
   */
  onChange?: (value: string) => void;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Additional CSS classes for the options container
   */
  optionsClassName?: string;
  
  /**
   * Additional CSS classes for the help text
   */
  helpTextClassName?: string;
  
  /**
   * Additional CSS classes for the error message
   */
  errorClassName?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  helpText,
  error,
  options,
  value,
  name,
  disabled,
  hasError,
  required,
  direction = 'vertical',
  onChange,
  containerClassName,
  labelClassName,
  optionsClassName,
  helpTextClassName,
  errorClassName,
}) => {
  const generatedId = useId();
  const groupId = `radio-group-${generatedId}`;
  const helpTextId = helpText ? `help-text-${groupId}` : undefined;
  const errorId = error ? `error-${groupId}` : undefined;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div 
      className={cn('space-y-3', containerClassName)}
      role="radiogroup"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={cn(helpTextId, errorId)}
    >
      {label && (
        <div 
          id={`${groupId}-label`}
          className={cn(
            'text-sm font-medium text-neutral-700',
            disabled && 'opacity-60',
            labelClassName
          )}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </div>
      )}
      
      <div 
        className={cn(
          'space-y-3',
          direction === 'horizontal' && 'flex flex-wrap gap-x-6 gap-y-3 space-y-0',
          optionsClassName
        )}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          
          return (
            <div key={option.value} className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={optionId}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  disabled={disabled || option.disabled}
                  onChange={handleChange}
                  required={required}
                  className={cn(
                    'h-4 w-4 border-neutral-300 text-primary-600',
                    'focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-70',
                    (hasError || error) && 'border-red-500 focus:ring-red-500'
                  )}
                />
              </div>
              
              <div className="ml-3 text-sm">
                <label 
                  htmlFor={optionId}
                  className={cn(
                    'font-medium text-neutral-700',
                    (disabled || option.disabled) && 'opacity-60'
                  )}
                >
                  {option.label}
                </label>
                
                {option.helpText && (
                  <p className="mt-1 text-neutral-500">{option.helpText}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {helpText && !error && (
        <p 
          id={helpTextId}
          className={cn('text-sm text-neutral-500', helpTextClassName)}
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className={cn('text-sm text-red-600', errorClassName)}
        >
          {error}
        </p>
      )}
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';

/**************************************
 * Switch Component
 **************************************/
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  /**
   * Whether the switch is checked
   */
  checked: boolean;
  
  /**
   * Callback when the switch is toggled
   */
  onChange: (checked: boolean) => void;
  
  /**
   * Label for the switch
   */
  label?: string;
  
  /**
   * Helper text to display below the switch
   */
  helpText?: string;
  
  /**
   * Description text to display to the right of the switch label
   */
  description?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the switch has an error
   */
  hasError?: boolean;
  
  /**
   * Size of the switch
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Additional CSS classes for the switch element
   */
  switchClassName?: string;
  
  /**
   * Additional CSS classes for the label
   */
  labelClassName?: string;
  
  /**
   * Additional CSS classes for the description
   */
  descriptionClassName?: string;
  
  /**
   * Additional CSS classes for the help text
   */
  helpTextClassName?: string;
  
  /**
   * Additional CSS classes for the error message
   */
  errorClassName?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  checked,
  onChange,
  label,
  helpText,
  description,
  error,
  disabled,
  hasError,
  size = 'md',
  containerClassName,
  switchClassName,
  labelClassName,
  descriptionClassName,
  helpTextClassName,
  errorClassName,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const switchId = id || `switch-${generatedId}`;
  const helpTextId = helpText ? `help-text-${switchId}` : undefined;
  const errorId = error ? `error-${switchId}` : undefined;
  
  // Compute error state
  const isError = hasError || !!error;
  
  // Configure dimensions based on size
  const sizeClasses = {
    sm: {
      container: 'h-5 w-9',
      circle: 'h-3.5 w-3.5',
      translate: 'translate-x-4',
    },
    md: {
      container: 'h-6 w-11',
      circle: 'h-4.5 w-4.5',
      translate: 'translate-x-5',
    },
    lg: {
      container: 'h-7 w-14',
      circle: 'h-5.5 w-5.5',
      translate: 'translate-x-7',
    },
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };
  
  return (
    <div className={cn('space-y-2', containerClassName)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-grow items-center">
          {label && (
            <label 
              htmlFor={switchId}
              className={cn(
                'text-sm font-medium text-neutral-700',
                disabled && 'opacity-60',
                labelClassName
              )}
            >
              {label}
            </label>
          )}
          
          {description && (
            <p className={cn('ml-2 text-sm text-neutral-500', descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
        
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-describedby={cn(helpTextId, errorId)}
          id={switchId}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            'group relative inline-flex items-center justify-center outline-none',
            disabled && 'cursor-not-allowed opacity-70',
            switchClassName
          )}
        >
          <span 
            className={cn(
              'block rounded-full transition',
              sizeClasses[size].container,
              checked ? 'bg-primary-600' : 'bg-neutral-300',
              !disabled && checked && 'group-hover:bg-primary-700',
              !disabled && !checked && 'group-hover:bg-neutral-400',
              isError && 'bg-red-500 group-hover:bg-red-600',
              className
            )}
          >
            <span 
              className={cn(
                'block transform rounded-full bg-white shadow transition',
                'ring-0 group-focus:ring-2 group-focus:ring-primary-600 group-focus:ring-offset-2',
                isError && 'group-focus:ring-red-500',
                sizeClasses[size].circle,
                checked ? sizeClasses[size].translate : 'translate-x-0.5'
              )}
            />
          </span>
          
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />
        </button>
      </div>
      
      {helpText && !error && (
        <p 
          id={helpTextId}
          className={cn('text-sm text-neutral-500', helpTextClassName)}
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className={cn('text-sm text-red-600', errorClassName)}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

/**************************************
 * Form Label Component
 **************************************/
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Whether the associated field is required
   */
  required?: boolean;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(({
  required,
  className,
  children,
  ...props
}, ref) => (
  <label
    ref={ref}
    className={cn('block text-sm font-medium text-neutral-700', className)}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-red-500">*</span>}
  </label>
));

FormLabel.displayName = 'FormLabel';

/**************************************
 * Form Helper Text Component
 **************************************/
export interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormHelperText = forwardRef<HTMLParagraphElement, FormHelperTextProps>(({
  className,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('mt-1 text-sm text-neutral-500', className)}
    {...props}
  />
));

FormHelperText.displayName = 'FormHelperText';

/**************************************
 * Form Error Message Component
 **************************************/
export interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormErrorMessage = forwardRef<HTMLParagraphElement, FormErrorMessageProps>(({
  className,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('mt-1 text-sm text-red-600', className)}
    {...props}
  />
));

FormErrorMessage.displayName = 'FormErrorMessage';

/**************************************
 * Form Group Component
 **************************************/
export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
));

FormGroup.displayName = 'FormGroup'; 