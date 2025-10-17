# 🔍 How to Check PostgreSQL Database

**Quick Reference Guide**

---

## 🚀 Method 1: Command Line (Easiest)

### Check All Clients in Database:
```bash
curl -s https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025' | python3 -m json.tool
```

### Check Specific Client by ID:
```bash
curl -s https://api.legalindia.ai/clients/1 \
  -H 'X-API-Key: legalindia_secure_api_key_2025' | python3 -m json.tool
```

### Count Total Clients:
```bash
curl -s https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025' | \
  python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Total: {data[\"total\"]} clients')"
```

---

## 🌐 Method 2: Browser (Visual)

### 1. **Swagger UI** (Interactive API Docs)
```
https://api.legalindia.ai/docs
```
- Click "Authorize" button
- Enter: `legalindia_secure_api_key_2025`
- Click "Authorize"
- Expand "GET /clients/" → Click "Try it out" → Click "Execute"

### 2. **ReDoc** (Alternative Docs)
```
https://api.legalindia.ai/redoc
```

---

## 🖥️ Method 3: Railway Dashboard

### Steps:
1. Go to: https://railway.app
2. Login
3. Select your project: `lindia-b` (or `legalindia-backend`)
4. Click on **PostgreSQL** service
5. Go to **"Data"** tab
6. Run SQL query:
   ```sql
   SELECT * FROM clients;
   ```

---

## 💻 Method 4: Direct Database Connection

### Get Database URL from Railway:
1. Go to Railway dashboard
2. Click PostgreSQL service
3. Go to "Variables" tab
4. Copy `DATABASE_URL`

### Connect with psql:
```bash
# Format:
psql "postgresql://username:password@host:port/database"

# Example (use your actual DATABASE_URL):
psql "postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway"
```

### Once connected, run:
```sql
-- List all clients
SELECT * FROM clients;

-- Count clients
SELECT COUNT(*) FROM clients;

-- Get latest client
SELECT * FROM clients ORDER BY created_at DESC LIMIT 1;

-- Search by name
SELECT * FROM clients WHERE name LIKE '%yrjr%';
```

---

## 📱 Method 5: Database GUI Tools

### **TablePlus** (Mac) - Recommended
1. Download: https://tableplus.com
2. Create new connection
3. Type: PostgreSQL
4. Paste Railway DATABASE_URL
5. Click "Connect"

### **DBeaver** (Free, All Platforms)
1. Download: https://dbeaver.io
2. Create new PostgreSQL connection
3. Enter Railway credentials
4. Browse tables visually

### **pgAdmin** (Official PostgreSQL Tool)
1. Download: https://www.pgadmin.org
2. Add new server
3. Enter Railway connection details

---

## 🔧 Method 6: Check Backend Health

### Health Check:
```bash
curl https://api.legalindia.ai/
```

### Database Status:
```bash
curl https://api.legalindia.ai/db-status
```

---

## 🎯 Quick Commands (Copy-Paste Ready)

### Check Database Right Now:
```bash
curl -s https://api.legalindia.ai/clients/ \
  -H 'X-API-Key: legalindia_secure_api_key_2025' | \
  python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'\n📊 Total Clients: {data[\"total\"]}\n')
for i, c in enumerate(data['clients'], 1):
    print(f'{i}. {c[\"name\"]}')
    print(f'   Email: {c.get(\"email\") or \"N/A\"}')
    print(f'   Phone: {c.get(\"phone\") or \"N/A\"}')
    print('')
"
```

### Create Test Client:
```bash
curl -X POST https://api.legalindia.ai/clients/ \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: legalindia_secure_api_key_2025' \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "phone": "1234567890"
  }'
```

### Delete Client by ID:
```bash
curl -X DELETE https://api.legalindia.ai/clients/5 \
  -H 'X-API-Key: legalindia_secure_api_key_2025'
```

---

## 📊 What You'll See

### Sample Output:
```json
{
  "clients": [
    {
      "name": "yrjr",
      "email": null,
      "phone": "ethrdt",
      "address": null,
      "company": null,
      "notes": null,
      "is_active": true,
      "user_id": "api_key_user"
    }
  ],
  "total": 5,
  "page": 1,
  "per_page": 50
}
```

---

## 🚨 Troubleshooting

### If you get "Unauthorized":
- Check API key is correct: `legalindia_secure_api_key_2025`
- Make sure header is: `X-API-Key` (case-sensitive)

### If you get "Connection refused":
- Check Railway deployment is running
- Verify backend URL: https://api.legalindia.ai

### If you get "CORS error":
- Make sure using `https://www.legalindia.ai` (with www)
- Hard refresh browser: Cmd + Shift + R

---

## 🎯 Recommended Method

**For Quick Checks:** Use Method 1 (curl commands)  
**For Visual Exploration:** Use Method 2 (Swagger UI)  
**For Development:** Use Method 4 (Database GUI)  
**For Production Monitoring:** Use Railway Dashboard

---

## 📝 Current Database Info

- **Host:** Railway PostgreSQL
- **API Endpoint:** https://api.legalindia.ai/clients/
- **Auth Method:** API Key
- **Current Clients:** 5
- **Status:** ✅ Operational

---

**Need help? Just ask!** 🚀

