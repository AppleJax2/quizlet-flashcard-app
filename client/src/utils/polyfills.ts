/**
 * Polyfills for Node.js process object in browser environment
 * This resolves the "process is not defined" error
 */

// Create a global process object that satisfies the minimum requirements
// for libraries that expect Node.js globals
(function() {
  if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
    // Using any type to avoid TypeScript errors with process object structure
    (window as any).process = {
      env: {
        NODE_ENV: import.meta.env.MODE || 'development',
        VITE_API_URL: import.meta.env.VITE_API_URL || '/api',
        // Add any other environment variables your app needs here
      },
      browser: true,
      version: '0.0.0',
      versions: {
        node: '0.0.0',
      },
      nextTick: (cb: Function) => setTimeout(cb, 0),
      platform: typeof navigator !== 'undefined' && /Win/.test(navigator.platform) ? 'win32' : 'browser',
    };
  }
})();

export {}; 