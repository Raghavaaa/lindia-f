# AI Law Junior Backend API

This document provides comprehensive documentation for the AI Law Junior backend API.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Database Schema](#database-schema)

## Overview

The AI Law Junior backend is built with Next.js API routes and provides a comprehensive legal research and case management system. It includes:

- User authentication and authorization
- Client management
- Case management
- Legal research with AI integration
- Document management
- Activity logging
- Settings management

## Authentication

The API uses NextAuth.js for authentication with Google OAuth provider. All protected endpoints require a valid JWT token.

### Authentication Headers

```http
Authorization: Bearer <jwt_token>
```

### User Roles

- `user`: Basic user access
- `lawyer`: Lawyer access with client management
- `admin`: Full administrative access

## API Endpoints

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

### Users

#### GET /api/users/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "lawyer",
    "phone": "+1234567890",
    "address": "123 Main St",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "address": "456 Oak Ave"
}
```

### Clients

#### GET /api/clients
Get all clients for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "client_123",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "address": "789 Pine St",
      "referenceId": "REF001",
      "userId": "user_123",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### POST /api/clients
Create a new client.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "address": "789 Pine St",
  "referenceId": "REF001"
}
```

#### GET /api/clients/[id]
Get a specific client by ID.

#### PUT /api/clients/[id]
Update a client.

#### DELETE /api/clients/[id]
Delete a client (soft delete).

### Cases

#### GET /api/cases
Get all cases for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (active, closed, pending)
- `priority` (optional): Filter by priority (low, medium, high, urgent)

#### POST /api/cases
Create a new case.

**Request Body:**
```json
{
  "title": "Property Dispute Case",
  "description": "Boundary dispute with neighbor",
  "caseNumber": "CASE-2024-001",
  "court": "District Court",
  "priority": "high",
  "clientId": "client_123",
  "startDate": "2024-01-01T00:00:00Z",
  "tags": ["property", "dispute"]
}
```

### Research

#### POST /api/research
Perform legal research using AI.

**Request Body:**
```json
{
  "query": "What are the legal requirements for property boundary disputes in India?",
  "clientId": "client_123",
  "model": "deepseek"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "Based on Indian law, property boundary disputes are governed by...",
    "id": "rq_123",
    "confidence": 0.85
  }
}
```

#### GET /api/research/saved
Get saved research queries.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `clientId` (optional): Filter by client ID

### Settings

#### GET /api/admin/settings
Get all system settings (admin only).

#### PUT /api/admin/settings
Update system settings (admin only).

**Request Body:**
```json
{
  "key": "PROMPT_BASE",
  "value": "Updated prompt text",
  "description": "Base prompt for AI research"
}
```

## Data Models

### User
```typescript
interface User {
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
```

### Client
```typescript
interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  referenceId?: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Case
```typescript
interface Case {
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
```

### ResearchQuery
```typescript
interface ResearchQuery {
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
```

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Optional validation details
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `429`: Rate Limited
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default**: 100 requests per minute per IP
- **Headers**: Rate limit information is included in response headers
- **Response**: 429 status code when limit exceeded

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
Retry-After: 60
```

## Database Schema

The backend uses SQLite with the following main tables:

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  phone TEXT,
  address TEXT,
  image TEXT,
  provider TEXT,
  role TEXT DEFAULT 'user',
  is_active BOOLEAN DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Clients Table
```sql
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  reference_id TEXT,
  user_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Research Queries Table
```sql
CREATE TABLE research_queries (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  client_id TEXT,
  query_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  model TEXT DEFAULT 'deepseek',
  confidence REAL,
  tags TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=sqlite:./data.sqlite

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Services
DEEPSEEK_API_KEY=your-deepseek-api-key
HF_TOKEN=your-huggingface-token

# System Settings
PROMPT_BASE=Your base prompt for AI research
```

## Development

### Running the Backend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Migrations

The database schema is automatically created and migrated on first run. The migration system is located in `lib/database/migrations.ts`.

### Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint
```

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Role-based access control
3. **Input Validation**: All inputs are validated using Zod schemas
4. **Rate Limiting**: Prevents abuse and DoS attacks
5. **Error Handling**: Sensitive information is not exposed in error messages
6. **SQL Injection**: Parameterized queries prevent SQL injection
7. **CORS**: Configured for specific origins in production

## Monitoring and Logging

- All API requests are logged with user context
- Errors are logged with stack traces
- Activity tracking for audit trails
- Performance monitoring through response times

## Deployment

The backend is designed to be deployed on:

- **Vercel**: Recommended for Next.js applications
- **Railway**: Alternative platform with database support
- **Docker**: Containerized deployment option

### Production Checklist

- [ ] Set all required environment variables
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy for database
- [ ] Set up SSL certificates
- [ ] Configure rate limiting for production load
