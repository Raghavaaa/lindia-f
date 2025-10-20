import { api } from '@/lib/api-client';
import { Document, BaseResponse } from './types';

const DOCUMENT_ENDPOINT = '/api/documents';

export const documentService = {
  // Upload document
  upload: async (file: File, caseId?: string, metadata?: Record<string, unknown>): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    if (caseId) formData.append('caseId', caseId);
    if (metadata) formData.append('metadata', JSON.stringify(metadata));

    const response = await api.post<BaseResponse<Document>>(
      `${DOCUMENT_ENDPOINT}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Get document by ID
  getById: async (id: string): Promise<Document> => {
    const response = await api.get<BaseResponse<Document>>(`${DOCUMENT_ENDPOINT}/${id}`);
    return response.data.data;
  },

  // Get documents by case
  getByCaseId: async (caseId: string): Promise<Document[]> => {
    const response = await api.get<BaseResponse<Document[]>>(
      `${DOCUMENT_ENDPOINT}/case/${caseId}`
    );
    return response.data.data;
  },

  // Get all documents
  getAll: async (page = 1, pageSize = 20): Promise<Record<string, unknown>> => {
    const response = await api.get<BaseResponse<Record<string, unknown>>>(
      DOCUMENT_ENDPOINT,
      { params: { page, pageSize } }
    );
    return response.data.data;
  },

  // Download document
  download: async (id: string): Promise<Blob> => {
    const response = await api.get(`${DOCUMENT_ENDPOINT}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete document
  delete: async (id: string): Promise<void> => {
    await api.delete(`${DOCUMENT_ENDPOINT}/${id}`);
  },

  // Search documents
  search: async (query: string): Promise<Document[]> => {
    const response = await api.get<BaseResponse<Document[]>>(
      `${DOCUMENT_ENDPOINT}/search`,
      { params: { q: query } }
    );
    return response.data.data;
  },
};

