# 🚀 Deploy Frontend Updates to Production

## ✅ What's Ready to Deploy:

### New Features:
1. **Backend Integration** - Frontend now calls PostgreSQL backend
2. **JWT Authentication** - Secure client management
3. **Login Page** - Easy token input at `/login`
4. **API Client Library** - Clean API wrapper
5. **Error Handling** - Graceful fallback to localStorage

---

## 📦 Files to Deploy:

```
✅ frontend/src/lib/api/client-api.ts      - NEW
✅ frontend/src/app/app/page.tsx           - UPDATED
✅ frontend/src/app/login/page.tsx         - NEW
✅ frontend/src/hooks/use-toast.ts         - NEW
```

---

## 🚀 Deployment Steps:

### If using Vercel:

```bash
cd /Users/raghavankarthik/ai-law-junior/frontend

# Add files
git add src/lib/api/client-api.ts
git add src/app/app/page.tsx
git add src/app/login/page.tsx
git add src/hooks/use-toast.ts

# Commit
git commit -m "feat: integrate frontend with backend API for client management

- Add API client library for backend integration
- Update app page to fetch clients from PostgreSQL
- Create login page for JWT token input
- Add toast notifications for user feedback
- Graceful fallback to localStorage on API errors"

# Push (triggers auto-deploy)
git push origin main
```

### If using other platforms:

Just push to your git repository and your deployment platform will auto-deploy!

---

## ⚙️ Environment Variables (Production):

Make sure your production frontend has:

```env
NEXT_PUBLIC_API_URL=https://api.legalindia.ai
```

This should already be set from previous deployments.

---

## 🧪 Test After Deployment:

### 1. Generate Token:
```bash
cd legalindia-backend
python3 generate_token.py
```

### 2. Test Login Page:
```
https://legalindia.ai/login
```
- Paste token
- Click "Login to Dashboard"
- Should redirect to `/app`

### 3. Test Client Creation:
```
https://legalindia.ai/app
```
- Click "+ New"
- Create a client
- Check backend: `curl -H "Authorization: Bearer TOKEN" https://api.legalindia.ai/clients/`
- Should see the new client!

---

## 🔄 Migration Notes:

### Existing Users (with localStorage clients):

**No data loss!** The new version:
1. **First tries** to load from backend API
2. **Falls back** to localStorage if API fails
3. **New clients** created after deployment → saved to PostgreSQL
4. **Old clients** from localStorage → still accessible

### Optional: Migrate localStorage to Backend

If you want to move existing localStorage clients to the backend:

```javascript
// In browser console at https://legalindia.ai/app
const oldClients = JSON.parse(localStorage.getItem('legalindia_clients') || '[]');
const token = localStorage.getItem('legalindia_jwt_token');

for (const client of oldClients) {
  fetch('https://api.legalindia.ai/api/v1/clients/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: client.name,
      phone: client.phone
    })
  }).then(r => r.json()).then(console.log);
}
```

---

## 📊 Monitoring:

### Check Deployment Status:

**Vercel Dashboard:**
- Go to: https://vercel.com/dashboard
- Find your project
- Check latest deployment
- View logs for any errors

**Test Endpoints:**
```bash
# Health check
curl https://legalindia.ai/

# API connection (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.legalindia.ai/clients/
```

---

## 🐛 Rollback Plan (if needed):

If something goes wrong:

```bash
cd frontend

# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback in Vercel Dashboard:
# Deployments → Previous Deployment → "Promote to Production"
```

---

## ✅ Post-Deployment Checklist:

- [ ] Frontend deployed successfully
- [ ] Login page accessible at `/login`
- [ ] Can paste JWT token and login
- [ ] Dashboard loads at `/app`
- [ ] Can create new client
- [ ] Client appears in backend API
- [ ] Client persists after refresh
- [ ] Error handling works (test without token)

---

## 🎉 Success Criteria:

✅ **Login Page** - Users can enter JWT token
✅ **Client Creation** - New clients saved to PostgreSQL
✅ **Client List** - Fetched from backend API
✅ **Error Handling** - Graceful fallback to localStorage
✅ **Toast Notifications** - User feedback on actions
✅ **No Breaking Changes** - Existing features still work

---

## 📞 Support:

If users ask "where do I get a token?":

**Answer:**
```
Generate a JWT token by running:
python3 legalindia-backend/generate_token.py

Or contact admin for a token.
```

For production users, you might want to create a proper user registration/login system later, but for now, this token-based approach works!

---

## 🔐 Security Notes:

1. **JWT tokens expire** after 30 days (configurable in backend)
2. **Tokens are user-specific** - each user has their own clients
3. **HTTPS required** in production for security
4. **CORS configured** - only your frontend can access the API

---

## 🚀 Deploy Now!

Run these commands to deploy:

```bash
cd /Users/raghavankarthik/ai-law-junior/frontend

git add .
git commit -m "feat: integrate frontend with PostgreSQL backend"
git push origin main
```

Your deployment platform will automatically build and deploy! 🎉

