// Import polyfills first to ensure Node.js globals are available
import './utils/polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import GlobalProvider from './context';
import './styles/globals.css';

// Simple error boundary to catch React Router errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Routing error caught:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
            <h1 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-4">There was an error loading the application:</p>
            <div className="bg-red-50 p-4 rounded border border-red-200 mb-4 overflow-auto">
              <pre className="text-sm text-red-800 whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </div>
            <button 
              onClick={() => window.location.href = '/'} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <GlobalProvider>
          <App />
        </GlobalProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
); 