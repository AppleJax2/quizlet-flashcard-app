/**
 * Type definition for UUID strings
 */
export type UUID = string;

/**
 * Type definition for ISO8601 date strings
 */
export type ISO8601Date = string;

/**
 * User authentication roles
 */
export type UserRole = 'user' | 'premium' | 'admin';

/**
 * Basic user information
 */
export interface User {
  id: UUID;
  email: string;
  username: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
}

/**
 * Extended user profile information
 */
export interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePictureUrl?: string;
  location?: string;
  website?: string;
  occupation?: string;
  organization?: string;
  education?: string;
  interests?: string[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  timezone?: string;
  language?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration data
 */
export interface RegistrationData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  agreeToTerms: boolean;
  referralCode?: string;
}

/**
 * Update profile data
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  occupation?: string;
  organization?: string;
  education?: string;
  interests?: string[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  timezone?: string;
  language?: string;
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password reset request data
 */
export interface PasswordResetRequestData {
  email: string;
}

/**
 * Password reset data with token
 */
export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  email: {
    marketing: boolean;
    studyReminders: boolean;
    achievementNotifications: boolean;
    newFeatures: boolean;
    accountUpdates: boolean;
    dailyDigest: boolean;
    weeklyDigest: boolean;
  };
  push: {
    studyReminders: boolean;
    achievementNotifications: boolean;
    friendActivity: boolean;
    newContent: boolean;
  };
  inApp: {
    studyReminders: boolean;
    achievementNotifications: boolean;
    friendActivity: boolean;
    newContent: boolean;
    tips: boolean;
  };
  studyRemindersFrequency?: 'daily' | 'weekdays' | 'weekends' | 'custom';
  studyReminderTimes?: string[]; // Format: "HH:MM"
  studyReminderDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
}

/**
 * Study preferences 
 */
export interface StudyPreferences {
  defaultStudyMode: 'learning' | 'testing' | 'writing' | 'matching';
  cardsPerSession: number;
  reviewBeforeTesting: boolean;
  shuffleCards: boolean;
  autoplayAudio: boolean;
  showImages: boolean;
  showProgressStats: boolean;
  focusMode: boolean;
  reminderInterval: number; // in minutes
  theme: 'light' | 'dark' | 'system';
  fontScale: number;
  highContrastMode: boolean;
  animationReduced: boolean;
  colorBlindMode: boolean;
  screenReaderOptimized: boolean;
  keyboardShortcuts: { [key: string]: string };
}

/**
 * Account subscription 
 */
export interface Subscription {
  id: UUID;
  userId: UUID;
  plan: 'free' | 'basic' | 'premium' | 'team' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: ISO8601Date;
  currentPeriodEnd: ISO8601Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: ISO8601Date;
  canceledAt?: ISO8601Date;
  endedAt?: ISO8601Date;
  features: string[];
  paymentMethod?: {
    type: 'card' | 'paypal' | 'bank_transfer';
    lastFour?: string;
    expiryDate?: string;
    brand?: string;
  };
}

/**
 * User activity log entry
 */
export interface ActivityLogEntry {
  id: UUID;
  userId: UUID;
  type: 'login' | 'study_session' | 'create_set' | 'edit_set' | 'delete_set' | 'achievement' | 'profile_update' | 'subscription_change' | 'account_action';
  description: string;
  timestamp: ISO8601Date;
  ipAddress?: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  metadata?: {
    [key: string]: any;
  };
}

/**
 * User achievement
 */
export interface Achievement {
  id: UUID;
  name: string;
  description: string;
  icon: string;
  category: 'study' | 'creation' | 'consistency' | 'social' | 'exploration';
  requirement: {
    type: 'count' | 'duration' | 'streak' | 'completion';
    target: number;
    action?: string;
  };
  rewards?: {
    type: 'xp' | 'badge' | 'feature_unlock';
    value: any;
  }[];
}

/**
 * User achievement progress
 */
export interface UserAchievement {
  id: UUID;
  userId: UUID;
  achievementId: UUID;
  achievement: Achievement;
  progress: number;
  maxProgress: number;
  unlockedAt?: ISO8601Date;
  earnedRewards?: {
    type: string;
    value: any;
    claimedAt?: ISO8601Date;
  }[];
}

/**
 * User statistics
 */
export interface UserStats {
  userId: UUID;
  totalSets: number;
  totalCards: number;
  totalStudySessions: number;
  totalStudyTime: number; // In seconds
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageAccuracy: number; // Percentage
  streakDays: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: ISO8601Date;
  studyHistory: {
    date: ISO8601Date;
    sessionsCount: number;
    cardsStudied: number;
    studyTime: number; // In seconds
    accuracy: number; // Percentage
  }[];
}

/**
 * Social connection with another user
 */
export interface UserConnection {
  id: UUID;
  userId: UUID;
  connectedUserId: UUID;
  status: 'pending' | 'connected' | 'rejected' | 'blocked';
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
  connectedUser?: {
    id: UUID;
    username: string;
    profilePictureUrl?: string;
  };
}

/**
 * User onboarding state 
 */
export interface OnboardingState {
  completed: boolean;
  steps: {
    profile: boolean;
    tutorial: boolean;
    firstSet: boolean;
    firstStudySession: boolean;
    notification: boolean;
    featureExploration: boolean;
  };
  currentStep: string;
  skipped: boolean;
  startedAt: ISO8601Date;
  completedAt?: ISO8601Date;
  lastInteractionAt: ISO8601Date;
} 