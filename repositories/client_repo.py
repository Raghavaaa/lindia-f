"""Client repository for CRUD operations."""

from typing import Optional, List
from sqlalchemy.orm import Session
from models.client import Client
from utils.db_exceptions import NotFound
from utils.pagination import apply_pagination


def create_client(session: Session, **data) -> Client:
    """Create a new client."""
    client = Client(**data)
    session.add(client)
    session.flush()
    return client


def get_client_by_id(session: Session, client_id: int) -> Optional[Client]:
    """Get client by ID."""
    return session.query(Client).filter(Client.id == client_id).first()


def list_clients_for_lawyer(session: Session, lawyer_id: int, page: int = 1, per_page: int = 10) -> List[Client]:
    """List clients for a specific lawyer with pagination."""
    query = session.query(Client).filter(Client.lawyer_id == lawyer_id)
    paginated_query, _ = apply_pagination(query, page, per_page)
    return paginated_query.all()


def update_client(session: Session, client_id: int, **fields) -> Client:
    """Update client fields."""
    client = get_client_by_id(session, client_id)
    if not client:
        raise NotFound(f"Client {client_id} not found")
    
    for key, value in fields.items():
        if hasattr(client, key):
            setattr(client, key, value)
    
    session.flush()
    return client


def delete_client(session: Session, client_id: int) -> bool:
    """Delete client by ID. Returns True if deleted, False if not found."""
    client = get_client_by_id(session, client_id)
    if not client:
        return False
    
    session.delete(client)
    session.flush()
    return True

