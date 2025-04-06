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
    if (user === null && !isLoading) {
      loadUser();
    }
  }, [loadUser, user, isLoading]);

  if (isLoading || user === null) {
    const token = localStorage.getItem('token');
    if (!token && !isLoading) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <LoadingScreen message="Verifying your authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
} 