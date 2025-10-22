// Global configuration for frontend
export const config = {
  apiBase: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  environment: process.env.NEXT_PUBLIC_ENV || 'production',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || 'demo_api_key_12345',
  
  // Timeout configurations (in milliseconds)
  timeouts: {
    health: 5000,      // 5 seconds for health checks
    standard: 90000,   // 90 seconds for standard API calls
    quick: 30000,      // 30 seconds for quick operations
  },
  
  // API endpoints
  endpoints: {
    health: '/health',
    research: '/api/v1/research/',
    junior: '/api/v1/junior/',
    property: '/api/v1/property-opinion/',
    case: '/api/v1/cases/',
    storage: '/api/storage',
    clients: '/api/v1/clients',
    clientsCreate: '/api/v1/clients',
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

// CORS-safe fetch wrapper with extended timeout and network error handling
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = config.timeouts.standard
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': config.apiKey,
      ...options.headers,
    },
    credentials: 'include',
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('REQUEST_TIMEOUT: The request took too long. Please try again.');
      }
      if (error.message.includes('fetch')) {
        throw new Error('NETWORK_ERROR: Unable to reach backend. Please check your connection.');
      }
    }
    throw error;
  }
};

// Fetch with retry logic
export const apiFetchWithRetry = async (
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = config.timeouts.standard,
  maxRetries: number = 1
): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiFetch(endpoint, options, timeoutMs);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff: 2s, 4s, 8s...)
        const waitTime = Math.min(2000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError || new Error('Failed after retries');
};

// Health check function
export const checkBackendHealth = async (): Promise<boolean> => {
  if (!isBackendConfigured()) {
    return false;
  }
  
  try {
    const response = await apiFetch(config.endpoints.health, {}, config.timeouts.health);
    return response.ok;
  } catch (error) {
    return false;
  }
};
