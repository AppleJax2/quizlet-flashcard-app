import { useState, useCallback } from 'react';
import useFetch, { FetchOptions } from './useFetch';
import userService from '@/api/userService';
import { useAuth } from '@/context/auth/AuthContext';
import {
  User,
  UserProfile,
  LoginCredentials,
  RegistrationData,
  UpdateProfileData,
  ChangePasswordData,
  NotificationSettings,
} from '@/types/user.types';

/**
 * Hook for fetching and updating the user's profile
 */
export function useUserProfile(options?: FetchOptions) {
  const { updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile data
  const { data: profile, isLoading, refetch } = useFetch(
    userService.getUserProfile.bind(userService),
    [],
    {
      ...options,
    }
  );

  // Update user profile
  const updateProfile = useCallback(
    async (data: UpdateProfileData) => {
      setIsUpdating(true);
      setError(null);
      
      try {
        const response = await userService.updateProfile(data);
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        // If the update includes user fields that are in the auth context,
        // update the auth context user as well
        updateUser(response.data as User);
        
        // Refetch profile to ensure we have latest data
        refetch();
        
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile');
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [updateUser, refetch]
  );

  // Upload profile picture
  const uploadProfilePicture = useCallback(
    async (file: File) => {
      setIsUpdating(true);
      setUploadProgress(0);
      setError(null);
      
      try {
        const response = await userService.uploadProfilePicture(
          file,
          (progress) => {
            setUploadProgress(progress);
          }
        );
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        // Refetch profile to get updated image URL
        refetch();
        
        return response.data.imageUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload profile picture');
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [refetch]
  );

  return {
    profile,
    isLoading,
    isUpdating,
    uploadProgress,
    error,
    updateProfile,
    uploadProfilePicture,
    refetchProfile: refetch,
  };
}

/**
 * Hook for changing user password
 */
export function useChangePassword() {
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = useCallback(
    async (data: ChangePasswordData) => {
      setIsChanging(true);
      setError(null);
      setSuccess(false);
      
      try {
        const response = await userService.changePassword(data);
        
        if (response.error) {
          setError(response.error.message);
          return false;
        }
        
        setSuccess(true);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to change password');
        return false;
      } finally {
        setIsChanging(false);
      }
    },
    []
  );

  return {
    changePassword,
    isChanging,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
}

/**
 * Hook for managing notification settings
 */
export function useNotificationSettings(options?: FetchOptions) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notification settings
  const { 
    data: settings, 
    isLoading, 
    refetch 
  } = useFetch(
    userService.getNotificationSettings.bind(userService),
    [],
    {
      ...options,
    }
  );

  // Update notification settings
  const updateSettings = useCallback(
    async (newSettings: NotificationSettings) => {
      setIsUpdating(true);
      setError(null);
      
      try {
        const response = await userService.updateNotificationSettings(newSettings);
        
        if (response.error) {
          setError(response.error.message);
          return null;
        }
        
        // Refetch to ensure we have latest data
        refetch();
        
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update notification settings');
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [refetch]
  );

  return {
    settings,
    isLoading,
    isUpdating,
    error,
    updateSettings,
  };
}

/**
 * Hook for fetching user's subscription status
 */
export function useSubscriptionStatus(options?: FetchOptions) {
  return useFetch(
    userService.getSubscriptionStatus.bind(userService),
    [],
    {
      ...options,
    }
  );
}

/**
 * Hook for fetching user's learning statistics
 */
export function useLearningStats(options?: FetchOptions) {
  return useFetch(
    userService.getLearningStats.bind(userService),
    [],
    {
      ...options,
    }
  );
}

/**
 * Hook for fetching user's activity log
 */
export function useActivityLog(
  page: number = 1,
  limit: number = 10,
  options?: FetchOptions
) {
  return useFetch(
    userService.getActivityLog.bind(userService),
    [page, limit],
    {
      cacheKey: `activityLog-${page}-${limit}`,
      ...options,
    }
  );
}

/**
 * Hook for fetching user's achievements
 */
export function useAchievements(options?: FetchOptions) {
  return useFetch(
    userService.getAchievements.bind(userService),
    [],
    {
      ...options,
    }
  );
}

/**
 * Hook for account deletion
 */
export function useDeleteAccount() {
  const { logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = useCallback(
    async (password: string) => {
      setIsDeleting(true);
      setError(null);
      
      try {
        const response = await userService.deleteAccount(password);
        
        if (response.error) {
          setError(response.error.message);
          return false;
        }
        
        // Log user out after account deletion
        await logout();
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete account');
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [logout]
  );

  return {
    deleteAccount,
    isDeleting,
    error,
  };
}

/**
 * Hook for password reset request
 */
export function usePasswordReset() {
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Request password reset
  const requestReset = useCallback(
    async (email: string) => {
      setIsRequestingReset(true);
      setError(null);
      setSuccess(false);
      
      try {
        const response = await userService.requestPasswordReset({ email });
        
        if (response.error) {
          setError(response.error.message);
          return false;
        }
        
        setSuccess(true);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to request password reset');
        return false;
      } finally {
        setIsRequestingReset(false);
      }
    },
    []
  );

  // Complete password reset with token
  const resetPassword = useCallback(
    async (token: string, newPassword: string, confirmPassword: string) => {
      setIsResetting(true);
      setError(null);
      setSuccess(false);
      
      try {
        const response = await userService.resetPassword({
          token,
          newPassword,
          confirmPassword,
        });
        
        if (response.error) {
          setError(response.error.message);
          return false;
        }
        
        setSuccess(true);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reset password');
        return false;
      } finally {
        setIsResetting(false);
      }
    },
    []
  );

  return {
    requestReset,
    resetPassword,
    isRequestingReset,
    isResetting,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
}

/**
 * Hook for email verification
 */
export function useEmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Verify email with token
  const verifyEmail = useCallback(
    async (token: string) => {
      setIsVerifying(true);
      setError(null);
      setSuccess(false);
      
      try {
        const response = await userService.verifyEmail(token);
        
        if (response.error) {
          setError(response.error.message);
          return false;
        }
        
        setSuccess(true);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify email');
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    []
  );

  // Resend verification email
  const resendVerification = useCallback(
    async (email: string) => {
      setIsResending(true);
      setError(null);
      
      try {
        const response = await userService.resendVerificationEmail(email);
        
        if (response.error) {
          setError(response.error.message);
          return false;
        }
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to resend verification email');
        return false;
      } finally {
        setIsResending(false);
      }
    },
    []
  );

  return {
    verifyEmail,
    resendVerification,
    isVerifying,
    isResending,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
}

/**
 * Hook that provides authentication methods with state management
 * (wraps the AuthContext for convenience)
 */
export function useAuthentication() {
  const { 
    login, 
    register, 
    logout, 
    isAuthenticated, 
    isLoading, 
    user, 
    error 
  } = useAuth();
  
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Enhanced login with local state management
  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoginLoading(true);
      setLoginError(null);
      
      try {
        const success = await login(credentials);
        return success;
      } catch (err) {
        setLoginError(err instanceof Error ? err.message : 'Login failed');
        return false;
      } finally {
        setIsLoginLoading(false);
      }
    },
    [login]
  );

  // Enhanced register with local state management
  const handleRegister = useCallback(
    async (data: RegistrationData) => {
      setIsRegisterLoading(true);
      setRegisterError(null);
      
      try {
        const success = await register(data);
        return success;
      } catch (err) {
        setRegisterError(err instanceof Error ? err.message : 'Registration failed');
        return false;
      } finally {
        setIsRegisterLoading(false);
      }
    },
    [register]
  );

  return {
    login: handleLogin,
    register: handleRegister,
    logout,
    isAuthenticated,
    user,
    isLoginLoading,
    isRegisterLoading,
    isAuthLoading: isLoading,
    loginError,
    registerError,
    authError: error,
    clearErrors: () => {
      setLoginError(null);
      setRegisterError(null);
    },
  };
} 