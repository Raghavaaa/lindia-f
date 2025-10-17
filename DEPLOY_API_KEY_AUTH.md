# 🚀 Deploy API Key Authentication - Step by Step

## ✅ Code Changes Complete!

All code has been committed and pushed:
- ✅ Backend: API key authentication implemented
- ✅ Frontend: Updated to use X-API-Key header
- ✅ Documentation: Migration guide created

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Update Railway Environment Variable

**CRITICAL:** Railway needs the new API key!

1. **Go to:** https://railway.app
2. **Select:** lindia-b service (backend)
3. **Click:** Variables tab
4. **Add new variable:**
   - **Name:** `API_SECRET_KEY`
   - **Value:** `legalindia_secure_api_key_2025`
5. **Delete old variable:**
   - **Name:** `JWT_SECRET` (no longer needed)
6. **Click:** "Deploy" or wait for auto-deploy

---

### Step 2: Wait for Deployment

- Railway will automatically rebuild and deploy
- Wait **2-3 minutes**
- Check: Railway Dashboard → lindia-b → Deployments
- Status should show: **"Active"** or **"Success"**

---

### Step 3: Test Production Backend

```bash
# Test 1: Health check (no auth required)
curl https://api.legalindia.ai/

# Expected: {"service":"LegalIndia Backend","status":"Active","version":"1.0.0"}
```

```bash
# Test 2: Database status (no auth required)
curl https://api.legalindia.ai/db-status

# Expected: {"database_connected":true,"tables":["uploads","clients"],...}
```

```bash
# Test 3: List clients (API key required)
curl https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025'

# Expected: {"clients":[],"total":0}
```

```bash
# Test 4: Create client (API key required)
curl -X POST https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Client","email":"test@example.com","phone":"1234567890"}'

# Expected: {"client_id":"...","name":"Test Client",...}
```

```bash
# Test 5: Verify client was saved
curl https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025'

# Expected: {"clients":[{"name":"Test Client",...}],"total":1}
```

---

### Step 4: Test Frontend

1. **Open:** Your frontend URL (wherever it's deployed)
2. **Navigate to:** /app page
3. **Create a client:**
   - Name: "Frontend Test"
   - Email: "frontend@test.com"
   - Phone: "9999999999"
4. **Click:** "Create" or "Save"
5. **Verify:** Client appears in the list immediately
6. **Refresh the page:** Client should still be there (saved in PostgreSQL!)

---

### Step 5: Verify in Swagger UI

1. **Go to:** https://api.legalindia.ai/docs
2. **Click:** "Authorize" button (lock icon at top)
3. **In the popup:**
   - **APIKeyHeader (X-API-Key):**
   - **Value:** `legalindia_secure_api_key_2025`
4. **Click:** "Authorize" → "Close"
5. **Try:** GET /clients/ → "Try it out" → "Execute"
6. **Expected:** See all your test clients listed

---

## ✅ SUCCESS CRITERIA

| Test | Expected Result | Status |
|------|----------------|---------|
| Backend health check | Returns service info | ⏳ Test |
| Database status | Connected = true | ⏳ Test |
| List clients (no key) | 401 Unauthorized | ⏳ Test |
| List clients (with key) | Returns clients array | ⏳ Test |
| Create client | 201 Created | ⏳ Test |
| Client persists | Visible after refresh | ⏳ Test |
| Frontend works | No login required | ⏳ Test |

---

## 🔧 Troubleshooting

### If backend returns "API_SECRET_KEY not configured":
- Railway variable not set
- Go back to Step 1

### If backend returns "Invalid API key":
- Key mismatch between frontend and Railway
- Check Railway variable value exactly matches: `legalindia_secure_api_key_2025`

### If frontend can't create clients:
- Check browser console for errors
- Verify frontend deployed with latest code
- Check `NEXT_PUBLIC_API_KEY` if using env var

### If Railway deployment fails:
- Check Railway logs: Dashboard → lindia-b → Deployments → Logs
- Look for:
  - `ImportError: email-validator` → Already fixed in requirements.txt
  - Module import errors → Check file paths
  - Database connection errors → Check DATABASE_URL

---

## 📋 Post-Deployment Checklist

After successful deployment:

- [ ] Delete all JWT-related files (optional cleanup):
  - `generate_token.py`
  - `GET_BROWSER_TOKEN.txt`
  - `SETUP_JWT_AUTH.md`
  - `EXACT_JWT_SECRET.txt`

- [ ] Update team documentation

- [ ] Consider changing API key to a more secure random value:
  ```bash
  # Generate secure key
  python3 -c "import secrets; print(secrets.token_urlsafe(32))"
  # Update in Railway and frontend
  ```

- [ ] Add rate limiting (optional future enhancement)

- [ ] Set up monitoring/alerts

---

## 🎉 What You Get

With API key authentication:

✅ **Reliability:** No more token mismatch errors
✅ **Simplicity:** No login page needed
✅ **Stability:** Works across all deployments
✅ **Ease:** One environment variable to manage
✅ **Speed:** App loads instantly, no auth flow

---

## 📞 Support

If you encounter issues:

1. Check Railway deployment logs
2. Test backend endpoints with curl
3. Check browser console for frontend errors
4. Review `API_KEY_AUTH_MIGRATION.md`

---

**Ready to Deploy!** 🚀

1. Update Railway `API_SECRET_KEY`
2. Wait for deployment
3. Test with curl
4. Test frontend
5. Celebrate! 🎉

