# Quick Reference - API Integration

## 🚀 Most Common Patterns

### 1. Fetch Data (Query)

```tsx
import { useCases } from '@/hooks/api';

function MyComponent() {
  const { data, isLoading, error } = useCases();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.data.map(...)}</div>;
}
```

### 2. Create/Update Data (Mutation)

```tsx
import { useCreateCase } from '@/hooks/api';
import { useApiToast } from '@/hooks/use-api-toast';

function MyComponent() {
  const createCase = useCreateCase();
  const apiToast = useApiToast();
  
  const handleCreate = () => {
    createCase.mutate(
      { title: 'New Case', ... },
      {
        onSuccess: () => apiToast.success('Created!'),
        onError: (error) => apiToast.error(error),
      }
    );
  };
  
  return (
    <button onClick={handleCreate} disabled={createCase.isPending}>
      {createCase.isPending ? 'Creating...' : 'Create'}
    </button>
  );
}
```

### 3. Search/Filter

```tsx
import { useSearchCases } from '@/hooks/api';

function Search() {
  const [query, setQuery] = useState('');
  const { data } = useSearchCases(query, query.length > 0);
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {data?.map(...)}
    </div>
  );
}
```

### 4. Upload File

```tsx
import { useUploadDocument } from '@/hooks/api';

function Upload() {
  const upload = useUploadDocument();
  
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      upload.mutate({ file, caseId: '123' });
    }
  };
  
  return <input type="file" onChange={handleUpload} />;
}
```

## 📋 All Available Hooks

### Authentication
| Hook | Purpose |
|------|---------|
| `useLogin()` | Login user |
| `useLogout()` | Logout user |
| `useRegister()` | Register new user |
| `useCurrentUser()` | Get current user |
| `useRefreshToken()` | Refresh auth token |

### Cases
| Hook | Purpose |
|------|---------|
| `useCases(page, size, filters)` | Get all cases |
| `useCaseById(id)` | Get single case |
| `useCasesByClient(clientId)` | Get client's cases |
| `useCaseStats()` | Get statistics |
| `useSearchCases(query)` | Search cases |
| `useCreateCase()` | Create new case |
| `useUpdateCase()` | Update case |
| `useDeleteCase()` | Delete case |

### Clients
| Hook | Purpose |
|------|---------|
| `useClients(page, size)` | Get all clients |
| `useClientById(id)` | Get single client |
| `useActiveClients()` | Get active clients |
| `useSearchClients(query)` | Search clients |
| `useCreateClient()` | Create new client |
| `useUpdateClient()` | Update client |
| `useDeleteClient()` | Delete client |

### Documents
| Hook | Purpose |
|------|---------|
| `useDocuments(page, size)` | Get all documents |
| `useDocumentById(id)` | Get single document |
| `useDocumentsByCase(caseId)` | Get case documents |
| `useSearchDocuments(query)` | Search documents |
| `useUploadDocument()` | Upload document |
| `useDownloadDocument()` | Download document |
| `useDeleteDocument()` | Delete document |

### Research
| Hook | Purpose |
|------|---------|
| `useResearch()` | Perform research |
| `useResearchHistory()` | Get history |
| `useResearchById(id)` | Get saved research |
| `useSaveResearch()` | Save research |
| `useDeleteResearch()` | Delete research |

### Junior (AI)
| Hook | Purpose |
|------|---------|
| `useAskJunior()` | Ask AI question |
| `useConversations(caseId?)` | Get conversations |
| `useConversationById(id)` | Get conversation |
| `useClearConversation()` | Clear conversation |
| `useSuggestedQuestions(context)` | Get suggestions |

### Property
| Hook | Purpose |
|------|---------|
| `useRequestPropertyOpinion()` | Request opinion |
| `usePropertyOpinionById(id)` | Get opinion |
| `usePropertyOpinions(page, size)` | Get all opinions |
| `useUpdatePropertyOpinionStatus()` | Update status |
| `useDeletePropertyOpinion()` | Delete opinion |

### History
| Hook | Purpose |
|------|---------|
| `useActivityLogs(query)` | Get activity logs |
| `useActivityLogById(id)` | Get single log |
| `useEntityLogs(type, id)` | Get entity logs |
| `useUserActivity(userId)` | Get user activity |
| `useRecentActivity(limit)` | Get recent activity |

### Health
| Hook | Purpose |
|------|---------|
| `useHealthCheck()` | Check API health |
| `useServerPing()` | Ping server |

## 🎨 Toast Notifications

```tsx
import { useApiToast } from '@/hooks/use-api-toast';

const apiToast = useApiToast();

// Success
apiToast.success('Title', 'Description');

// Error
apiToast.error(error, 'Fallback message');

// Warning
apiToast.warning('Title', 'Description');

// Info
apiToast.info('Title', 'Description');

// Loading (manual dismiss)
const loadingToast = apiToast.loading('Processing...');
// Later...
loadingToast.dismiss();
```

## 🎯 Common Query Options

```tsx
// Enable/disable query
const { data } = useCases(1, 20, undefined, {
  enabled: someCondition, // Only run when true
});

// Custom stale time
const { data } = useCases(1, 20, undefined, {
  staleTime: 10000, // 10 seconds
});

// Refetch interval
const { data } = useHealthCheck({
  refetchInterval: 30000, // Every 30 seconds
});
```

## 🔄 Mutation Options

```tsx
mutation.mutate(data, {
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
  onSettled: () => {
    console.log('Completed');
  },
});
```

## 🔧 Direct API Calls (if needed)

```tsx
import { api } from '@/lib/api-client';

// GET
const response = await api.get('/endpoint');

// POST
const response = await api.post('/endpoint', { data });

// PUT
const response = await api.put('/endpoint', { data });

// DELETE
const response = await api.delete('/endpoint');
```

## 🌐 Environment Variables

```env
# Required
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Optional
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_API_TIMEOUT=30000
```

## 📖 Error Handling

All errors are automatically caught and typed:

```tsx
const { error } = useCases();

if (error) {
  // error has type ApiError with:
  // - message: string
  // - status: number
  // - details?: any
}
```

## 🎪 Loading States

```tsx
import { LoadingSpinner, LoadingCard, LoadingOverlay } from '@/components/ui';

// Spinner
<LoadingSpinner size="lg" text="Loading..." />

// Card
<LoadingCard text="Loading data..." />

// Full-page overlay
<LoadingOverlay text="Processing..." />
```

## 📚 Full Documentation

- **`INTEGRATION_GUIDE.md`** - Comprehensive examples
- **`API_INTEGRATION_SUMMARY.md`** - Technical details
- **`SETUP_COMPLETE.md`** - Setup overview
- **`EXAMPLE_USAGE.tsx`** - Real-world examples

## 💡 Tips

1. Always use hooks, don't call services directly
2. Use `enabled` parameter to control when queries run
3. Mutations automatically invalidate related queries
4. Check `isLoading` before rendering data
5. Use `apiToast` for user feedback
6. Error boundaries catch React errors automatically

---

**Need help?** Check `INTEGRATION_GUIDE.md` for detailed examples!

