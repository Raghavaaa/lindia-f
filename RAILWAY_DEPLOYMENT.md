# Railway Deployment Guide - LegalIndia Backend

**Repository:** https://github.com/Raghavaaa/lindia-b  
**Latest Commit:** 14a0c85

---

## ✅ Pre-Deployment Checklist

- [x] `requirements.txt` - Contains all dependencies
- [x] `Procfile` - Configured for Gunicorn + Uvicorn
- [x] `main.py` - FastAPI app with CORS and middleware
- [x] Authentication utilities implemented
- [x] AI service layer implemented
- [x] Research controller implemented
- [x] Code pushed to GitHub

---

## 🚀 Railway Deployment Steps

### Step 1: Create New Project on Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **`Raghavaaa/lindia-b`**
5. Railway will automatically detect the Python project

### Step 2: Configure Environment Variables

Add the following environment variables in Railway dashboard:

#### Required Variables:

```env
# Database (if using Railway PostgreSQL)
DATABASE_URL=postgresql+asyncpg://user:pass@host:port/dbname

# Redis (if using Railway Redis)
REDIS_URL=redis://default:password@host:port

# Authentication
JWT_SECRET=<generate_secure_random_string>
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt_hash_of_admin_password>

# AI Engine
AI_ENGINE_URL=https://ai.legalindia.ai/inference

# MinIO/S3 Storage
MINIO_ENDPOINT=<minio_endpoint>
MINIO_ACCESS_KEY=<access_key>
MINIO_SECRET_KEY=<secret_key>
MINIO_BUCKET=legalindia-docs
MINIO_SECURE=true

# Optional External Services
DEEPSEEK_API_KEY=<api_key_if_using>
INFERENCE_ENDPOINT=<worker_endpoint>
QDRANT_URL=<qdrant_url_if_direct_access>

# Application Config
LOG_LEVEL=info
FRONTEND_ORIGIN=https://legalindia.ai

# Observability (Optional)
SENTRY_DSN=<sentry_dsn_for_error_tracking>
```

### Step 3: Generate Secrets

**JWT_SECRET:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

**ADMIN_PASSWORD_HASH:**
```bash
python -c "from passlib.hash import bcrypt; print(bcrypt.hash('your_admin_password'))"
```

### Step 4: Deploy

1. Click **"Deploy"** in Railway
2. Railway will:
   - Pull code from GitHub
   - Install dependencies from `requirements.txt`
   - Run the command from `Procfile`
3. Monitor deployment logs

### Step 5: Verify Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-app.up.railway.app/

# API documentation
https://your-app.up.railway.app/docs

# OpenAPI spec
https://your-app.up.railway.app/openapi.json
```

---

## 📦 What's Deployed

### Core Components:
- ✅ FastAPI application with auto-documentation
- ✅ CORS middleware (configured for https://legalindia.ai)
- ✅ Request logging middleware
- ✅ Authorization middleware (JWT parsing)
- ✅ Automatic router registration
- ✅ Health check endpoint: `GET /`

### Services:
- ✅ AI Service (`app/services/ai_service.py`)
  - Async HTTP client for AI engine
  - Retry logic with exponential backoff
  - Response mapping to InferenceResponse

### Controllers:
- ✅ Research Controller (`app/controllers/research_controller.py`)
  - Input sanitization and validation
  - Context templating
  - Error handling (400, 413, 502, 500)

### Authentication:
- ✅ JWT utilities (`app/utils/auth.py`)
  - Token creation/validation
  - Password hashing (bcrypt)
  - FastAPI dependencies for protected routes

### Placeholders (Ready for Implementation):
- ⏳ Database models (SQLAlchemy)
- ⏳ API routers (auth, users, clients, documents, research, jobs)
- ⏳ External adapters (Redis, MinIO, Qdrant)
- ⏳ Testing infrastructure

---

## 🔧 Railway Configuration

### Procfile Command:
```
web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

This runs:
- 4 worker processes
- Uvicorn ASGI workers
- Gunicorn process manager (production-ready)

### Resource Requirements:
- **Memory:** Minimum 512MB, Recommended 1GB+
- **CPU:** 1 vCPU sufficient for MVP
- **Storage:** Minimal (code only, no file uploads yet)

---

## 🔍 Post-Deployment Verification

### 1. Check Health Endpoint
```bash
curl https://your-app.up.railway.app/
# Expected: {"service": "LegalIndia Backend", "status": "Active", "version": "1.0.0"}
```

### 2. Access API Documentation
```
https://your-app.up.railway.app/docs
```

### 3. Test Authentication (if configured)
```bash
curl -X POST https://your-app.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

---

## 🚨 Troubleshooting

### Common Issues:

**1. Deployment fails with "No module named 'X'"**
- Check `requirements.txt` includes the module
- Railway automatically installs from requirements.txt

**2. App crashes on startup**
- Check Railway logs
- Verify all required environment variables are set
- Ensure JWT_SECRET is configured

**3. CORS errors in frontend**
- Verify FRONTEND_ORIGIN environment variable
- Check main.py CORS configuration

**4. AI service fails**
- Verify AI_ENGINE_URL is set
- Check AI engine is accessible from Railway
- Review logs for connection errors

---

## 📊 Monitoring

### Railway Dashboard:
- **Logs:** Real-time application logs
- **Metrics:** CPU, Memory, Network usage
- **Deployments:** History and rollback options

### Application Logs:
All logs include structured fields:
- HTTP method, path, status code, latency
- User ID (when authenticated)
- Module context (e.g., module=research)

---

## 🔄 Updates & Rollback

### Deploy Updates:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```
Railway auto-deploys on push to main branch.

### Rollback:
1. Go to Railway dashboard
2. Navigate to Deployments
3. Click on a previous successful deployment
4. Click "Redeploy"

---

## 📝 Next Steps After Deployment

1. **Test all endpoints** via `/docs`
2. **Monitor error rates** in Railway logs
3. **Configure custom domain** (optional)
4. **Set up database** (PostgreSQL plugin in Railway)
5. **Implement remaining API routers**
6. **Add Redis for caching** (Redis plugin in Railway)
7. **Configure MinIO** for document storage
8. **Set up CI/CD** with GitHub Actions

---

## 🔐 Security Notes

- ✅ JWT_SECRET must be strong and unique
- ✅ Never commit `.env` file to repository
- ✅ Use Railway's secret management for sensitive values
- ✅ CORS restricted to frontend domain
- ✅ No secrets in logs or error responses

---

**Deployment Status:** ✅ Ready for Railway deployment  
**Latest Push:** Commit 14a0c85 to https://github.com/Raghavaaa/lindia-b

