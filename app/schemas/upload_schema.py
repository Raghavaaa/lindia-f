"""
Upload Schemas - Request/Response validation for file uploads.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    """Response schema for successful file upload."""
    file_id: str = Field(..., description="Unique file identifier")
    client_id: Optional[str] = Field(None, description="Associated client ID")
    tab: str = Field(..., description="Upload context: property, case, research, or junior")
    filename: str = Field(..., description="Original filename")
    size: int = Field(..., description="File size in bytes")
    created_at: datetime = Field(..., description="Upload timestamp")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "file_id": "upload_1234567890_abcd",
                "client_id": "client_123",
                "tab": "property",
                "filename": "property_deed.pdf",
                "size": 1048576,
                "created_at": "2025-10-16T12:00:00Z"
            }
        }


class UploadListResponse(BaseModel):
    """Response schema for listing user's uploads."""
    uploads: list[UploadResponse]
    total: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "uploads": [],
                "total": 0
            }
        }

