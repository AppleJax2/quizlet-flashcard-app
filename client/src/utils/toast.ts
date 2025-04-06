import toast from 'react-hot-toast';

/**
 * Show a success toast message with consistent styling
 * @param message The message to display
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: '#10B981',
      color: 'white',
      border: '1px solid #059669',
      fontWeight: '500',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#059669',
    },
    duration: 4000,
  });
};

/**
 * Show an error toast message with consistent styling
 * @param message The message to display
 */
export const showError = (message: string) => {
  toast.error(message, {
    style: {
      background: '#EF4444',
      color: 'white',
      border: '1px solid #DC2626',
      fontWeight: '500',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#DC2626',
    },
    duration: 5000,
  });
};

/**
 * Show an info toast message with consistent styling
 * @param message The message to display
 */
export const showInfo = (message: string) => {
  toast(message, {
    style: {
      background: '#3B82F6',
      color: 'white',
      border: '1px solid #2563EB',
      fontWeight: '500',
    },
    icon: 'ℹ️',
    duration: 4000,
  });
};

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
}; 