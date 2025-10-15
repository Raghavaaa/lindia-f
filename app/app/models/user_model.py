"""
User model for LegalIndia.ai backend.
Defines the User entity with authentication and profile information.
"""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    """User model for authentication and profile management."""
    
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    username: str = Field(unique=True, index=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    full_name: Optional[str] = None
    
    # User type and status
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    is_verified: bool = Field(default=False)
    
    # Professional information
    profession: Optional[str] = None  # lawyer, law_student, individual, business
    bar_council_number: Optional[str] = None
    organization: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "lawyer@example.com",
                "username": "lawyer_john",
                "full_name": "John Doe",
                "profession": "lawyer",
                "bar_council_number": "BC123456",
                "organization": "Law Firm XYZ"
            }
        }

