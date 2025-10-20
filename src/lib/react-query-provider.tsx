'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

// Configure React Query defaults
const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Stale time: data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: unused data stays in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in production
      refetchOnWindowFocus: process.env.NEXT_PUBLIC_ENV === 'production',
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      // Error handling
      throwOnError: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
};

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // Create query client instance on component mount
  // This ensures each request gets a fresh client
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query devtools in development only */}
      {process.env.NEXT_PUBLIC_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

// Export for use in components
export { QueryClient };

