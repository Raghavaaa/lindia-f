import { api } from '@/lib/api-client';
import { JuniorQuery, JuniorResponse, BaseResponse } from './types';

const JUNIOR_ENDPOINT = '/api/junior';

export const juniorService = {
  // Ask AI legal assistant a question
  ask: async (query: JuniorQuery): Promise<JuniorResponse> => {
    const response = await api.post<BaseResponse<JuniorResponse>>(
      `${JUNIOR_ENDPOINT}/ask`,
      query
    );
    return response.data.data;
  },

  // Get conversation history
  getConversations: async (caseId?: string): Promise<Record<string, unknown>[]> => {
    const response = await api.get<BaseResponse<Record<string, unknown>[]>>(
      `${JUNIOR_ENDPOINT}/conversations`,
      { params: { caseId } }
    );
    return response.data.data;
  },

  // Get conversation by ID
  getConversationById: async (id: string): Promise<Record<string, unknown>> => {
    const response = await api.get<BaseResponse<Record<string, unknown>>>(
      `${JUNIOR_ENDPOINT}/conversations/${id}`
    );
    return response.data.data;
  },

  // Clear conversation history
  clearConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`${JUNIOR_ENDPOINT}/conversations/${conversationId}`);
  },

  // Get suggested questions based on context
  getSuggestedQuestions: async (context: string): Promise<string[]> => {
    const response = await api.post<BaseResponse<string[]>>(
      `${JUNIOR_ENDPOINT}/suggest-questions`,
      { context }
    );
    return response.data.data;
  },
};

