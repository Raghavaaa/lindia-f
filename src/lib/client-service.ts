import { apiFetch, config } from './config';

export type Client = {
  id: string;
  name: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateClientRequest = {
  name: string;
  phone?: string;
};

// Get all clients
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await apiFetch(config.endpoints.clients, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.status}`);
    }

    const data = await response.json();
    return data.clients || data || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

// Create a new client
export const createClient = async (clientData: CreateClientRequest): Promise<Client> => {
  try {
    const response = await apiFetch(config.endpoints.clientsCreate, {
      method: 'POST',
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create client: ${response.status}`);
    }

    const data = await response.json();
    return data.client || data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

// Update a client
export const updateClient = async (clientId: string, clientData: Partial<CreateClientRequest>): Promise<Client> => {
  try {
    const response = await apiFetch(`${config.endpoints.clients}/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update client: ${response.status}`);
    }

    const data = await response.json();
    return data.client || data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

// Delete a client
export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    const response = await apiFetch(`${config.endpoints.clients}/${clientId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete client: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};
