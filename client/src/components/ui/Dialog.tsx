import React from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className={cn(
            'bg-background rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          {title && (
            <h2 className="text-lg font-semibold leading-none tracking-tight mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </>
  );
}; 