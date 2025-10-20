# Frontend-Backend Integration Guide

This guide explains how to use the API integration setup in your Next.js application.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_API_TIMEOUT=30000
```

For production, update the backend URL to your actual FastAPI server:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENV=production
```

### 2. Architecture Overview

The integration consists of:

- **Axios Client** (`src/lib/api-client.ts`) - HTTP client with interceptors
- **React Query Provider** (`src/lib/react-query-provider.tsx`) - Data fetching and caching
- **Error Boundary** (`src/components/ErrorBoundary.tsx`) - Global error handling
- **API Services** (`src/services/api/`) - Type-safe API service layer
- **Custom Hooks** (`src/hooks/api/`) - React Query hooks for each module

## 📚 Usage Examples

### Example 1: Using Research Module

```tsx
'use client';

import { useResearch, useResearchHistory } from '@/hooks/api';
import { Button } from '@/components/ui/button';

export default function ResearchPage() {
  const { mutate: search, data, isLoading, error } = useResearch();
  const { data: history } = useResearchHistory();

  const handleSearch = () => {
    search({
      query: 'Contract disputes in Indian law',
      jurisdiction: 'India',
    });
  };

  return (
    <div>
      <Button onClick={handleSearch} disabled={isLoading}>
        Search
      </Button>
      
      {isLoading && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <div>{/* Display results */}</div>}
    </div>
  );
}
```

### Example 2: Using Case Management

```tsx
'use client';

import { useCases, useCreateCase, useUpdateCase } from '@/hooks/api';

export default function CasesPage() {
  const { data: cases, isLoading } = useCases(1, 20);
  const createCase = useCreateCase();
  const updateCase = useUpdateCase();

  const handleCreateCase = () => {
    createCase.mutate({
      caseNumber: 'CASE-2025-001',
      title: 'Property Dispute',
      description: 'Commercial property ownership dispute',
      clientId: 'client-123',
      priority: 'high',
    });
  };

  const handleUpdateCase = (caseId: string) => {
    updateCase.mutate({
      id: caseId,
      data: {
        status: 'active',
        priority: 'urgent',
      },
    });
  };

  return (
    <div>
      {isLoading && <p>Loading cases...</p>}
      {cases?.data.map((case) => (
        <div key={case.id}>
          <h3>{case.title}</h3>
          <Button onClick={() => handleUpdateCase(case.id)}>
            Update Status
          </Button>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Using AI Legal Assistant (Junior)

```tsx
'use client';

import { useAskJunior, useConversations } from '@/hooks/api';
import { useState } from 'react';

