import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnChange?: any[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      errorInfo,
    });
    
    // Call error callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset the error boundary when specified props change
    if (
      this.state.hasError &&
      this.props.resetOnChange &&
      this.props.resetOnChange.some((value, i) => prevProps.resetOnChange?.[i] !== value)
    ) {
      this.reset();
    }
  }
  
  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="p-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8 text-red-500 dark:text-red-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200">
            Something went wrong
          </h2>
          
          <p className="text-red-600 dark:text-red-300">
            We're sorry, but an error occurred while rendering this component. 
            Please try refreshing the page.
          </p>
          
          <div className="mt-4 space-x-4">
            <Button
              onClick={this.reset}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
            >
              Refresh Page
            </Button>
          </div>
          
          {import.meta.env.MODE !== 'production' && (
            <div className="mt-6 p-4 border border-red-200 dark:border-red-800 bg-white dark:bg-red-900/50 rounded text-left overflow-auto max-h-60 w-full">
              <p className="font-bold text-red-800 dark:text-red-200">Error details:</p>
              <pre className="text-xs text-red-700 dark:text-red-300 mt-2 overflow-auto">
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <>
                  <p className="font-bold text-red-800 dark:text-red-200 mt-4">Component stack:</p>
                  <pre className="text-xs text-red-700 dark:text-red-300 mt-2 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 