# 🗄️ Database Direct Check - PostgreSQL & SQLite

## 📍 Database Connection Information

### Local SQLite:
```
Database Type: SQLite
Path: /Users/raghavankarthik/ai-law-junior/legalindia-backend/legalindia.db
Size: 48 KB
```

### Production PostgreSQL (Railway):
```
Connection URL: Check Railway Dashboard → Postgres service → Variables
Format: postgresql://user:password@host:port/database
```

---

## 🔍 Direct Database Check Commands

### 1. SQLite (Local) - Check Clients Table

```bash
cd /Users/raghavankarthik/ai-law-junior/legalindia-backend

# Check database exists
ls -lh legalindia.db

# Query clients directly
sqlite3 legalindia.db "SELECT * FROM clients;"

# Count clients
sqlite3 legalindia.db "SELECT COUNT(*) as total_clients FROM clients;"

# See table structure
sqlite3 legalindia.db ".schema clients"

# Show all tables
sqlite3 legalindia.db ".tables"
```

### 2. PostgreSQL (Production) - Check Clients

```bash
# Get connection string from Railway
# Replace with your actual DATABASE_URL

psql "postgresql://user:password@host:port/database" -c "SELECT * FROM clients;"

# Count clients
psql "postgresql://user:password@host:port/database" -c "SELECT COUNT(*) FROM clients;"

# Show table structure
psql "postgresql://user:password@host:port/database" -c "\d clients"
```

---

## 🐍 Python Direct Database Access

### Check Clients via Python:

```python
# Quick check script
cd /Users/raghavankarthik/ai-law-junior/legalindia-backend

python3 << 'EOF'
from app.database import SessionLocal, DATABASE_URL
from app.models.client import Client

print("=" * 70)
print("🗄️  DIRECT DATABASE CLIENT CHECK")
print("=" * 70)
print(f"Database URL: {DATABASE_URL}")
print()

db = SessionLocal()
try:
    # Get all clients
    clients = db.query(Client).all()
    
    print(f"📊 Total Clients: {len(clients)}")
    print()
    
    if clients:
        print("👥 Clients in Database:")
        print("-" * 70)
        for client in clients:
            print(f"ID: {client.client_id}")
            print(f"Name: {client.name}")
            print(f"Email: {client.email or 'N/A'}")
            print(f"User ID: {client.user_id}")
            print(f"Created: {client.created_at}")
            print("-" * 70)
    else:
        print("⚠️  No clients found in database")
        print()
        print("Possible reasons:")
        print("  • No clients created yet")
        print("  • Frontend not sending auth tokens")
        print("  • Using different database in production")
    
    # Check table structure
    from sqlalchemy import inspect
    inspector = inspect(db.bind)
    columns = inspector.get_columns('clients')
    
    print()
    print("📋 Clients Table Structure:")
    for col in columns:
        print(f"  • {col['name']}: {col['type']}")
    
finally:
    db.close()

print()
print("=" * 70)
EOF
```

---

## 🔗 Database Connection URLs

### Railway PostgreSQL Connection:

**Get from Railway Dashboard:**
```
1. Go to: https://railway.app
2. Select your project
3. Click "Postgres" service
4. Click "Connect"
5. Copy connection string
```

**Connection String Format:**
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```

**Direct psql Connection:**
```bash
# Replace with your actual values
psql postgresql://postgres:PASSWORD@HOST:PORT/railway
```

**Once connected, run:**
```sql
-- List all tables
\dt

-- Check clients table
SELECT * FROM clients;

-- Count clients
SELECT COUNT(*) FROM clients;

-- Show table structure
\d clients

-- Check recent clients
SELECT client_id, name, email, user_id, created_at 
FROM clients 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 📊 Quick Database Queries

### SQLite Commands:

```bash
# Interactive mode
sqlite3 legalindia.db

# Then run:
.tables                    # Show all tables
.schema clients           # Show clients table structure
SELECT COUNT(*) FROM clients;
SELECT * FROM clients;
.quit                     # Exit
```

### Direct One-Liners:

```bash
# Count clients
sqlite3 legalindia.db "SELECT COUNT(*) FROM clients;"

# List all clients
sqlite3 legalindia.db "SELECT client_id, name, email FROM clients;"

# Check user isolation
sqlite3 legalindia.db "SELECT user_id, COUNT(*) as client_count FROM clients GROUP BY user_id;"

# Recent clients
sqlite3 legalindia.db "SELECT name, created_at FROM clients ORDER BY created_at DESC LIMIT 5;"
```

---

## 🔍 Check Database Connection String

### For Local SQLite:

