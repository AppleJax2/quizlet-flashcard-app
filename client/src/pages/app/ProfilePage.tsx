import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { UserCircleIcon, KeyIcon, AtSymbolIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

type ProfileFormValues = {
  username: string;
  email: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Profile form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm<ProfileFormValues>();
  
  // Password form
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword, watch } = useForm<PasswordFormValues>();
  
  // Watch new password for confirmation validation
  const newPassword = watch('newPassword', '');
  
  // Set initial form values when user data is available
  useEffect(() => {
    if (user) {
      resetProfile({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user, resetProfile]);
  
  // Handle profile update submission
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }
      
      // Update token in localStorage if a new one was returned
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      
      // Refresh user data in context
      if (refreshUser) {
        await refreshUser();
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle password change submission
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    
    try {
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to change password');
      }
      
      // Update token in localStorage if a new one was returned
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      
      // Reset password form
      resetPassword();
      
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Manage your account information and security settings
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left sidebar */}
        <aside className="md:col-span-1">
          <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="p-6 text-center border-b border-neutral-200 bg-neutral-50">
              <div className="inline-block h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                {user?.username?.charAt(0) || 'U'}
              </div>
              <h2 className="text-lg font-medium text-neutral-900">{user?.username || 'User'}</h2>
              <p className="text-sm text-neutral-500">{user?.email || 'user@example.com'}</p>
            </div>
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md text-neutral-700 bg-primary-50 font-medium"
                    aria-current="page"
                  >
                    <UserCircleIcon className="mr-3 h-5 w-5 text-primary-500" aria-hidden="true" />
                    <span>Profile Information</span>
                  </button>
                </li>
                <li>
                  <button
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  >
                    <KeyIcon className="mr-3 h-5 w-5 text-neutral-400" aria-hidden="true" />
                    <span>Account Security</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="md:col-span-2 space-y-8">
          {/* Profile Information Form */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h2 className="text-lg font-medium text-neutral-900">Profile Information</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Update your account information and email address
              </p>
            </div>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="p-6 space-y-6">
              {/* Username field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    {...registerProfile('username', {
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Username must be at least 3 characters' },
                      maxLength: { value: 50, message: 'Username cannot exceed 50 characters' },
                    })}
                    className="pl-10 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                {profileErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{profileErrors.username.message}</p>
                )}
              </div>
              
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSymbolIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...registerProfile('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="pl-10 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                {profileErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Password Change Form */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h2 className="text-lg font-medium text-neutral-900">Change Password</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Update your password to maintain account security
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="p-6 space-y-6">
              {/* Current Password field */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  {...registerPassword('currentPassword', {
                    required: 'Current password is required',
                  })}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              
              {/* New Password field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must include uppercase, lowercase, number and special character',
                    },
                  })}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              
              {/* Confirm New Password field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === newPassword || 'Passwords do not match',
                  })}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 