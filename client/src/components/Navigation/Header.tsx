import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/lib/store';
import ThemeSwitcher from '@/components/common/ThemeSwitcher';

/**
 * Header component with responsive navigation for public pages
 */
const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navigation = [
    { name: 'Home', href: '/', enabled: true },
    { name: 'Features', href: '/features', enabled: true },
    { name: 'Pricing', href: '/pricing', enabled: true },
    { name: 'About', href: '/about', enabled: true },
  ];

  return (
    <header 
      className={cn(
        "z-50 fixed w-full transition-all duration-300 border-b",
        scrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-neutral-200 py-2 dark:bg-neutral-900/95 dark:border-neutral-800" 
          : "bg-transparent border-transparent py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg group"
            aria-label="FlashLeap - Homepage"
          >
            <div className={cn(
              "overflow-hidden rounded-lg p-1.5 transition-all duration-300 group-hover:scale-105",
              scrolled ? "bg-primary-500" : "bg-primary-500/90"
            )}>
              <svg
                className="h-7 w-7 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="6" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M12 17V9"></path>
                <path d="M9 12l3-3 3 3"></path>
                <path d="M8 14h8"></path>
              </svg>
            </div>
            <span className={cn(
              "text-xl font-semibold transition-colors duration-300",
              scrolled 
                ? "text-primary-700 dark:text-primary-400" 
                : "text-primary-600 dark:text-primary-400"
            )}>
              FlashLeap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              item.enabled ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname === item.href
                      ? scrolled 
                        ? 'text-primary-700 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/40' 
                        : 'text-primary-700 bg-white/70 backdrop-blur-sm shadow-sm dark:text-primary-300 dark:bg-neutral-800/70'
                      : scrolled 
                        ? 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white' 
                        : 'text-neutral-800 hover:bg-white/70 hover:backdrop-blur-sm hover:shadow-sm dark:text-neutral-300 dark:hover:bg-neutral-800/70'
                  )}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ) : null
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Switcher */}
            <ThemeSwitcher size="sm" />
            
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className={cn(
                  "transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium",
                  scrolled
                    ? "bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow dark:bg-primary-600 dark:hover:bg-primary-700"
                    : "bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow dark:bg-primary-600 dark:hover:bg-primary-700"
                )}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={cn(
                    "transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium",
                    location.pathname === '/login'
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                      : scrolled
                        ? "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                        : "text-neutral-800 hover:bg-white/80 hover:backdrop-blur-sm hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/70"
                  )}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className={cn(
                    "transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium",
                    location.pathname === '/register'
                      ? "bg-primary-600 text-white shadow-md dark:bg-primary-700"
                      : "bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow dark:bg-primary-600 dark:hover:bg-primary-700"
                  )}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile buttons: theme switcher and menu */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeSwitcher size="sm" />
            
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? (
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        id="mobile-menu" 
        className={cn(
          "md:hidden bg-white border-t border-neutral-200 shadow-lg absolute left-0 right-0 transition-all duration-300 ease-in-out z-40 dark:bg-neutral-900 dark:border-neutral-800",
          mobileMenuOpen ? "top-full opacity-100" : "-top-96 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-4 pt-4 pb-4 space-y-1">
          {navigation.filter(item => item.enabled).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                location.pathname === item.href
                  ? 'text-primary-700 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/40'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 mt-3 border-t border-neutral-200 grid grid-cols-2 gap-2 dark:border-neutral-800">
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="col-span-2 text-center transition-all duration-200 rounded-lg px-4 py-3 text-base font-medium bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow dark:bg-primary-600 dark:hover:bg-primary-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-center transition-all duration-200 rounded-lg px-4 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="text-center transition-all duration-200 rounded-lg px-4 py-3 text-base font-medium bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow dark:bg-primary-600 dark:hover:bg-primary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 