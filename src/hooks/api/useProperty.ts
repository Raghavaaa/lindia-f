import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/api';
import { PropertyOpinionRequest } from '@/services/api/types';

// Query keys for caching
export const propertyKeys = {
  all: ['property'] as const,
  opinions: () => [...propertyKeys.all, 'opinions'] as const,
  opinion: (id: string) => [...propertyKeys.opinions(), id] as const,
  list: (page: number, pageSize: number) => [...propertyKeys.opinions(), 'list', { page, pageSize }] as const,
};

// Request property opinion
export function useRequestPropertyOpinion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PropertyOpinionRequest) => propertyService.requestOpinion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.opinions() });
    },
  });
}

// Get opinion by ID
export function usePropertyOpinionById(id: string, enabled = true) {
  return useQuery({
    queryKey: propertyKeys.opinion(id),
    queryFn: () => propertyService.getOpinionById(id),
    enabled: enabled && !!id,
  });
}

// Get all opinions
export function usePropertyOpinions(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: propertyKeys.list(page, pageSize),
    queryFn: () => propertyService.getOpinions(page, pageSize),
  });
}

// Update opinion status
export function useUpdatePropertyOpinionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      propertyService.updateOpinionStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.opinion(variables.id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.opinions() });
    },
  });
}

// Delete opinion
export function useDeletePropertyOpinion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyService.deleteOpinion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.opinions() });
    },
  });
}

