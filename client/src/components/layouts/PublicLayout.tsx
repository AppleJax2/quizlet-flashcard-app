import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

export default function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const navigation = [
    { name: 'Home', href: '/', enabled: true },
    { name: 'Features', href: '/features', enabled: true },
    { name: 'Pricing', href: '/pricing', enabled: true },
    { name: 'About', href: '/about', enabled: true },
    { name: 'Contact', href: '/contact', enabled: false, comingSoon: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100">
      <header className="z-10 bg-white/80 backdrop-blur-xs border-b border-neutral-200 shadow-sm sticky top-0 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg group"
              >
                <div className="overflow-hidden rounded-lg bg-gradient-to-tr from-primary-500 to-primary-600 p-1.5 shadow-sm transition-all duration-300 group-hover:shadow group-hover:scale-105">
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
                <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500 transition-colors duration-300">FlashLeap</span>
              </Link>
            </div>

            {/* Navigation items */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                item.enabled ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-neutral-100',
                      location.pathname === item.href
                        ? 'text-primary-700'
                        : 'text-neutral-700 hover:text-neutral-900'
                    )}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div
                    key={item.name}
                    className="relative px-3 py-2 mx-1 rounded-lg text-sm font-medium text-neutral-400 cursor-not-allowed group"
                  >
                    {item.name}
                    {item.comingSoon && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Coming soon
                      </div>
                    )}
                  </div>
                )
              ))}
            </nav>

            {/* CTA buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className={cn(
                  "transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium",
                  location.pathname === '/login'
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                Log in
              </Link>
              <Link 
                to="/register" 
                className={cn(
                  "transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium",
                  location.pathname === '/register'
                    ? "bg-primary-600 text-white shadow-md hover:shadow-lg"
                    : "bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow"
                )}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className={cn(
        "flex-grow animate-fadeIn",
        isHomePage ? "pt-0" : "pt-8",
      )}>
        <Outlet />
      </main>

      <footer className="bg-white border-t border-neutral-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link 
                to="/" 
                className="flex items-center space-x-2 mb-4"
              >
                <div className="overflow-hidden rounded-lg bg-gradient-to-tr from-primary-500 to-primary-600 p-1.5 shadow-sm">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="6" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M12 17V9"></path>
                    <path d="M9 12l3-3 3 3"></path>
                    <path d="M8 14h8"></path>
                  </svg>
                </div>
                <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">FlashLeap</span>
              </Link>
              <p className="text-sm text-neutral-600 mb-4 max-w-md">
                FlashLeap is an intelligent flashcard generator that helps you learn faster and remember longer with AI-powered tools. Take the leap in your learning journey.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">Text Processing</Link>
                </li>
                <li>
                  <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">URL Processing</Link>
                </li>
                <li>
                  <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">Document Processing</Link>
                </li>
                <li>
                  <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">Study Tools</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/pricing" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">Pricing</Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">About</Link>
                </li>
                <li>
                  <span className="text-sm text-neutral-400 cursor-not-allowed">Contact</span>
                </li>
                <li>
                  <span className="text-sm text-neutral-400 cursor-not-allowed">FAQ</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500">
            <p>&copy; {new Date().getFullYear()} FlashLeap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 