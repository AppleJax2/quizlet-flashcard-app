import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { authService } from '@/services';
import { showSuccess, showError } from '@/utils/toast';
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

  // Refresh current user data
  const refreshUser = useCallback(async () => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        return false;
      }
      
      const response = await authService.getCurrentUser();
      
      if (response.success && response.data) {
        // Update auth state with the user data
        setState((prev) => ({
          ...prev,
          user: response.data as User,
          isLoading: false,
          error: null,
        }));
        
        // Update stored user data
        authService.setUser(response.data as User);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return false;
    }
  }, []);

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
      
      if (response.status === 200 && response.data) {
        // Update auth state
        setState({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        // Show success message
        showSuccess('Logged in successfully');
        
        // Use React Router navigation instead of force reload
        // This maintains the React application state
        navigate('/dashboard');
        
        return;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message || 'Failed to login',
      }));
      
      showError(response.message || 'Failed to login');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
      
      showError(error.message || 'An unexpected error occurred');
    }
  }, [navigate]);

  // Register handler
  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.register(credentials);
      
      if (response.status === 201 && response.data) {
        // Update auth state
        setState({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        // Show success message in green
        showSuccess('Registration successful');
        
        // Use React Router navigation instead of force reload
        navigate('/dashboard');
        
        return;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message || 'Failed to register',
      }));
      
      showError(response.message || 'Failed to register');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
      
      showError(error.message || 'An unexpected error occurred');
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = useCallback(() => {
    authService.clearAuth();
    setState({
      ...initialState,
      isLoading: false,
    });
    showSuccess('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  // Forgot password handler
  const handleForgotPassword = useCallback(async (data: ForgotPasswordData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.forgotPassword(data);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success) {
        showSuccess(response.message || 'Password reset email sent');
        return;
      }
      
      setState(prev => ({
        ...prev,
        error: response.message || 'Failed to process forgot password request',
      }));
      
      showError(response.message || 'Failed to process forgot password request');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
      
      showError(error.message || 'An unexpected error occurred');
    }
  }, []);

  // Reset password handler
  const handleResetPassword = useCallback(async (data: ResetPasswordData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.resetPassword(data);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success) {
        showSuccess(response.message || 'Password reset successful');
        navigate('/login');
        return;
      }
      
      setState(prev => ({
        ...prev,
        error: response.message || 'Failed to reset password',
      }));
      
      showError(response.message || 'Failed to reset password');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
      
      showError(error.message || 'An unexpected error occurred');
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
        
        showSuccess(response.message || 'Profile updated successfully');
        return;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message || 'Failed to update profile',
      }));
      
      showError(response.message || 'Failed to update profile');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An unexpected error occurred',
      }));
      
      showError(error.message || 'An unexpected error occurred');
    }
  }, []);

  // Clear error handler
  const handleClearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Context value with state and handlers
  const contextValue = useMemo(() => ({
    ...state,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    updateProfile: handleUpdateProfile,
    clearError: handleClearError,
    refreshUser
  }), [
    state,
    handleLogin,
    handleRegister,
    handleLogout,
    handleForgotPassword,
    handleResetPassword,
    handleUpdateProfile,
    handleClearError,
    refreshUser
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
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