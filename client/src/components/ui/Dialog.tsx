import React, { useEffect, useState, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export interface DialogProps {
  /**
   * Whether the dialog is open or not
   */
  open: boolean;
  
  /**
   * Callback when the dialog is requested to be closed
   */
  onClose: () => void;
  
  /**
   * The content of the dialog
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes for the dialog overlay
   */
  overlayClassName?: string;
  
  /**
   * Additional CSS classes for the dialog content
   */
  className?: string;
  
  /**
   * Whether to show a close button in the top-right corner
   */
  showCloseButton?: boolean;
  
  /**
   * Whether to close the dialog when clicking the overlay
   */
  closeOnOverlayClick?: boolean;
  
  /**
   * Whether to close the dialog when the Escape key is pressed
   */
  closeOnEscapeKey?: boolean;
  
  /**
   * The ID of the dialog for accessibility purposes
   */
  id?: string;
  
  /**
   * The role of the dialog for accessibility purposes
   */
  role?: 'dialog' | 'alertdialog';
  
  /**
   * The aria-label for the dialog
   */
  ariaLabel?: string;
  
  /**
   * The aria-labelledby for the dialog (ID of the element that labels the dialog)
   */
  ariaLabelledby?: string;
  
  /**
   * The aria-describedby for the dialog (ID of the element that describes the dialog)
   */
  ariaDescribedby?: string;

  /**
   * Maximum width of the dialog
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

/**
 * Dialog component that provides an accessible modal dialog.
 * Implements keyboard navigation, focus trapping, and screen reader support.
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(({
  open,
  onClose,
  children,
  overlayClassName,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  id,
  role = 'dialog',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  maxWidth = 'md',
}, ref) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useFocusTrap(open);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Add overflow hidden to body when dialog opens
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  
  useEffect(() => {
    if (!closeOnEscapeKey) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscapeKey, onClose, open]);
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  // Return null during SSR
  if (!isMounted) return null;
  
  // Get maxWidth class based on prop
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    'full': 'max-w-full',
  };

  // Don't render if closed
  if (!open) return null;
  
  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          // @ts-ignore - containerRef.current is assignable
          containerRef.current = node;
        }}
        role={role}
        id={id}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        className={cn(
          'relative mx-auto my-6 w-full rounded-lg bg-background p-0 shadow-xl outline-none',
          maxWidthClasses[maxWidth],
          className
        )}
        tabIndex={-1}
      >
        {showCloseButton && (
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
});

Dialog.displayName = 'Dialog';

/**
 * DialogHeader component that provides a standardized header for dialogs.
 */
export const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 p-6 pb-0',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

DialogHeader.displayName = 'DialogHeader';

/**
 * DialogTitle component that provides a standardized title for dialogs.
 */
export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = 'DialogTitle';

/**
 * DialogDescription component that provides a standardized description for dialogs.
 */
export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-500', className)}
    {...props}
  />
));

DialogDescription.displayName = 'DialogDescription';

/**
 * DialogContent component that provides a standardized content area for dialogs.
 */
export const DialogContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6', className)}
    {...props}
  />
));

DialogContent.displayName = 'DialogContent';

/**
 * DialogFooter component that provides a standardized footer for dialogs.
 */
export const DialogFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 pt-0',
      className
    )}
    {...props}
  />
));

DialogFooter.displayName = 'DialogFooter'; 