"""
Simple API Key Authentication
Replaces JWT with a stable, reliable API key system
"""
import os
from typing import Optional
from fastapi import HTTPException, Request, Depends
from fastapi.security import APIKeyHeader

# Load API key from environment
API_SECRET_KEY = os.getenv("API_SECRET_KEY")

# API Key header scheme
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def get_api_key() -> str:
    """Get the configured API secret key"""
    if not API_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="API_SECRET_KEY not configured"
        )
    return API_SECRET_KEY


async def verify_api_key(api_key: Optional[str] = Depends(api_key_header)) -> dict:
    """
    Verify API key from X-API-Key header.
    
    Returns a user context dict for compatibility with existing code.
    """
    if not API_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="API_SECRET_KEY not configured"
        )
    
    if not api_key:
        raise HTTPException(
            status_code=401,
            detail="Missing API key. Include X-API-Key header."
        )
    
    if api_key != API_SECRET_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid API key"
        )
    
    # Return a user context for compatibility
    # All API key requests map to a single user
    return {
        "user_id": "api_user",
        "auth_method": "api_key",
        "authenticated": True
    }


async def optional_api_key(api_key: Optional[str] = Depends(api_key_header)) -> Optional[dict]:
    """
    Optional API key verification - doesn't raise errors.
    Useful for endpoints that can work with or without auth.
    """
    if not api_key or not API_SECRET_KEY:
        return None
    
    if api_key == API_SECRET_KEY:
        return {
            "user_id": "api_user",
            "auth_method": "api_key",
            "authenticated": True
        }
    
    return None

