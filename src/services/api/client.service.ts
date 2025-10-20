import { api } from '@/lib/api-client';
import { Client, CreateClientRequest, UpdateClientRequest, BaseResponse, PaginatedResponse } from './types';

const CLIENT_ENDPOINT = '/api/clients';

export const clientService = {
  // Get all clients with pagination
  getAll: async (page = 1, pageSize = 20): Promise<PaginatedResponse<Client>> => {
    const response = await api.get<BaseResponse<PaginatedResponse<Client>>>(
      CLIENT_ENDPOINT,
      { params: { page, pageSize } }
    );
    return response.data.data;
  },

  // Get client by ID
  getById: async (id: string): Promise<Client> => {
    const response = await api.get<BaseResponse<Client>>(`${CLIENT_ENDPOINT}/${id}`);
    return response.data.data;
  },

  // Create new client
  create: async (data: CreateClientRequest): Promise<Client> => {
    const response = await api.post<BaseResponse<Client>>(CLIENT_ENDPOINT, data);
    return response.data.data;
  },

  // Update client
  update: async (id: string, data: UpdateClientRequest): Promise<Client> => {
    const response = await api.put<BaseResponse<Client>>(`${CLIENT_ENDPOINT}/${id}`, data);
    return response.data.data;
  },

  // Delete client
  delete: async (id: string): Promise<void> => {
    await api.delete(`${CLIENT_ENDPOINT}/${id}`);
  },

  // Search clients
  search: async (query: string): Promise<Client[]> => {
    const response = await api.get<BaseResponse<Client[]>>(
      `${CLIENT_ENDPOINT}/search`,
      { params: { q: query } }
    );
    return response.data.data;
  },

  // Get active clients
  getActive: async (): Promise<Client[]> => {
    const response = await api.get<BaseResponse<Client[]>>(
      `${CLIENT_ENDPOINT}/active`
    );
    return response.data.data;
  },
};

