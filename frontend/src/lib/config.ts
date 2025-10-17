// Global configuration for frontend
export const config = {
  apiBase: process.env.NEXT_PUBLIC_FRONTEND_API_BASE || 'https://api.legalindia.ai',
  environment: process.env.NEXT_PUBLIC_FRONTEND_ENV || 'production',
  
  // API Key for authentication (replaces JWT)
  apiKey: process.env.NEXT_PUBLIC_API_KEY || 'legalindia_secure_api_key_2025',
  
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

// Get API Key - Simple and reliable
export const getApiKey = (): string => {
  return config.apiKey;
};

// API Fetch wrapper - automatically includes API key
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  const apiKey = getApiKey();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,  // Use API key instead of JWT
    ...options.headers,
  };

  const defaultOptions: RequestInit = {
    headers: defaultHeaders,
    credentials: 'include',
  };

  return fetch(url, { ...defaultOptions, ...options });
};

// Check if API is accessible
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiFetch('/');
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
