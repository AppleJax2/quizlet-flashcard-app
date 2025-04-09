import React from 'react';
import { cn } from '@/utils/cn';

interface SkipLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /**
   * The target ID to skip to (without #)
   */
  targetId: string;
  
  /**
   * Custom text for the skip link
   */
  text?: string;
}

/**
 * SkipLink component for accessibility.
 * Allows keyboard users to bypass navigation menus and jump directly to main content.
 * This link is visually hidden but becomes visible when focused with keyboard navigation.
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  text = 'Skip to main content',
  className,
  ...props
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Visually hidden by default
        'absolute left-4 top-4 z-50 -translate-y-full transform rounded-md bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-md outline-none transition-transform focus:translate-y-0 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-secondary-900 dark:text-primary-400',
        className
      )}
      {...props}
    >
      {text}
    </a>
  );
};

export default SkipLink; 