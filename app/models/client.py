"""
Client Model - Manage client information with user isolation.
Each user has their own set of clients.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from app.models.upload import Base


class Client(Base):
    """
    Client model for managing client information.
    Each client is scoped to a specific user for security/isolation.
    """
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    client_id = Column(String(255), unique=True, nullable=False, index=True)
    
    # Client information
    name = Column(String(500), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    company = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    
    # User isolation - CRITICAL FOR SECURITY
    user_id = Column(String(255), nullable=False, index=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Client(client_id={self.client_id}, name={self.name}, user_id={self.user_id})>"

