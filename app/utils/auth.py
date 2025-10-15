"""
LegalIndia Backend - Authentication Utilities
Backend-only, non-persistent authentication with JWT and bcrypt.

TODO: Replace static admin auth with DB-backed user model
TODO: Implement token blacklist for logout functionality
TODO: Add refresh token rotation mechanism
"""
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

import bcrypt
import jwt
from fastapi import HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Load environment variables
JWT_SECRET = os.getenv("JWT_SECRET")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")

# JWT Configuration
JWT_ALGORITHM = "HS256"
DEFAULT_TOKEN_EXPIRY = 3600  # 1 hour in seconds

# HTTP Bearer security scheme
security = HTTPBearer()


# ============================================================================
# Password Utilities (bcrypt)
# ============================================================================

def hash_password(plain_password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    
    Args:
        plain_password: The plain text password to hash
        
    Returns:
        Bcrypt hash as a string
    """
    password_bytes = plain_password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a bcrypt hash.
    
    Args:
        plain_password: The plain text password to verify
        hashed_password: The bcrypt hash to compare against
        
    Returns:
        True if password matches, False otherwise
    """
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


# ============================================================================
# JWT Utilities
# ============================================================================

def create_access_token(payload: Dict[str, Any], expires_in_seconds: int = DEFAULT_TOKEN_EXPIRY) -> str:
    """
    Create a signed JWT access token.
    
    Args:
        payload: Dictionary containing token claims (e.g., {"sub": username})
        expires_in_seconds: Token expiration time in seconds (default: 3600)
        
    Returns:
        Signed JWT token string
        
    Raises:
        HTTPException: If JWT_SECRET is not configured
    """
    if not JWT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="JWT_SECRET not configured - cannot create tokens"
        )
    
    # Create token payload with issued-at and expiry claims
    now = datetime.utcnow()
    token_payload = payload.copy()
    token_payload.update({
        "iat": now,  # Issued at
        "exp": now + timedelta(seconds=expires_in_seconds)  # Expiry
    })
    
    # Sign and return token
    token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT access token.
    
    Args:
        token: The JWT token string to decode
        
    Returns:
        Dictionary containing the token payload
        
    Raises:
        HTTPException: If token is invalid, expired, or JWT_SECRET is missing
    """
    if not JWT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="JWT_SECRET not configured - cannot verify tokens"
        )
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


# ============================================================================
# FastAPI Authentication Dependency
# ============================================================================

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    FastAPI dependency to verify JWT token from Authorization header.
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: dict = Depends(verify_token)):
            return {"user": user}
    
    Args:
        credentials: HTTP Bearer credentials from Authorization header
        
    Returns:
        Decoded token payload containing user identity
        
    Raises:
        HTTPException: If token is missing, invalid, or expired (401)
        HTTPException: If JWT_SECRET is not configured (500)
    """
    token = credentials.credentials
    
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Missing authentication token"
        )
    
    # Decode and validate token
    payload = decode_access_token(token)
    
    return payload


async def get_current_user(request: Request) -> Optional[Dict[str, Any]]:
    """
    Alternative dependency to get current user from request state.
    This works with the authorization middleware in main.py.
    
    Args:
        request: FastAPI request object
        
    Returns:
        User identity dict if authenticated, None otherwise
    """
    return getattr(request.state, "user", None)


# ============================================================================
# Static Admin Authentication (Temporary - No Database)
# ============================================================================

def authenticate_admin(username: str, password: str) -> Optional[Dict[str, str]]:
    """
    Authenticate against static admin credentials from environment variables.
    This is a temporary, non-persistent authentication flow for local testing only.
    
    TODO: Replace with database-backed user authentication
    
    Args:
        username: Admin username to verify
        password: Plain text password to verify
        
    Returns:
        Identity dict {"sub": username, "role": "admin"} if valid, None otherwise
    """
    # Check if admin credentials are configured
    if not ADMIN_USERNAME or not ADMIN_PASSWORD_HASH:
        return None
    
    # Verify username matches
    if username != ADMIN_USERNAME:
        return None
    
    # Verify password against hash
    if not verify_password(password, ADMIN_PASSWORD_HASH):
        return None
    
    # Return identity object suitable for JWT creation
    return {
        "sub": username,
        "role": "admin"
    }


# ============================================================================
# Helper Functions
# ============================================================================

def create_admin_token(username: str, password: str) -> Optional[str]:
    """
    Convenience function to authenticate admin and create access token.
    
    Args:
        username: Admin username
        password: Admin password
        
    Returns:
        JWT access token if authentication successful, None otherwise
    """
    identity = authenticate_admin(username, password)
    
    if not identity:
        return None
    
    return create_access_token(identity)
