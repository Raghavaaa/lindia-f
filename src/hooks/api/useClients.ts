import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/api';
import { CreateClientRequest, UpdateClientRequest } from '@/services/api/types';

// Query keys for caching
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...clientKeys.lists(), { page, pageSize }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  active: () => [...clientKeys.all, 'active'] as const,
  search: (query: string) => [...clientKeys.all, 'search', query] as const,
};

// Get all clients with pagination
export function useClients(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: clientKeys.list(page, pageSize),
    queryFn: () => clientService.getAll(page, pageSize),
  });
}

// Get client by ID
export function useClientById(id: string, enabled = true) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientService.getById(id),
    enabled: enabled && !!id,
  });
}

// Get active clients
export function useActiveClients() {
  return useQuery({
    queryKey: clientKeys.active(),
    queryFn: () => clientService.getActive(),
  });
}

// Search clients
export function useSearchClients(query: string, enabled = true) {
  return useQuery({
    queryKey: clientKeys.search(query),
    queryFn: () => clientService.search(query),
    enabled: enabled && query.length > 0,
  });
}

// Create client mutation
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientRequest) => clientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.active() });
    },
  });
}

// Update client mutation
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientRequest }) =>
      clientService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.active() });
    },
  });
}

// Delete client mutation
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.active() });
    },
  });
}

