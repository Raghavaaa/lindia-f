// Global configuration for frontend
export const config = {
  apiBase: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  environment: process.env.NEXT_PUBLIC_ENV || 'production',
  
  // API endpoints
  endpoints: {
    health: '/health',
    research: '/api/v1/research/',
    junior: '/api/v1/junior/',
    storage: '/api/storage',
  },
} as const;

// Check if backend URL is configured
export const isBackendConfigured = (): boolean => {
  return !!config.apiBase && config.apiBase.trim() !== '';
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  if (!isBackendConfigured()) {
    throw new Error('BACKEND_URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.');
  }
  return `${config.apiBase}${endpoint}`;
};

// CORS-safe fetch wrapper with network error handling
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
    credentials: 'include',
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('NETWORK_ERROR: Unable to reach backend. Please check your connection.');
    }
    throw error;
  }
};

// Health check function
export const checkBackendHealth = async (): Promise<boolean> => {
  if (!isBackendConfigured()) {
    return false;
  }
  
  try {
    const response = await fetch(buildApiUrl(config.endpoints.health), {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
