import { useState, useCallback, FormEvent, ChangeEvent, useEffect } from 'react';
import { useErrorHandler, ErrorState } from './useErrorHandler';

export type ValidationRule<T> = (value: any, formValues: T) => string | null;

export interface FieldConfig<T> {
  initialValue: any;
  validationRules?: ValidationRule<T>[];
  required?: boolean;
  transform?: (value: any) => any;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  dependsOn?: (keyof T)[];
}

export type FieldsConfig<T> = {
  [K in keyof T]: FieldConfig<T>;
};

export interface FormOptions<T> {
  onSubmit?: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  resetOnSubmit?: boolean;
}

export interface FormState<T> {
  values: T;
  errors: { [K in keyof T]?: string | null };
  touched: { [K in keyof T]?: boolean };
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  isSubmitted: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]?: string | null };
  touched: { [K in keyof T]?: boolean };
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  isSubmitted: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  setValues: (values: Partial<T>) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  getFieldProps: (field: keyof T) => {
    name: string;
    value: any;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
  };
}

/**
 * Custom hook for comprehensive form state management with validation
 * 
 * @param fieldsConfig Configuration for form fields with validation rules
 * @param options Form options
 */
export function useForm<T extends Record<string, any>>(
  fieldsConfig: FieldsConfig<T>,
  options: FormOptions<T> = {}
): UseFormReturn<T> {
  const {
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    resetOnSubmit = false,
  } = options;
  
  // Extract initial values from config
  const initialValues = Object.entries(fieldsConfig).reduce(
    (values, [field, config]) => ({
      ...values,
      [field]: config.initialValue,
    }),
    {} as T
  );
  
  // Initialize form state
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isDirty: false,
    isSubmitting: false,
    isValid: true,
    isSubmitted: false,
  });
  
  // Use error handler for field errors
  const errorHandler = useErrorHandler();
  
  // Initialize form validation by running validation on mount
  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Run dependent field validations when specific fields change
  useEffect(() => {
    if (!formState.isDirty) return;
    
    Object.entries(fieldsConfig).forEach(([field, config]) => {
      if (config.dependsOn && config.dependsOn.length > 0) {
        const dependentFields = config.dependsOn as (keyof T)[];
        const shouldValidate = dependentFields.some(
          dependentField => formState.touched[dependentField]
        );
        
        if (shouldValidate) {
          validateField(field as keyof T);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.values, formState.isDirty]);
  
  /**
   * Validate a specific field
   */
  const validateField = useCallback(
    (field: keyof T): boolean => {
      const config = fieldsConfig[field];
      const value = formState.values[field];
      
      // Check required validation
      if (config.required && (value === undefined || value === null || value === '')) {
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: 'This field is required',
          },
          isValid: false,
        }));
        
        return false;
      }
      
      // Run through validation rules
      if (config.validationRules && config.validationRules.length > 0) {
        for (const rule of config.validationRules) {
          const errorMessage = rule(value, formState.values);
          
          if (errorMessage) {
            setFormState(prev => ({
              ...prev,
              errors: {
                ...prev.errors,
                [field]: errorMessage,
              },
              isValid: false,
            }));
            
            return false;
          }
        }
      }
      
      // Clear error if validation passes
      setFormState(prev => {
        const newErrors = { ...prev.errors };
        delete newErrors[field];
        
        return {
          ...prev,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
      
      return true;
    },
    [fieldsConfig, formState.values]
  );
  
  /**
   * Validate all form fields
   */
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors: { [K in keyof T]?: string } = {};
    
    // Validate each field
    Object.keys(fieldsConfig).forEach(field => {
      const fieldKey = field as keyof T;
      const config = fieldsConfig[fieldKey];
      const value = formState.values[fieldKey];
      
      // Check required validation
      if (config.required && (value === undefined || value === null || value === '')) {
        newErrors[fieldKey] = 'This field is required';
        isValid = false;
        return;
      }
      
      // Run through validation rules
      if (config.validationRules && config.validationRules.length > 0) {
        for (const rule of config.validationRules) {
          const errorMessage = rule(value, formState.values);
          
          if (errorMessage) {
            newErrors[fieldKey] = errorMessage;
            isValid = false;
            return;
          }
        }
      }
    });
    
    setFormState(prev => ({
      ...prev,
      errors: newErrors,
      isValid,
    }));
    
    return isValid;
  }, [fieldsConfig, formState.values]);
  
  /**
   * Handle form input changes
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      let transformedValue: any = value;
      
      // Handle checkbox inputs
      if (type === 'checkbox') {
        transformedValue = (e.target as HTMLInputElement).checked;
      }
      
      // Apply field-specific transform if available
      if (fieldsConfig[name] && fieldsConfig[name].transform) {
        transformedValue = fieldsConfig[name].transform!(transformedValue);
      }
      
      setFormState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          [name]: transformedValue,
        },
        isDirty: true,
      }));
      
      // Validate field if configured to validate on change
      if (
        validateOnChange && 
        (fieldsConfig[name].validateOnChange !== false)
      ) {
        setTimeout(() => validateField(name as keyof T), 0);
      }
    },
    [fieldsConfig, validateField, validateOnChange]
  );
  
  /**
   * Handle input blur events
   */
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      
      setFormState(prev => ({
        ...prev,
        touched: {
          ...prev.touched,
          [name]: true,
        },
      }));
      
      // Validate field if configured to validate on blur
      if (
        validateOnBlur && 
        (fieldsConfig[name].validateOnBlur !== false)
      ) {
        validateField(name as keyof T);
      }
    },
    [fieldsConfig, validateField, validateOnBlur]
  );
  
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault();
      
      setFormState(prev => ({
        ...prev,
        isSubmitting: true,
        isSubmitted: true,
      }));
      
      let isValid = true;
      
      // Validate all fields before submission if configured
      if (validateOnSubmit) {
        isValid = validateForm();
      }
      
      // Mark all fields as touched on submit
      const touchedFields = Object.keys(fieldsConfig).reduce(
        (result, field) => ({
          ...result,
          [field]: true,
        }),
        {}
      );
      
      setFormState(prev => ({
        ...prev,
        touched: {
          ...prev.touched,
          ...touchedFields,
        },
      }));
      
      if (isValid && onSubmit) {
        try {
          await onSubmit(formState.values);
          
          // Reset form if configured
          if (resetOnSubmit) {
            resetForm();
          } else {
            setFormState(prev => ({
              ...prev,
              isSubmitting: false,
            }));
          }
        } catch (error) {
          // Error handling
          setFormState(prev => ({
            ...prev,
            isSubmitting: false,
          }));
          
          if (error instanceof Error) {
            errorHandler.addError(error.message, 'error');
          }
        }
      } else {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
        }));
      }
    },
    [formState.values, validateForm, validateOnSubmit, onSubmit, resetOnSubmit, fieldsConfig, errorHandler]
  );
  
  /**
   * Programmatically set a field value
   */
  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      let transformedValue = value;
      
      // Apply field-specific transform if available
      if (fieldsConfig[field] && fieldsConfig[field].transform) {
        transformedValue = fieldsConfig[field].transform!(transformedValue);
      }
      
      setFormState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          [field]: transformedValue,
        },
        isDirty: true,
      }));
      
      // Validate field if configured to validate on change
      if (
        validateOnChange && 
        (fieldsConfig[field].validateOnChange !== false)
      ) {
        setTimeout(() => validateField(field), 0);
      }
    },
    [fieldsConfig, validateField, validateOnChange]
  );
  
  /**
   * Set multiple field values at once
   */
  const setValues = useCallback(
    (values: Partial<T>) => {
      const transformedValues = { ...values };
      
      // Apply transformations to each field
      Object.entries(values).forEach(([field, value]) => {
        const fieldKey = field as keyof T;
        
        if (fieldsConfig[fieldKey] && fieldsConfig[fieldKey].transform) {
          transformedValues[fieldKey] = fieldsConfig[fieldKey].transform!(value);
        }
      });
      
      setFormState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          ...transformedValues,
        },
        isDirty: true,
      }));
      
      // Validate affected fields
      Object.keys(values).forEach(field => {
        const fieldKey = field as keyof T;
        
        if (
          validateOnChange && 
          (fieldsConfig[fieldKey].validateOnChange !== false)
        ) {
          setTimeout(() => validateField(fieldKey), 0);
        }
      });
    },
    [fieldsConfig, validateField, validateOnChange]
  );
  
  /**
   * Mark a field as touched or untouched
   */
  const setFieldTouched = useCallback(
    (field: keyof T, isTouched: boolean = true) => {
      setFormState(prev => ({
        ...prev,
        touched: {
          ...prev.touched,
          [field]: isTouched,
        },
      }));
      
      // Validate field if marked as touched and configured to validate on blur
      if (
        isTouched && 
        validateOnBlur && 
        (fieldsConfig[field].validateOnBlur !== false)
      ) {
        validateField(field);
      }
    },
    [fieldsConfig, validateField, validateOnBlur]
  );
  
  /**
   * Programmatically set a field error
   */
  const setFieldError = useCallback(
    (field: keyof T, error: string | null) => {
      setFormState(prev => {
        const newErrors = { ...prev.errors };
        
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        
        return {
          ...prev,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
    },
    []
  );
  
  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isDirty: false,
      isSubmitting: false,
      isValid: true,
      isSubmitted: false,
    });
  }, [initialValues]);
  
  /**
   * Generate props for form fields (convenience method)
   */
  const getFieldProps = useCallback(
    (field: keyof T) => {
      const hasError = !!formState.errors[field];
      
      return {
        name: field.toString(),
        value: formState.values[field],
        onChange: handleChange,
        onBlur: handleBlur,
        'aria-invalid': hasError,
        'aria-describedby': hasError ? `${field}-error` : undefined,
      };
    },
    [formState.values, formState.errors, handleChange, handleBlur]
  );
  
  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    isSubmitted: formState.isSubmitted,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    setValues,
    resetForm,
    validateField,
    validateForm,
    getFieldProps,
  };
}

