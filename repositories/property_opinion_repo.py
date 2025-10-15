"""Property Opinion repository for CRUD operations."""

from typing import Optional, List
from sqlalchemy.orm import Session
from models.property_opinion import PropertyOpinion
from utils.db_exceptions import NotFound


def create_property_opinion(session: Session, **data) -> PropertyOpinion:
    """Create a new property opinion."""
    opinion = PropertyOpinion(**data)
    session.add(opinion)
    session.flush()
    return opinion


def get_property_opinion_by_id(session: Session, opinion_id: int) -> Optional[PropertyOpinion]:
    """Get property opinion by ID."""
    return session.query(PropertyOpinion).filter(PropertyOpinion.id == opinion_id).first()


def list_property_opinions_by_client(session: Session, client_id: int) -> List[PropertyOpinion]:
    """List all property opinions for a specific client."""
    return session.query(PropertyOpinion).filter(PropertyOpinion.client_id == client_id).all()


def update_property_opinion(session: Session, opinion_id: int, **fields) -> PropertyOpinion:
    """Update property opinion fields."""
    opinion = get_property_opinion_by_id(session, opinion_id)
    if not opinion:
        raise NotFound(f"PropertyOpinion {opinion_id} not found")
    
    for key, value in fields.items():
        if hasattr(opinion, key):
            setattr(opinion, key, value)
    
    session.flush()
    return opinion


def delete_property_opinion(session: Session, opinion_id: int) -> bool:
    """Delete property opinion by ID. Returns True if deleted, False if not found."""
    opinion = get_property_opinion_by_id(session, opinion_id)
    if not opinion:
        return False
    
    session.delete(opinion)
    session.flush()
    return True

