import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  labelPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'dropdown';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className,
  showLabel = false,
  labelPosition = 'right',
  size = 'md',
  variant = 'icon',
}) => {
  // Get initial theme from localStorage if available, otherwise default to system
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      return savedTheme || 'system';
    }
    return 'system';
  });

  // Update theme setting and localStorage
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply theme class to html element when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system theme changes if using system preference
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Size variants
  const sizeVariants = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6',
  };

  // Dropdown theme switcher
  if (variant === 'dropdown') {
    return (
      <select
        value={theme}
        onChange={(e) => updateTheme(e.target.value as Theme)}
        className={cn(
          'rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white',
          className
        )}
        aria-label="Select theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    );
  }

  // Button theme switcher
  if (variant === 'button') {
    return (
      <div className="flex items-center space-x-2">
        {showLabel && labelPosition === 'left' && (
          <span className="text-sm font-medium dark:text-white">Theme:</span>
        )}
        <div className="flex rounded-lg border border-neutral-200 p-1 dark:border-neutral-700">
          <button
            type="button"
            className={cn(
              'rounded px-2 py-1 text-xs font-medium transition-colors',
              theme === 'light' 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-700 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            )}
            onClick={() => updateTheme('light')}
            aria-label="Light theme"
          >
            Light
          </button>
          <button
            type="button"
            className={cn(
              'rounded px-2 py-1 text-xs font-medium transition-colors',
              theme === 'dark'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-700 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            )}
            onClick={() => updateTheme('dark')}
            aria-label="Dark theme"
          >
            Dark
          </button>
          <button
            type="button"
            className={cn(
              'rounded px-2 py-1 text-xs font-medium transition-colors',
              theme === 'system'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-700 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            )}
            onClick={() => updateTheme('system')}
            aria-label="System theme"
          >
            Auto
          </button>
        </div>
        {showLabel && labelPosition === 'right' && (
          <span className="text-sm font-medium dark:text-white">Theme</span>
        )}
      </div>
    );
  }

  // Default icon theme switcher
  return (
    <button
      type="button"
      onClick={() => {
        const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        updateTheme(nextTheme);
      }}
      className={cn(
        'flex items-center justify-center rounded-full bg-neutral-100 text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500',
        sizeVariants[size],
        className
      )}
      aria-label={`Current theme: ${theme}. Click to toggle theme.`}
    >
      {/* Light theme icon */}
      {theme === 'light' && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={iconSizes[size]}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
      
      {/* Dark theme icon */}
      {theme === 'dark' && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={iconSizes[size]}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
      
      {/* System theme icon */}
      {theme === 'system' && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={iconSizes[size]}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
      
      {showLabel && (
        <span className={cn(
          'ml-2 text-sm font-medium',
          labelPosition === 'right' ? 'inline-block' : 'hidden'
        )}>
          {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
        </span>
      )}
    </button>
  );
};

export default ThemeSwitcher; 