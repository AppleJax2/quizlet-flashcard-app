import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The width of the skeleton
   * @default "100%"
   */
  width?: string | number;
  
  /**
   * The height of the skeleton
   * @default "1rem"
   */
  height?: string | number;
  
  /**
   * Whether to animate the skeleton
   * @default true
   */
  animate?: boolean;
  
  /**
   * The border radius of the skeleton
   * @default "0.25rem"
   */
  radius?: string | number;
  
  /**
   * Whether the skeleton should be circular
   * @default false
   */
  circle?: boolean;
}

/**
 * Skeleton component for loading states
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width = '100%',
  height = '1rem',
  animate = true,
  radius = '0.25rem',
  circle = false,
  ...props
}) => {
  const getSize = (size: string | number) => 
    typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={cn(
        'bg-neutral-200',
        animate && 'animate-pulse',
        className
      )}
      style={{
        width: getSize(width),
        height: getSize(height),
        borderRadius: circle ? '50%' : getSize(radius),
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

/**
 * Creates a skeleton for text with multiple lines
 */
export const SkeletonText: React.FC<{
  lines?: number;
  spacing?: number | string;
  lastLineWidth?: string | number;
  height?: string | number;
  className?: string;
}> = ({
  lines = 3,
  spacing = '0.5rem',
  lastLineWidth = '75%',
  height = '0.75rem',
  className,
}) => {
  const getSize = (size: string | number) => 
    typeof size === 'number' ? `${size}px` : size;
  
  return (
    <div className={cn('space-y-2', className)}>
      {Array(lines)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={index}
            height={height}
            width={index === lines - 1 ? lastLineWidth : '100%'}
            className="block"
            style={{ marginTop: index === 0 ? 0 : getSize(spacing) }}
          />
        ))}
    </div>
  );
};

/**
 * Creates a skeleton for an avatar (circular)
 */
export const SkeletonAvatar: React.FC<{
  size?: number | string;
  className?: string;
}> = ({ size = 40, className }) => (
  <Skeleton width={size} height={size} circle className={className} />
);

/**
 * Creates a skeleton for a card
 */
export const SkeletonCard: React.FC<{
  height?: number | string;
  className?: string;
  children?: React.ReactNode;
}> = ({ height = 150, className, children }) => (
  <Skeleton 
    height={height} 
    className={cn('rounded-lg overflow-hidden', className)}
  >
    {children}
  </Skeleton>
);

export default Skeleton; 