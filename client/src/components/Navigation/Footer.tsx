import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component for public pages with navigation links and copyright information
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-1 lg:col-span-1">
            <Link 
              to="/" 
              className="flex items-center space-x-2 mb-4"
              aria-label="FlashLeap - Homepage"
            >
              <div className="overflow-hidden rounded-lg bg-primary-500 p-1.5 shadow-sm">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="6" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M12 17V9"></path>
                  <path d="M9 12l3-3 3 3"></path>
                  <path d="M8 14h8"></path>
                </svg>
              </div>
              <span className="text-lg font-semibold text-primary-700">FlashLeap</span>
            </Link>
            <p className="text-sm text-neutral-600 mb-6 max-w-md">
              FlashLeap is an intelligent flashcard application that helps you learn faster and remember longer. Take the leap in your learning journey today.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-neutral-500 hover:text-primary-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-neutral-500 hover:text-primary-600 transition-colors duration-200"
                aria-label="GitHub"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">
                  Smart Flashcards
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">
                  Spaced Repetition
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">
                  Collaborative Learning
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <span className="text-sm text-neutral-400 cursor-not-allowed">Careers</span>
              </li>
              <li>
                <span className="text-sm text-neutral-400 cursor-not-allowed">Blog</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-neutral-400 cursor-not-allowed">Help Center</span>
              </li>
              <li>
                <span className="text-sm text-neutral-400 cursor-not-allowed">Contact</span>
              </li>
              <li>
                <span className="text-sm text-neutral-400 cursor-not-allowed">FAQ</span>
              </li>
              <li>
                <span className="text-sm text-neutral-400 cursor-not-allowed">Privacy</span>
              </li>
              <li>
                <span className="text-sm text-neutral-400 cursor-not-allowed">Terms</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-200 text-center">
          <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} FlashLeap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 