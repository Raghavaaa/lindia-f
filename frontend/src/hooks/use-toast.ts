/**
 * Toast notifications hook
 * Simple implementation for client feedback
 */

import { useState, useCallback } from 'react';

export type Toast = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

let toastCallback: ((toast: Toast) => void) | null = null;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((newToast: Toast) => {
    console.log(`[Toast] ${newToast.variant === 'destructive' ? '❌' : '✅'} ${newToast.title}`, newToast.description);
    
    // Show browser notification if supported
    if (typeof window !== 'undefined') {
      // For now, just log - can enhance with proper toast UI later
      console.log('Toast:', title, description);
    }
  }, []);

  return { toast, toasts };
}

