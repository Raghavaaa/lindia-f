"""Inference Log repository for ML model tracking."""

from typing import Optional, List
from sqlalchemy.orm import Session
from models.inference_log import InferenceLog


def log_inference(session: Session, query_id: int, model_used: str = None, 
                  tokens: int = None, cost: float = None, response_hash: str = None) -> InferenceLog:
    """Log an inference event."""
    log = InferenceLog(
        query_id=query_id,
        model_used=model_used,
        tokens=tokens,
        cost=cost,
        response_hash=response_hash
    )
    session.add(log)
    session.flush()
    return log


def get_inference_log_by_id(session: Session, log_id: int) -> Optional[InferenceLog]:
    """Get inference log by ID."""
    return session.query(InferenceLog).filter(InferenceLog.id == log_id).first()


def list_inference_logs_by_query(session: Session, query_id: int) -> List[InferenceLog]:
    """List all inference logs for a specific research query."""
    return (
        session.query(InferenceLog)
        .filter(InferenceLog.query_id == query_id)
        .order_by(InferenceLog.timestamp.desc())
        .all()
    )

