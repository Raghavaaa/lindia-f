// Global configuration for frontend
export const config = {
  apiBase: process.env.NEXT_PUBLIC_FRONTEND_API_BASE || 'https://api.legalindia.ai',
  environment: process.env.NEXT_PUBLIC_FRONTEND_ENV || 'production',
  
  // API endpoints
  endpoints: {
    health: '/api/v1/health',
    auth: {
      google: '/api/v1/auth/google',
      me: '/api/v1/me',
    },
    clients: '/api/v1/clients',
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

// CORS-safe fetch wrapper
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // For JWT cookies
  };

  return fetch(url, { ...defaultOptions, ...options });
};
