"""
Client model for LegalIndia.ai backend.
Defines the Client entity for managing legal clients.
"""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class Client(SQLModel, table=True):
    """Client model for managing legal case clients."""
    
    __tablename__ = "clients"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # User relationship
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    
    # Client information
    full_name: str = Field(nullable=False)
    email: Optional[str] = Field(default=None)
    phone: Optional[str] = Field(default=None)
    
    # Address information
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    
    # Client type
    client_type: str = Field(default="individual")  # individual, business, organization
    
    # Business details (if applicable)
    company_name: Optional[str] = None
    gstin: Optional[str] = None
    
    # Additional information
    notes: Optional[str] = None
    
    # Status
    is_active: bool = Field(default=True)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Jane Smith",
                "email": "jane.smith@example.com",
                "phone": "+91-9876543210",
                "address": "123 Main Street",
                "city": "Mumbai",
                "state": "Maharashtra",
                "pincode": "400001",
                "client_type": "individual"
            }
        }

