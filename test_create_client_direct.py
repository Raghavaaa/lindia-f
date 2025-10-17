#!/usr/bin/env python3
"""
Direct database test - Create client without JWT
This bypasses the API and writes directly to PostgreSQL to confirm database works
"""
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not found in environment")
    print("Set it with: export DATABASE_URL='postgresql://...'")
    sys.exit(1)

print("="*70)
print("🔧 DIRECT DATABASE TEST - Bypassing API/JWT")
print("="*70)
print()

try:
    # Create engine
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    print("✅ Connected to database")
    print(f"📍 Database: {DATABASE_URL[:30]}...")
    print()
    
    # Create a test client using raw SQL
    client_id = str(uuid.uuid4())
    name = f"Direct Test Client {datetime.now().strftime('%H:%M:%S')}"
    email = "direct.test@database.com"
    phone = "9999999999"
    user_id = "test_user_123"  # Same user_id as in JWT tokens
    created_at = datetime.utcnow()
    
    print("📝 Creating client...")
    print(f"   Name: {name}")
    print(f"   Email: {email}")
    print(f"   Phone: {phone}")
    print(f"   User ID: {user_id}")
    print()
    
    # Insert client
    db.execute(f"""
        INSERT INTO clients (client_id, name, email, phone, user_id, is_active, created_at)
        VALUES ('{client_id}', '{name}', '{email}', '{phone}', '{user_id}', true, '{created_at}')
    """)
    db.commit()
    
    print("✅ Client created successfully!")
    print(f"   Client ID: {client_id}")
    print()
    
    # Query back
    result = db.execute("SELECT * FROM clients WHERE user_id = 'test_user_123' ORDER BY created_at DESC LIMIT 5")
    clients = result.fetchall()
    
    print(f"📊 All clients for user_id='test_user_123': {len(clients)} found")
    print()
    for i, client in enumerate(clients, 1):
        print(f"{i}. {client[1]} ({client[2]}) - {client[7]}")  # name, email, created_at
    
    print()
    print("="*70)
    print("✅ DATABASE IS WORKING!")
    print("="*70)
    print()
    print("This confirms:")
    print("✅ PostgreSQL is connected")
    print("✅ 'clients' table exists")
    print("✅ Data can be written")
    print("✅ Data can be read")
    print()
    print("The ONLY issue is JWT authentication in the API layer!")
    print()
    
    db.close()
    
except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

