export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface QueryParams {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
} 