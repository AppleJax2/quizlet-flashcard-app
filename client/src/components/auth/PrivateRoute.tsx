import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that protects routes requiring authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 * The current location is saved so the user can be redirected back after login.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
};

export default PrivateRoute; 