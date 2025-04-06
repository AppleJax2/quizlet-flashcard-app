import { 
  ForgotPasswordData, 
  LoginCredentials, 
  RegisterCredentials, 
  ResetPasswordData, 
  UpdateProfileData, 
  User 
} from '@/types';
import apiService from './api';

class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  // Login with email and password
  async login(credentials: LoginCredentials) {
    const response = await apiService.post<{ user: User; token: string }>('/auth/login', credentials);
    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    return response;
  }

  // Register a new user
  async register(credentials: RegisterCredentials) {
    const response = await apiService.post<{ user: User; token: string }>('/auth/register', credentials);
    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    return response;
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordData) {
    return apiService.post<{ message: string }>('/auth/forgot-password', data);
  }

  // Reset password
  async resetPassword(data: ResetPasswordData) {
    return apiService.post<{ message: string }>('/auth/reset-password', data);
  }

  // Update user profile
  async updateProfile(data: UpdateProfileData) {
    const response = await apiService.put<{ user: User; token: string }>('/users/profile', data);
    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    return response;
  }

  // Get current user info
  async getCurrentUser() {
    return apiService.get<User>('/auth/me');
  }

  // Store token in localStorage
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Store user in localStorage
  setUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Get user from localStorage
  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Clear token and user from localStorage
  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService; 