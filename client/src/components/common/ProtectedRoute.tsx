import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { useAppContext } from '@/context';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'user' | 'premium' | 'admin';
  redirectPath?: string;
}

/**
 * ProtectedRoute component that enforces authentication and optionally role-based authorization.
 * Redirects unauthenticated or unauthorized users to the login page or specified redirect path.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'user',
  redirectPath = '/login',
}) => {
  const { isAuthenticated, user, isLoading, authInitialized } = useAuth();
  const { showNotification } = useAppContext();
  const location = useLocation();

  // Check if user has the required role
  const hasRequiredRole = user && (
    requiredRole === 'user' ||
    (requiredRole === 'premium' && ['premium', 'admin'].includes(user.role)) ||
    (requiredRole === 'admin' && user.role === 'admin')
  );

  // Show notification if user doesn't have the required role
  useEffect(() => {
    if (authInitialized && isAuthenticated && !hasRequiredRole) {
      showNotification(
        'You do not have permission to access this page.',
        'error',
        { duration: 5000 }
      );
    }
  }, [authInitialized, isAuthenticated, hasRequiredRole, showNotification]);

  // Don't render anything if auth is still initializing
  if (!authInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or doesn't have required role, redirect to login
  if (!isAuthenticated || !hasRequiredRole) {
    return (
      <Navigate
        to={redirectPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Render children or outlet for nested routes
  return <>{children ?? <Outlet />}</>;
};

export default ProtectedRoute; 