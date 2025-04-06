import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService, type User } from '@/lib/api/services';

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
          const authService = AuthService.getInstance();
          const response = await authService.login({ email, password });
          
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Login failed');
          }
          
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
          const authService = AuthService.getInstance();
          const response = await authService.register({
            username,
            email,
            password,
            confirmPassword,
          });
          
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Registration failed');
          }
          
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
        const authService = AuthService.getInstance();
        authService.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      loadUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const authService = AuthService.getInstance();
          
          // Only attempt to load user if we have a token
          if (!authService.isAuthenticated()) {
            set({ isLoading: false });
            return;
          }
          
          const response = await authService.getCurrentUser();
          
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to load user');
          }
          
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
          });
          
          // If we fail to load the user, clear the token
          const authService = AuthService.getInstance();
          authService.logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 