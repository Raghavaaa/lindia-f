# 🔐 JWT Authentication Setup - COMPLETE

## ✅ What's Been Implemented

### Backend (legalindia-backend):
✅ JWT token generation (`app/utils/jwt_helper.py`)  
✅ Token verification (`app/utils/auth.py`)  
✅ Token generator script (`generate_token.py`)  
✅ Client API with auth protection  

### Frontend (frontend/src):
✅ JWT token storage (`lib/config.ts`)  
✅ Auto-inject tokens in API calls (`apiFetch`)  
✅ Auth helper utilities (`lib/auth-helper.ts`)  

---

## 🚀 Quick Start Guide

### Step 1: Generate a JWT Token (Backend)

```bash
cd legalindia-backend
python3 generate_token.py
```

**Output:**
```
======================================================================
🔑 JWT TOKEN GENERATOR
======================================================================

✅ Token generated for user: test_user_123

📋 Token (copy this):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXJfMTIzIi...
```

**Copy the token!** You'll need it for the frontend.

---

### Step 2: Set Token in Frontend

#### Option A: Browser Console (Quick Test)

1. Open your frontend in browser
2. Open Developer Console (F12)
3. Run:
```javascript
// Paste your token from Step 1
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXJfMTIzIi...";

localStorage.setItem('legalindia_jwt_token', token);

console.log('✅ Token set! Refresh the page.');
```

4. Refresh the page
5. All API calls will now include the token!

#### Option B: Use Auth Helper (Recommended)

In your frontend code:

```typescript
import { setTestToken } from '@/lib/auth-helper';

// In component or page
useEffect(() => {
  // Set test token (only for development)
  setTestToken("test_user_123");
}, []);
```

Or for real authentication:

```typescript
import { loginWithToken } from '@/lib/auth-helper';

// After successful login
const handleLogin = async () => {
  // Get token from your auth flow
  const token = await authenticateUser(credentials);
  loginWithToken(token);
};
```

---

### Step 3: Test Client Creation

#### With Browser:

1. Go to your frontend (http://localhost:3000)
2. Navigate to client creation page
3. Create a client
4. Check backend database:

```bash
cd legalindia-backend
python3 -c "
from app.models.client import Client
from app.database import SessionLocal
db = SessionLocal()
clients = db.query(Client).all()
print(f'✅ Clients in database: {len(clients)}')
for c in clients:
    print(f'  - {c.name} (ID: {c.client_id})')
"
```

#### With curl:

```bash
# Replace TOKEN with your actual token from Step 1
curl -X POST http://localhost:8000/api/v1/clients/ \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{"name": "Test Client", "email": "test@example.com"}'
```

---

## 📁 Files Created/Modified

### Backend:
- ✅ `app/utils/jwt_helper.py` - JWT token generation & verification
- ✅ `generate_token.py` - CLI tool to generate tokens
- ✅ `requirements.txt` - Added PyJWT dependency
- ✅ `app/utils/auth.py` - Already had JWT verification

### Frontend:
- ✅ `src/lib/config.ts` - Added JWT token management & auto-injection
- ✅ `src/lib/auth-helper.ts` - Auth utility functions

---

## 🔧 Frontend Integration

### Automatic Token Injection

All API calls using `apiFetch` now automatically include JWT tokens:

```typescript
import { apiFetch, config } from '@/lib/config';

// This will automatically add Authorization: Bearer {token}
const response = await apiFetch(config.endpoints.clients, {
  method: 'POST',
  body: JSON.stringify({ name: 'New Client' })
});
```

### Manual Token Management

```typescript
import { 
  loginWithToken, 
  logout, 
  isAuthenticated,
  getUserFromToken 
} from '@/lib/auth-helper';

// Login
loginWithToken('your_jwt_token_here');

// Check auth status
if (isAuthenticated()) {
  const user = getUserFromToken();
  console.log(`Logged in as: ${user?.email}`);
}

// Logout
logout();
```

---

## 🧪 Testing Checklist

### Backend Tests:

```bash
cd legalindia-backend

# 1. Generate token
python3 generate_token.py

# 2. Test health endpoint (no auth needed)
curl http://localhost:8000/

# 3. Test client creation with token
curl -X POST http://localhost:8000/api/v1/clients/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Client"}'

# 4. List clients with token
curl -X GET http://localhost:8000/api/v1/clients/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Verify in database
python3 test_client_autocheck.py
```

### Frontend Tests:

1. **Set Token:**
   - Open browser console
   - Set token: `localStorage.setItem('legalindia_jwt_token', 'YOUR_TOKEN')`

2. **Create Client:**
   - Go to client creation page
   - Fill in client details
   - Submit form

3. **Check Network Tab:**
   - Open DevTools → Network
   - Create a client
   - Check request headers should show:
     ```
     Authorization: Bearer eyJhbGci...
     ```

4. **Verify Database:**
   - Run: `python3 test_client_autocheck.py`
   - Should show clients > 0

---

## 🔐 Production Setup

### Environment Variables:

**Backend (.env):**
```bash
JWT_SECRET=your-super-secret-key-min-32-characters-change-this
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_FRONTEND_API_BASE=https://your-backend.railway.app
```

### Generate Secure Secret:

```bash
# Generate a secure JWT secret
openssl rand -base64 32
# Output: Use this as JWT_SECRET
```

---

## 🎯 Current Status

✅ **Backend:**
- JWT generation working
- Token verification working
- Client API protected with auth
- Test token generator available

✅ **Frontend:**
- JWT token storage in localStorage
- Automatic token injection in API calls
- Auth helper utilities available
- Ready to use

✅ **Integration:**
- `apiFetch` automatically adds Authorization header
- Tokens persist across page reloads
- Easy login/logout functions

---

## 🆘 Troubleshooting

### Issue: "401 Unauthorized" error

**Solution:**
1. Check if token is set:
   ```javascript
   console.log(localStorage.getItem('legalindia_jwt_token'));
   ```
2. Generate new token if expired:
   ```bash
   python3 generate_token.py
   ```
3. Clear and reset token:
   ```javascript
   localStorage.removeItem('legalindia_jwt_token');
   localStorage.setItem('legalindia_jwt_token', 'NEW_TOKEN');
   ```

### Issue: Clients still not in database

**Check:**
1. Backend is running: `http://localhost:8000/`
2. Token is valid: Check expiry in browser console
3. API endpoint correct: Check Network tab
4. Database initialized: `python3 db_init.py`

### Issue: Token expired

**Solution:**
```bash
# Generate new token (valid for 30 days)
python3 generate_token.py

# Use new token in frontend
```

---

## 📚 Next Steps

1. **Implement Real Authentication:**
   - Add login page
   - Implement Google OAuth
   - Store user credentials

2. **Add Token Refresh:**
   - Implement refresh token mechanism
   - Auto-refresh before expiry

3. **Add User Management:**
   - Create user registration
   - Add user profiles
   - Implement role-based access

---

## ✅ Summary

**What works now:**
- ✅ Generate JWT tokens for testing
- ✅ Frontend automatically sends tokens
- ✅ Backend verifies tokens
- ✅ Clients can be created with auth
- ✅ Data persists in database

**To use:**
1. Generate token: `python3 generate_token.py`
2. Set in browser: `localStorage.setItem('legalindia_jwt_token', 'TOKEN')`
3. Create clients normally
4. Verify: `python3 test_client_autocheck.py`

---

**Ready to test!** 🚀

Run: `python3 generate_token.py` to get started.

