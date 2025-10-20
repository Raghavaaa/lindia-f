'use client';

import { useServerPing } from '@/hooks/api';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackendConnectionStatus() {
  const { data: isConnected, isLoading } = useServerPing();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="w-4 h-4 animate-pulse" />
        <span>Checking backend...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      )}
    >
      {isConnected ? (
        <>
          <CheckCircle className="w-4 h-4" />
          <span>Backend Connected</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          <span>Backend Offline</span>
        </>
      )}
    </div>
  );
}

