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
          
          if (response.status !== 200 || !response.data) {
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
          
          // Attempt to fetch the current user profile
          const response = await authServiceInstance.getCurrentUser();
          
          if (response.status !== 200 || !response.data) {
            // API call failed (e.g., token expired, server error)
            throw new Error(response.message || response.error || 'Failed to load user profile.');
          }
          
          // Success!
          isAuthenticatedUpdate = true;
          userUpdate = response.data;

        } catch (error) {
          // Any error during the process means not authenticated
          authServiceInstance.clearAuth(); // Ensure token/user removed from storage
          isAuthenticatedUpdate = false;
          userUpdate = null;
          errorUpdate = error instanceof Error ? error.message : 'Failed to authenticate session.';
          console.error('loadUser failed:', errorUpdate); // Log the error

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