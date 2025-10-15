"""Junior Log repository for append-focused operations."""

from typing import Optional, List
from sqlalchemy.orm import Session
from models.junior_log import JuniorLog


def append_log(session: Session, lawyer_id: int, action: str, context: str = None, response: str = None) -> JuniorLog:
    """Append a new junior log entry."""
    log = JuniorLog(
        lawyer_id=lawyer_id,
        action=action,
        context=context,
        response=response
    )
    session.add(log)
    session.flush()
    return log


def get_junior_log_by_id(session: Session, log_id: int) -> Optional[JuniorLog]:
    """Get junior log by ID."""
    return session.query(JuniorLog).filter(JuniorLog.id == log_id).first()


def list_junior_logs_by_lawyer(session: Session, lawyer_id: int, limit: int = 100, offset: int = 0) -> List[JuniorLog]:
    """List junior logs for a specific lawyer with pagination."""
    return (
        session.query(JuniorLog)
        .filter(JuniorLog.lawyer_id == lawyer_id)
        .order_by(JuniorLog.timestamp.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )

