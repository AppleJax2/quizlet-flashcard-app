import { useState, useCallback } from 'react';
import { ApiError } from '@/api/apiClient';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'success';

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
  severity: ErrorSeverity;
  field?: string;
  timestamp: Date;
  dismissed: boolean;
}

export interface UseErrorHandlerReturn {
  errors: ErrorState[];
  hasErrors: boolean;
  addError: (error: ApiError | string, severity?: ErrorSeverity, field?: string) => void;
  dismissError: (index: number) => void;
  dismissAllErrors: () => void;
  clearErrors: () => void;
  getFieldError: (fieldName: string) => ErrorState | undefined;
  hasFieldError: (fieldName: string) => boolean;
}

/**
 * Custom hook for centralized error handling
 * 
 * This hook provides a way to manage errors consistently across the application.
 * It supports API errors, validation errors, and custom error messages.
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const [errors, setErrors] = useState<ErrorState[]>([]);
  
  /**
   * Add a new error to the errors array
   */
  const addError = useCallback((error: ApiError | string, severity: ErrorSeverity = 'error', field?: string) => {
    const newError: ErrorState = {
      message: typeof error === 'string' ? error : error.message,
      code: typeof error !== 'string' ? error.code : undefined,
      details: typeof error !== 'string' ? error.details : undefined,
      severity,
      field,
      timestamp: new Date(),
      dismissed: false,
    };
    
    // Don't add duplicate errors that occurred within the last 5 seconds
    setErrors(prev => {
      const isDuplicate = prev.some(
        e => 
          e.message === newError.message && 
          e.field === newError.field &&
          (new Date().getTime() - e.timestamp.getTime()) < 5000
      );
      
      if (isDuplicate) {
        return prev;
      }
      
      return [...prev, newError];
    });
  }, []);
  
  /**
   * Dismiss a specific error by index
   */
  const dismissError = useCallback((index: number) => {
    setErrors(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], dismissed: true };
      }
      return updated;
    });
    
    // Clean up dismissed errors after a delay
    setTimeout(() => {
      setErrors(prev => prev.filter(e => !e.dismissed));
    }, 300);
  }, []);
  
  /**
   * Dismiss all errors
   */
  const dismissAllErrors = useCallback(() => {
    setErrors(prev => prev.map(e => ({ ...e, dismissed: true })));
    
    // Clean up dismissed errors after a delay
    setTimeout(() => {
      setErrors([]);
    }, 300);
  }, []);
  
  /**
   * Clear all errors immediately
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);
  
  /**
   * Get error for a specific form field
   */
  const getFieldError = useCallback((fieldName: string) => {
    return errors.find(e => e.field === fieldName && !e.dismissed);
  }, [errors]);
  
  /**
   * Check if a field has an error
   */
  const hasFieldError = useCallback((fieldName: string) => {
    return errors.some(e => e.field === fieldName && !e.dismissed);
  }, [errors]);
  
  return {
    errors: errors.filter(e => !e.dismissed),
    hasErrors: errors.some(e => !e.dismissed),
    addError,
    dismissError,
    dismissAllErrors,
    clearErrors,
    getFieldError,
    hasFieldError,
  };
}

export default useErrorHandler; 