'use client';

import { useToast } from './use-toast';
import { ApiError } from '@/lib/api-client';

/**
 * Hook for displaying API-related toast notifications
 */
export function useApiToast() {
  const { toast } = useToast();

  return {
    /**
     * Show success toast
     */
    success: (title: string, description?: string) => {
      toast({
        variant: 'success',
        title,
        description,
      });
    },

    /**
     * Show error toast from API error
     */
    error: (error: ApiError | Error | unknown, defaultMessage = 'An error occurred') => {
      const message = (error && typeof error === 'object' && 'message' in error) 
        ? String(error.message) 
        : defaultMessage;
      const details = (error && typeof error === 'object' && 'details' in error) 
        ? error.details 
        : undefined;

      toast({
        variant: 'error',
        title: 'Error',
        description: details ? `${message}: ${JSON.stringify(details)}` : message,
      });
    },

    /**
     * Show warning toast
     */
    warning: (title: string, description?: string) => {
      toast({
        variant: 'warning',
        title,
        description,
      });
    },

    /**
     * Show info toast
     */
    info: (title: string, description?: string) => {
      toast({
        variant: 'info',
        title,
        description,
      });
    },

    /**
     * Show loading toast (returns dismiss function)
     */
    loading: (title: string, description?: string) => {
      return toast({
        variant: 'info',
        title,
        description,
        duration: Infinity, // Don't auto-dismiss
      });
    },
  };
}

