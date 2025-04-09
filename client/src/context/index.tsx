import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthProvider } from './auth/AuthContext';
import { FlashcardProvider } from './flashcard/FlashcardContext';
import useNotifications, { Notification } from '@/hooks/useNotifications';

// Theme options
export type ThemeType = 'light' | 'dark' | 'system';

// Global app state
interface AppState {
  theme: ThemeType;
  sidebarOpen: boolean;
  notifications: Notification[];
  isLoading: boolean;
  modalOpen: boolean;
}

// Global app context type
interface AppContextType extends AppState {
  setTheme: (theme: ThemeType) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  showNotification: (message: string, type: Notification['type'], options?: any) => string;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  setIsLoading: (loading: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
}

// Create the app context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Props for the app provider
interface AppProviderProps {
  children: React.ReactNode;
}

// App provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize app state
  const [state, setState] = useState<AppState>({
    theme: 'system',
    sidebarOpen: false,
    notifications: [],
    isLoading: false,
    modalOpen: false,
  });

  // Use notification hook
  const { 
    notifications, 
    success, 
    error, 
    warning, 
    info, 
    dismissNotification, 
    clearAllNotifications 
  } = useNotifications();

  // Set theme and store in localStorage
  const setTheme = useCallback((theme: ThemeType) => {
    setState(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle sidebar open/closed
  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  // Set sidebar open state
  const setSidebarOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, sidebarOpen: open }));
  }, []);

  // Show a notification
  const showNotification = useCallback(
    (message: string, type: Notification['type'] = 'info', options?: any) => {
      switch (type) {
        case 'success':
          return success(message, options);
        case 'error':
          return error(message, options);
        case 'warning':
          return warning(message, options);
        case 'info':
        default:
          return info(message, options);
      }
    },
    [success, error, warning, info]
  );

  // Set global loading state
  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  // Modal controls
  const openModal = useCallback(() => {
    setState(prev => ({ ...prev, modalOpen: true }));
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({ ...prev, modalOpen: false }));
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('system');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (state.theme === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [state.theme, setTheme]);

  // Create context value
  const contextValue: AppContextType = {
    ...state,
    notifications,
    setTheme,
    toggleSidebar,
    setSidebarOpen,
    showNotification,
    dismissNotification,
    clearNotifications: clearAllNotifications,
    setIsLoading,
    openModal,
    closeModal,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <AuthProvider>
        <FlashcardProvider>
          {children}
        </FlashcardProvider>
      </AuthProvider>
    </AppContext.Provider>
  );
};

// Combine all providers into a single global provider
export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};

export default GlobalProvider; 