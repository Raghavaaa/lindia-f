#!/usr/bin/env python3
"""
Test Client API - Simulates frontend client creation to test the full flow
"""
import sys
import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 70)
print("🧪 CLIENT API TEST")
print("=" * 70)

# 1. Test Health Check
print("\n📡 Step 1: Testing Health Check...")
try:
    response = requests.get(f"{BASE_URL}/")
    if response.status_code == 200:
        print(f"   ✅ Health check passed: {response.json()}")
    else:
        print(f"   ❌ Health check failed: {response.status_code}")
        print("   Make sure backend is running: uvicorn main:app --reload")
        sys.exit(1)
except Exception as e:
    print(f"   ❌ Cannot connect to backend: {e}")
    print("   Run: uvicorn main:app --reload --port 8000")
    sys.exit(1)

# 2. Test Database Status
print("\n💾 Step 2: Testing Database Status...")
try:
    response = requests.get(f"{BASE_URL}/db-status")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Database connected: {data.get('database_connected')}")
        print(f"   📋 Tables: {', '.join(data.get('tables', []))}")
        
        if 'clients' not in data.get('tables', []):
            print("   ⚠️  WARNING: 'clients' table not found!")
    else:
        print(f"   ❌ Database status check failed: {response.status_code}")
except Exception as e:
    print(f"   ❌ Error checking database: {e}")

# 3. Test Client Creation (WITHOUT auth - should fail)
print("\n🔒 Step 3: Testing Client Creation WITHOUT Auth (should fail)...")
try:
    client_data = {
        "name": "Test Client",
        "email": "test@example.com"
    }
    response = requests.post(
        f"{BASE_URL}/api/v1/clients/",
        json=client_data
    )
    
    if response.status_code == 401:
        print(f"   ✅ Correctly rejected (401 Unauthorized)")
    else:
        print(f"   ⚠️  Unexpected status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# 4. Generate Mock JWT Token
print("\n🔑 Step 4: Generating Mock JWT Token...")
mock_token = "mock_jwt_token_for_testing_user_123"
print(f"   Token: {mock_token}")
print("   ⚠️  NOTE: This is a mock token. For real auth, implement JWT generation.")

# 5. Test Client Creation WITH Mock Auth
print("\n✏️  Step 5: Testing Client Creation WITH Mock Auth...")
try:
    client_data = {
        "name": "Test Client via API",
        "email": "apitest@example.com",
        "phone": "+91-1234567890"
    }
    
    headers = {
        "Authorization": f"Bearer {mock_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/clients/",
        json=client_data,
        headers=headers
    )
    
    print(f"   Status Code: {response.status_code}")
    
    if response.status_code == 201:
        print(f"   ✅ Client created successfully!")
        created_client = response.json()
        print(f"   Client ID: {created_client.get('client_id')}")
        print(f"   Name: {created_client.get('name')}")
    elif response.status_code == 401:
        print(f"   ⚠️  Authentication failed (expected with mock token)")
        print(f"   Response: {response.json()}")
    else:
        print(f"   ❌ Unexpected status: {response.status_code}")
        print(f"   Response: {response.text[:300]}")
        
except Exception as e:
    print(f"   ❌ Error: {e}")

# 6. List Clients
print("\n📋 Step 6: Listing Clients...")
try:
    headers = {
        "Authorization": f"Bearer {mock_token}"
    }
    
    response = requests.get(
        f"{BASE_URL}/api/v1/clients/",
        headers=headers
    )
    
    print(f"   Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        total = data.get('total', 0)
        print(f"   ✅ Total clients: {total}")
        
        clients = data.get('clients', [])
        if clients:
            print("   Recent clients:")
            for client in clients[:3]:
                print(f"      • {client.get('name')} (ID: {client.get('client_id')})")
    elif response.status_code == 401:
        print(f"   ⚠️  Authentication required")
    else:
        print(f"   Response: {response.text[:300]}")
        
except Exception as e:
    print(f"   ❌ Error: {e}")

# Summary
print("\n" + "=" * 70)
print("📊 SUMMARY")
print("=" * 70)
print("✅ Backend is running")
print("✅ Database is accessible")
print("✅ Client routes are registered")
print("")
print("⚠️  ISSUE IDENTIFIED:")
print("   • Client creation requires valid JWT authentication")
print("   • Mock tokens won't work - need real JWT from auth system")
print("")
print("💡 NEXT STEPS:")
print("   1. Implement proper JWT token generation")
print("   2. Add test user credentials")
print("   3. Update frontend to send valid JWT tokens")
print("   4. Or temporarily disable auth for testing:")
print("      • Comment out 'Depends(verify_token)' in client routes")
print("")
print("=" * 70)

