# Railway Database Setup Guide - lindia-db

**Purpose:** Deploy PostgreSQL database on Railway and initialize schema

---

## 🚀 Step 1: Create PostgreSQL Database on Railway

### 1.1 Create New Database

1. Go to: **https://railway.app/new**
2. Click **"Provision PostgreSQL"**
3. Name it: `legalindia-database`
4. Railway will provision a PostgreSQL instance

### 1.2 Get Database Credentials

1. Click on your PostgreSQL service
2. Go to **"Variables"** tab
3. Copy the `DATABASE_URL` - it looks like:
   ```
   postgresql://postgres:password@containers-us-west-123.railway.app:7654/railway
   ```
4. **Save this URL securely** - you'll need it!

---

## 🔧 Step 2: Set Up Local Environment

### 2.1 Clone Repository (if not already)

```bash
cd /Users/raghavankarthik
git clone https://github.com/Raghavaaa/lindia-db.git
cd lindia-db
```

### 2.2 Install Dependencies

```bash
pip3 install -r requirements.txt
```

### 2.3 Create .env File

```bash
# Copy template
cp .env.template .env

# Edit .env and add your Railway DATABASE_URL
echo "DATABASE_URL=postgresql://postgres:password@..." > .env
```

**⚠️ IMPORTANT:** Never commit `.env` file to git!

---

## 📊 Step 3: Run Migrations

### 3.1 Test Connection First

```bash
python3 -c "from db_init import test_connection; ok, latency = test_connection(); print(f'Connection: {ok}, Latency: {latency:.2f}ms')"
```

Expected output:
```
Connection: True, Latency: 45.23ms
```

### 3.2 Run Alembic Migration

```bash
# Apply all migrations
alembic upgrade head
```

Expected output:
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 04bd3fd5e6c2, Initial schema
```

### 3.3 Verify Tables Created

```bash
python3 << 'EOF'
from db_init import SessionLocal
from sqlalchemy import inspect

session = SessionLocal()
inspector = inspect(session.bind)
tables = inspector.get_table_names()

print("✓ Tables created:")
for table in sorted(tables):
    print(f"  - {table}")

session.close()
EOF
```

Expected output:
```
✓ Tables created:
  - alembic_version
  - cases
  - clients
  - inference_logs
  - junior_logs
  - property_opinions
  - research_queries
  - users
```

---

## 🌱 Step 4: Load Seed Data

### 4.1 Run Seed Script

```bash
python3 scripts/seed_via_models.py
```

Expected output:
```
Created user: amit.sharma@legalindia.ai
Created user: priya.patel@legalindia.ai
Created client: Tech Solutions Pvt Ltd
Created client: Green Properties LLC
Created case: Contract Dispute Resolution
Created property opinion for Green Properties LLC

=== Seed Summary ===
Users: 2
Clients: 2
Cases: 1
Property Opinions: 1
```

### 4.2 Verify Idempotency

Run the seed script again - it should not create duplicates:

```bash
python3 scripts/seed_via_models.py
```

Expected output:
```
User already exists: amit.sharma@legalindia.ai
User already exists: priya.patel@legalindia.ai
Client already exists: Tech Solutions Pvt Ltd
...
```

---

## 🧪 Step 5: Run Tests (Optional)

Test the database connection and repositories:

```bash
# Set DATABASE_URL in terminal
export DATABASE_URL="postgresql://postgres:password@..."

# Run repository tests (against actual database)
pytest tests/test_repositories.py -v
```

**Note:** Tests create and delete test data. Safe to run on staging/dev databases.

---

## 🔗 Step 6: Connect to Backend

Now your backend application can connect using the same `DATABASE_URL`:

### 6.1 In Your Backend Service

Add environment variable in Railway:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

This automatically references your PostgreSQL service!

### 6.2 Test Backend Connection

In your backend code:
```python
from db_init import SessionLocal, test_connection

