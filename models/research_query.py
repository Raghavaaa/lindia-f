from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from models.base import Base

class ResearchQuery(Base):
    __tablename__ = "research_queries"
    
    id = Column(Integer, primary_key=True)
    lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query_text = Column(Text, nullable=False)
    response_text = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

