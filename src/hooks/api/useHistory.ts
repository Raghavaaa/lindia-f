import { useQuery } from '@tanstack/react-query';
import { historyService } from '@/services/api';
import { HistoryQuery } from '@/services/api/types';

// Query keys for caching
export const historyKeys = {
  all: ['history'] as const,
  logs: (query?: HistoryQuery) => [...historyKeys.all, 'logs', query] as const,
  log: (id: string) => [...historyKeys.all, 'log', id] as const,
  entityLogs: (entityType: string, entityId: string) => 
    [...historyKeys.all, 'entity', entityType, entityId] as const,
  userActivity: (userId: string, limit: number) => 
    [...historyKeys.all, 'user', userId, limit] as const,
  recent: (limit: number) => [...historyKeys.all, 'recent', limit] as const,
};

// Get activity logs
export function useActivityLogs(query?: HistoryQuery) {
  return useQuery({
    queryKey: historyKeys.logs(query),
    queryFn: () => historyService.getLogs(query),
  });
}

// Get activity log by ID
export function useActivityLogById(id: string, enabled = true) {
  return useQuery({
    queryKey: historyKeys.log(id),
    queryFn: () => historyService.getLogById(id),
    enabled: enabled && !!id,
  });
}

// Get logs for specific entity
export function useEntityLogs(entityType: string, entityId: string, enabled = true) {
  return useQuery({
    queryKey: historyKeys.entityLogs(entityType, entityId),
    queryFn: () => historyService.getEntityLogs(entityType, entityId),
    enabled: enabled && !!entityType && !!entityId,
  });
}

// Get user activity
export function useUserActivity(userId: string, limit = 50, enabled = true) {
  return useQuery({
    queryKey: historyKeys.userActivity(userId, limit),
    queryFn: () => historyService.getUserActivity(userId, limit),
    enabled: enabled && !!userId,
  });
}

// Get recent activity
export function useRecentActivity(limit = 20) {
  return useQuery({
    queryKey: historyKeys.recent(limit),
    queryFn: () => historyService.getRecent(limit),
  });
}

