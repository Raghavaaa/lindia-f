/**
 * Client API - Backend integration for client management
 * Uses simple API key authentication (no JWT)
 */

import { apiFetch } from '../config';

export type Client = {
  client_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
};

export type ClientCreate = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
};

export type ClientUpdate = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  is_active?: boolean;
};

export type ClientListResponse = {
  clients: Client[];
  total: number;
};

/**
 * Fetch all clients for the authenticated user
 */
export async function listClients(params?: {
  is_active?: boolean;
  search?: string;
}): Promise<ClientListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.is_active !== undefined) {
    searchParams.append('is_active', String(params.is_active));
  }
  if (params?.search) {
    searchParams.append('search', params.search);
  }

  const query = searchParams.toString();
  const endpoint = query ? `/clients/?${query}` : '/clients/';
  
  const response = await apiFetch(endpoint);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch clients: ${error}`);
  }
  
  return response.json();
}

/**
 * Create a new client
 */
export async function createClient(data: ClientCreate): Promise<Client> {
  const response = await apiFetch('/clients/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create client: ${error}`);
  }
  
  return response.json();
}

/**
 * Get a single client by ID
 */
export async function getClient(clientId: string): Promise<Client> {
  const response = await apiFetch(`/clients/${clientId}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch client: ${error}`);
  }
  
  return response.json();
}

/**
 * Update a client
 */
export async function updateClient(
  clientId: string,
  data: ClientUpdate
): Promise<Client> {
  const response = await apiFetch(`/clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update client: ${error}`);
  }
  
  return response.json();
}

/**
 * Delete a client
 */
export async function deleteClient(clientId: string): Promise<void> {
  const response = await apiFetch(`/clients/${clientId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete client: ${error}`);
  }
}
