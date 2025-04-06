import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
  onClose?: () => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', title, description, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
          'animate-in slide-in-from-bottom-full',
          variant === 'destructive' && 'destructive border-destructive bg-destructive text-destructive-foreground',
          variant === 'default' && 'border bg-background text-foreground',
          className
        )}
        {...props}
      >
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
              variant === 'destructive' && 'text-red-300 hover:text-red-50 focus:ring-red-400 focus:ring-offset-red-600'
            )}
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export const ToastContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {children}
    </div>
  );
}; 