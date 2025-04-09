import React from 'react';
import { cn } from '@/utils/cn';

export interface SkipLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /**
   * The target element to skip to (usually the main content area)
   */
  target: string;
  
  /**
   * The text to display in the skip link
   */
  text?: string;
  
  /**
   * The position of the skip link when focused
   */
  position?: 'top-left' | 'top-center';
  
  /**
   * The z-index of the skip link
   */
  zIndex?: string;
}

/**
 * SkipLink component for keyboard accessibility.
 * Allows keyboard users to skip navigation and jump directly to main content.
 * Appears only when focused, making it invisible to non-keyboard users.
 */
const SkipLink: React.FC<SkipLinkProps> = ({
  target,
  text = 'Skip to main content',
  position = 'top-left',
  zIndex = 'z-50',
  className,
  ...props
}) => {
  const positionClasses = {
    'top-left': 'left-4',
    'top-center': 'left-1/2 -translate-x-1/2',
  };
  
  return (
    <a
      href={target}
      className={cn(
        'absolute -top-full rounded bg-primary-600 px-4 py-2 text-white transition-all focus:top-4',
        zIndex,
        positionClasses[position],
        className
      )}
      {...props}
    >
      {text}
    </a>
  );
};

export default SkipLink; 