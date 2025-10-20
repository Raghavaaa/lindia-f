import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { researchService } from '@/services/api';
import { ResearchQuery } from '@/services/api/types';

// Query keys for caching
export const researchKeys = {
  all: ['research'] as const,
  lists: () => [...researchKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...researchKeys.lists(), { filters }] as const,
  details: () => [...researchKeys.all, 'detail'] as const,
  detail: (id: string) => [...researchKeys.details(), id] as const,
  history: () => [...researchKeys.all, 'history'] as const,
};

// Search research hook
export function useResearch() {
  return useMutation({
    mutationFn: (searchQuery: ResearchQuery) => researchService.search(searchQuery),
  });
}

// Get research history
export function useResearchHistory(limit = 10) {
  return useQuery({
    queryKey: [...researchKeys.history(), limit],
    queryFn: () => researchService.getHistory(limit),
  });
}

// Get saved research by ID
export function useResearchById(id: string, enabled = true) {
  return useQuery({
    queryKey: researchKeys.detail(id),
    queryFn: () => researchService.getById(id),
    enabled: enabled && !!id,
  });
}

// Save research mutation
export function useSaveResearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ researchId, name }: { researchId: string; name: string }) =>
      researchService.save(researchId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.history() });
    },
  });
}

// Delete research mutation
export function useDeleteResearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => researchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.history() });
    },
  });
}

