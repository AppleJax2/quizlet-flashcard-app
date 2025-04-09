import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authServiceInstance from '@/services/auth.service';
import { type User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authServiceInstance.login({ email, password });
          
          // The server sends a message 'Login successful' when authentication succeeds
          // Don't treat this as an error
          if (response.status !== 200 || !response.data) {
            // Skip throwing an error if the message indicates success
            if (response.message === 'Login successful') {
              // This is actually a successful login despite being in the error handler
              // Since we have a successful login message but no data, we need to 
              // either fetch the user data or set a flag to load it
              set({
                isAuthenticated: true,
                isLoading: false,
              });
              
              // Try to load user data
              setTimeout(() => {
                get().loadUser();
              }, 100);
              
              return;
            }
            
            throw new Error(response.message || response.error || 'Login failed');
          }

          // Explicitly save token and user data via the service instance
          authServiceInstance.setToken(response.data.token);
          authServiceInstance.setUser(response.data.user);
          
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Don't set error state if the error message indicates success
          if (error instanceof Error && error.message === 'Login successful') {
            set({
              isLoading: false,
              isAuthenticated: true,
            });
            
            // Try to load user data
            setTimeout(() => {
              get().loadUser();
            }, 100);
            
            return;
          }
          
          set({
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (username: string, email: string, password: string, confirmPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authServiceInstance.register({
            username,
            email,
            password,
            confirmPassword,
          });
          
          if (response.status !== 201 || !response.data) {
            throw new Error(response.message || response.error || 'Registration failed');
          }
          
          // Explicitly save token and user data via the service instance
          authServiceInstance.setToken(response.data.token);
          authServiceInstance.setUser(response.data.user);

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        authServiceInstance.clearAuth(); // This should handle removing token/user from localStorage
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false, // Also reset loading state
        });
      },

      loadUser: async () => {
        // Ensure loading is true at the start
        set({ isLoading: true, error: null });
        let isAuthenticatedUpdate = false;
        let userUpdate: User | null = null;
        let errorUpdate: string | null = null;

        try {
          const token = authServiceInstance.getToken();
          if (!token) {
            // No token, definitely not authenticated
            throw new Error('No authentication token found.');
          }
          
          console.log('Attempting to load user profile with token:', token.substring(0, 10) + '...');
          
          // Attempt to fetch the current user profile
          const response = await authServiceInstance.getCurrentUser();
          
          console.log('User profile response:', response);
          
          // Handle two different possible response structures:
          // 1. Standard structure: response.data contains the user
          // 2. Alternate structure: response.user contains the user directly
          if (response.data) {
            userUpdate = response.data;
            isAuthenticatedUpdate = true;
          } else if (response.user) {
            // The user data is directly in the response.user property
            userUpdate = response.user;
            isAuthenticatedUpdate = true;
          } else if (!response.success) {
            // No user data and not marked as successful
            throw new Error(response.message || response.error || 'Failed to load user profile.');
          } else {
            // Success is true but no user data
            throw new Error('User data missing from response.');
          }

        } catch (error) {
          // Any error during the process means not authenticated
          authServiceInstance.clearAuth(); // Ensure token/user removed from storage
          isAuthenticatedUpdate = false;
          userUpdate = null;
          
          // More detailed error logging
          if (error instanceof Error) {
            errorUpdate = error.message;
            console.error('loadUser failed:', errorUpdate, error.stack);
          } else {
            errorUpdate = 'Failed to authenticate session.';
            console.error('loadUser failed with unknown error:', error);
          }

        } finally {
          // Always update the state at the end, ensuring isLoading is false
          set({
            user: userUpdate,
            isAuthenticated: isAuthenticatedUpdate,
            isLoading: false,
            error: errorUpdate,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      // Only persist minimal state; token is handled by AuthService
      partialize: (state) => ({
        // Don't persist user/isAuthenticated here, rely on loadUser on app start
      }),
    }
  )
); 