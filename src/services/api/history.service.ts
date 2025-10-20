import { api } from '@/lib/api-client';
import { ActivityLog, HistoryQuery, BaseResponse, PaginatedResponse } from './types';

const HISTORY_ENDPOINT = '/api/history';

export const historyService = {
  // Get activity logs
  getLogs: async (query?: HistoryQuery): Promise<PaginatedResponse<ActivityLog>> => {
    const response = await api.get<BaseResponse<PaginatedResponse<ActivityLog>>>(
      HISTORY_ENDPOINT,
      { params: query }
    );
    return response.data.data;
  },

  // Get activity log by ID
  getLogById: async (id: string): Promise<ActivityLog> => {
    const response = await api.get<BaseResponse<ActivityLog>>(`${HISTORY_ENDPOINT}/${id}`);
    return response.data.data;
  },

  // Get logs for specific entity
  getEntityLogs: async (entityType: string, entityId: string): Promise<ActivityLog[]> => {
    const response = await api.get<BaseResponse<ActivityLog[]>>(
      `${HISTORY_ENDPOINT}/entity/${entityType}/${entityId}`
    );
    return response.data.data;
  },

  // Get user activity
  getUserActivity: async (userId: string, limit = 50): Promise<ActivityLog[]> => {
    const response = await api.get<BaseResponse<ActivityLog[]>>(
      `${HISTORY_ENDPOINT}/user/${userId}`,
      { params: { limit } }
    );
    return response.data.data;
  },

  // Get recent activity
  getRecent: async (limit = 20): Promise<ActivityLog[]> => {
    const response = await api.get<BaseResponse<ActivityLog[]>>(
      `${HISTORY_ENDPOINT}/recent`,
      { params: { limit } }
    );
    return response.data.data;
  },
};

