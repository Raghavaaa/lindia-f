"""User repository for CRUD operations."""

from typing import Optional
from sqlalchemy.orm import Session
from models.user import User
from utils.db_exceptions import NotFound


def create_user(session: Session, **data) -> User:
    """Create a new user."""
    user = User(**data)
    session.add(user)
    session.flush()
    return user


def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    """Get user by ID."""
    return session.query(User).filter(User.id == user_id).first()


def get_by_email(session: Session, email: str) -> Optional[User]:
    """Get user by email address."""
    return session.query(User).filter(User.email == email).first()


def list_users(session: Session, limit: int = 100, offset: int = 0) -> list:
    """List users with pagination."""
    return session.query(User).limit(limit).offset(offset).all()


def update_user(session: Session, user_id: int, **fields) -> User:
    """Update user fields."""
    user = get_user_by_id(session, user_id)
    if not user:
        raise NotFound(f"User {user_id} not found")
    
    for key, value in fields.items():
        if hasattr(user, key):
            setattr(user, key, value)
    
    session.flush()
    return user


def delete_user(session: Session, user_id: int) -> bool:
    """Delete user by ID. Returns True if deleted, False if not found."""
    user = get_user_by_id(session, user_id)
    if not user:
        return False
    
    session.delete(user)
    session.flush()
    return True

