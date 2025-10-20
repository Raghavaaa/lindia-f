import { api } from '@/lib/api-client';
import { PropertyOpinionRequest, PropertyOpinionResponse, BaseResponse } from './types';

const PROPERTY_ENDPOINT = '/api/property';

export const propertyService = {
  // Request property opinion
  requestOpinion: async (data: PropertyOpinionRequest): Promise<PropertyOpinionResponse> => {
    const response = await api.post<BaseResponse<PropertyOpinionResponse>>(
      `${PROPERTY_ENDPOINT}/opinion`,
      data
    );
    return response.data.data;
  },

  // Get opinion by ID
  getOpinionById: async (id: string): Promise<PropertyOpinionResponse> => {
    const response = await api.get<BaseResponse<PropertyOpinionResponse>>(
      `${PROPERTY_ENDPOINT}/opinion/${id}`
    );
    return response.data.data;
  },

  // Get all opinions
  getOpinions: async (page = 1, pageSize = 20): Promise<Record<string, unknown>> => {
    const response = await api.get<BaseResponse<Record<string, unknown>>>(
      `${PROPERTY_ENDPOINT}/opinions`,
      { params: { page, pageSize } }
    );
    return response.data.data;
  },

  // Update opinion status
  updateOpinionStatus: async (id: string, status: string): Promise<PropertyOpinionResponse> => {
    const response = await api.patch<BaseResponse<PropertyOpinionResponse>>(
      `${PROPERTY_ENDPOINT}/opinion/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  // Delete opinion
  deleteOpinion: async (id: string): Promise<void> => {
    await api.delete(`${PROPERTY_ENDPOINT}/opinion/${id}`);
  },
};

