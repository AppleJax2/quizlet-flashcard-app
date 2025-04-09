import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '@/api/userService';
import {
  User,
  LoginCredentials,
  RegistrationData,
  PasswordResetRequestData,
  PasswordResetData,
} from '@/types/user.types';
import apiClient from '@/api/apiClient';

// Define the shape of our auth state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authInitialized: boolean;
}

// Define the shape of our auth context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (data: PasswordResetData) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props for the Auth Provider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Auth state
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    authInitialized: false,
  });
  
  // Initialize auth state when the component mounts
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token
        const token = apiClient.getAuthToken();
        if (!token) {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            authInitialized: true 
          }));
          return;
        }
        
        // Try to get current user with the token
        const response = await userService.getCurrentUser();
        
        if (response.error) {
          // Clear token if invalid
          apiClient.clearAuthToken();
          setState(prev => ({ 
            ...prev, 
            isAuthenticated: false, 
            user: null, 
            isLoading: false, 
            authInitialized: true 
          }));
          return;
        }
        
        // Set authenticated state
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: response.data,
          isLoading: false,
          authInitialized: true,
        }));
      } catch (error) {
        // Handle unexpected errors
        console.error('Auth initialization error:', error);
        apiClient.clearAuthToken();
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          authInitialized: true 
        }));
      }
    };
    
    initializeAuth();
  }, []);
  
  // Login handler
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await userService.login(credentials);
      
      if (response.error !== null) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: response.error.message 
        }));
        return false;
      }
      
      // Store token and set auth state
      apiClient.setAuthToken(response.data.token);
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'An unexpected error occurred during login.' 
      }));
      return false;
    }
  };
  
  // Register handler
  const register = async (data: RegistrationData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await userService.register(data);
      
      if (response.error !== null) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: response.error.message 
        }));
        return false;
      }
      
      // Store token and set auth state
      apiClient.setAuthToken(response.data.token);
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'An unexpected error occurred during registration.' 
      }));
      return false;
    }
  };
  
  // Logout handler
  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and auth state regardless of server response
      apiClient.clearAuthToken();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        authInitialized: true,
      });
      
      // Redirect to login page
      navigate('/login');
    }
  };
  
  // Request password reset
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await userService.requestPasswordReset({ email });
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return !response.error && response.data.success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'An error occurred while requesting a password reset.' 
      }));
      return false;
    }
  };
  
  // Reset password
  const resetPassword = async (data: PasswordResetData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await userService.resetPassword(data);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return !response.error && response.data.success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'An error occurred while resetting your password.' 
      }));
      return false;
    }
  };
  
  // Verify email
  const verifyEmail = async (token: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await userService.verifyEmail(token);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      // If the user is authenticated, update their email verified status
      if (state.user && !response.error && response.data.success) {
        setState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, isEmailVerified: true } : null,
        }));
      }
      
      return !response.error && response.data.success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'An error occurred while verifying your email.' 
      }));
      return false;
    }
  };
  
  // Resend verification email
  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await userService.resendVerificationEmail(email);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return !response.error && response.data.success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'An error occurred while resending the verification email.' 
      }));
      return false;
    }
  };
  
  // Update user data in state
  const updateUser = (user: User): void => {
    setState(prev => ({ ...prev, user }));
  };
  
  // Clear any error message
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };
  
  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    updateUser,
    clearError,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 