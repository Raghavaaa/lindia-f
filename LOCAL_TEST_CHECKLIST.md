# 🧪 Local Integration Test Checklist

## Prerequisites

```bash
# 1. Backend is running
curl http://localhost:8000/health
# Should return: {"status": "healthy"}

# 2. Frontend is running
# Open: http://localhost:3000
```

## ✅ Test Checklist

### 1. Environment Setup
- [ ] `.env.local` exists with `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] No console errors on page load

### 2. Google Login Test
- [ ] Click "Sign in with Google"
- [ ] Successfully redirected to Google OAuth
- [ ] Redirected back to /app after login
- [ ] User info displayed in header

### 3. Client Selection Test
- [ ] Can select existing client OR
- [ ] Can create new client
- [ ] Client info displays correctly
- [ ] Network tab shows GET request to backend (if implemented)

### 4. Property Opinion Upload Test
- [ ] Navigate to Property Opinion tab
- [ ] Click "Upload" or drag-drop PDF files
- [ ] Selected files appear in list with file sizes
- [ ] Click "Analyze Property Documents"
- [ ] **Verify:**
  - [ ] Progress bar appears and animates (0-100%)
  - [ ] Toast notification: "Uploading documents..."
  - [ ] Network tab shows POST to `/api/documents/upload`
  - [ ] Network tab shows POST to `/api/property/opinion`
  - [ ] Success toast appears: "Analysis Complete!"
  - [ ] Files cleared after success
  - [ ] **Performance:** < 300ms per request (local)

### 5. Research AI Test
- [ ] Navigate to Research tab
- [ ] Enter query: "What is the process for property registration in India?"
- [ ] (Optional) Toggle admin prompt
- [ ] Click Run button (play icon)
- [ ] **Verify:**
  - [ ] Spinner/loading state appears
  - [ ] Network tab shows POST to `/api/research/search`
  - [ ] Request body contains: query, context, jurisdiction, caseType
  - [ ] Response received from backend
  - [ ] Results modal opens with AI response
  - [ ] Success toast: "Research Complete"
  - [ ] Query saved to history (bottom of page)
  - [ ] **Performance:** < 300ms (local backend)

### 6. Junior AI Module Test (if implemented)
- [ ] Navigate to Junior tab
- [ ] Enter legal question
- [ ] Click submit
- [ ] **Verify:**
  - [ ] Loading indicator
  - [ ] Network POST to `/api/junior/ask`
  - [ ] AI response displays
  - [ ] Toast notification

### 7. Case Module Test (if backend ready)
- [ ] Navigate to Case tab
- [ ] Create new case
- [ ] **Verify:**
  - [ ] Network POST to `/api/cases`
  - [ ] Success toast
  - [ ] Case appears in list

### 8. Error Handling Tests
- [ ] **Stop backend** (Ctrl+C)
- [ ] Try to upload file
  - [ ] Should show error toast
  - [ ] Should fallback gracefully
- [ ] Try research query
  - [ ] Should show "offline mode" fallback
  - [ ] Should still save locally
- [ ] **Restart backend**
- [ ] Verify operations work again

### 9. Network Performance Check
Open Browser DevTools → Network tab:
- [ ] Filter: XHR
- [ ] Verify all requests show:
  - [ ] Status: 200 or 201
  - [ ] Time: < 300ms (local)
  - [ ] URL starts with `http://localhost:8000`
- [ ] No CORS errors
- [ ] No 404/500 errors

### 10. Toast Notifications Test
Verify toasts appear for:
- [ ] ✅ Success: Upload complete
- [ ] ✅ Success: Research complete
- [ ] ⚠️  Warning: Empty query
- [ ] ⚠️  Warning: No files selected
- [ ] ❌ Error: Backend unavailable
- [ ] ❌ Error: Upload failed

## 🐛 Common Issues & Fixes

### Issue: CORS Error
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```
**Fix:** Add to FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: 404 Not Found
```
POST http://localhost:8000/api/research/search 404
```
**Fix:** Implement the endpoint in FastAPI backend

### Issue: Progress Bar Not Moving
**Fix:** Check that backend is returning responses (not hanging)

### Issue: Toast Not Showing
**Fix:** Verify `<Toaster />` is in `layout.tsx` (it is)

## ✅ Success Criteria

All tests passing means:
- ✅ Frontend-backend communication working
- ✅ File uploads successful with progress
- ✅ AI research inference working
- ✅ Error handling graceful
- ✅ Performance < 300ms locally
- ✅ Toast notifications everywhere
- ✅ No console errors
- ✅ Ready for production deployment

## 📝 Test Results Template

```
Date: __________
Tester: __________

✅ Tests Passed: ___/10
❌ Tests Failed: ___/10

Failed Tests:
1. _______________________
2. _______________________

Notes:
_________________________
_________________________
```

## 🚀 After Local Tests Pass

Move to: **Production Deployment Checklist**
(See BACKEND_INTEGRATION_COMPLETE.md - Instruction 7)

