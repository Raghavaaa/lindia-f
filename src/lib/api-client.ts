import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from './config';

// Types for API responses
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBase,
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies/sessions
});

// Request interceptor - logging and setup (tokens handled by HttpOnly cookies)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request in development
    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('📦 Request Data:', config.data);
      }
    }

    // Ensure credentials are included for cookie-based auth
    config.withCredentials = true;

    // Add timestamp to prevent caching for GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error: AxiosError) => {
    // Request Error - handled by error boundary
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      // API Error - handled by error boundary
    }

    // Handle different error scenarios
    if (!error.response) {
      // Network error
      // Network Error: Unable to reach the server
      return Promise.reject({
        message: 'Network error. Please check your connection and ensure the backend is running.',
        status: 0,
        details: error.message,
      } as ApiError);
    }

    const status = error.response.status;
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    switch (status) {
      case 401:
        // Unauthorized - clear user data and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          // Only redirect if not already on login or auth pages
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/auth/')) {
            // Store intended destination
            sessionStorage.setItem('redirect_after_login', window.location.pathname);
            window.location.href = '/login';
          }
        }
        return Promise.reject({
          message: 'Session expired. Please login again.',
          status,
          details: error.response.data,
        } as ApiError);

      case 403:
        return Promise.reject({
          message: 'Access denied. You do not have permission to perform this action.',
          status,
          details: error.response.data,
        } as ApiError);

      case 404:
        return Promise.reject({
          message: 'Resource not found.',
          status,
          details: error.response.data,
        } as ApiError);

      case 422:
        return Promise.reject({
          message: 'Validation error. Please check your input.',
          status,
          details: error.response.data,
        } as ApiError);

      case 429:
        return Promise.reject({
          message: 'Too many requests. Please try again later.',
          status,
          details: error.response.data,
        } as ApiError);

      case 500:
      case 502:
      case 503:
      case 504:
        return Promise.reject({
          message: 'Server error. Please try again later.',
          status,
          details: error.response.data,
        } as ApiError);

      default:
        return Promise.reject({
          message: (error.response.data as { message?: string })?.message || 'An unexpected error occurred.',
          status,
          details: error.response.data,
        } as ApiError);
    }
  }
);

// Wrapper functions for different HTTP methods
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

// Helper to check if backend is reachable
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

export default apiClient;

