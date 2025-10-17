# 🧪 HOW TO TEST NOW - Simple 5-Minute Guide

## 🎯 THE 3 MOST IMPORTANT TESTS

### ✅ Test 1: Open Your Frontend (30 seconds)

**What to do:**
1. Open your frontend URL in a browser
2. Press F12 to open Developer Tools
3. Click the "Console" tab

**What you're checking:**
- Does the page load?
- Any red errors in console?

**Expected:**
- ✅ Page loads successfully
- ✅ No red errors about API key or authentication

---

### ✅ Test 2: Create a Client (1 minute)

**What to do:**
1. Navigate to `/app` page on your frontend
2. Fill in the client form:
   - Name: "Test Client 1"
   - Email: "test1@example.com"
   - Phone: "1234567890"
3. Click "Create" or "Save" button

**What you're checking:**
- Does the client appear in the list immediately?
- Any errors in console?

**Expected:**
- ✅ Client appears in the list
- ✅ Success message or confirmation
- ✅ No errors in console

---

### ✅ Test 3: Verify Database Persistence (30 seconds)

**What to do:**
1. On the `/app` page with your created client
2. Press F5 to refresh the page
3. Wait for page to reload

**What you're checking:**
- Is the client still there after refresh?
- If YES → Saved in PostgreSQL ✅
- If NO → Only in localStorage ❌

**Expected:**
- ✅ Client is still visible after refresh
- ✅ This confirms it's saved in the database!

---

## 🎉 IF ALL 3 PASS → YOUR FULL STACK IS WORKING!

---

## 🔧 Additional Quick Tests (Optional)

### Test 4: Backend API Direct (30 seconds)

Run this command in terminal:

```bash
curl -s https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025' | python3 -m json.tool
```

**Expected:**
```json
{
  "clients": [
    {
      "name": "Test Client 1",
      "email": "test1@example.com",
      ...
    }
  ],
  "total": 1
}
```

---

### Test 5: Browser Network Tab (1 minute)

**What to do:**
1. On frontend `/app` page
2. Press F12 → Click "Network" tab
3. Refresh the page (F5)
4. Look for requests to `api.legalindia.ai`

**What you're checking:**
- Do you see requests to `/clients/`?
- Click on one → Check "Headers" section
- Look for `X-API-Key` header

**Expected:**
- ✅ See GET request to `/clients/`
- ✅ Status: 200 OK
- ✅ Request Headers include: `X-API-Key: legalindia_secure_api_key_2025`
- ✅ Response shows your clients

---

### Test 6: Create Multiple Clients (2 minutes)

**What to do:**
1. Create 3 different clients:
   - "Client A" / "a@test.com"
   - "Client B" / "b@test.com"
   - "Client C" / "c@test.com"
2. Refresh page
3. All 3 should still be there

**Expected:**
- ✅ All 3 clients visible
- ✅ Persist after refresh
- ✅ Can edit/delete them

---

## 🚨 TROUBLESHOOTING

### ❌ Problem: Frontend won't load or shows errors

**Check:**
```bash
# Verify backend is up
curl https://api.legalindia.ai/
```

**Fix:**
- Check if frontend is deployed with latest code
- Check browser console for specific errors
- Try clearing browser cache (Ctrl+Shift+Delete)

---

### ❌ Problem: Clients don't persist after refresh

**Check:**
1. Open browser console (F12)
2. Refresh page
3. Look for errors like:
   - "401 Unauthorized"
   - "Invalid API key"
   - "Missing API key"

**Fix:**
- Frontend might not be deployed with API key code
- Check `frontend/src/lib/config.ts` has the API key
- Redeploy frontend

---

### ❌ Problem: "CORS" or "Cross-Origin" errors

**Fix:**
- Backend already has CORS configured
- Clear browser cache
- Try incognito/private window

---

### ❌ Problem: 401 or 403 errors

**Check:**
```bash
# Test backend directly
curl https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025'
```

**If this works but frontend doesn't:**
- Frontend not sending API key
- Check Network tab → Request Headers
- Should see `X-API-Key` header

---

## ✅ SUCCESS CHECKLIST

After testing, you should have:

- [ ] ✅ Frontend loads without errors
- [ ] ✅ Can create clients
- [ ] ✅ Clients persist after page refresh
- [ ] ✅ Backend API responds with 200 status
- [ ] ✅ Network tab shows X-API-Key header
- [ ] ✅ Console has no red errors

---

## 🎯 WHAT FRONTEND URL TO USE?

**Find your frontend URL:**

1. **If using Vercel:**
   - Go to: https://vercel.com/dashboard
   - Click your project
   - See "Domains" section
   - Use that URL

2. **If using Netlify:**
   - Go to: https://app.netlify.com
   - Click your site
   - See URL at top
   - Use that URL

3. **If running locally:**
   - `cd frontend`
   - `npm run dev`
   - Open: http://localhost:3000

---

## 📱 QUICK COMMANDS TO COPY/PASTE

### Test Backend Health:
```bash
curl https://api.legalindia.ai/
```

### Test Database Connection:
```bash
curl https://api.legalindia.ai/db-status
```

### Test API Key Auth:
```bash
curl https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025'
```

### Create Client via API:
```bash
curl -X POST https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025' \
  -H 'Content-Type: application/json' \
  -d '{"name":"API Test","email":"api@test.com","phone":"9999999999"}'
```

### Count Clients in Database:
```bash
curl -s https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025' | grep total
```

---

## 🎉 START HERE:

1. **Open your frontend in a browser**
2. **Go to `/app` page**
3. **Create a test client**
4. **Refresh the page (F5)**
5. **Is the client still there?**

**If YES → Everything is working!** 🎉
**If NO → Check browser console for errors** 

---

**The most important test is: Create → Refresh → Still there?**

That confirms your complete stack is working! 🚀

