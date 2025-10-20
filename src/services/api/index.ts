// Central API services export
export * from './types';
export * from './auth.service';
export * from './case.service';
export * from './client.service';
export * from './document.service';
export * from './health.service';
export * from './history.service';
export * from './junior.service';
export * from './property.service';
export * from './research.service';

// Re-export the api client
export { api, checkBackendConnection } from '@/lib/api-client';

