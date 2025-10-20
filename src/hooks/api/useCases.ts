import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { caseService } from '@/services/api';
import { CreateCaseRequest, UpdateCaseRequest } from '@/services/api/types';

// Query keys for caching
export const caseKeys = {
  all: ['cases'] as const,
  lists: () => [...caseKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, filters?: Record<string, unknown>) => 
    [...caseKeys.lists(), { page, pageSize, filters }] as const,
  details: () => [...caseKeys.all, 'detail'] as const,
  detail: (id: string) => [...caseKeys.details(), id] as const,
  byClient: (clientId: string) => [...caseKeys.all, 'client', clientId] as const,
  stats: () => [...caseKeys.all, 'stats'] as const,
  search: (query: string) => [...caseKeys.all, 'search', query] as const,
};

// Get all cases with pagination
export function useCases(page = 1, pageSize = 20, filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: caseKeys.list(page, pageSize, filters),
    queryFn: () => caseService.getAll(page, pageSize, filters),
  });
}

// Get case by ID
export function useCaseById(id: string, enabled = true) {
  return useQuery({
    queryKey: caseKeys.detail(id),
    queryFn: () => caseService.getById(id),
    enabled: enabled && !!id,
  });
}

// Get cases by client
export function useCasesByClient(clientId: string, enabled = true) {
  return useQuery({
    queryKey: caseKeys.byClient(clientId),
    queryFn: () => caseService.getByClient(clientId),
    enabled: enabled && !!clientId,
  });
}

// Get case statistics
export function useCaseStats() {
  return useQuery({
    queryKey: caseKeys.stats(),
    queryFn: () => caseService.getStats(),
  });
}

// Search cases
export function useSearchCases(query: string, enabled = true) {
  return useQuery({
    queryKey: caseKeys.search(query),
    queryFn: () => caseService.search(query),
    enabled: enabled && query.length > 0,
  });
}

// Create case mutation
export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCaseRequest) => caseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.stats() });
    },
  });
}

// Update case mutation
export function useUpdateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaseRequest }) =>
      caseService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.stats() });
    },
  });
}

// Delete case mutation
export function useDeleteCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => caseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.stats() });
    },
  });
}

