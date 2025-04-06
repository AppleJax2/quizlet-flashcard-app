import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  const homePath = isAuthenticated ? '/dashboard' : '/';

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 text-primary-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link
          to={homePath}
          className="rounded-lg bg-primary-500 px-6 py-3 text-lg font-medium text-white hover:bg-primary-600"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
} 