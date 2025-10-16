"""
Upload Model - File upload metadata tracking.
SQLAlchemy model for tracking uploaded files per user.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Upload(Base):
    """
    Upload model for tracking file uploads.
    Each file is scoped to a specific user for security/isolation.
    """
    __tablename__ = "uploads"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_id = Column(String(255), unique=True, nullable=False, index=True)
    
    # File metadata
    filename = Column(String(500), nullable=False)
    size = Column(BigInteger, nullable=False)
    content_type = Column(String(100))
    storage_path = Column(String(1000), nullable=False)
    
    # Upload context
    tab_type = Column(String(50), nullable=False)  # property, case, research, junior
    client_id = Column(String(255), nullable=True, index=True)
    
    # User isolation - CRITICAL FOR SECURITY
    user_id = Column(String(255), nullable=False, index=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Upload(file_id={self.file_id}, filename={self.filename}, user_id={self.user_id}, tab={self.tab_type})>"

