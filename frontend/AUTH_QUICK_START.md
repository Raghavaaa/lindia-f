# 🚀 Frontend Auth - Quick Start

## ⚡ 30-Second Setup

### 1. Get Token from Backend

```bash
cd ../legalindia-backend
python3 generate_token.py
```

Copy the token output!

### 2. Set Token in Browser

Open browser console (F12) and run:

```javascript
localStorage.setItem('legalindia_jwt_token', 'PASTE_YOUR_TOKEN_HERE');
location.reload();
```

### 3. Done!

All API calls now include authentication. Create clients and they'll save to database!

---

## 🔧 For Development

### Set Test Token in Code

```typescript
// In your component or page
import { setTestToken } from '@/lib/auth-helper';

useEffect(() => {
  setTestToken(); // Uses default test user
}, []);
```

⚠️ **Note:** Update the token in `auth-helper.ts` with a fresh one from `generate_token.py`

---

## ✅ Verify It's Working

1. Check token is set:
```javascript
console.log(localStorage.getItem('legalindia_jwt_token'));
// Should output your token
```

2. Check Network tab:
- Open DevTools → Network
- Make an API call (create client)
- Check request headers:
  ```
  Authorization: Bearer eyJhbGci...
  ```

3. Check database:
```bash
cd ../legalindia-backend
python3 test_client_autocheck.py
```

Should show clients > 0!

---

## 📖 Available Auth Functions

```typescript
import {
  loginWithToken,
  logout,
  isAuthenticated,
  getUserFromToken,
  setTestToken
} from '@/lib/auth-helper';

// Login
loginWithToken('your_token');

// Check if logged in
if (isAuthenticated()) {
  const user = getUserFromToken();
  console.log(user?.userId);
}

// Logout
logout();

// Set test token (dev only)
setTestToken('test_user_123');
```

---

## 🎯 Integration Complete

✅ JWT tokens automatically included in all API calls  
✅ Token persists across page reloads  
✅ Easy login/logout functions  
✅ User info extraction from token  

**All `apiFetch` calls now include auth!**

No need to manually add Authorization headers - it's automatic!

---

**Need help?** Check `SETUP_JWT_AUTH.md` for full documentation.

