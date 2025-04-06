import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig, ApiError, ApiResponse, QueryParams } from '@/types';

// Default API configuration
const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class ApiService {
  private instance: AxiosInstance;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: ApiConfig = defaultConfig) {
    // Create Axios instance
    this.instance = axios.create(config);

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Get token from local storage
        const token = localStorage.getItem('token');
        
        // If token exists, add it to the headers
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(this.handleError(error))
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => Promise.reject(this.handleError(error))
    );
  }

  // Handle API errors
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // The request was made and the server responded with an error status
      const data = error.response.data as any;
      return {
        code: data.error?.code || 'API_ERROR',
        message: data.message || 'An error occurred',
        status: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        code: 'NETWORK_ERROR',
        message: 'No response received from server',
        status: 0,
      };
    } else {
      // Something happened in setting up the request
      return {
        code: 'REQUEST_ERROR',
        message: error.message || 'Error setting up request',
        status: 0,
      };
    }
  }

  // Cancel ongoing requests with the same key
  private createAbortController(key?: string): AbortController {
    // If no key provided, just return a new controller
    if (!key) return new AbortController();

    // If a key is provided, cancel any existing request with this key
    if (this.abortControllers.has(key)) {
      this.abortControllers.get(key)!.abort();
    }

    // Create a new controller
    const controller = new AbortController();
    this.abortControllers.set(key, controller);
    return controller;
  }

  // Format URL with query parameters
  private formatUrl(url: string, params?: QueryParams): string {
    if (!params) return url;

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
      })
      .join('&');

    return queryString ? `${url}?${queryString}` : url;
  }

  // GET request
  async get<T>(url: string, params?: QueryParams, options?: {
    abortKey?: string;
    config?: AxiosRequestConfig;
  }): Promise<ApiResponse<T>> {
    const controller = this.createAbortController(options?.abortKey);
    const formattedUrl = this.formatUrl(url, params);
    
    return this.instance.get<any, ApiResponse<T>>(formattedUrl, {
      ...options?.config,
      signal: controller.signal,
    });
  }

  // POST request
  async post<T>(url: string, data?: any, options?: {
    abortKey?: string;
    config?: AxiosRequestConfig;
  }): Promise<ApiResponse<T>> {
    const controller = this.createAbortController(options?.abortKey);
    
    return this.instance.post<any, ApiResponse<T>>(url, data, {
      ...options?.config,
      signal: controller.signal,
    });
  }

  // PUT request
  async put<T>(url: string, data?: any, options?: {
    abortKey?: string;
    config?: AxiosRequestConfig;
  }): Promise<ApiResponse<T>> {
    const controller = this.createAbortController(options?.abortKey);
    
    return this.instance.put<any, ApiResponse<T>>(url, data, {
      ...options?.config,
      signal: controller.signal,
    });
  }

  // DELETE request
  async delete<T>(url: string, options?: {
    abortKey?: string;
    config?: AxiosRequestConfig;
  }): Promise<ApiResponse<T>> {
    const controller = this.createAbortController(options?.abortKey);
    
    return this.instance.delete<any, ApiResponse<T>>(url, {
      ...options?.config,
      signal: controller.signal,
    });
  }

  // Upload file
  async uploadFile<T>(url: string, file: File, additionalData?: Record<string, any>, options?: {
    abortKey?: string;
    config?: AxiosRequestConfig;
    onProgress?: (progress: number) => void;
  }): Promise<ApiResponse<T>> {
    const controller = this.createAbortController(options?.abortKey);
    const formData = new FormData();
    
    // Append the file
    formData.append('file', file);
    
    // Append additional data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }
    
    // Configure the request with upload progress tracking
    const uploadConfig: AxiosRequestConfig = {
      ...options?.config,
      signal: controller.signal,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (options?.onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options.onProgress(progress);
        }
      },
    };
    
    return this.instance.post<any, ApiResponse<T>>(url, formData, uploadConfig);
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService; 