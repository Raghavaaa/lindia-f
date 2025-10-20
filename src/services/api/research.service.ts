import { api } from '@/lib/api-client';
import { ResearchQuery, ResearchResponse, BaseResponse } from './types';

const RESEARCH_ENDPOINT = '/api/research';

export const researchService = {
  // Perform legal research
  search: async (query: ResearchQuery): Promise<ResearchResponse> => {
    const response = await api.post<BaseResponse<ResearchResponse>>(
      `${RESEARCH_ENDPOINT}/search`,
      query
    );
    return response.data.data;
  },

  // Get research history
  getHistory: async (limit = 10): Promise<Record<string, unknown>[]> => {
    const response = await api.get<BaseResponse<Record<string, unknown>[]>>(
      `${RESEARCH_ENDPOINT}/history`,
      { params: { limit } }
    );
    return response.data.data;
  },

  // Get saved research by ID
  getById: async (id: string): Promise<ResearchResponse> => {
    const response = await api.get<BaseResponse<ResearchResponse>>(
      `${RESEARCH_ENDPOINT}/${id}`
    );
    return response.data.data;
  },

  // Save research results
  save: async (researchId: string, name: string): Promise<Record<string, unknown>> => {
    const response = await api.post<BaseResponse<Record<string, unknown>>>(
      `${RESEARCH_ENDPOINT}/save`,
      { researchId, name }
    );
    return response.data.data;
  },

  // Delete saved research
  delete: async (id: string): Promise<void> => {
    await api.delete(`${RESEARCH_ENDPOINT}/${id}`);
  },
};

