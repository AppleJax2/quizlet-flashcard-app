import { ApiResponse } from '@/types';

// Define Vite's import.meta.env type
interface ImportMetaEnv {
  VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Original API URL 
const ORIGINAL_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Use a CORS proxy to bypass CORS restrictions
// This is a public CORS proxy service - consider using a more reliable one for production
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Apply the CORS proxy to the API URL
const API_BASE_URL = CORS_PROXY + ORIGINAL_API_URL;

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...init } = options;

    // Build URL with query parameters
    let url: URL;
    
    // If the endpoint is already a full URL (starts with http/https), use it directly with the proxy
    if (endpoint.startsWith('http')) {
      url = new URL(CORS_PROXY + endpoint);
    } else {
      // Otherwise, combine with the base URL which already includes the proxy
      url = new URL(endpoint, API_BASE_URL);
    }
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Prepare headers
    const headers = new Headers(init.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add header required by cors-anywhere
    headers.set('X-Requested-With', 'XMLHttpRequest');

    try {
      console.log(`Making request to: ${url.toString()}`); // Debug logging
      
      const response = await fetch(url.toString(), {
        ...init,
        headers,
        // Force mode to 'cors' to use the proxy correctly
        mode: 'cors',
      });

      // Handle unauthorized access
      if (response.status === 401) {
        // Clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Unauthorized');
      }

      // Handle non-2xx responses
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.status}`);
      }

      // Return null for 204 No Content
      if (response.status === 204) {
        return null as T;
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error); // Debug logging
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An error occurred');
    }
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async patch<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export as default
const apiService = new ApiService();
export default apiService; 