import { 
  ForgotPasswordData, 
  LoginCredentials, 
  RegisterCredentials, 
  ResetPasswordData, 
  UpdateProfileData, 
  User,
  ApiResponse
} from '@/types';
import apiService from './api';

class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  // Login with email and password
  async login(credentials: LoginCredentials) {
    try {
      const response = await apiService.post<ApiResponse<{ user: User; token: string }>>('/api/v1/auth/login', credentials);
      
      // Handle successful login even if the response structure is inconsistent
      if (response.status === 200 || response.success === true) {
        // Check for nested user data within response.data
        if (response.data) {
          if (response.data.token) {
            this.setToken(response.data.token);
          }
          
          if (response.data.user) {
            this.setUser(response.data.user);
          }
        } else {
          // Check for direct user data at the response level
          if (response.token) {
            this.setToken(response.token);
          }
          
          if (response.user) {
            this.setUser(response.user);
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error('Auth service login error:', error);
      throw error;
    }
  }

  // Register a new user
  async register(credentials: RegisterCredentials) {
    const response = await apiService.post<ApiResponse<{ user: User; token: string }>>('/api/v1/auth/register', credentials);
    if (response.status === 201 && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    return response;
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordData) {
    return apiService.post<ApiResponse<{ message: string }>>('/api/v1/auth/forgot-password', data);
  }

  // Reset password
  async resetPassword(data: ResetPasswordData) {
    return apiService.post<ApiResponse<{ message: string }>>('/api/v1/auth/reset-password', data);
  }

  // Update user profile
  async updateProfile(data: UpdateProfileData) {
    const response = await apiService.put<ApiResponse<{ user: User; token: string }>>('/api/v1/users/profile', data);
    if (response.status === 200 && response.data) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    return response;
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await apiService.get<ApiResponse<User>>('/api/v1/auth/me');
      
      // Normalize the response structure
      // If we get user object directly at the top level but not in data,
      // create a consistent structure for the caller
      if (response.user && !response.data) {
        return {
          ...response,
          data: response.user
        };
      }
      
      return response;
    } catch (error) {
      console.error('getCurrentUser error:', error);
      throw error;
    }
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