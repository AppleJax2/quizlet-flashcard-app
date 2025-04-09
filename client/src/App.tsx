import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

import PrivateRoute from '@/components/auth/PrivateRoute';
import PublicLayout from '@/components/layouts/PublicLayout';
import AppLayout from '@/components/layouts/AppLayout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SkipLink from '@/components/common/SkipLink';

// Public pages
import HomePage from '@/pages/HomePage';
import FeaturesPage from '@/pages/FeaturesPage';
import AboutPage from '@/pages/AboutPage';
import PricingPage from '@/pages/PricingPage';

// Lazy loaded auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Lazy loaded app pages - Dashboard
const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'));

// Lazy loaded app pages - Flashcards
const FlashcardSetListPage = lazy(() => import('@/pages/app/flashcards/FlashcardSetListPage'));

// Lazy loaded app pages - Study Sessions

// Lazy loaded app pages - AI Processing
const TextProcessorPage = lazy(() => import('@/pages/app/processor/TextProcessorPage'));
const UrlProcessorPage = lazy(() => import('@/pages/app/processor/UrlProcessorPage'));
const DocumentProcessorPage = lazy(() => import('@/pages/app/processor/DocumentProcessorPage'));

// Lazy loaded app pages - Study Guides

// Lazy loaded app pages - User Profile & Settings
const ProfilePage = lazy(() => import('@/pages/app/ProfilePage'));

// Shared loading fallback component with consistent design
const PageLoadingFallback = () => (
  <LoadingScreen 
    message="Loading page..." 
    variant="pulse" 
    color="primary" 
  />
);

function App() {
  return (
    <>
      <AuthProvider>
        {/* Skip link for keyboard accessibility */}
        <SkipLink targetId="main-content" />
        
        <Toaster
          position="top-right"
          toastOptions={{
            // Default styles
            style: {
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontWeight: '500',
            },
            // Success toasts (green)
            success: {
              style: {
                background: '#10B981',
                color: 'white',
                border: '1px solid #059669',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#059669',
              },
              duration: 4000,
            },
            // Error toasts (red)
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
                border: '1px solid #DC2626',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#DC2626',
              },
              duration: 5000,
            },
          }}
        />
        <div id="main-content">
          <Routes>
            {/* Public routes with PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route 
                path="/login" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <LoginPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <RegisterPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/forgot-password" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <ForgotPasswordPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/reset-password/:token" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <ResetPasswordPage />
                  </Suspense>
                } 
              />
            </Route>

            {/* Protected routes with AppLayout */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              {/* Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <DashboardPage />
                  </Suspense>
                } 
              />
              
              {/* Flashcard Management */}
              <Route 
                path="/flashcards" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <FlashcardSetListPage />
                  </Suspense>
                } 
              />
              
              {/* AI Processing */}
              <Route 
                path="/processor/text" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <TextProcessorPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/processor/url" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <UrlProcessorPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/processor/document" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <DocumentProcessorPage />
                  </Suspense>
                } 
              />
              
              {/* User Profile & Settings */}
              <Route 
                path="/profile" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <ProfilePage />
                  </Suspense>
                } 
              />
            </Route>

            {/* Redirects */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 page */}
            <Route 
              path="*" 
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <NotFoundPage />
                </Suspense>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App; 