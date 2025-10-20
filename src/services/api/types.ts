// Common API types and interfaces

export interface BaseResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ErrorResponse {
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

// Research Module Types
export interface ResearchQuery {
  query: string;
  context?: string;
  jurisdiction?: string;
  caseType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ResearchResult {
  id: string;
  title: string;
  summary: string;
  relevance: number;
  source: string;
  date: string;
  citations: string[];
}

export interface ResearchResponse {
  results: ResearchResult[];
  totalFound: number;
  searchTime: number;
}

// Junior Module Types (Legal Assistant)
export interface JuniorQuery {
  question: string;
  context?: string;
  caseId?: string;
}

export interface JuniorResponse {
  answer: string;
  confidence: number;
  sources: string[];
  relatedQuestions?: string[];
}

// Case Module Types
export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  clientId: string;
  status: 'active' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string[];
}

export interface CreateCaseRequest {
  caseNumber: string;
  title: string;
  description: string;
  clientId: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateCaseRequest {
  title?: string;
  description?: string;
  status?: 'active' | 'pending' | 'closed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Client Module Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  status?: 'active' | 'inactive';
}

// Property Opinion Module Types
export interface PropertyOpinionRequest {
  propertyId: string;
  address: string;
  documents: string[];
  checkType: 'title' | 'due-diligence' | 'full';
}

export interface PropertyOpinionResponse {
  id: string;
  propertyId: string;
  status: 'pending' | 'in-progress' | 'completed';
  opinion?: string;
  risks: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  documents: string[];
  createdAt: string;
  completedAt?: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  caseId?: string;
}

export interface UploadDocumentRequest {
  file: File;
  caseId?: string;
  metadata?: Record<string, unknown>;
}

// History/Activity Types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface HistoryQuery {
  entityType?: string;
  entityId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'lawyer' | 'paralegal' | 'client';
  avatar?: string;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'lawyer' | 'paralegal';
}

// Health Check
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  services?: {
    database: boolean;
    ai: boolean;
    storage: boolean;
  };
}

