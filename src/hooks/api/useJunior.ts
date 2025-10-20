import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { juniorService } from '@/services/api';
import { JuniorQuery } from '@/services/api/types';

// Query keys for caching
export const juniorKeys = {
  all: ['junior'] as const,
  conversations: () => [...juniorKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...juniorKeys.conversations(), id] as const,
  conversationsByCase: (caseId: string) => [...juniorKeys.conversations(), 'case', caseId] as const,
  suggestedQuestions: (context: string) => [...juniorKeys.all, 'suggestions', context] as const,
};

// Ask Junior AI assistant
export function useAskJunior() {
  return useMutation({
    mutationFn: (query: JuniorQuery) => juniorService.ask(query),
  });
}

// Get conversations
export function useConversations(caseId?: string) {
  return useQuery({
    queryKey: caseId ? juniorKeys.conversationsByCase(caseId) : juniorKeys.conversations(),
    queryFn: () => juniorService.getConversations(caseId),
  });
}

// Get conversation by ID
export function useConversationById(id: string, enabled = true) {
  return useQuery({
    queryKey: juniorKeys.conversation(id),
    queryFn: () => juniorService.getConversationById(id),
    enabled: enabled && !!id,
  });
}

// Clear conversation
export function useClearConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => juniorService.clearConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: juniorKeys.conversations() });
    },
  });
}

// Get suggested questions
export function useSuggestedQuestions(context: string, enabled = true) {
  return useQuery({
    queryKey: juniorKeys.suggestedQuestions(context),
    queryFn: () => juniorService.getSuggestedQuestions(context),
    enabled: enabled && !!context,
  });
}

