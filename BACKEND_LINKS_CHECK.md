# 🔗 Backend Client API - Testing Links

## 📍 Base URLs

### Local Development:
```
http://localhost:8000
```

### Production (Railway):
```
https://legalindia-backend-production.up.railway.app
```

---

## 🔍 Health & Status Endpoints (No Auth Required)

### 1. Root Health Check
```
http://localhost:8000/
```
**Expected Response:**
```json
{
  "service": "LegalIndia Backend",
  "status": "Active",
  "version": "1.0.0"
}
```

### 2. Database Status
```
http://localhost:8000/db-status
```
**Expected Response:**
```json
{
  "database_connected": true,
  "database_url": "sqlite:///./legalindia.db...",
  "tables": ["alembic_version", "clients", "uploads"],
  "uploads_table_exists": true
}
```

---

## 👥 Client API Endpoints (Auth Required)

### 3. List All Clients (GET)
```
http://localhost:8000/api/v1/clients/
```
**Method:** GET  
**Auth:** Required  
**Expected Response:**
```json
{
  "clients": [],
  "total": 0
}
```

### 4. Create Client (POST)
```
http://localhost:8000/api/v1/clients/
```
**Method:** POST  
**Auth:** Required  
**Body:**
```json
{
  "name": "Test Client",
  "email": "test@example.com",
  "phone": "+91-1234567890"
}
```

### 5. Get Single Client (GET)
```
http://localhost:8000/api/v1/clients/{client_id}
```
**Method:** GET  
**Auth:** Required  

### 6. Update Client (PUT)
```
http://localhost:8000/api/v1/clients/{client_id}
```
**Method:** PUT  
**Auth:** Required  

### 7. Delete Client (DELETE)
```
http://localhost:8000/api/v1/clients/{client_id}
```
**Method:** DELETE  
**Auth:** Required  

---

## 🧪 Testing with curl

### 1. Generate Token First:
```bash
cd /Users/raghavankarthik/ai-law-junior/legalindia-backend
python3 generate_token.py
# Copy the token
```

### 2. Test Health (No Auth):
```bash
curl http://localhost:8000/
```

### 3. Test Database Status (No Auth):
```bash
curl http://localhost:8000/db-status
```

### 4. List Clients (With Auth):
```bash
TOKEN="YOUR_TOKEN_HERE"
curl -X GET http://localhost:8000/api/v1/clients/ \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Create Client (With Auth):
```bash
TOKEN="YOUR_TOKEN_HERE"
curl -X POST http://localhost:8000/api/v1/clients/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "phone": "+91-1234567890"
  }'
```

---

## 🌐 Browser Testing (Postman/Insomnia)

### Setup:

1. **Base URL:** `http://localhost:8000`

2. **Headers:**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   Content-Type: application/json
   ```

3. **Generate Token:**
   ```bash
   python3 generate_token.py
   ```

### Endpoints to Test:

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| GET | `/` | No | - |
| GET | `/db-status` | No | - |
| GET | `/api/v1/clients/` | Yes | - |
| POST | `/api/v1/clients/` | Yes | JSON |
| GET | `/api/v1/clients/{id}` | Yes | - |
| PUT | `/api/v1/clients/{id}` | Yes | JSON |
| DELETE | `/api/v1/clients/{id}` | Yes | - |

---

## 📋 Quick Test Script

Save this as `test_backend_links.sh`:

```bash
#!/bin/bash

echo "🔗 Testing Backend Client Links"
echo "================================"

# 1. Check if backend is running
echo "1. Testing Health Endpoint..."
curl -s http://localhost:8000/ | python3 -m json.tool
echo ""

# 2. Check database
echo "2. Testing Database Status..."
curl -s http://localhost:8000/db-status | python3 -m json.tool
echo ""

# 3. Generate token
echo "3. Generating JWT Token..."
TOKEN=$(python3 generate_token.py | grep "eyJ" | head -1)
echo "Token: ${TOKEN:0:50}..."
echo ""

# 4. Test client list
echo "4. Testing Client List (Auth)..."
curl -s http://localhost:8000/api/v1/clients/ \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 5. Create test client
echo "5. Creating Test Client..."
curl -s -X POST http://localhost:8000/api/v1/clients/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test Client","email":"api@test.com"}' | python3 -m json.tool
echo ""

echo "✅ Test Complete!"
```

**Run:**
```bash
chmod +x test_backend_links.sh
./test_backend_links.sh
```

---

## 🖥️ Browser Testing (Direct URLs)

### Open these in your browser:

1. **Health Check:**
   ```
   http://localhost:8000/
   ```

2. **Database Status:**
   ```
   http://localhost:8000/db-status
   ```

3. **API Documentation (if available):**
   ```
   http://localhost:8000/docs
   ```

4. **OpenAPI Schema:**
   ```
   http://localhost:8000/openapi.json
   ```

---

## 🔐 Testing with Authentication

### Browser Console Method:

1. Open browser to `http://localhost:3000` (frontend)
2. Open Console (F12)
3. Run:
```javascript
// Generate token backend first: python3 generate_token.py
const token = 'YOUR_TOKEN_HERE';

// Test list clients
fetch('http://localhost:8000/api/v1/clients/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Clients:', data));

// Test create client
fetch('http://localhost:8000/api/v1/clients/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Browser Test Client',
    email: 'browser@test.com'
  })
})
.then(r => r.json())
.then(data => console.log('Created:', data));
```

---

## 📊 Expected Responses

### Success (200/201):
```json
{
  "client_id": "client_1760700000_abc123",
  "name": "Test Client",
  "email": "test@example.com",
  "phone": "+91-1234567890",
  "is_active": true,
  "created_at": "2025-10-17T10:00:00",
  "updated_at": "2025-10-17T10:00:00"
}
```

### Unauthorized (401):
```json
{
  "detail": "Invalid authentication credentials"
}
```

### Not Found (404):
```json
{
  "detail": "Client not found"
}
```

---

## 🚀 Start Backend Server

Before testing, make sure backend is running:

```bash
cd /Users/raghavankarthik/ai-law-junior/legalindia-backend

# Option 1: Development
uvicorn main:app --reload --port 8000

# Option 2: Production
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

Server should show:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

---

## ✅ Verification Checklist

- [ ] Backend server running on port 8000
- [ ] Health endpoint responds: `http://localhost:8000/`
- [ ] DB status shows clients table: `http://localhost:8000/db-status`
- [ ] JWT token generated: `python3 generate_token.py`
- [ ] Client list accessible with auth
- [ ] Can create client with valid token
- [ ] Unauthorized without token (401)

---

## 🔗 Quick Links Summary

| Link | Purpose | Auth |
|------|---------|------|
| `http://localhost:8000/` | Health Check | No |
| `http://localhost:8000/db-status` | Database Status | No |
| `http://localhost:8000/docs` | API Docs | No |
| `http://localhost:8000/api/v1/clients/` | List Clients | Yes |
| `http://localhost:8000/api/v1/clients/` (POST) | Create Client | Yes |

---

**Ready to test?**

1. Start backend: `uvicorn main:app --reload --port 8000`
2. Generate token: `python3 generate_token.py`
3. Test links above!