/**
 * Common validation rules for reuse
 */
export const ValidationRules = {
  required: (fieldName: string) => (value: any) => 
    value == null || value === '' ? `${fieldName} is required` : null,
    
  email: () => (value: any) => 
    !value || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) 
      ? null 
      : 'Invalid email address',
      
  minLength: (min: number) => (value: string) => 
    !value || value.length >= min 
      ? null 
      : `Must be at least ${min} characters`,
      
  maxLength: (max: number) => (value: string) => 
    !value || value.length <= max 
      ? null 
      : `Must be at most ${max} characters`,
      
  password: () => (value: string) => {
    if (!value) return null;
    
    const errors = [];
    
    if (value.length < 8) {
      errors.push('at least 8 characters');
    }
    
    if (!/[A-Z]/.test(value)) {
      errors.push('an uppercase letter');
    }
    
    if (!/[a-z]/.test(value)) {
      errors.push('a lowercase letter');
    }
    
    if (!/[0-9]/.test(value)) {
      errors.push('a number');
    }
    
    if (!/[^a-zA-Z0-9]/.test(value)) {
      errors.push('a special character');
    }
    
    return errors.length === 0 
      ? null 
      : `Password must contain ${errors.join(', ')}`;
  },
  
  passwordMatch: (passwordField: string) => (value: string, formValues: any) => 
    !value || value === formValues[passwordField] 
      ? null 
      : 'Passwords must match',
      
  url: () => (value: string) => {
    if (!value) return null;
    
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  },
};

export default useForm; 