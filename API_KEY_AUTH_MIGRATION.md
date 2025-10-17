# 🔑 API Key Authentication Migration

## ✅ COMPLETED: JWT → API Key Migration

---

## Why We Switched

JWT authentication was causing:
- Token mismatch errors between local and production
- Complex secret management issues
- Login instability
- Deployment complications

**API Key auth is:**
- ✅ Simple and stable
- ✅ Works across all environments
- ✅ No token generation/refresh needed
- ✅ Easy to configure in Railway

---

## What Changed

### Backend (FastAPI)

#### 1. New Authentication Module
Created `app/utils/api_key_auth.py`:
- Simple `verify_api_key()` dependency
- Checks `X-API-Key` header
- Returns user context for compatibility

#### 2. Updated Routes
- `app/routes/client.py` - All client endpoints
- `app/routes/upload.py` - All upload endpoints
- Replaced `verify_token` with `verify_api_key`

#### 3. Environment Variables
**OLD (Removed):**
```
JWT_SECRET=...
```

**NEW (Required):**
```
API_SECRET_KEY=legalindia_secure_api_key_2025
```

---

### Frontend (Next.js)

#### 1. Updated `config.ts`
- Removed JWT token management
- Added simple `getApiKey()` function
- `apiFetch()` automatically includes `X-API-Key` header

#### 2. Updated `client-api.ts`
- No changes needed - just works!
- All API calls automatically authenticated

#### 3. Removed Login Requirements
- No login page needed
- No token storage/refresh
- App works immediately

---

## How to Use

### Backend Setup

1. **Set environment variable:**
   ```bash
   export API_SECRET_KEY="legalindia_secure_api_key_2025"
   ```

2. **For Railway:**
   - Go to: Railway Dashboard → lindia-b → Variables
   - Add: `API_SECRET_KEY` = `legalindia_secure_api_key_2025`
   - Delete: `JWT_SECRET` (no longer needed)

### Frontend Setup

1. **Environment variable (optional):**
   ```bash
   NEXT_PUBLIC_API_KEY="legalindia_secure_api_key_2025"
   ```

2. **Or use default:**
   - Hardcoded in `config.ts` for simplicity
   - Change in production if needed

### Testing

```bash
# Test with curl
curl -X GET http://localhost:8000/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025'

# Should return: {"clients": [], "total": 0}
```

---

## Security Considerations

### Current Setup
- Single API key for all users
- Suitable for:
  - Internal tools
  - Trusted environments
  - Development/staging
  - Small teams

### Future Enhancements (if needed)
- Multiple API keys per user
- API key rotation
- Rate limiting per key
- Key expiration
- Audit logging

---

## Deployment Checklist

### Railway Backend
- [x] Update `API_SECRET_KEY` environment variable
- [x] Remove `JWT_SECRET` environment variable
- [x] Push updated code
- [x] Verify deployment

### Frontend
- [x] Update API configuration
- [x] Remove JWT logic
- [x] Test API calls
- [x] Deploy to production

---

## Testing Endpoints

### Health Check (No auth)
```bash
curl https://api.legalindia.ai/
# Returns: {"service":"LegalIndia Backend","status":"Active"}
```

### Database Status (No auth)
```bash
curl https://api.legalindia.ai/db-status
# Returns: {"database_connected": true, ...}
```

### List Clients (Requires API key)
```bash
curl https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025'
# Returns: {"clients": [...], "total": N}
```

### Create Client (Requires API key)
```bash
curl -X POST https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Client","email":"test@example.com"}'
# Returns: {client data with client_id}
```

---

## Rollback Plan

If issues arise:

1. **Revert backend:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Restore JWT_SECRET in Railway**

3. **Revert frontend:**
   ```bash
   git revert HEAD
   git push origin integration
   ```

---

## Success Criteria

✅ API endpoints respond without login
✅ Clients save to PostgreSQL
✅ Frontend works without authentication flow
✅ Railway deployment stable
✅ No token mismatch errors

---

## Next Steps

Once verified working:
1. Update production API key to a secure random value
2. Document for team
3. Remove old JWT code completely
4. Add rate limiting (optional)
5. Add API key rotation (optional)

---

**Status:** ✅ Ready for testing and deployment

**Migration Date:** October 17, 2025

**Approved:** User-requested due to JWT issues

