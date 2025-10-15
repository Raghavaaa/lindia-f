from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from models.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

