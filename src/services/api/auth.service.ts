import { api } from '@/lib/api-client';
import { LoginRequest, LoginResponse, RegisterRequest, User, BaseResponse } from './types';

const AUTH_ENDPOINT = '/api/auth';

export const authService = {
  // Google Auth - Redirect to backend Google OAuth
  initiateGoogleAuth: (): void => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    const redirectUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${backendUrl}/api/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;
  },

  // Handle Google Auth callback
  handleGoogleCallback: async (code: string): Promise<LoginResponse> => {
    const response = await api.post<BaseResponse<LoginResponse>>(
      `${AUTH_ENDPOINT}/google/callback`,
      { code },
      { withCredentials: true } // Important for HttpOnly cookies
    );
    
    // Store user data (tokens are in HttpOnly cookies)
    if (typeof window !== 'undefined' && response.data.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<BaseResponse<LoginResponse>>(
      `${AUTH_ENDPOINT}/login`,
      credentials,
      { withCredentials: true } // Important for HttpOnly cookies
    );
    
    // Store user data (tokens are in HttpOnly cookies)
    if (typeof window !== 'undefined' && response.data.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  // Register
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<BaseResponse<LoginResponse>>(
      `${AUTH_ENDPOINT}/register`,
      data,
      { withCredentials: true } // Important for HttpOnly cookies
    );
    
    // Store user data (tokens are in HttpOnly cookies)
    if (typeof window !== 'undefined' && response.data.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post(`${AUTH_ENDPOINT}/logout`, {}, { withCredentials: true });
    } finally {
      // Always clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<BaseResponse<User>>(`${AUTH_ENDPOINT}/me`);
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post<BaseResponse<LoginResponse>>(
      `${AUTH_ENDPOINT}/refresh`,
      {},
      { withCredentials: true } // Important for HttpOnly cookies
    );
    
    // Update user data if changed
    if (typeof window !== 'undefined' && response.data.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  // Check if user is authenticated (check for user data, cookies handled by backend)
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const user = localStorage.getItem('user');
    return !!user;
  },

  // Get stored user
  getStoredUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

