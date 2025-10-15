from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from models.base import Base

class JuniorLog(Base):
    __tablename__ = "junior_logs"
    
    id = Column(Integer, primary_key=True)
    lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(Text, nullable=False)
    context = Column(Text)
    response = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

