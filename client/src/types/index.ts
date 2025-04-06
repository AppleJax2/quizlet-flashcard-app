export * from './auth';
export * from './flashcards';
export * from './processor';
export * from './api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  page: number;
  totalPages: number;
} 