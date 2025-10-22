# 🔧 VERCEL ENVIRONMENT VARIABLE FIX

**Issue:** Frontend showing "Offline Mode - Limited Functionality"  
**Date:** 2025-10-22 02:26 AM  
**Status:** 🚨 **ENVIRONMENT VARIABLE MISSING**

---

## 🚨 **PROBLEM**

The deployed frontend at `legalindia.ai/app` is showing:
```
"Offline Mode - Limited Functionality"
Research Summary for: "bail"
```

This indicates the frontend **cannot reach the backend** because the environment variable is not configured in Vercel.

---

## 🔍 **ROOT CAUSE**

### **Missing Environment Variable in Vercel:**
- `NEXT_PUBLIC_BACKEND_URL` is either:
  - ❌ Not set in Vercel environment variables
  - ❌ Set to incorrect URL
  - ❌ Not accessible from the frontend

---

## ✅ **SOLUTION**

### **Step 1: Set Environment Variables in Vercel**

Go to Vercel Dashboard:
1. Navigate to your project: **lindia-f-work**
2. Go to **Settings** → **Environment Variables**
3. Add/Update these variables:

```bash
NEXT_PUBLIC_BACKEND_URL=https://lindia-b-production.up.railway.app
NEXT_PUBLIC_AI_URL=https://lindia-ai-production.up.railway.app
NEXTAUTH_URL=https://legalindia.ai
NEXTAUTH_SECRET=<your-secret-key>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### **Step 2: Verify URL Format**
- ✅ Use `https://` (not `http://`)
- ✅ No trailing slash at the end
- ✅ Correct Railway URL: `lindia-b-production.up.railway.app`

### **Step 3: Apply to All Environments**
Make sure to set these for:
- ✅ Production
- ✅ Preview
- ✅ Development

### **Step 4: Redeploy**
After setting environment variables:
1. Go to **Deployments**
2. Click on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing build cache"** (or clear it if needed)

---

## 🔍 **CURRENT CONFIGURATION**

### **Local (.env.local):**
```bash
NEXT_PUBLIC_BACKEND_URL=https://lindia-b-production.up.railway.app
NEXT_PUBLIC_AI_URL=https://lindia-ai-production.up.railway.app
```

### **Vercel (vercel.json):**
```json
{
  "env": {
    "NEXT_PUBLIC_BACKEND_URL": "https://api.legalindia.ai",
    "NEXT_PUBLIC_ENV": "production"
  }
}
```

**Issue:** The `vercel.json` has `api.legalindia.ai` but this might not be resolving correctly.

---

## 🎯 **RECOMMENDED FIX**

### **Option 1: Update vercel.json (Quick Fix)**

Update the backend URL to point directly to Railway:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm ci",
  "env": {
    "NEXT_PUBLIC_BACKEND_URL": "https://lindia-b-production.up.railway.app",
    "NEXT_PUBLIC_AI_URL": "https://lindia-ai-production.up.railway.app",
    "NEXT_PUBLIC_ENV": "production"
  }
}
```

### **Option 2: Set in Vercel Dashboard (Recommended)**

Don't rely on `vercel.json` for sensitive variables. Instead:
1. Go to Vercel Dashboard → Environment Variables
2. Set all variables there
3. Remove `env` section from `vercel.json`

---

## 📊 **TESTING**

### **After Setting Environment Variables:**

1. **Check if variables are loaded:**
   - Open browser console on deployed site
   - Type: `console.log(process.env.NEXT_PUBLIC_BACKEND_URL)`
   - Should show: `https://lindia-b-production.up.railway.app`

2. **Test backend connectivity:**
   - Go to: `https://lindia-b-production.up.railway.app/health`
   - Should return: `{"status":"healthy","version":"1.0.4"}`

3. **Test frontend:**
   - Try a research query: "bail"
   - Should get AI response (not "Offline Mode")
   - Should take ~60 seconds (within 120s timeout)

---

## 🚨 **CURRENT ISSUE ANALYSIS**

### **Why "Offline Mode"?**

Looking at the screenshot:
```
"Offline Mode - Limited Functionality"
Research Summary for: "bail"
Generated: 22/10/2025, 02:26:11
```

The frontend code checks backend health and if it fails, enters "Offline Mode". This happens when:

1. **`NEXT_PUBLIC_BACKEND_URL` is empty/undefined**
   ```typescript
   // src/lib/config.ts
   export const isBackendConfigured = (): boolean => {
     return !!config.apiBase && config.apiBase.trim() !== '';
   };
   ```

2. **Backend health check fails**
   ```typescript
   // src/lib/config.ts
   export const checkBackendHealth = async (): Promise<boolean> => {
     if (!isBackendConfigured()) {
       return false; // ← This triggers Offline Mode
     }
     // ... health check
   };
   ```

---

## ✅ **ACTION ITEMS**

### **Immediate:**
1. ✅ Go to Vercel Dashboard
2. ✅ Set `NEXT_PUBLIC_BACKEND_URL` environment variable
3. ✅ Set `NEXT_PUBLIC_AI_URL` environment variable
4. ✅ Redeploy

### **Verify:**
1. ✅ Check browser console for environment variables
2. ✅ Test backend health endpoint
3. ✅ Test research query
4. ✅ Confirm no "Offline Mode" message

---

## 📝 **CHECKLIST**

- [ ] Set `NEXT_PUBLIC_BACKEND_URL` in Vercel
- [ ] Set `NEXT_PUBLIC_AI_URL` in Vercel
- [ ] Set `NEXTAUTH_URL` in Vercel
- [ ] Set `NEXTAUTH_SECRET` in Vercel
- [ ] Redeploy from Vercel Dashboard
- [ ] Test backend connectivity
- [ ] Test research query
- [ ] Verify "Offline Mode" is gone

---

## 🔗 **REFERENCES**

### **Vercel Documentation:**
- Environment Variables: https://vercel.com/docs/projects/environment-variables
- Deployment: https://vercel.com/docs/deployments/overview

### **Your Services:**
- Frontend: https://legalindia.ai
- Backend: https://lindia-b-production.up.railway.app
- AI Engine: https://lindia-ai-production.up.railway.app

---

**Report Generated:** 2025-10-22 02:26 AM  
**Status:** 🚨 **ACTION REQUIRED - SET ENVIRONMENT VARIABLES IN VERCEL**

---

**Next Step:** Go to Vercel Dashboard and set the environment variables, then redeploy.

