import React from 'react';
import { useToast } from './use-toast';
import { Toast } from './toast';

interface ToastContainerProps {
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  maxToasts = 5,
  className,
}) => {
  const { toasts } = useToast();

  // Apply different positioning classes based on the position prop
  const positionClasses = {
    'top': 'top-0 left-1/2 -translate-x-1/2',
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom': 'bottom-0 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  // Animation classes for different positions
  const enterAnimationClasses = {
    'top': 'animate-slide-down',
    'top-right': 'animate-slide-left',
    'top-left': 'animate-slide-right',
    'bottom': 'animate-slide-up',
    'bottom-right': 'animate-slide-left',
    'bottom-left': 'animate-slide-right',
  };
  
  // Apply different flex direction based on position
  const flexDirection = position.startsWith('top') 
    ? 'flex-col' 
    : 'flex-col-reverse';

  return (
    <div
      className={`fixed z-[100] flex max-h-screen w-full p-4 pointer-events-none ${positionClasses[position]} ${flexDirection} gap-3 ${className || ''}`}
      aria-live="polite"
    >
      {toasts
        .slice(0, maxToasts)
        .map(({ id, title, description, status, isClosable, icon, action, ...props }) => (
          <Toast
            key={id}
            id={id}
            title={title || undefined}
            description={description || undefined}
            status={(status as 'success' | 'error' | 'warning' | 'info') || undefined}
            isClosable={isClosable}
            icon={icon}
            action={action}
            className={enterAnimationClasses[position]}
            {...props}
          />
        ))}
    </div>
  );
};

export default ToastContainer; 