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
        try {
          set({ isLoading: true, error: null });
          
          // Use the service method to check authentication state
          const token = authServiceInstance.getToken();
          if (!token) {
            set({ isLoading: false, isAuthenticated: false, user: null });
            return;
          }
          
          // Attempt to fetch the current user profile
          const response = await authServiceInstance.getCurrentUser();
          
          if (response.status !== 200 || !response.data) {
            authServiceInstance.clearAuth(); // Clear invalid token if fetch fails
            throw new Error(response.message || response.error || 'Failed to load user');
          }
          
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          authServiceInstance.clearAuth(); // Ensure clearAuth if any error occurs during load
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
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