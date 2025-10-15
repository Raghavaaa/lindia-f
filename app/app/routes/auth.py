"""
Authentication Routes
Handles user registration, login, and authentication.
"""
from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from typing import Dict, Any

from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, Token
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from app.core.config import settings
from app.core.logger import logger

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user.
    
    Args:
        user_data: User registration data
        
    Returns:
        UserResponse with created user details
    """
    logger.info(f"Registering new user: {user_data.username}")
    
    # TODO: Check if user already exists in database
    # TODO: Create user in database
    
    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    
    # Placeholder response - in production, this would save to database
    user_response = UserResponse(
        id=1,
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        profession=user_data.profession,
        bar_council_number=user_data.bar_council_number,
        organization=user_data.organization,
        is_active=True,
        is_verified=False,
        created_at="2025-10-15T00:00:00",
        last_login=None
    )
    
    logger.info(f"User registered successfully: {user_data.username}")
    return user_response


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Authenticate user and return access token.
    
    Args:
        credentials: User login credentials
        
    Returns:
        Token with access token
    """
    logger.info(f"Login attempt for user: {credentials.username}")
    
    # TODO: Fetch user from database
    # For now, using placeholder
    
    # Placeholder password verification
    # In production, fetch hashed_password from database
    # is_valid = verify_password(credentials.password, hashed_password_from_db)
    
    # For demonstration, accepting any credentials
    # TODO: Implement proper authentication
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": credentials.username, "user_id": 1},
        expires_delta=access_token_expires
    )
    
    logger.info(f"User logged in successfully: {credentials.username}")
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get current authenticated user's profile.
    
    Args:
        current_user: Current authenticated user from JWT token
        
    Returns:
        UserResponse with user details
    """
    logger.info(f"Fetching profile for user: {current_user.get('sub')}")
    
    # TODO: Fetch full user details from database
    # This is a placeholder response
    user_response = UserResponse(
        id=current_user.get("user_id", 1),
        email="user@example.com",
        username=current_user.get("sub", "unknown"),
        full_name="John Doe",
        profession="lawyer",
        bar_council_number=None,
        organization=None,
        is_active=True,
        is_verified=True,
        created_at="2025-10-15T00:00:00",
        last_login="2025-10-15T00:00:00"
    )
    
    return user_response


@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Refresh the access token.
    
    Args:
        current_user: Current authenticated user from JWT token
        
    Returns:
        Token with new access token
    """
    logger.info(f"Refreshing token for user: {current_user.get('sub')}")
    
    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.get("sub"), "user_id": current_user.get("user_id")},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

