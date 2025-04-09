import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type InputBaseProps = {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
};

type InputProps = InputBaseProps & Omit<HTMLMotionProps<'input'>, keyof InputBaseProps>;

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseInputStyles = `
    block rounded-md border-gray-300 shadow-sm
    focus:border-primary-500 focus:ring-primary-500
    disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500
    dark:bg-dark-800 dark:border-dark-700 dark:text-white
    dark:focus:border-primary-400 dark:focus:ring-primary-400
    dark:disabled:bg-dark-700 dark:disabled:text-dark-400
  `;

  const errorStyles = error
    ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
    : '';

  const widthStyles = fullWidth ? 'w-full' : '';

  const inputClasses = `
    ${baseInputStyles}
    ${errorStyles}
    ${widthStyles}
    ${className}
  `;

  const iconBaseStyles = 'absolute top-1/2 transform -translate-y-1/2 text-gray-400';
  const startIconStyles = 'left-3';
  const endIconStyles = 'right-3';
  const inputWithIconPadding = startIcon ? 'pl-10' : endIcon ? 'pr-10' : '';

  const motionProps: HTMLMotionProps<'input'> = {
    ref,
    whileFocus: { scale: 1.01 },
    className: `${inputClasses} ${inputWithIconPadding}`,
    disabled,
    'aria-invalid': !!error,
    'aria-describedby': props.id ? `${props.id}-error ${props.id}-helper` : undefined,
    ...props
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className={`${iconBaseStyles} ${startIconStyles}`}>
            {startIcon}
          </div>
        )}
        <motion.input {...motionProps} />
        {endIcon && (
          <div className={`${iconBaseStyles} ${endIconStyles}`}>
            {endIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1"
        >
          {error && (
            <span
              className="text-sm text-red-500"
              id={props.id ? `${props.id}-error` : undefined}
            >
              {error}
            </span>
          )}
          {helperText && !error && (
            <span
              className="text-sm text-gray-500 dark:text-gray-400"
              id={props.id ? `${props.id}-helper` : undefined}
            >
              {helperText}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 