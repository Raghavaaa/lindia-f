"""
JWT Token Helper - Generate and verify JWT tokens for authentication
"""
import os
import jwt
from datetime import datetime, timedelta
from typing import Dict, Optional

# Secret key from environment or default (CHANGE IN PRODUCTION!)
SECRET_KEY = os.getenv("JWT_SECRET", "legalindia-dev-secret-key-change-in-production-min-32-chars")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30  # 30 days


def create_access_token(
    user_id: str,
    email: Optional[str] = None,
    additional_data: Optional[Dict] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.
    
    Args:
        user_id: User identifier (required)
        email: User email (optional)
        additional_data: Additional claims to include in token
        expires_delta: Custom expiration time
        
    Returns:
        Encoded JWT token string
        
    Example:
        token = create_access_token(user_id="user_123", email="user@example.com")
    """
    to_encode = {
        "sub": user_id,
        "user_id": user_id,
        "iat": datetime.utcnow()
    }
    
    if email:
        to_encode["email"] = email
    
    if additional_data:
        to_encode.update(additional_data)
    
    # Set expiration
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode["exp"] = expire
    
    # Encode token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Dict:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload as dictionary
        
    Raises:
        jwt.ExpiredSignatureError: Token has expired
        jwt.InvalidTokenError: Token is invalid
        
    Example:
        try:
            payload = verify_token(token)
            user_id = payload.get("user_id")
        except jwt.InvalidTokenError:
            # Handle invalid token
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise jwt.InvalidTokenError("Token has expired")
    except jwt.InvalidTokenError as e:
        raise jwt.InvalidTokenError(f"Invalid token: {str(e)}")


def create_test_token(user_id: str = "test_user_123") -> str:
    """
    Create a test JWT token for development/testing.
    
    Args:
        user_id: User ID for test token (default: "test_user_123")
        
    Returns:
        JWT token valid for 30 days
        
    Example:
        test_token = create_test_token()
        # Use: Authorization: Bearer {test_token}
    """
    return create_access_token(
        user_id=user_id,
        email=f"{user_id}@test.com",
        additional_data={"test": True}
    )


# CLI usage for generating test tokens
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
    else:
        user_id = "test_user_123"
    
    token = create_test_token(user_id)
    print("=" * 70)
    print("🔑 JWT TOKEN GENERATED")
    print("=" * 70)
    print(f"User ID: {user_id}")
    print(f"Token:\n{token}")
    print("\n📋 Usage:")
    print(f"curl -H 'Authorization: Bearer {token}' http://localhost:8000/api/v1/clients/")
    print("=" * 70)

