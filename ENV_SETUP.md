# Environment Variables Setup Guide

## Quick Setup

### For Local Development

1. Create `.env.local` file in the frontend directory:
```bash
cd /Users/raghavankarthik/lindia-b/frontend
touch .env.local
```

2. Add the following content:
```bash
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_API_KEY=demo_api_key_12345
```

3. Restart the development server:
```bash
npm run dev
```

---

### For Production Build (Local Testing)

1. Create `.env.production` file:
```bash
cd /Users/raghavankarthik/lindia-b/frontend
touch .env.production
```

2. Add the following content:
```bash
# Production Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=https://lindia-b-production.up.railway.app
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_API_KEY=demo_api_key_12345
```

3. Build and start:
```bash
npm run build
npm run start
```

---

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://lindia-b-production.up.railway.app` | Production |
| `NEXT_PUBLIC_ENV` | `production` | Production |
| `NEXT_PUBLIC_API_KEY` | Your production API key | Production |

4. Redeploy your application

---

### For Railway Deployment

1. Go to your Railway project dashboard
2. Navigate to **Variables** tab
3. Add the following variables:
```
NEXT_PUBLIC_BACKEND_URL=https://lindia-b-production.up.railway.app
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_API_KEY=demo_api_key_12345
```

4. Railway will automatically redeploy

---

## Variable Descriptions

### `NEXT_PUBLIC_BACKEND_URL` (Required)
- **Description**: Full URL of the backend API
- **Format**: Must NOT include trailing slash
- **Local**: `http://localhost:8000`
- **Production**: `https://lindia-b-production.up.railway.app`

### `NEXT_PUBLIC_ENV` (Optional)
- **Description**: Environment identifier
- **Values**: `development` or `production`
- **Default**: `production`

### `NEXT_PUBLIC_API_KEY` (Optional)
- **Description**: API key for backend authentication
- **Format**: String
- **Default**: `demo_api_key_12345`
- **Security**: Replace with secure key in production

---

## Verification

### Check if variables are loaded:

**In terminal:**
```bash
echo $NEXT_PUBLIC_BACKEND_URL
```

**In browser console:**
```javascript
console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
```

### Test backend connection:

**In browser console:**
```javascript
fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/health')
  .then(r => r.json())
  .then(data => console.log('Backend health:', data))
```

---

## Common Issues

### Variables not loading
- **Cause**: Development server not restarted
- **Solution**: Restart with `npm run dev`

### Variables undefined in browser
- **Cause**: Missing `NEXT_PUBLIC_` prefix
- **Solution**: All client-side variables must start with `NEXT_PUBLIC_`

### Backend not reachable
- **Cause**: Wrong URL or backend is down
- **Solution**: 
  1. Check backend is running
  2. Verify URL is correct (no trailing slash)
  3. Check CORS configuration

### 401 Unauthorized
- **Cause**: API key mismatch
- **Solution**: Verify `NEXT_PUBLIC_API_KEY` matches backend expectation

---

## Security Best Practices

1. ✅ **Never commit `.env.local` to git** (already in .gitignore)
2. ✅ **Use different keys for development and production**
3. ✅ **Rotate API keys periodically**
4. ✅ **Don't store secrets in `NEXT_PUBLIC_*` variables** (they're exposed to browser)
5. ✅ **Use environment-specific variable files**

---

## Default Configuration

If no environment variables are set, the application will use these defaults:

```typescript
{
  apiBase: 'https://lindia-b-production.up.railway.app',
  environment: 'production',
  apiKey: 'demo_api_key_12345',
  timeouts: {
    health: 5000,      // 5 seconds
    standard: 90000,   // 90 seconds
    quick: 30000       // 30 seconds
  }
}
```

This means the app will work out-of-the-box with the production backend!

---

## Testing Different Backends

To test with different backend URLs without changing files:

```bash
# Set temporary environment variable
NEXT_PUBLIC_BACKEND_URL=https://staging-backend.example.com npm run dev

# Or export for session
export NEXT_PUBLIC_BACKEND_URL=https://staging-backend.example.com
npm run dev
```

---

## Troubleshooting

### Problem: "Backend Not Configured" message
**Solution:**
```bash
# Check if variable is set
echo $NEXT_PUBLIC_BACKEND_URL

# If empty, set it
export NEXT_PUBLIC_BACKEND_URL=https://lindia-b-production.up.railway.app

# Restart dev server
npm run dev
```

### Problem: CORS errors
**Solution:**
1. Backend must allow your frontend origin
2. Check backend CORS configuration:
```python
# Backend should have:
allow_origins=["https://your-frontend.vercel.app"]
```

### Problem: Variables work locally but not in production
**Solution:**
1. Verify variables are set in deployment platform (Vercel/Railway)
2. Ensure variables are set for correct environment
3. Redeploy application after adding variables

---

## Quick Copy-Paste

### .env.local (Development)
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_API_KEY=demo_api_key_12345
```

### .env.production (Production)
```bash
NEXT_PUBLIC_BACKEND_URL=https://lindia-b-production.up.railway.app
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_API_KEY=demo_api_key_12345
```

---

## Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway Environment Variables Guide](https://docs.railway.app/develop/variables)

---

**Last Updated:** October 22, 2025