export default function JuniorPage() {
  const [question, setQuestion] = useState('');
  const { mutate: askQuestion, data, isLoading } = useAskJunior();
  const { data: conversations } = useConversations();

  const handleAsk = () => {
    askQuestion({
      question,
      context: 'Legal analysis context here',
    });
  };

  return (
    <div>
      <textarea 
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a legal question..."
      />
      <button onClick={handleAsk} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Ask'}
      </button>
      
      {data && (
        <div>
          <h3>Answer:</h3>
          <p>{data.answer}</p>
          <p>Confidence: {(data.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
```

### Example 4: Authentication

```tsx
'use client';

import { useLogin, useLogout, useCurrentUser } from '@/hooks/api';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const login = useLogin();
  const logout = useLogout();
  const { data: user, isLoading } = useCurrentUser();

  const handleLogin = () => {
    login.mutate({ email, password });
  };

  if (isLoading) return <p>Loading...</p>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={() => logout.mutate()}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example 5: Document Upload

```tsx
'use client';

import { useUploadDocument, useDocumentsByCase } from '@/hooks/api';
import { useState } from 'react';

export default function DocumentUpload({ caseId }: { caseId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const upload = useUploadDocument();
  const { data: documents } = useDocumentsByCase(caseId);

  const handleUpload = () => {
    if (file) {
      upload.mutate({ 
        file, 
        caseId,
        metadata: { uploadedBy: 'user-123' }
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={upload.isPending}>
        {upload.isPending ? 'Uploading...' : 'Upload'}
      </button>

      <h3>Documents:</h3>
      {documents?.map((doc) => (
        <div key={doc.id}>{doc.name}</div>
      ))}
    </div>
  );
}
```

## 🔧 Available Hooks

### Authentication
- `useLogin()` - Login user
- `useRegister()` - Register new user
- `useLogout()` - Logout user
- `useCurrentUser()` - Get current user data
- `useRefreshToken()` - Refresh auth token

### Cases
- `useCases(page, pageSize, filters)` - Get all cases
- `useCaseById(id)` - Get case by ID
- `useCasesByClient(clientId)` - Get cases for a client
- `useCaseStats()` - Get case statistics
- `useSearchCases(query)` - Search cases
- `useCreateCase()` - Create new case
- `useUpdateCase()` - Update case
- `useDeleteCase()` - Delete case

### Clients
- `useClients(page, pageSize)` - Get all clients
- `useClientById(id)` - Get client by ID
- `useActiveClients()` - Get active clients
- `useSearchClients(query)` - Search clients
- `useCreateClient()` - Create client
- `useUpdateClient()` - Update client
- `useDeleteClient()` - Delete client

### Research
- `useResearch()` - Perform legal research
- `useResearchHistory()` - Get research history
- `useResearchById(id)` - Get saved research
- `useSaveResearch()` - Save research results
- `useDeleteResearch()` - Delete research

### Junior (AI Assistant)
- `useAskJunior()` - Ask AI assistant
- `useConversations(caseId?)` - Get conversations
- `useConversationById(id)` - Get conversation
- `useClearConversation()` - Clear conversation
- `useSuggestedQuestions(context)` - Get suggested questions

### Documents
- `useDocuments(page, pageSize)` - Get all documents
- `useDocumentById(id)` - Get document
- `useDocumentsByCase(caseId)` - Get case documents
- `useSearchDocuments(query)` - Search documents
- `useUploadDocument()` - Upload document
- `useDownloadDocument()` - Download document
- `useDeleteDocument()` - Delete document

### Property
- `useRequestPropertyOpinion()` - Request opinion
- `usePropertyOpinionById(id)` - Get opinion
- `usePropertyOpinions(page, pageSize)` - Get all opinions
- `useUpdatePropertyOpinionStatus()` - Update status
- `useDeletePropertyOpinion()` - Delete opinion

### History
- `useActivityLogs(query)` - Get activity logs
- `useActivityLogById(id)` - Get log by ID
- `useEntityLogs(type, id)` - Get entity logs
- `useUserActivity(userId)` - Get user activity
- `useRecentActivity(limit)` - Get recent activity

### Health
- `useHealthCheck()` - Check API health
- `useServerPing()` - Ping server

## 🛡️ Error Handling

All API calls are automatically wrapped with error handling:

1. **Network Errors** - Automatically detected and displayed
2. **401 Unauthorized** - Redirects to login page
3. **403 Forbidden** - Shows access denied message
4. **422 Validation** - Shows validation errors
5. **500+ Server Errors** - Shows server error message

Errors can be accessed in your components:

```tsx
const { data, error, isError } = useCases();

if (isError) {
  console.error('Error:', error.message);
}
```

## 🔐 Authentication Flow

1. User logs in via `useLogin()` hook
2. Token is automatically stored in localStorage
3. Token is automatically attached to all API requests
4. On 401 error, user is redirected to login
5. User can logout via `useLogout()` hook

## 📝 Best Practices

1. **Always use hooks** - Don't call services directly
2. **Enable/disable queries** - Use the `enabled` parameter to control when queries run
3. **Handle loading states** - Always check `isLoading` before rendering
4. **Handle errors** - Always display error messages to users
5. **Invalidate queries** - Use `queryClient.invalidateQueries()` after mutations
6. **Use TypeScript** - All types are provided for type safety

## 🚨 Troubleshooting

### Backend not connecting?

1. Check if `NEXT_PUBLIC_BACKEND_URL` is set correctly
2. Ensure FastAPI backend is running
3. Check browser console for CORS errors
4. Verify network connectivity

### Queries not updating?

1. Check if you're invalidating queries after mutations
2. Verify `staleTime` and `gcTime` settings
3. Check React Query DevTools (visible in development)

### Authentication issues?

1. Check if token is stored in localStorage
2. Verify token is being sent in request headers
3. Check token expiration
4. Try clearing localStorage and logging in again

## 📦 Package Dependencies

- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching and caching
- `@tanstack/react-query-devtools` - Development tools

All packages are automatically installed and configured.

