import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Standard API response wrapper for consistent error handling
 */
export interface ApiResponse<T = any> {
  data: T;
  error: ApiError | null;
  status: number;
  headers: any;
}

/**
 * Standardized API error format
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

/**
 * Retry configuration for failed requests
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryStatusCodes: number[];
}

/**
 * API Client class for handling all server communication
 */
class ApiClient {
  private instance: AxiosInstance;
  private authTokenKey = 'token';
  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryStatusCodes: [408, 429, 500, 502, 503, 504]
  };

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  /**
   * Configure request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = localStorage.getItem(this.authTokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add timestamp to prevent caching
        config.params = {
          ...config.params,
          _t: Date.now()
        };

        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Handle token expiration - redirect to login if unauthorized
        if (error.response?.status === 401) {
          // If on a protected route, redirect to login
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem(this.authTokenKey);
            // Only redirect if not already on login page
            window.location.href = '/login?session=expired';
          }
          return Promise.reject(error);
        }
        
        // Handle retries for server errors
        if (
          originalRequest &&
          !originalRequest._retry &&
          this.defaultRetryConfig.retryStatusCodes.includes(error.response?.status || 0)
        ) {
          originalRequest._retry = true;
          return this.retryRequest(originalRequest);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Retry a failed request with exponential backoff
   */
  private async retryRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    let retryCount = 0;
    let lastError: any;

    while (retryCount < this.defaultRetryConfig.maxRetries) {
      try {
        // Wait before retrying
        await new Promise(resolve => 
          setTimeout(resolve, this.defaultRetryConfig.retryDelay * Math.pow(2, retryCount))
        );
        
        // Attempt the request again
        return await this.instance(config);
      } catch (error) {
        retryCount++;
        lastError = error;
        console.warn(`Retry attempt ${retryCount}/${this.defaultRetryConfig.maxRetries} failed`);
      }
    }

    return Promise.reject(lastError);
  }

  /**
   * Process API response and standardize error handling
   */
  private processResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      error: null,
      status: response.status,
      headers: response.headers
    };
  }

  /**
   * Process API error and standardize error format
   */
  private processError(error: any): ApiResponse<any> {
    const apiError: ApiError = {
      code: 'unknown_error',
      message: 'An unexpected error occurred',
      statusCode: 500
    };

    if (error.response) {
      // Server responded with an error status code
      apiError.statusCode = error.response.status;
      apiError.code = error.response.data?.code || `error_${error.response.status}`;
      apiError.message = error.response.data?.message || error.message;
      apiError.details = error.response.data?.details;
    } else if (error.request) {
      // Request was made but no response received
      apiError.code = 'network_error';
      apiError.message = 'Network error - server unreachable';
      apiError.statusCode = 0;
    } else {
      // Error setting up the request
      apiError.code = 'request_configuration_error';
      apiError.message = error.message;
    }

    return {
      data: null as any,
      error: apiError,
      status: apiError.statusCode,
      headers: {}
    };
  }

  /**
   * Make GET request to API
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, config);
      return this.processResponse<T>(response);
    } catch (error) {
      return this.processError(error);
    }
  }

  /**
   * Make POST request to API
   */
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      // Special handling for registration
      if (url === '/auth/register') {
        // Ensure all required fields are present
        const { email, password, username, confirmPassword } = data;
        if (!email || !password || !username || !confirmPassword) {
          return this.processError({
            response: {
              status: 400,
              data: {
                code: 'validation_error',
                message: 'All fields are required for registration',
                details: { missing: Object.entries({ email, password, username, confirmPassword })
                  .filter(([_, v]) => !v)
                  .map(([k]) => k) }
              }
            }
          });
        }
      }
      
      const response = await this.instance.post<T>(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/json'
        }
      });
      return this.processResponse<T>(response);
    } catch (error) {
      return this.processError(error);
    }
  }

  /**
   * Make PUT request to API
   */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<T>(url, data, config);
      return this.processResponse<T>(response);
    } catch (error) {
      return this.processError(error);
    }
  }

  /**
   * Make PATCH request to API
   */
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch<T>(url, data, config);
      return this.processResponse<T>(response);
    } catch (error) {
      return this.processError(error);
    }
  }

  /**
   * Make DELETE request to API
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<T>(url, config);
      return this.processResponse<T>(response);
    } catch (error) {
      return this.processError(error);
    }
  }

  /**
   * Upload a file to the API with progress tracking
   */
  public async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (percentage: number) => void,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentage);
          }
        },
      };

      const response = await this.instance.post<T>(url, formData, uploadConfig);
      return this.processResponse<T>(response);
    } catch (error) {
      return this.processError(error);
    }
  }

  /**
   * Download a file from the API 
   */
  public async downloadFile(
    url: string,
    params?: Record<string, any>,
    responseType: 'blob' | 'arraybuffer' = 'blob',
    onProgress?: (percentage: number) => void
  ): Promise<Blob | ArrayBuffer> {
    try {
      const response = await this.instance.get(url, {
        params,
        responseType,
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentage);
          }
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set the authentication token
   */
  public setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  /**
   * Clear the authentication token
   */
  public clearAuthToken(): void {
    localStorage.removeItem(this.authTokenKey);
    delete this.instance.defaults.headers.common.Authorization;
  }

  /**
   * Get the current authentication token
   */
  public getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  /**
   * Check if the user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Create and export the API client instance
const apiClient = new ApiClient();
export default apiClient; 