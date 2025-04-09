import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = 'currentColor',
  className = ''
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`${sizes[size]} rounded-full border-2 border-t-transparent`}
        style={{
          borderColor: `${color} transparent transparent transparent`
        }}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
    </div>
  );
};

export default Loading; 