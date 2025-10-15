"""Case repository for CRUD operations."""

from typing import Optional, List
from sqlalchemy.orm import Session
from models.case import Case
from utils.db_exceptions import NotFound


def create_case(session: Session, **data) -> Case:
    """Create a new case."""
    case = Case(**data)
    session.add(case)
    session.flush()
    return case


def get_case_by_id(session: Session, case_id: int) -> Optional[Case]:
    """Get case by ID."""
    return session.query(Case).filter(Case.id == case_id).first()


def list_cases_for_client(session: Session, client_id: int) -> List[Case]:
    """List all cases for a specific client."""
    return session.query(Case).filter(Case.client_id == client_id).all()


def update_case(session: Session, case_id: int, **fields) -> Case:
    """Update case fields."""
    case = get_case_by_id(session, case_id)
    if not case:
        raise NotFound(f"Case {case_id} not found")
    
    for key, value in fields.items():
        if hasattr(case, key):
            setattr(case, key, value)
    
    session.flush()
    return case


def delete_case(session: Session, case_id: int) -> bool:
    """Delete case by ID. Returns True if deleted, False if not found."""
    case = get_case_by_id(session, case_id)
    if not case:
        return False
    
    session.delete(case)
    session.flush()
    return True

