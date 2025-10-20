import { useQuery } from '@tanstack/react-query';
import { healthService } from '@/services/api';

// Query keys for caching
export const healthKeys = {
  all: ['health'] as const,
  check: () => [...healthKeys.all, 'check'] as const,
  ping: () => [...healthKeys.all, 'ping'] as const,
};

// Check API health
export function useHealthCheck(enabled = true) {
  return useQuery({
    queryKey: healthKeys.check(),
    queryFn: () => healthService.check(),
    enabled,
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
  });
}

// Ping server
export function useServerPing(enabled = true) {
  return useQuery({
    queryKey: healthKeys.ping(),
    queryFn: () => healthService.ping(),
    enabled,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  });
}

