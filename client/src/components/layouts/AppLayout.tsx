import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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

  // Close sidebar when ESC key is pressed
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Flashcards', href: '/flashcards', icon: DocumentDuplicateIcon },
    { name: 'Text Processor', href: '/processor/text', icon: DocumentTextIcon },
    { name: 'URL Processor', href: '/processor/url', icon: GlobeAltIcon },
    { name: 'Document Processor', href: '/processor/document', icon: DocumentTextIcon },
    { name: 'Study', href: '/flashcards', icon: AcademicCapIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-neutral-900/50 transition-opacity duration-300 lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-white px-2 py-4 transition-transform duration-300 lg:translate-x-0 lg:px-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="flex items-center justify-between px-4">
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
          >
            <svg
              className="h-8 w-8 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
            <span className="text-lg font-semibold">Quizlet</span>
          </Link>
          <button
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-8 space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                )
              }
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  'text-neutral-400 group-hover:text-neutral-500'
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <ArrowRightOnRectangleIcon
              className="mr-3 h-5 w-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-500 transition-colors"
              aria-hidden="true"
            />
            Log out
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="text-neutral-700 hover:text-neutral-900 rounded-md p-1 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-neutral-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* User menu */}
              <div className="relative">
                <button 
                  ref={userButtonRef}
                  className="flex items-center space-x-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <UserCircleIcon className="h-8 w-8 text-neutral-400" aria-hidden="true" />
                  <span>{user?.username || 'User'}</span>
                  <ChevronDownIcon className={cn("ml-1 h-4 w-4 transition-transform", userMenuOpen && "rotate-180")} aria-hidden="true" />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div 
                    ref={userMenuRef}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
                    role="menu" 
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-neutral-200 bg-white px-4 py-6 text-center text-sm text-neutral-500 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} Quizlet Flashcard Generator. All rights reserved.
        </footer>
      </div>
    </div>
  );
} 