from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from models.base import Base

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True)
    lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    contact = Column(String(255))
    address = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

