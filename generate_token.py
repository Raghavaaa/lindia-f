#!/usr/bin/env python3
"""
Quick script to generate JWT tokens for testing
"""
import sys
from app.utils.jwt_helper import create_test_token, create_access_token

def main():
    print("=" * 70)
    print("🔑 JWT TOKEN GENERATOR")
    print("=" * 70)
    
    # Get user_id from command line or use default
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
    else:
        user_id = "test_user_123"
    
    # Generate token
    token = create_test_token(user_id)
    
    print(f"\n✅ Token generated for user: {user_id}")
    print(f"\n📋 Token (copy this):")
    print(f"{token}")
    
    print(f"\n💻 Usage in curl:")
    print(f"curl -X POST http://localhost:8000/api/v1/clients/ \\")
    print(f"  -H 'Authorization: Bearer {token}' \\")
    print(f"  -H 'Content-Type: application/json' \\")
    print(f"  -d '{{\"name\": \"Test Client\", \"email\": \"test@example.com\"}}'")
    
    print(f"\n💻 Usage in JavaScript/Frontend:")
    print(f"const token = '{token}';")
    print(f"fetch('/api/v1/clients/', {{")
    print(f"  headers: {{")
    print(f"    'Authorization': `Bearer ${{token}}`,")
    print(f"    'Content-Type': 'application/json'")
    print(f"  }}")
    print(f"}});")
    
    print("\n" + "=" * 70)
    print("✅ Save this token to use in your frontend!")
    print("=" * 70)

if __name__ == "__main__":
    main()

