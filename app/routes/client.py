"""
Client Routes - CRUD endpoints for client management with authentication and user isolation.

SECURITY:
- All routes require authentication (JWT token)
- Clients are scoped to logged-in user only
- User isolation enforced at database level
"""
import logging
import uuid
from typing import Dict, Any, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.schemas.client_schema import ClientCreate, ClientUpdate, ClientResponse, ClientListResponse
from app.models.client import Client
from app.database import get_db
from app.utils.auth import verify_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/clients", tags=["Client Management"])


# ============================================================================
# Create Client
# ============================================================================

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(
    client_data: ClientCreate,
    current_user: Dict[str, Any] = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Create a new client.
    
    SECURITY: Restricted to logged-in users only.
    Client is associated with user_id from JWT token.
    """
    user_id = current_user.get("sub") or current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    # Generate unique client_id
    client_id = f"client_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:8]}"
    
    logger.info(f"Creating client for user {user_id}: {client_data.name}")
    
    try:
        # Create client
        new_client = Client(
            client_id=client_id,
            name=client_data.name,
            email=client_data.email,
            phone=client_data.phone,
            address=client_data.address,
            company=client_data.company,
            notes=client_data.notes,
            user_id=str(user_id)
        )
        
        db.add(new_client)
        db.commit()
        db.refresh(new_client)
        
        logger.info(f"Client created: {client_id}")
        
        return ClientResponse(
            client_id=new_client.client_id,
            name=new_client.name,
            email=new_client.email,
            phone=new_client.phone,
            address=new_client.address,
            company=new_client.company,
            notes=new_client.notes,
            is_active=new_client.is_active,
            created_at=new_client.created_at,
            updated_at=new_client.updated_at
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating client: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create client"
        )


# ============================================================================
# List Clients
# ============================================================================

@router.get("/", response_model=ClientListResponse)
async def list_clients(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    search: Optional[str] = Query(None, description="Search by name, email, or company"),
    current_user: Dict[str, Any] = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    List all clients for the logged-in user.
    
    SECURITY: Returns only clients owned by the authenticated user.
    """
    user_id = current_user.get("sub") or current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    try:
        # Build query with user isolation
        query = db.query(Client).filter(Client.user_id == str(user_id))
        
        # Apply filters
        if is_active is not None:
            query = query.filter(Client.is_active == is_active)
        
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (Client.name.ilike(search_pattern)) |
                (Client.email.ilike(search_pattern)) |
                (Client.company.ilike(search_pattern))
            )
        
        # Order by created_at descending
        query = query.order_by(Client.created_at.desc())
        
        clients = query.all()
        
        logger.info(f"Listed {len(clients)} clients for user {user_id}")
        
        return ClientListResponse(
            clients=[
                ClientResponse(
                    client_id=client.client_id,
                    name=client.name,
                    email=client.email,
                    phone=client.phone,
                    address=client.address,
                    company=client.company,
                    notes=client.notes,
                    is_active=client.is_active,
                    created_at=client.created_at,
                    updated_at=client.updated_at
                )
                for client in clients
            ],
            total=len(clients)
        )
    except Exception as e:
        logger.error(f"Error listing clients: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list clients"
        )


# ============================================================================
# Get Client by ID
# ============================================================================

@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: str,
    current_user: Dict[str, Any] = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Get a specific client by ID.
    
    SECURITY CRITICAL:
    - Requires authentication
    - Only returns client if it belongs to the logged-in user
    """
    user_id = current_user.get("sub") or current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    try:
        # Query with user isolation
        client = db.query(Client).filter(
            Client.client_id == client_id,
            Client.user_id == str(user_id)
        ).first()
        
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found or access denied"
            )
        
        return ClientResponse(
            client_id=client.client_id,
            name=client.name,
            email=client.email,
            phone=client.phone,
            address=client.address,
            company=client.company,
            notes=client.notes,
            is_active=client.is_active,
            created_at=client.created_at,
            updated_at=client.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting client: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get client"
        )


# ============================================================================
# Update Client
# ============================================================================

@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: str,
    client_data: ClientUpdate,
    current_user: Dict[str, Any] = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Update an existing client.
    
    SECURITY: Can only update clients owned by the authenticated user.
    """
    user_id = current_user.get("sub") or current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    try:
        # Query with user isolation
        client = db.query(Client).filter(
            Client.client_id == client_id,
            Client.user_id == str(user_id)
        ).first()
        
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found or access denied"
            )
        
        # Update fields
        update_data = client_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(client, field, value)
        
        client.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(client)
        
        logger.info(f"Client updated: {client_id}")
        
        return ClientResponse(
            client_id=client.client_id,
            name=client.name,
            email=client.email,
            phone=client.phone,
            address=client.address,
            company=client.company,
            notes=client.notes,
            is_active=client.is_active,
            created_at=client.created_at,
            updated_at=client.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating client: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update client"
        )


# ============================================================================
# Delete Client
# ============================================================================

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(
    client_id: str,
    current_user: Dict[str, Any] = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Delete a client (soft delete by setting is_active=False).
    
    SECURITY: Can only delete clients owned by the authenticated user.
    """
    user_id = current_user.get("sub") or current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    try:
        # Query with user isolation
        client = db.query(Client).filter(
            Client.client_id == client_id,
            Client.user_id == str(user_id)
        ).first()
        
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found or access denied"
            )
        
        # Soft delete
        client.is_active = False
        client.updated_at = datetime.utcnow()
        
        db.commit()
        
        logger.info(f"Client deleted (soft): {client_id}")
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting client: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete client"
        )

