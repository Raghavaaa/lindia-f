// Global configuration for frontend
export const config = {
  apiBase: process.env.NEXT_PUBLIC_FRONTEND_API_BASE || 'https://api.legalindia.ai',
  environment: process.env.NEXT_PUBLIC_FRONTEND_ENV || 'production',
  
  // API endpoints
  endpoints: {
    health: '/',
    auth: {
      google: '/api/v1/auth/google',
      me: '/api/v1/me',
    },
    clients: '/clients',
    research: {
      run: '/api/v1/research/run',
      save: '/api/v1/research/save',
      history: '/api/v1/research/history',
    },
    admin: {
      prompt: '/api/v1/admin/prompt',
    },
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${config.apiBase}${endpoint}`;
};

// JWT Token Management
const TOKEN_KEY = 'legalindia_jwt_token';

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// CORS-safe fetch wrapper with automatic JWT token injection
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  // Get JWT token from localStorage
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // Add JWT token if available
    ...options.headers,
  };
  
  const defaultOptions: RequestInit = {
    headers: defaultHeaders,
    credentials: 'include', // For cookies
  };

  return fetch(url, { ...defaultOptions, ...options });
};
