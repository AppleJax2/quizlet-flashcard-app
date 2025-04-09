import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines multiple class names and merges Tailwind CSS classes.
 * It uses clsx for conditional class joining and tailwind-merge to handle Tailwind class conflicts.
 * 
 * @param inputs - Any number of class names, objects, or arrays to be combined
 * @returns A string of merged class names
 * 
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500')
 * // => 'text-red-500 bg-blue-500'
 * 
 * @example
 * // With conditionals
 * cn('text-white', isActive && 'bg-blue-500', !isActive && 'bg-gray-500')
 * // => 'text-white bg-blue-500' or 'text-white bg-gray-500'
 * 
 * @example
 * // Merging conflicting Tailwind classes
 * cn('px-2 py-1 bg-red-500', 'p-3 bg-blue-500')
 * // => 'p-3 bg-blue-500' (later classes override earlier ones)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 