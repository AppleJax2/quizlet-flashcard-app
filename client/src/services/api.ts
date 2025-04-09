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

// Set the API base URL directly
const API_BASE_URL = ORIGINAL_API_URL;

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

    // Construct the URL using the base URL
    url = new URL(endpoint, API_BASE_URL);
    
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
    
    try {
      console.log(`Making request to: ${url.toString()}`); // Debug logging
      
      const response = await fetch(url.toString(), {
        ...init,
        headers,
        // Removed mode: 'cors'
      });

      console.log(`Response status: ${response.status}`);
      
      // For debugging, log the raw response text before parsing JSON
      const responseText = await response.text();
      console.log(`Response body: ${responseText}`);
      
      // Convert text back to response for further processing
      const responseData = responseText ? JSON.parse(responseText) : null;

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
        // Use the already parsed response data
        const errorData = responseData || {};
        
        // Special case: if the response has success=true, don't treat it as an error
        // This handles cases where the API returns success data with a non-2XX status code
        if (errorData.success === true) {
          return errorData;
        }
        
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      // Return null for 204 No Content
      if (response.status === 204) {
        return null as T;
      }

      return responseData;
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