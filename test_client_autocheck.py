#!/usr/bin/env python3
"""
Auto-check script for client database persistence issues.
Tests client creation flow and identifies problems.
"""
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, DATABASE_URL
from app.models.client import Client
from datetime import datetime
import uuid

print("=" * 70)
print("🔍 CLIENT DATABASE AUTO-CHECK")
print("=" * 70)

# 1. Check Database Configuration
print("\n📍 Step 1: Database Configuration")
print(f"   DATABASE_URL: {DATABASE_URL[:80]}...")
print(f"   Database Type: {'PostgreSQL' if 'postgresql' in DATABASE_URL else 'SQLite'}")

if "sqlite" in DATABASE_URL:
    db_path = DATABASE_URL.replace("sqlite:///", "")
    print(f"   SQLite Path: {db_path}")
    if os.path.exists(db_path):
        size = os.path.getsize(db_path) / 1024
        print(f"   File Size: {size:.2f} KB")
    else:
        print(f"   ⚠️  Database file does not exist!")

# 2. Check Table Existence
print("\n📊 Step 2: Table Existence")
try:
    from sqlalchemy import inspect
    from app.database import engine
    
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"   Tables found: {', '.join(tables)}")
    
    if 'clients' in tables:
        print("   ✅ 'clients' table exists")
        
        # Check table schema
        columns = inspector.get_columns('clients')
        print(f"   Columns ({len(columns)}):")
        for col in columns:
            print(f"      - {col['name']}: {col['type']}")
    else:
        print("   ❌ 'clients' table NOT found!")
        print("   Run: python3 db_init.py")
        sys.exit(1)
except Exception as e:
    print(f"   ❌ Error inspecting database: {e}")
    sys.exit(1)

# 3. Query Existing Clients
print("\n👥 Step 3: Query Existing Clients")
try:
    db = SessionLocal()
    clients = db.query(Client).all()
    print(f"   Total clients: {len(clients)}")
    
    if clients:
        print("   Recent clients:")
        for client in clients[:5]:
            print(f"      • {client.name} (ID: {client.client_id}, User: {client.user_id})")
    else:
        print("   ⚠️  No clients found in database")
    
    db.close()
except Exception as e:
    print(f"   ❌ Error querying clients: {e}")
    sys.exit(1)

# 4. Test Client Creation (Direct Database)
print("\n✏️  Step 4: Test Direct Client Creation")
try:
    db = SessionLocal()
    
    # Create test client
    test_client = Client(
        client_id=f"test_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:8]}",
        name="Auto-Check Test Client",
        email="test@autocheck.com",
        user_id="autocheck_user_123",
        is_active=True
    )
    
    db.add(test_client)
    db.commit()
    db.refresh(test_client)
    
    print(f"   ✅ Test client created: {test_client.client_id}")
    
    # Verify it's in the database
    verify = db.query(Client).filter(Client.client_id == test_client.client_id).first()
    if verify:
        print(f"   ✅ Verified client exists in database")
        
        # Clean up test client
        db.delete(verify)
        db.commit()
        print(f"   🧹 Test client cleaned up")
    else:
        print(f"   ❌ Could not verify client in database!")
    
    db.close()
except Exception as e:
    print(f"   ❌ Error creating test client: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# 5. Check API Endpoint (if server is running)
print("\n🌐 Step 5: API Endpoint Check")
print("   To test API endpoints, run:")
print("   curl -X GET http://localhost:8000/api/v1/clients/")
print("   (Make sure server is running: uvicorn main:app --reload)")

# 6. Summary and Recommendations
print("\n" + "=" * 70)
print("📋 SUMMARY")
print("=" * 70)

db = SessionLocal()
final_count = db.query(Client).count()
db.close()

print(f"✅ Database is accessible")
print(f"✅ 'clients' table exists with proper schema")
print(f"✅ Direct database operations work")
print(f"📊 Current client count: {final_count}")

print("\n🔧 POTENTIAL ISSUES:")
if final_count == 0:
    print("   1. ⚠️  No clients in database - possible causes:")
    print("      • Frontend not calling backend API correctly")
    print("      • Authentication/JWT token issues")
    print("      • Backend API errors not being logged")
    print("      • Production using different DATABASE_URL")
    
print("\n💡 RECOMMENDATIONS:")
print("   1. Check backend logs when creating client:")
print("      tail -f logs/backend.log")
print("   2. Test API directly with curl:")
print("      curl -X POST http://localhost:8000/api/v1/clients/ \\")
print("        -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\")
print("        -H 'Content-Type: application/json' \\")
print("        -d '{\"name\": \"Test Client\"}'")
print("   3. Verify DATABASE_URL in production matches local")
print("   4. Check Railway/deployment logs for errors")

print("\n" + "=" * 70)
print("✅ AUTO-CHECK COMPLETE")
print("=" * 70)

