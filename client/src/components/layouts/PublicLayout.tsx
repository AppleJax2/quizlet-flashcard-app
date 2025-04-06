import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="M8 12h8"></path>
                <path d="M8 8h8"></path>
                <path d="M8 16h8"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-neutral-900">
                Quizlet Flashcard Generator
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="M8 12h8"></path>
                  <path d="M8 8h8"></path>
                  <path d="M8 16h8"></path>
                </svg>
                <span className="ml-2 text-lg font-semibold text-neutral-900">
                  Quizlet Flashcard Generator
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                Create and study flashcards from any source, powered by advanced AI.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Resources
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/features"
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-neutral-200 pt-8">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} Quizlet Flashcard Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 