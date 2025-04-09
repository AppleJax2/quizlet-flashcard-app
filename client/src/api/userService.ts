import apiClient, { ApiResponse } from './apiClient';
import {
  User,
  UserProfile,
  LoginCredentials,
  RegistrationData,
  UpdateProfileData,
  ChangePasswordData,
  PasswordResetRequestData,
  PasswordResetData,
  NotificationSettings,
  UUID,
} from '@/types/user.types';

/**
 * Service for user authentication and profile management
 */
class UserService {
  private baseUrl = '/users';
  private authUrl = '/auth';
  private profileUrl = '/profile';
  private settingsUrl = '/settings';
  
  // Authentication methods
  
  /**
   * Authenticate user with credentials
   */
  public async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiClient.post<{ token: string; user: User }>(
      `${this.authUrl}/login`,
      credentials
    );
  }
  
  /**
   * Register a new user
   */
  public async register(data: RegistrationData): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiClient.post<{ token: string; user: User }>(
      `${this.authUrl}/register`,
      data
    );
  }
  
  /**
   * Log out the current user
   */
  public async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(
      `${this.authUrl}/logout`,
      {}
    );
  }
  
  /**
   * Get current authenticated user
   */
  public async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(
      `${this.authUrl}/me`
    );
  }
  
  /**
   * Refresh authentication token
   */
  public async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post<{ token: string }>(
      `${this.authUrl}/refresh`,
      {}
    );
  }
  
  /**
   * Request password reset
   */
  public async requestPasswordReset(data: PasswordResetRequestData): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      `${this.authUrl}/password-reset/request`,
      data
    );
  }
  
  /**
   * Reset password with token
   */
  public async resetPassword(data: PasswordResetData): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      `${this.authUrl}/password-reset/confirm`,
      data
    );
  }
  
  /**
   * Verify email with token
   */
  public async verifyEmail(token: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      `${this.authUrl}/verify-email`,
      { token }
    );
  }
  
  /**
   * Resend email verification
   */
  public async resendVerificationEmail(email: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      `${this.authUrl}/verify-email/resend`,
      { email }
    );
  }
  
  // Profile methods
  
  /**
   * Get user's profile
   */
  public async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>(
      `${this.profileUrl}`
    );
  }
  
  /**
   * Update user's profile
   */
  public async updateProfile(data: UpdateProfileData): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>(
      `${this.profileUrl}`,
      data
    );
  }
  
  /**
   * Change user's password
   */
  public async changePassword(data: ChangePasswordData): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      `${this.profileUrl}/password`,
      data
    );
  }
  
  /**
   * Upload profile picture
   */
  public async uploadProfilePicture(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    return apiClient.uploadFile<{ imageUrl: string }>(
      `${this.profileUrl}/picture`,
      file,
      onProgress
    );
  }
  
  // Settings methods
  
  /**
   * Get user notification settings
   */
  public async getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
    return apiClient.get<NotificationSettings>(
      `${this.settingsUrl}/notifications`
    );
  }
  
  /**
   * Update notification settings
   */
  public async updateNotificationSettings(settings: NotificationSettings): Promise<ApiResponse<NotificationSettings>> {
    return apiClient.put<NotificationSettings>(
      `${this.settingsUrl}/notifications`,
      settings
    );
  }
  
  /**
   * Get user's study preferences
   */
  public async getStudyPreferences(): Promise<ApiResponse<{ [key: string]: any }>> {
    return apiClient.get<{ [key: string]: any }>(
      `${this.settingsUrl}/study-preferences`
    );
  }
  
  /**
   * Update study preferences
   */
  public async updateStudyPreferences(preferences: { [key: string]: any }): Promise<ApiResponse<{ [key: string]: any }>> {
    return apiClient.put<{ [key: string]: any }>(
      `${this.settingsUrl}/study-preferences`,
      preferences
    );
  }
  
  /**
   * Delete user account
   */
  public async deleteAccount(password: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `${this.baseUrl}/me`,
      { data: { password } }
    );
  }
  
  /**
   * Get user's subscription status
   */
  public async getSubscriptionStatus(): Promise<ApiResponse<{
    subscribed: boolean;
    plan?: string;
    expiresAt?: string;
    features: string[];
  }>> {
    return apiClient.get<{
      subscribed: boolean;
      plan?: string;
      expiresAt?: string;
      features: string[];
    }>(
      `${this.baseUrl}/subscription`
    );
  }
  
  /**
   * Get user's activity log with pagination
   */
  public async getActivityLog(page: number = 1, limit: number = 10): Promise<ApiResponse<{
    activities: {
      id: UUID;
      type: string;
      description: string;
      timestamp: string;
      metadata?: { [key: string]: any };
    }[];
    total: number;
    page: number;
    limit: number;
  }>> {
    return apiClient.get<{
      activities: {
        id: UUID;
        type: string;
        description: string;
        timestamp: string;
        metadata?: { [key: string]: any };
      }[];
      total: number;
      page: number;
      limit: number;
    }>(
      `${this.baseUrl}/activity-log?page=${page}&limit=${limit}`
    );
  }
  
  /**
   * Get user's achievements
   */
  public async getAchievements(): Promise<ApiResponse<{
    achievements: {
      id: UUID;
      name: string;
      description: string;
      icon: string;
      unlockedAt?: string;
      progress?: number;
      maxProgress?: number;
    }[];
  }>> {
    return apiClient.get<{
      achievements: {
        id: UUID;
        name: string;
        description: string;
        icon: string;
        unlockedAt?: string;
        progress?: number;
        maxProgress?: number;
      }[];
    }>(
      `${this.baseUrl}/achievements`
    );
  }
  
  /**
   * Get user's learning statistics
   */
  public async getLearningStats(): Promise<ApiResponse<{
    totalSets: number;
    totalCards: number;
    totalStudySessions: number;
    totalStudyTime: number;
    cardsStudied: number;
    averageAccuracy: number;
    streakDays: number;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: {
      date: string;
      studySessions: number;
      cardsStudied: number;
      studyTime: number;
    }[];
  }>> {
    return apiClient.get<{
      totalSets: number;
      totalCards: number;
      totalStudySessions: number;
      totalStudyTime: number;
      cardsStudied: number;
      averageAccuracy: number;
      streakDays: number;
      currentStreak: number;
      longestStreak: number;
      weeklyActivity: {
        date: string;
        studySessions: number;
        cardsStudied: number;
        studyTime: number;
      }[];
    }>(
      `${this.baseUrl}/learning-stats`
    );
  }
}

// Create and export the user service instance
const userService = new UserService();
export default userService; 