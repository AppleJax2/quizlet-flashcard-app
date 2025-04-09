import { useState, useCallback, useEffect, useRef } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
  duration?: number; // in milliseconds, 0 for persistent
  dismissible?: boolean;
  onDismiss?: () => void;
  createdAt: Date;
  dismissed: boolean;
  isClosing: boolean;
}

interface NotificationOptions {
  title?: string;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const DEFAULT_DURATION = 5000; // 5 seconds

/**
 * Custom hook for managing application notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);
  
  /**
   * Create a notification with a unique ID
   */
  const createNotification = useCallback((
    message: string,
    type: NotificationType = 'info',
    options: NotificationOptions = {}
  ) => {
    const {
      title,
      duration = DEFAULT_DURATION,
      dismissible = true,
      onDismiss,
    } = options;
    
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: Notification = {
      id,
      message,
      type,
      title,
      duration,
      dismissible,
      onDismiss,
      createdAt: new Date(),
      dismissed: false,
      isClosing: false,
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-dismiss if duration is set
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        dismissNotification(id);
      }, duration);
      
      timeoutsRef.current[id] = timeoutId;
    }
    
    return id;
  }, []);
  
  /**
   * Start the closing animation for a notification
   */
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id
          ? { ...notification, isClosing: true }
          : notification
      )
    );
    
    // Remove notification after animation completes
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id
            ? { ...notification, dismissed: true }
            : notification
        )
      );
      
      // Clean up completely after a delay
      setTimeout(() => {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== id)
        );
        
        // Clean up timeout
        if (timeoutsRef.current[id]) {
          clearTimeout(timeoutsRef.current[id]);
          delete timeoutsRef.current[id];
        }
      }, 300);
    }, 150); // Match this to your CSS transition duration
  }, []);
  
  /**
   * Remove all notifications
   */
  const clearAllNotifications = useCallback(() => {
    // Mark all as closing first
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isClosing: true }))
    );
    
    // Then remove after animation
    setTimeout(() => {
      setNotifications([]);
      
      // Clean up all timeouts
      Object.keys(timeoutsRef.current).forEach(id => {
        clearTimeout(timeoutsRef.current[id]);
        delete timeoutsRef.current[id];
      });
    }, 150);
  }, []);
  
  /**
   * Convenience methods for different notification types
   */
  const success = useCallback((message: string, options?: NotificationOptions) => {
    return createNotification(message, 'success', options);
  }, [createNotification]);
  
  const error = useCallback((message: string, options?: NotificationOptions) => {
    return createNotification(message, 'error', {
      ...options,
      duration: options?.duration ?? 0, // Error notifications persist by default
    });
  }, [createNotification]);
  
  const warning = useCallback((message: string, options?: NotificationOptions) => {
    return createNotification(message, 'warning', options);
  }, [createNotification]);
  
  const info = useCallback((message: string, options?: NotificationOptions) => {
    return createNotification(message, 'info', options);
  }, [createNotification]);
  
  return {
    notifications: notifications.filter(n => !n.dismissed),
    createNotification,
    dismissNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };
}

export default useNotifications; 