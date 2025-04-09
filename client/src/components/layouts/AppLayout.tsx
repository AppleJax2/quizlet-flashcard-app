import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/lib/store';

/**
 * Layout for authenticated application pages
 * Includes a sidebar navigation and top header
 */
const AppLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    { 
      name: 'My Flashcards', 
      href: '/flashcards', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
        </svg>
      )
    },
    { 
      name: 'Create from Text', 
      href: '/processor/text', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    },
    { 
      name: 'Create from URL', 
      href: '/processor/url', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      )
    },
    { 
      name: 'Create from Document', 
      href: '/processor/document', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V7.5M13.5 4.125l3 3m0 0l3 3M16.5 10.125l-3-3m0 0l-3 3" />
        </svg>
      )
    },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-neutral-200">
          {/* Sidebar header */}
          <div className="flex items-center h-16 px-4 border-b border-neutral-200">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 group"
              aria-label="FlashLeap - Dashboard"
            >
              <div className="overflow-hidden rounded-lg bg-primary-500 p-1.5 shadow-sm">
                <svg
                  className="h-6 w-6 text-white"
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
              <span className="text-lg font-semibold text-primary-700">FlashLeap</span>
            </Link>
          </div>
          
          {/* Sidebar content */}
          <div className="flex flex-col flex-grow px-4 pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    location.pathname === item.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  )}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  <span className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200',
                    location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-neutral-500 group-hover:text-neutral-700'
                  )}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User section */}
            <div className="mt-auto pt-4 border-t border-neutral-200">
              <div className="flex items-center px-3 py-2.5 text-sm font-medium text-neutral-700">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <div className="text-sm font-medium text-neutral-900 truncate">
                    {user?.name || user?.username || 'User'}
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {user?.email || ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex md:hidden transform transition-transform ease-in-out duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Overlay */}
        <div 
          className={cn(
            "fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity ease-in-out duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 group"
              aria-label="FlashLeap - Dashboard"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="overflow-hidden rounded-lg bg-primary-500 p-1.5 shadow-sm">
                <svg
                  className="h-6 w-6 text-white"
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
              <span className="text-lg font-semibold text-primary-700">FlashLeap</span>
            </Link>
            
            <button
              className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
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
            </button>
          </div>

          <div className="flex-1 px-4 pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200',
                    location.pathname === item.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  <span className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200',
                    location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-neutral-500 group-hover:text-neutral-700'
                  )}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-neutral-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="text-base font-medium text-neutral-900 truncate">
                  {user?.name || user?.username || 'User'}
                </div>
                <div className="text-sm text-neutral-500 truncate">
                  {user?.email || ''}
                </div>
              </div>
              <button
                className="ml-auto p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={handleLogout}
              >
                <span className="sr-only">Log out</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="w-full">
          <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-neutral-200 shadow-sm flex">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden px-4 text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
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
            </button>
            
            {/* Page title */}
            <div className="flex-1 flex justify-between items-center px-4 md:px-0">
              <div className="flex-1 flex ml-3">
                <h1 className="text-xl font-semibold text-neutral-900">
                  {/* Dynamic title based on current route */}
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>
              
              {/* User dropdown */}
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 p-2 lg:rounded-md lg:hover:bg-neutral-50"
                    id="user-menu"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:flex md:items-center ml-2">
                      <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                        {user?.name || user?.username || 'User'}
                      </span>
                      <svg 
                        className="ml-1 h-5 w-5 text-neutral-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        aria-hidden="true"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  <div
                    className={cn(
                      "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out",
                      isUserMenuOpen ? "transform opacity-100 scale-100" : "transform opacity-0 scale-95 pointer-events-none"
                    )}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                        role="menuitem"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 focus:outline-none p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 