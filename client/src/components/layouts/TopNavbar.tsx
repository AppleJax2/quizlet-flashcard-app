import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle click outside user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current && 
        userButtonRef.current && 
        !userMenuRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus when ESC key is pressed
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Navigation items shared between desktop and mobile
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
    { name: 'My Flashcards', href: '/flashcards', icon: DocumentDuplicateIcon },
    { name: 'Text Processor', href: '/processor/text', icon: DocumentTextIcon },
    { name: 'URL Processor', href: '/processor/url', icon: GlobeAltIcon },
    { name: 'Document Processor', href: '/processor/document', icon: DocumentTextIcon },
    { name: 'Study', href: '/flashcards', icon: AcademicCapIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  ];

  return (
    <>
      {/* Mobile menu backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-20 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 md:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-30 w-full max-w-sm transform overflow-y-auto bg-white p-6 transition-all duration-300 md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg group"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200">
              <svg
                className="h-5 w-5 text-amber-100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="M8 12h8"></path>
                <path d="M8 8h8"></path>
                <path d="M8 16h8"></path>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">Quizlet</span>
          </Link>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-neutral-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* User info at top of mobile menu */}
        <div className="mt-6 border-b border-neutral-200 pb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-semibold text-xl shadow-inner">
              {user?.username?.charAt(0) || 'U'}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="truncate text-base font-medium text-neutral-900">{user?.username || 'User'}</p>
              <p className="truncate text-sm text-neutral-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation links */}
        <div className="mt-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-neutral-700 hover:bg-amber-50 hover:text-amber-800 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="mr-4 h-6 w-6 text-neutral-400" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
          {/* Sign out button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex w-full items-center rounded-lg px-4 py-3 text-base font-medium text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon className="mr-4 h-6 w-6 text-neutral-400" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="border-b border-neutral-200/70 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo / Brand */}
            <div className="flex flex-shrink-0 items-center">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg group"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200">
                  <svg
                    className="h-5 w-5 text-amber-100"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="M8 12h8"></path>
                    <path d="M8 8h8"></path>
                    <path d="M8 16h8"></path>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">Quizlet</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link
                to="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/flashcards"
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200"
              >
                My Flashcards
              </Link>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200"
                  onClick={() => {}}
                >
                  Create
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                {/* Dropdown menu would go here */}
              </div>
              <Link
                to="/profile"
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200"
              >
                Profile
              </Link>
            </div>

            {/* User menu, notifications, etc. */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-700 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              
              {/* Notification bell - hide on mobile */}
              <button
                type="button"
                className="hidden md:block rounded-full p-1.5 text-neutral-500 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* User menu - hide on mobile */}
              <div className="relative hidden md:block">
                <button
                  ref={userButtonRef}
                  type="button"
                  className="relative flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-amber-700"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-semibold text-lg shadow-inner">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    ref={userMenuRef}
                    className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="border-b border-neutral-200 px-4 py-2">
                      <p className="truncate text-sm font-medium text-neutral-900">{user?.username || 'User'}</p>
                      <p className="truncate text-xs text-neutral-500">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-amber-50 hover:text-amber-800"
                      role="menuitem"
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-amber-50 hover:text-amber-800"
                      role="menuitem"
                    >
                      <Squares2X2Icon className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-600"
                      role="menuitem"
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
} 