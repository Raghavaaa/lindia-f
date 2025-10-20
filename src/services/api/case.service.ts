import { api } from '@/lib/api-client';
import { Case, CreateCaseRequest, UpdateCaseRequest, BaseResponse, PaginatedResponse } from './types';

const CASE_ENDPOINT = '/api/cases';

export const caseService = {
  // Get all cases with pagination
  getAll: async (page = 1, pageSize = 20, filters?: Record<string, unknown>): Promise<PaginatedResponse<Case>> => {
    const response = await api.get<BaseResponse<PaginatedResponse<Case>>>(
      CASE_ENDPOINT,
      { params: { page, pageSize, ...filters } }
    );
    return response.data.data;
  },

  // Get case by ID
  getById: async (id: string): Promise<Case> => {
    const response = await api.get<BaseResponse<Case>>(`${CASE_ENDPOINT}/${id}`);
    return response.data.data;
  },

  // Create new case
  create: async (data: CreateCaseRequest): Promise<Case> => {
    const response = await api.post<BaseResponse<Case>>(CASE_ENDPOINT, data);
    return response.data.data;
  },

  // Update case
  update: async (id: string, data: UpdateCaseRequest): Promise<Case> => {
    const response = await api.put<BaseResponse<Case>>(`${CASE_ENDPOINT}/${id}`, data);
    return response.data.data;
  },

  // Delete case
  delete: async (id: string): Promise<void> => {
    await api.delete(`${CASE_ENDPOINT}/${id}`);
  },

  // Get cases by client ID
  getByClient: async (clientId: string): Promise<Case[]> => {
    const response = await api.get<BaseResponse<Case[]>>(
      `${CASE_ENDPOINT}/client/${clientId}`
    );
    return response.data.data;
  },

  // Get case statistics
  getStats: async (): Promise<Record<string, unknown>> => {
    const response = await api.get<BaseResponse<Record<string, unknown>>>(`${CASE_ENDPOINT}/stats`);
    return response.data.data;
  },

  // Search cases
  search: async (query: string): Promise<Case[]> => {
    const response = await api.get<BaseResponse<Case[]>>(
      `${CASE_ENDPOINT}/search`,
      { params: { q: query } }
    );
    return response.data.data;
  },
};

