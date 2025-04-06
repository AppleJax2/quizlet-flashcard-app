import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { authService } from '@/services';
import {
  AuthContextType,
  AuthState,
  ForgotPasswordData,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordData,
  UpdateProfileData,
  User,
} from '@/types';

// Default auth state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      const storedUser = authService.getUser();

      // If token exists, try to get current user
      if (token && storedUser) {
        try {
          // Set initial state from local storage
          setState({
            user: storedUser,
            token,
            isAuthenticated: true,
            isLoading: true,
            error: null,
          });
          
          // Verify token is still valid by getting current user
          const response = await authService.getCurrentUser();
          
          if (response.success && response.data) {
            // Update user data with fresh data from API
            setState({
              user: response.data,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            // Update stored user data
            authService.setUser(response.data);
          } else {
            // Invalid token, clear auth
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          // Invalid token, clear auth
          handleLogout();
        }
      } else {
        setState({ ...initialState, isLoading: false });
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        // Update auth state
        setState({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        // Show success message
        toast.success('Logged in successfully');
        
        // Force navigation to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
        
        return;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message || 'Failed to login',
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
    }
  }, [navigate]);

  // Register handler
  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.register(credentials);
      
      if (response.success && response.data) {
        // Update auth state
        setState({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        // Show success message in green
        toast.success('Registration successful');
        
        // Force navigation to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
        
        return;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message || 'Failed to register',
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = useCallback(() => {
    authService.clearAuth();
    setState({
      ...initialState,
      isLoading: false,
    });
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  // Forgot password handler
  const handleForgotPassword = useCallback(async (data: ForgotPasswordData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.forgotPassword(data);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success) {
        toast.success(response.message || 'Password reset email sent');
        return;
      }
      
      setState(prev => ({
        ...prev,
        error: response.message || 'Failed to process forgot password request',
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
    }
  }, []);

  // Reset password handler
  const handleResetPassword = useCallback(async (data: ResetPasswordData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.resetPassword(data);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success) {
        toast.success(response.message || 'Password reset successful');
        navigate('/login');
        return;
      }
      
      setState(prev => ({
        ...prev,
        error: response.message || 'Failed to reset password',
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
    }
  }, [navigate]);

  // Update profile handler
  const handleUpdateProfile = useCallback(async (data: UpdateProfileData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.updateProfile(data);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          user: response.data.user,
          token: response.data.token,
          isLoading: false,
          error: null,
        }));
        
        toast.success(response.message || 'Profile updated successfully');
        return;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message || 'Failed to update profile',
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
    }
  }, []);

  // Clear error handler
  const handleClearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Context value
  const value = useMemo(() => ({
    ...state,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    updateProfile: handleUpdateProfile,
    clearError: handleClearError,
  }), [
    state,
    handleLogin,
    handleRegister,
    handleLogout,
    handleForgotPassword,
    handleResetPassword,
    handleUpdateProfile,
    handleClearError,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 