# Test connection
ok, latency = test_connection()
print(f"Database OK: {ok}, Latency: {latency}ms")

# Use in routes
session = SessionLocal()
try:
    # Your database operations
    from repositories import user_repo
    users = user_repo.list_users(session)
    print(f"Found {len(users)} users")
finally:
    session.close()
```

---

## 📋 Quick Command Reference

```bash
# Test connection
python3 -c "from db_init import test_connection; print(test_connection())"

# Run migrations
alembic upgrade head

# Check current revision
alembic current

# Seed database
python3 scripts/seed_via_models.py

# Run all tests
pytest -q

# Create tables (if not using Alembic)
python3 db_init.py
```

---

## 🔐 Security Checklist

Before production:

- [ ] DATABASE_URL stored in Railway environment variables (not in code)
- [ ] `.env` file added to `.gitignore`
- [ ] SSL mode enabled: `?sslmode=require` in DATABASE_URL
- [ ] Database accepts connections only from Railway internal network
- [ ] Seed data passwords are dummy hashes (change in production)
- [ ] Backup/snapshot configured on Railway (automatic)
- [ ] Read SECURITY_ARCHITECTURE.md for access rules

---

## 🔄 Useful Railway Database Commands

### View Database in Railway

1. Click on PostgreSQL service
2. Click **"Data"** tab
3. Browse tables and data in UI

### Connect via psql

```bash
# Get DATABASE_URL from Railway
DATABASE_URL="postgresql://postgres:..."

# Connect
psql $DATABASE_URL

# Run queries
\dt          # List tables
\d users     # Describe users table
SELECT * FROM users;
```

### Create Database Backup

In Railway dashboard:
1. Click PostgreSQL service
2. Go to **"Backups"** tab (if available)
3. Click **"Create Backup"**

Or use Railway CLI:
```bash
railway backup create
```

---

## 🚨 Troubleshooting

### "Connection refused"

**Cause:** DATABASE_URL incorrect or database not running

**Fix:**
1. Verify DATABASE_URL from Railway dashboard
2. Check PostgreSQL service is running
3. Ensure no typos in URL

### "SSL required"

**Cause:** Railway requires SSL connections

**Fix:** Add `?sslmode=require` to DATABASE_URL:
```
postgresql://user:pass@host:port/db?sslmode=require
```

### "Relation does not exist"

**Cause:** Migrations not run

**Fix:**
```bash
alembic upgrade head
```

### "Permission denied"

**Cause:** User lacks permissions

**Fix:** Railway default user has all permissions. If using custom roles, check SECURITY_ARCHITECTURE.md for role setup.

---

## 📊 Next Steps After Setup

1. ✅ Database running on Railway
2. ✅ Migrations applied
3. ✅ Seed data loaded
4. ✅ Connection tested

**Now you can:**
- Connect your backend API using `DATABASE_URL`
- Build your application features
- Run additional migrations as needed
- Scale database resources in Railway dashboard

---

## 💡 Pro Tips

### Use Railway CLI

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run commands in Railway environment
railway run alembic upgrade head
railway run python3 scripts/seed_via_models.py
railway run pytest

# View logs
railway logs
```

### Database Connection Pooling

For production, configure pool settings in `db_init.py`:

```python
from db_init import get_engine_kwargs

engine = create_engine(
    DATABASE_URL,
    **get_engine_kwargs()  # Uses pool_size=10, max_overflow=20
)
```

### Monitor Database

- **Railway Dashboard:** View metrics (CPU, memory, storage)
- **Query Logs:** Enable in Railway settings if needed
- **Slow Query Log:** Configure PostgreSQL logging

---

## 📞 Support

- **Railway Docs:** https://docs.railway.app/databases/postgresql
- **Alembic Docs:** https://alembic.sqlalchemy.org
- **Repository Issues:** https://github.com/Raghavaaa/lindia-db/issues

---

✅ **Your database schema is production-ready!** Follow the steps above to deploy to Railway.

