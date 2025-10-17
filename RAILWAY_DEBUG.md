# Railway Deployment Debug Guide

## ✅ Pre-Deployment Checklist

Run: `python railway_check.py`

All checks should pass before deploying.

---

## 🔍 Common Railway Errors & Solutions

### 1. **Build Failed: `pip: command not found`**
**Solution:** ✅ Fixed with `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["python39"]
```

### 2. **Build Failed: `postgresql_16.dev` missing**
**Solution:** ✅ Fixed - removed postgres from nixpacks, using psycopg2-binary instead

### 3. **Build Failed: `python-multipart` missing**
**Solution:** ✅ Fixed - added to requirements.txt

### 4. **Healthcheck Failed: Service Unavailable**
**Causes:**
- Server not binding to `$PORT`
- Database init blocking startup
- Worker timeout

**Solutions:** ✅ All fixed
- ✅ Procfile uses `--bind 0.0.0.0:$PORT`
- ✅ Database init has try-catch (non-blocking)
- ✅ Healthcheck timeout: 300s
- ✅ Worker timeout: 120s

### 5. **Application Crashes on Startup**
**Check Railway logs for:**
```
ModuleNotFoundError: No module named 'XXX'
```
**Solution:** Add missing package to requirements.txt

---

## 🚀 Deployment Process

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Your message"
git push origin main
```

### Step 2: Railway Auto-Deploys
Railway detects the push and starts deployment automatically.

### Step 3: Monitor Build Logs
In Railway dashboard:
1. Click your service
2. Go to "Deployments"
3. Click latest deployment
4. Click "View Logs"

### Step 4: Check Deployment Status

**✅ Successful Deployment Logs:**
```
✅ Installing dependencies...
✅ Successfully installed fastapi uvicorn gunicorn...
✅ Building...
✅ [INFO] Starting gunicorn 23.0.0
✅ [INFO] Listening at: http://0.0.0.0:XXXX
✅ Initializing database tables...
✅ Database tables ready
✅ Registered router: app.routes.upload
✅ Application startup complete
✅ Healthcheck passed
✅ Deployment successful
```

---

## 🧪 Testing Your Deployment

### Test Health Endpoint
```bash
curl https://YOUR_APP.railway.app/
```

**Expected Response:**
```json
{
  "service": "LegalIndia Backend",
  "status": "Active",
  "version": "1.0.0"
}
```

### Test Upload Endpoints
```bash
# List all routes
curl https://YOUR_APP.railway.app/docs

# Test with JWT token
curl -X POST https://YOUR_APP.railway.app/upload/property \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test.pdf"
```

---

## 🔧 Environment Variables on Railway

Set these in Railway dashboard → Your Service → Variables:

### Required (if using PostgreSQL):
- `DATABASE_URL` - Auto-provided by Railway if you add PostgreSQL

### Required for Auth:
- `JWT_SECRET` - Strong random string (48+ chars)
```bash
# Generate one:
openssl rand -base64 48
```

### Optional:
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD_HASH` - Bcrypt hash of admin password
- `MAX_FILE_SIZE` - Max upload size (default: 10MB)
- `STORAGE_PATH` - File storage path (default: /tmp on Railway)

---

## 📊 Monitoring

### View Live Logs
```bash
# Using Railway CLI
railway logs

# Or in dashboard:
Service → Deployments → View Logs
```

### Check Service Health
```bash
# Should return 200
curl -I https://YOUR_APP.railway.app/
```

### Check Database
Railway provides `/tmp/legalindia.db` for SQLite (ephemeral).
For persistent data, add PostgreSQL from Railway dashboard.

---

## 🆘 If Deployment Still Fails

1. **Check logs in Railway dashboard**
2. **Copy error message**
3. **Common fixes:**
   - Redeploy (clears cache)
   - Check environment variables
   - Verify GitHub repo is up to date
   - Check Railway service limits (free tier: 512MB RAM)

---

## ✅ Current Configuration Status

- ✅ Procfile: Correct PORT binding
- ✅ runtime.txt: Python 3.9
- ✅ requirements.txt: All dependencies including python-multipart
- ✅ railway.json: 300s healthcheck timeout
- ✅ nixpacks.toml: Simple Python 3.9 setup
- ✅ main.py: Non-blocking database init
- ✅ app/database.py: /tmp for Railway SQLite

**Your app is production-ready!** 🚀

