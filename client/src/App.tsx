import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/contexts/AuthContext';
import PrivateRoute from '@/components/auth/PrivateRoute';
import PublicLayout from '@/components/layouts/PublicLayout';
import AppLayout from '@/components/layouts/AppLayout';
import LoadingScreen from '@/components/ui/LoadingScreen';

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

// Lazy loaded app pages
const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'));
const FlashcardSetListPage = lazy(() => import('@/pages/app/flashcards/FlashcardSetListPage'));
const TextProcessorPage = lazy(() => import('@/pages/app/processor/TextProcessorPage'));
const UrlProcessorPage = lazy(() => import('@/pages/app/processor/UrlProcessorPage'));
const DocumentProcessorPage = lazy(() => import('@/pages/app/processor/DocumentProcessorPage'));
const ProfilePage = lazy(() => import('@/pages/app/ProfilePage'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications with proper styling */}
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
        <Suspense fallback={<LoadingScreen message="Loading..." />}>
          <Routes>
            {/* Public routes with PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>

            {/* Protected routes with AppLayout */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/flashcards" element={<FlashcardSetListPage />} />
              <Route path="/processor/text" element={<TextProcessorPage />} />
              <Route path="/processor/url" element={<UrlProcessorPage />} />
              <Route path="/processor/document" element={<DocumentProcessorPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Redirects */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 