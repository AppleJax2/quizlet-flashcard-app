import React from 'react';
import { motion } from 'framer-motion';
import { useForm, UseFormReturn, FieldValues, SubmitHandler, UseFormProps, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FormProps<TFormValues extends FieldValues> {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  schema?: z.ZodType<TFormValues>;
  options?: Omit<UseFormProps<TFormValues>, 'resolver'>;
  id?: string;
  className?: string;
}

const Form = <TFormValues extends FieldValues>({
  onSubmit,
  children,
  schema,
  options,
  id,
  className
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    ...(options || {}),
    resolver: schema ? (zodResolver(schema) as Resolver<TFormValues>) : undefined
  });

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      id={id}
      className={className}
      onSubmit={methods.handleSubmit(onSubmit)}
      noValidate
    >
      {children(methods)}
    </motion.form>
  );
};

export default Form;

// Field wrapper component for consistent field styling and error handling
interface FieldWrapperProps {
  name: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  name,
  label,
  className,
  error,
  children,
  description
}) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        )}
      </div>
      <div className="mt-1">{children}</div>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1"
        >
          <span className="text-sm text-red-500">{error}</span>
        </motion.div>
      )}
    </div>
  );
};

// Field component that combines FieldWrapper with form control
interface FieldProps extends Omit<FieldWrapperProps, 'children'> {
  type?: string;
  placeholder?: string;
}

export const Field: React.FC<FieldProps> = ({ type = 'text', ...props }) => {
  return (
    <FieldWrapper {...props}>
      <input
        id={props.name}
        type={type}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-primary-500 focus:ring-primary-500
          disabled:cursor-not-allowed disabled:bg-gray-100
          dark:bg-dark-800 dark:border-dark-700 dark:text-white
          dark:focus:border-primary-400 dark:focus:ring-primary-400
          ${props.error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
        `}
        placeholder={props.placeholder}
      />
    </FieldWrapper>
  );
}; 