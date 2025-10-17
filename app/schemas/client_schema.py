"""
Client Schemas - Request/Response validation for client management.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class ClientCreate(BaseModel):
    """Schema for creating a new client."""
    name: str = Field(..., min_length=1, max_length=500, description="Client name")
    email: Optional[EmailStr] = Field(None, description="Client email address")
    phone: Optional[str] = Field(None, max_length=50, description="Client phone number")
    address: Optional[str] = Field(None, description="Client address")
    company: Optional[str] = Field(None, max_length=255, description="Client company")
    notes: Optional[str] = Field(None, description="Additional notes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+1-555-0123",
                "address": "123 Main St, City, State 12345",
                "company": "Acme Corp",
                "notes": "VIP client"
            }
        }


class ClientUpdate(BaseModel):
    """Schema for updating an existing client."""
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    company: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None
    is_active: Optional[bool] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe Jr.",
                "email": "john.doe.jr@example.com",
                "is_active": True
            }
        }


class ClientResponse(BaseModel):
    """Schema for client response."""
    client_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "client_id": "client_1729167234_abc123",
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+1-555-0123",
                "address": "123 Main St, City, State 12345",
                "company": "Acme Corp",
                "notes": "VIP client",
                "is_active": True,
                "created_at": "2025-10-17T12:00:00Z",
                "updated_at": "2025-10-17T12:30:00Z"
            }
        }


class ClientListResponse(BaseModel):
    """Schema for listing clients."""
    clients: list[ClientResponse]
    total: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "clients": [
                    {
                        "client_id": "client_1729167234_abc123",
                        "name": "John Doe",
                        "email": "john.doe@example.com",
                        "is_active": True,
                        "created_at": "2025-10-17T12:00:00Z"
                    }
                ],
                "total": 1
            }
        }

