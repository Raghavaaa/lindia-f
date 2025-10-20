import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/api';

// Query keys for caching
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...documentKeys.lists(), { page, pageSize }] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  byCase: (caseId: string) => [...documentKeys.all, 'case', caseId] as const,
  search: (query: string) => [...documentKeys.all, 'search', query] as const,
};

// Get all documents
export function useDocuments(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: documentKeys.list(page, pageSize),
    queryFn: () => documentService.getAll(page, pageSize),
  });
}

// Get document by ID
export function useDocumentById(id: string, enabled = true) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentService.getById(id),
    enabled: enabled && !!id,
  });
}

// Get documents by case ID
export function useDocumentsByCase(caseId: string, enabled = true) {
  return useQuery({
    queryKey: documentKeys.byCase(caseId),
    queryFn: () => documentService.getByCaseId(caseId),
    enabled: enabled && !!caseId,
  });
}

// Search documents
export function useSearchDocuments(query: string, enabled = true) {
  return useQuery({
    queryKey: documentKeys.search(query),
    queryFn: () => documentService.search(query),
    enabled: enabled && query.length > 0,
  });
}

// Upload document mutation
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, caseId, metadata }: { 
      file: File; 
      caseId?: string; 
      metadata?: Record<string, unknown>
    }) => documentService.upload(file, caseId, metadata),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      if (variables.caseId) {
        queryClient.invalidateQueries({ 
          queryKey: documentKeys.byCase(variables.caseId) 
        });
      }
    },
  });
}

// Download document
export function useDownloadDocument() {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await documentService.download(id);
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

// Delete document mutation
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

