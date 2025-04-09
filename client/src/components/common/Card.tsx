import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  fullWidth?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  interactive = false,
  fullWidth = false,
}) => {
  const baseStyles = 'rounded-lg overflow-hidden';
  
  const variants = {
    default: 'bg-white dark:bg-dark-800 shadow-sm',
    elevated: 'bg-white dark:bg-dark-800 shadow-lg',
    outlined: 'border border-gray-200 dark:border-dark-700'
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]'
    : '';

  const widthStyles = fullWidth ? 'w-full' : '';

  const cardClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${interactiveStyles}
    ${widthStyles}
    ${className}
  `;

  const motionProps: HTMLMotionProps<'div'> = {
    className: cardClasses,
    onClick,
    ...(interactive ? {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      initial: { scale: 1 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    } : {})
  };

  return <motion.div {...motionProps}>{children}</motion.div>;
};

export default Card; 