```bash
cd /Users/raghavankarthik/ai-law-junior/legalindia-backend

python3 -c "
from app.database import DATABASE_URL, engine
from sqlalchemy import inspect

print('Database URL:', DATABASE_URL)
print('Database Type:', 'PostgreSQL' if 'postgresql' in DATABASE_URL else 'SQLite')
print()

# Check if database is accessible
try:
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print('✅ Database accessible')
    print('Tables:', ', '.join(tables))
    
    if 'clients' in tables:
        print('✅ Clients table exists')
        columns = inspector.get_columns('clients')
        print(f'   Columns: {len(columns)}')
except Exception as e:
    print('❌ Database error:', e)
"
```

### For Production PostgreSQL:

```bash
# Check Railway environment variable
echo $DATABASE_URL

# Or from Railway CLI
railway variables

# Or from .env file
grep DATABASE_URL .env
```

---

## 🧪 Test Database Insert

### Create Test Client Directly:

```bash
cd /Users/raghavankarthik/ai-law-junior/legalindia-backend

python3 << 'EOF'
from app.database import SessionLocal
from app.models.client import Client
import uuid
from datetime import datetime

print("🧪 Creating test client...")

db = SessionLocal()
try:
    # Create test client
    test_client = Client(
        client_id=f"test_{int(datetime.utcnow().timestamp())}",
        name="Direct DB Test Client",
        email="dbtest@example.com",
        user_id="test_user_db",
        is_active=True
    )
    
    db.add(test_client)
    db.commit()
    db.refresh(test_client)
    
    print(f"✅ Test client created: {test_client.client_id}")
    print(f"   Name: {test_client.name}")
    
    # Verify it exists
    verify = db.query(Client).filter(Client.client_id == test_client.client_id).first()
    if verify:
        print("✅ Verified in database")
    
    # Clean up
    db.delete(test_client)
    db.commit()
    print("🧹 Test client removed")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
EOF
```

---

## 📋 Database Health Check Script

Save as `check_database.py`:

```python
#!/usr/bin/env python3
"""Direct database health check"""

import sys
sys.path.insert(0, '.')

from app.database import SessionLocal, DATABASE_URL, engine
from app.models.client import Client
from sqlalchemy import inspect, text

print("=" * 70)
print("🗄️  DATABASE HEALTH CHECK")
print("=" * 70)
print()

# 1. Connection Info
print(f"📍 Database URL: {DATABASE_URL[:60]}...")
print(f"📍 Type: {'PostgreSQL' if 'postgresql' in DATABASE_URL else 'SQLite'}")
print()

# 2. Connection Test
try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Database connection: SUCCESS")
except Exception as e:
    print(f"❌ Database connection: FAILED - {e}")
    sys.exit(1)

# 3. Table Check
try:
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"✅ Tables found: {len(tables)}")
    print(f"   Tables: {', '.join(tables)}")
    
    if 'clients' not in tables:
        print("❌ 'clients' table NOT FOUND!")
        sys.exit(1)
    print("✅ 'clients' table exists")
except Exception as e:
    print(f"❌ Table check failed: {e}")
    sys.exit(1)

# 4. Client Count
db = SessionLocal()
try:
    count = db.query(Client).count()
    print(f"✅ Client count: {count}")
    
    if count > 0:
        print()
        print("📊 Sample clients:")
        clients = db.query(Client).limit(5).all()
        for c in clients:
            print(f"   • {c.name} ({c.client_id}) - User: {c.user_id}")
    else:
        print("⚠️  No clients in database (expected if no auth used yet)")
        
except Exception as e:
    print(f"❌ Query failed: {e}")
finally:
    db.close()

print()
print("=" * 70)
print("✅ DATABASE CHECK COMPLETE")
print("=" * 70)
```

**Run:**
```bash
python3 check_database.py
```

---

## 🔗 Railway Database Access

### Via Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Access database shell
railway run psql $DATABASE_URL

# Or run SQL directly
railway run psql $DATABASE_URL -c "SELECT COUNT(*) FROM clients;"
```

### Via Railway Dashboard:

1. Go to: https://railway.app
2. Select project
3. Click "Postgres" service
4. Click "Data" tab
5. View tables and data directly

---

## ✅ Quick Check Summary

**Local SQLite:**
```bash
sqlite3 legalindia.db "SELECT COUNT(*) FROM clients;"
```

**Python Check:**
```bash
python3 -c "from app.database import SessionLocal; from app.models.client import Client; db = SessionLocal(); print(f'Clients: {db.query(Client).count()}'); db.close()"
```

**Full Diagnostic:**
```bash
python3 test_client_autocheck.py
```

---

**Database Location:**
- Local: `/Users/raghavankarthik/ai-law-junior/legalindia-backend/legalindia.db`
- Production: Railway PostgreSQL (check dashboard)

**Direct Access Commands Ready!** 🚀

