# 🔧 Fix: Client Endpoints Not Showing in Production

## 🎯 Problem Identified:

Client endpoints (`/clients/`) are **NOT appearing** in production Swagger UI at:
- https://api.legalindia.ai/docs

This means the client routes are **failing to register** during deployment.

---

## ✅ Solution: Update schemas/__init__.py

The client routes require schemas but they may not be exported properly.

### Fix the schemas/__init__.py file:

```python
# app/schemas/__init__.py

# Client schemas
from app.schemas.client_schema import (
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientListResponse
)

# Upload schemas  
from app.schemas.upload_schema import (
    UploadResponse,
    UploadListResponse
)

# Request/Response schemas
from app.schemas.request_schema import *
from app.schemas.response_schema import *

__all__ = [
    # Client
    "ClientCreate",
    "ClientUpdate", 
    "ClientResponse",
    "ClientListResponse",
    # Upload
    "UploadResponse",
    "UploadListResponse",
]
```

---

## 🚀 Deploy to Production:

After fixing schemas/__init__.py:

```bash
cd /Users/raghavankarthik/ai-law-junior/legalindia-backend

# Commit changes
git add app/schemas/__init__.py
git commit -m "fix: export client schemas for route registration"
git push origin main

# Railway will auto-deploy
```

---

## ✅ Verify After Deploy:

1. Wait 2-3 minutes for Railway to redeploy
2. Check Swagger UI: https://api.legalindia.ai/docs
3. Look for **"Client Management"** section
4. Should see endpoints:
   - GET /clients/
   - POST /clients/
   - GET /clients/{client_id}
   - etc.

---

## 🔍 Check Railway Logs:

To see if there are registration errors:

```bash
# Using Railway CLI
railway logs

# Or check Railway Dashboard → lindia-b service → Deployments → Logs
```

Look for:
- ✅ "Registered router: app.routes.client"
- ❌ "Failed to register router from client: ..."

---

## 🎯 Alternative: Manual Router Registration

If auto-registration is failing, add manual registration to main.py:

```python
# In main.py, after the app definition:

from app.routes import client

app.include_router(client.router, prefix="/api/v1")
```

Then commit and push.

---

## 📋 Checklist:

- [ ] Update `app/schemas/__init__.py` with client schema exports
- [ ] Commit changes
- [ ] Push to trigger Railway deployment
- [ ] Wait for deployment (2-3 min)
- [ ] Check https://api.legalindia.ai/docs for Client Management section
- [ ] Test client endpoints with JWT token

---

## 🆘 If Still Not Working:

1. **Check Railway logs** for errors
2. **Verify all files deployed:**
   - app/routes/client.py
   - app/schemas/client_schema.py
   - app/models/client.py
3. **Check dependencies** in requirements.txt
4. **Manually include router** in main.py as shown above

---

**Next Step:** Update schemas/__init__.py and redeploy!

