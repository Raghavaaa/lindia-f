"""Research Query repository for CRUD operations."""

from typing import Optional, List
from sqlalchemy.orm import Session
from models.research_query import ResearchQuery
from utils.db_exceptions import NotFound


def create_research_query(session: Session, **data) -> ResearchQuery:
    """Create a new research query."""
    query = ResearchQuery(**data)
    session.add(query)
    session.flush()
    return query


def get_research_query_by_id(session: Session, query_id: int) -> Optional[ResearchQuery]:
    """Get research query by ID."""
    return session.query(ResearchQuery).filter(ResearchQuery.id == query_id).first()


def list_research_by_lawyer(session: Session, lawyer_id: int, limit: int = 50, offset: int = 0) -> List[ResearchQuery]:
    """List research queries for a specific lawyer with pagination."""
    return (
        session.query(ResearchQuery)
        .filter(ResearchQuery.lawyer_id == lawyer_id)
        .limit(limit)
        .offset(offset)
        .all()
    )


def search_queries(session: Session, text_fragment: str, limit: int = 20, offset: int = 0) -> List[ResearchQuery]:
    """
    Search research queries by text fragment using SQL LIKE.
    
    NOTE: This is a simple implementation for SQLite testing.
    TODO: Replace with PostgreSQL full-text search (tsvector/tsquery) or
    vector similarity search in production for better performance.
    """
    search_pattern = f"%{text_fragment}%"
    return (
        session.query(ResearchQuery)
        .filter(ResearchQuery.query_text.like(search_pattern))
        .limit(limit)
        .offset(offset)
        .all()
    )


def update_research_query(session: Session, query_id: int, **fields) -> ResearchQuery:
    """Update research query fields."""
    query = get_research_query_by_id(session, query_id)
    if not query:
        raise NotFound(f"ResearchQuery {query_id} not found")
    
    for key, value in fields.items():
        if hasattr(query, key):
            setattr(query, key, value)
    
    session.flush()
    return query


def delete_research_query(session: Session, query_id: int) -> bool:
    """Delete research query by ID. Returns True if deleted, False if not found."""
    query = get_research_query_by_id(session, query_id)
    if not query:
        return False
    
    session.delete(query)
    session.flush()
    return True

