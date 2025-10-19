// Offline queue manager for handling requests when backend is unavailable

export type QueuedRequest = {
  id: string;
  endpoint: string;
  method: string;
  body: unknown;
  timestamp: number;
};

const QUEUE_KEY = 'legalindia::offline_queue';

export const addToQueue = (endpoint: string, method: string, body: unknown): void => {
  try {
    const queue = getQueue();
    const request: QueuedRequest = {
      id: Date.now().toString(),
      endpoint,
      method,
      body,
      timestamp: Date.now(),
    };
    queue.push(request);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    // Queue is full or unavailable
  }
};

export const getQueue = (): QueuedRequest[] => {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const clearQueue = (): void => {
  try {
    localStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    // Ignore
  }
};

export const removeFromQueue = (id: string): void => {
  try {
    const queue = getQueue();
    const filtered = queue.filter((req) => req.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    // Ignore
  }
};

