import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { useToast } from './use-toast';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  status?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
  isClosable?: boolean;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export const Toast = ({
  id,
  title,
  description,
  status = 'info',
  duration = 5000,
  isClosable = true,
  icon,
  action,
  onClose,
  open = true,
  onOpenChange,
  className,
  children,
}: ToastProps) => {
  const { dismiss } = useToast();

  useEffect(() => {
    if (duration !== Infinity && open) {
      const timer = setTimeout(() => {
        if (onOpenChange) {
          onOpenChange(false);
        }
        if (onClose) {
          onClose();
        }
        if (id) {
          dismiss(id);
        }
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration, open, onOpenChange, onClose, id, dismiss]);

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    if (onClose) {
      onClose();
    }
    if (id) {
      dismiss(id);
    }
  };

  const statusStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: !icon ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-600">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
      ) : icon,
      text: 'text-green-800',
      title: 'text-green-900 font-medium',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: !icon ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-600">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      ) : icon,
      text: 'text-red-800',
      title: 'text-red-900 font-medium',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: !icon ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-amber-600">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ) : icon,
      text: 'text-amber-800',
      title: 'text-amber-900 font-medium',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: !icon ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-blue-600">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
      ) : icon,
      text: 'text-blue-800',
      title: 'text-blue-900 font-medium',
    },
  };

  if (!open) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-lg border p-4 shadow-lg',
        'animate-enter transition-all duration-300 ease-in-out',
        statusStyles[status].bg,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon !== null && (
          <div className="flex-shrink-0">
            {statusStyles[status].icon}
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <h3 className={cn('text-sm', statusStyles[status].title)}>{title}</h3>
          )}
          
          {description && (
            <div className={cn('mt-1 text-sm', statusStyles[status].text)}>
              {description}
            </div>
          )}
          
          {children && (
            <div className={cn('mt-1', statusStyles[status].text)}>
              {children}
            </div>
          )}
          
          {action && (
            <div className="mt-2">
              {action}
            </div>
          )}
        </div>
        
        {isClosable && (
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'absolute right-1 top-1 rounded-md p-1',
              'text-neutral-500 hover:bg-neutral-200/60 focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label="Close notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;

export const ToastContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {children}
    </div>
  );
}; 