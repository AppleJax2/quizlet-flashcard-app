import { ISO8601Date } from '@/types/flashcard.types';

/**
 * Format a date using Intl.DateTimeFormat
 * @param date - Date to format (string, Date, or timestamp)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: ISO8601Date | Date | number | undefined | null,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : 
                  date instanceof Date ? date : 
                  new Date(date);
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format a date relative to the current time (e.g., "2 days ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: ISO8601Date | Date | number | undefined | null): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : 
                  date instanceof Date ? date : 
                  new Date(date);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
  
  // Convert to appropriate unit
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
  } else if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
  } else if (Math.abs(diffInSeconds) < 2592000) {
    return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
  } else if (Math.abs(diffInSeconds) < 31536000) {
    return rtf.format(Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(Math.floor(diffInSeconds / 31536000), 'year');
  }
}

/**
 * Format a duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}`;
  }
  
  return `${seconds}s`;
}

/**
 * Truncate a string to a maximum length and add ellipsis if needed
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

/**
 * Generate initials from a name (e.g., "John Doe" => "JD")
 * @param name - Full name
 * @returns Initials
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

/**
 * Generate a random color based on a string (useful for avatar colors)
 * @param str - String to generate color from
 * @returns CSS color string
 */
export function stringToColor(str: string): string {
  if (!str) return '#6366F1'; // Default color
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
}

/**
 * Format a number with commas for thousands separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format a percentage value
 * @param value - Percentage value (0-100)
 * @param fractionDigits - Number of fraction digits
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, fractionDigits: number = 0): string {
  return `${value.toFixed(fractionDigits)}%`;
}

/**
 * Debounce a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T, 
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Throttle a function call
 * @param fn - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T, 
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  
  return function(...args: Parameters<T>) {
    if (!lastRan) {
      fn(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          fn(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Convert a file size in bytes to a human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Check if a string is a valid URL
 * @param str - String to check
 * @returns Boolean indicating if string is a valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid email address
 * @param str - String to check
 * @returns Boolean indicating if string is a valid email
 */
export function isValidEmail(str: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(str);
}

/**
 * Generate a random ID
 * @param length - Length of the ID
 * @returns Random ID string
 */
export function generateId(length: number = 12): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Group an array of objects by a key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Object with groups
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Detect if the current device is a mobile device
 * @returns Boolean indicating if the device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Detect if the user prefers dark mode
 * @returns Boolean indicating if the user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Shuffle an array
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Extract text content from HTML string
 * @param html - HTML string
 * @returns Plain text content
 */
export function htmlToText(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * Convert markdown to plain text
 * @param markdown - Markdown string
 * @returns Plain text content
 */
export function markdownToText(markdown: string): string {
  // Remove headers
  let text = markdown.replace(/#+\s+(.*?)\n/g, '$1\n');
  
  // Remove bold/italic
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  
  // Remove links
  text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
  
  // Remove lists
  text = text.replace(/^\s*(-|\*|\+|\d+\.)\s+/gm, '');
  
  // Remove blockquotes
  text = text.replace(/^\s*>\s+/gm, '');
  
  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`([^`]+)`/g, '$1');
  
  return text.trim();
}

/**
 * Pluralize a word based on count
 * @param count - Count
 * @param singular - Singular form
 * @param plural - Plural form (optional, defaults to singular + 's')
 * @returns Pluralized word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}

/**
 * Format a number as currency
 * @param amount - Amount
 * @param currency - Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Get the file extension from a filename
 * @param filename - Filename
 * @returns File extension
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if an element is in the viewport
 * @param element - DOM element
 * @returns Boolean indicating if the element is in the viewport
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
} 