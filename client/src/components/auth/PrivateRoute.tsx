import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Verifying your authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Redirect to login page and save the location user was trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the protected route
  return <Outlet />;
} 