import { api } from '@/lib/api-client';
import { HealthCheckResponse, BaseResponse } from './types';

const HEALTH_ENDPOINT = '/health';

export const healthService = {
  // Check API health
  check: async (): Promise<HealthCheckResponse> => {
    const response = await api.get<BaseResponse<HealthCheckResponse>>(HEALTH_ENDPOINT);
    return response.data.data;
  },

  // Ping server
  ping: async (): Promise<boolean> => {
    try {
      await api.get(HEALTH_ENDPOINT);
      return true;
    } catch {
      return false;
    }
  },
};

