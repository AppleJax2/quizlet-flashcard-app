import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { useToast } from '@/hooks/useToast';

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// API client configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create API client class
export class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  // Singleton pattern
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Setup interceptors for request/response handling
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        const { toast } = useToast();
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data as ApiResponse;

          // Handle specific error cases
          switch (status) {
            case 401:
              // Unauthorized - clear token and redirect to login
              localStorage.removeItem('token');
              window.location.href = '/login';
              break;
            case 403:
              toast({
                title: 'Access Denied',
                description: data.message || 'You do not have permission to perform this action',
                variant: 'destructive',
              });
              break;
            case 429:
              toast({
                title: 'Rate Limited',
                description: data.message || 'Too many requests. Please try again later',
                variant: 'destructive',
              });
              break;
            default:
              toast({
                title: 'Error',
                description: data.message || 'An unexpected error occurred',
                variant: 'destructive',
              });
          }
        } else if (error.request) {
          // Network error
          toast({
            title: 'Network Error',
            description: 'Unable to connect to the server. Please check your internet connection',
            variant: 'destructive',
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<any, ApiResponse<T>>(config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }
} 