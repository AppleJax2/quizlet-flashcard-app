import React from 'react';
import { cn } from '@/lib/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('space-y-6', className)}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
};

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);

FormLabel.displayName = 'FormLabel';

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm font-medium text-red-500', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

FormMessage.displayName = 'FormMessage'; 