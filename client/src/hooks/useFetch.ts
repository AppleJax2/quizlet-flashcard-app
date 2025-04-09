import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError, ApiResponse } from '@/api/apiClient';

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
}

export interface FetchOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  retryCount?: number;
  retryDelay?: number;
  cacheTime?: number | false;
  cacheKey?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  keepPreviousData?: boolean;
  fetchOnMount?: boolean;
}

/**
 * Custom hook for making API requests with built-in caching, retries, and state management
 * 
 * @param fetchFn The API request function to call
 * @param params Parameters to pass to the fetch function
 * @param options Configuration options for the request
 */
export function useFetch<TData = any, TParams extends any[] = any[]>(
  fetchFn: (...params: TParams) => Promise<ApiResponse<TData>>,
  params: TParams,
  options: FetchOptions = {}
) {
  const {
    enabled = true,
    refetchInterval = false,
    retryCount = 3,
    retryDelay = 1000,
    cacheTime = DEFAULT_CACHE_TIME,
    cacheKey,
    onSuccess,
    onError,
    keepPreviousData = false,
    fetchOnMount = true,
  } = options;

  const [state, setState] = useState<FetchState<TData>>({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const paramsRef = useRef(params);
  const retryCountRef = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);
  const refetchIntervalId = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Calculate a cache key if none provided
  const derivedCacheKey = cacheKey || 
    `${fetchFn.name}-${JSON.stringify(params)}`;

  // Memoize the fetch function  
  const executeFetch = useCallback(async (isRetry = false): Promise<void> => {
    // If not enabled, don't fetch
    if (!enabled) {
      if (!keepPreviousData) {
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
      return;
    }

    // Check cache first (only on first attempt, not on retries)
    if (cacheTime !== false && !isRetry) {
      const cachedResponse = cache.get(derivedCacheKey);
      
      if (
        cachedResponse && 
        Date.now() - cachedResponse.timestamp < (cacheTime || DEFAULT_CACHE_TIME)
      ) {
        setState({
          data: cachedResponse.data,
          isLoading: false,
          isError: false,
          error: null,
          isSuccess: true,
        });
        
        onSuccess?.(cachedResponse.data);
        return;
      }
    }

    // Setup abort controller for this request
    if (activeRequest.current) {
      activeRequest.current.abort();
    }
    activeRequest.current = new AbortController();

    // Set loading state
    if (!isRetry) {
      setState(prev => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));
    }

    try {
      const response = await fetchFn(...paramsRef.current);

      // Handle response
      if (response.error) {
        if (!isMounted.current) return;

        // Handle retry logic
        if (
          isRetry && 
          retryCountRef.current < retryCount &&
          response.status >= 500  // Only retry server errors
        ) {
          retryCountRef.current++;
          
          setTimeout(() => {
            executeFetch(true);
          }, retryDelay * Math.pow(2, retryCountRef.current - 1)); // Exponential backoff
          
          return;
        }

        setState({
          data: keepPreviousData ? state.data : null,
          isLoading: false,
          isError: true,
          error: response.error,
          isSuccess: false,
        });
        
        onError?.(response.error);
        return;
      }

      // Successful response
      if (!isMounted.current) return;
      
      setState({
        data: response.data,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      });
      
      // Cache the result if caching is enabled
      if (cacheTime !== false) {
        cache.set(derivedCacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }
      
      onSuccess?.(response.data);
      retryCountRef.current = 0;
    } catch (error) {
      if (!isMounted.current) return;
      
      const apiError: ApiError = {
        code: 'unexpected_error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        statusCode: 500,
      };

      // Handle retry logic for unexpected errors
      if (isRetry && retryCountRef.current < retryCount) {
        retryCountRef.current++;
        
        setTimeout(() => {
          executeFetch(true);
        }, retryDelay * Math.pow(2, retryCountRef.current - 1)); // Exponential backoff
        
        return;
      }

      setState({
        data: keepPreviousData ? state.data : null,
        isLoading: false,
        isError: true,
        error: apiError,
        isSuccess: false,
      });
      
      onError?.(apiError);
    }
  }, [derivedCacheKey, cacheTime, fetchFn, enabled, keepPreviousData, 
      retryCount, retryDelay, onSuccess, onError, state.data]);

  // Refresh data manually
  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    return executeFetch();
  }, [executeFetch]);

  // Setup refetch interval if enabled
  useEffect(() => {
    // Clear any existing interval
    if (refetchIntervalId.current) {
      clearInterval(refetchIntervalId.current);
      refetchIntervalId.current = null;
    }
    
    // Set up new interval if needed and we're enabled
    if (refetchInterval && enabled) {
      refetchIntervalId.current = setInterval(() => {
        retryCountRef.current = 0;
        executeFetch();
      }, refetchInterval);
    }

    return () => {
      if (refetchIntervalId.current) {
        clearInterval(refetchIntervalId.current);
      }
    };
  }, [refetchInterval, enabled, executeFetch]);

  // Fetch on mount if enabled
  useEffect(() => {
    isMounted.current = true;
    paramsRef.current = params; // Update params ref when they change
    
    if (fetchOnMount) {
      retryCountRef.current = 0;
      executeFetch();
    }

    return () => {
      isMounted.current = false;
      if (activeRequest.current) {
        activeRequest.current.abort();
      }
    };
  }, [fetchOnMount, params, executeFetch]);

  // Update params ref whenever they change
  useEffect(() => {
    paramsRef.current = params;
    
    // If params change, refetch
    if (
      enabled && 
      JSON.stringify(params) !== JSON.stringify(paramsRef.current)
    ) {
      retryCountRef.current = 0;
      executeFetch();
    }
  }, [params, enabled, executeFetch]);

  // Clear cache entry for this request when component unmounts
  useEffect(() => {
    return () => {
      if (cacheTime === 0) {
        cache.delete(derivedCacheKey);
      }
    };
  }, [derivedCacheKey, cacheTime]);

  return {
    ...state,
    refetch,
    isFetching: state.isLoading,
  };
}

/**
 * Manually clear the entire cache or a specific entry
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export default useFetch; 