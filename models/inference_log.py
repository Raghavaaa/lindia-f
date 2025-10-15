from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from models.base import Base

class InferenceLog(Base):
    __tablename__ = "inference_logs"
    
    id = Column(Integer, primary_key=True)
    query_id = Column(Integer, ForeignKey("research_queries.id"), nullable=False)
    model_used = Column(String(255))
    tokens = Column(Integer)
    cost = Column(Float)
    response_hash = Column(String(255))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

