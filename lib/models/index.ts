// Database models and types for AI Law Junior
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  image?: string;
  provider?: string;
  role: 'user' | 'admin' | 'lawyer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  referenceId?: string;
  userId: string; // Lawyer who owns this client
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Directory {
  id: string;
  name: string;
  clientId: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subdirectory {
  id: string;
  name: string;
  directoryId: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchQuery {
  id: string;
  userId?: string;
  clientId?: string;
  queryText: string;
  responseText: string;
  status: 'pending' | 'completed' | 'failed';
  model: 'deepseek' | 'inlegalbert' | 'manual';
  confidence?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'image';
  size: number;
  path: string;
  clientId?: string;
  directoryId?: string;
  subdirectoryId?: string;
  uploadedBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  key: string;
  value: string;
  description?: string;
  category: 'system' | 'user' | 'ai' | 'legal';
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  title: string;
  description?: string;
  caseNumber?: string;
  court?: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientId: string;
  assignedTo: string;
  startDate: string;
  endDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'research' | 'document' | 'case' | 'client' | 'system';
  action: string;
  description: string;
  userId: string;
  clientId?: string;
  caseId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Request types
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: 'user' | 'admin' | 'lawyer';
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  address?: string;
  image?: string;
}

export interface CreateClientRequest {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  referenceId?: string;
}

export interface CreateResearchRequest {
  query: string;
  clientId?: string;
  save?: boolean;
  model?: 'deepseek' | 'inlegalbert' | 'manual';
}

export interface CreateCaseRequest {
  title: string;
  description?: string;
  caseNumber?: string;
  court?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  clientId: string;
  startDate: string;
  tags?: string[];
}
