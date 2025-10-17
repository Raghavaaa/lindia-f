# 🔗 Connect Railway Postgres to Your App

## Current Status:
- ✅ `lindia-b` service deployed successfully
- ✅ Postgres database available in Railway
- ⚠️ App still using SQLite (not connected to Postgres)

---

## 🎯 **Step 1: Connect Postgres to Your App**

### In Railway Dashboard:

1. **Go to your `lindia-b` service** (not Postgres)
2. **Click "Variables" tab**
3. **Look for `DATABASE_URL`** - it should be auto-populated
4. **If not there, click "New Variable"** and add:
   - **Name:** `DATABASE_URL`
   - **Value:** (Railway should auto-fill this from Postgres service)

### Alternative Method:
1. **Go to Postgres service**
2. **Click "Connect" button**
3. **Copy the connection string**
4. **Go to `lindia-b` service → Variables**
5. **Add `DATABASE_URL` with the connection string**

---

## 🎯 **Step 2: Redeploy Your App**

After adding `DATABASE_URL`:

1. **Go to `lindia-b` service**
2. **Click "Deployments" tab**
3. **Click "Redeploy" on latest deployment**
4. **Wait for deployment to complete**

---

## 🎯 **Step 3: Verify Connection**

### Check Railway Logs:
Look for these messages:
```
✅ Initializing database tables...
✅ Database tables ready
```

### Check Postgres Database:
1. **Go to Postgres service**
2. **Click "Database" tab**
3. **You should now see:**
   - `uploads` table
   - Other tables created by your app

---

## 🔧 **Manual Setup (If Auto-connection Fails)**

### Get Postgres Connection Details:
1. **Go to Postgres service**
2. **Click "Variables" tab**
3. **Note these values:**
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

### Create DATABASE_URL:
```
postgresql://PGUSER:PGPASSWORD@PGHOST:PGPORT/PGDATABASE
```

### Add to lindia-b Variables:
- **Name:** `DATABASE_URL`
- **Value:** The connection string above

---

## 🧪 **Test Your Setup**

### 1. Check App Health:
```bash
curl https://YOUR-APP.railway.app/
```

### 2. Test Upload (with JWT):
```bash
curl -X POST https://YOUR-APP.railway.app/upload/property \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test.pdf"
```

### 3. Check Database:
- Go to Postgres → Database tab
- Should see `uploads` table with data

---

## 🎯 **Expected Results After Connection:**

### Railway Logs:
```
✅ Building with Dockerfile...
✅ Installing dependencies...
✅ Starting gunicorn...
✅ Initializing database tables...
✅ Database tables ready
✅ Application startup complete
✅ Healthcheck passed
```

### Postgres Database:
- ✅ `uploads` table created
- ✅ Proper indexes on `user_id`, `file_id`
- ✅ Data persists between deployments

---

## 🆘 **Troubleshooting**

### If DATABASE_URL is not auto-populated:
1. **Check if services are in same project**
2. **Try manual connection string**
3. **Redeploy after adding variable**

### If tables still not created:
1. **Check Railway logs for database errors**
2. **Verify DATABASE_URL format**
3. **Check Postgres service is running**

### If app crashes:
1. **Check logs for connection errors**
2. **Verify Postgres credentials**
3. **Check network connectivity**

---

## ✅ **Your App is Ready!**

Once connected:
- ✅ **Persistent data** in Postgres
- ✅ **File uploads** with user isolation
- ✅ **JWT authentication**
- ✅ **Auto-scaling** on Railway
- ✅ **Production-ready** deployment

---

**Next Steps:**
1. Connect Postgres to your app (5 minutes)
2. Redeploy (2 minutes)
3. Test uploads (1 minute)
4. **Your backend is live!** 🚀
