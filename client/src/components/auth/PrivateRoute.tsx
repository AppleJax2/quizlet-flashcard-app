import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/lib/store';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading, loadUser, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Attempt to load user details if we think we are authenticated but don't have user details yet.
    // This handles the case after page refresh where `isAuthenticated` might be true from persisted state,
    // but `user` details need to be fetched.
    if (isAuthenticated && user === null && !isLoading) {
      loadUser();
    }
    // If we are not authenticated and there's no user, ensure state is clean (e.g., clear potential stale user)
    // Note: loadUser already handles clearing state on failure.
  }, [isAuthenticated, user, isLoading, loadUser]);

  // If still loading user data explicitly, show loading screen.
  if (isLoading) {
    return <LoadingScreen message="Verifying your authentication..." />;
  }

  // After loading attempt, if not authenticated, redirect to login.
  // This relies on `loadUser` correctly setting `isAuthenticated` to false on failure.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and not loading, render the protected route.
  // We might still not have the user object briefly if loadUser is slow,
  // but the route is protected by isAuthenticated.
  return children || <Outlet />;
} 