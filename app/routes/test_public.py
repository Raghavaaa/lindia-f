"""
Temporary Public Test Route - No Authentication Required
This is for testing database connectivity without JWT issues
DELETE THIS FILE AFTER TESTING!
"""
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.client import Client
from datetime import datetime
import uuid

router = APIRouter(prefix="/test-public", tags=["Test - Public"])


@router.get("/")
async def test_root():
    """Simple test endpoint - no auth required"""
    return {
        "message": "Public test endpoint working",
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/db-test")
async def test_database():
    """Test database connection - no auth required"""
    try:
        db: Session = SessionLocal()
        
        # Count clients
        count = db.query(Client).count()
        
        # Get recent clients (no user_id filter since this is just a test)
        recent = db.query(Client).order_by(Client.created_at.desc()).limit(5).all()
        
        clients_list = [
            {
                "client_id": c.client_id,
                "name": c.name,
                "email": c.email,
                "created_at": c.created_at.isoformat() if c.created_at else None
            }
            for c in recent
        ]
        
        db.close()
        
        return {
            "database_connected": True,
            "total_clients": count,
            "recent_clients": clients_list,
            "message": "Database is working!"
        }
        
    except Exception as e:
        return {
            "database_connected": False,
            "error": str(e),
            "message": "Database connection failed"
        }


@router.post("/create-test-client")
async def create_test_client():
    """Create a test client - no auth required"""
    try:
        db: Session = SessionLocal()
        
        # Create test client
        client = Client(
            client_id=str(uuid.uuid4()),
            name=f"Public Test Client {datetime.utcnow().strftime('%H:%M:%S')}",
            email="public.test@example.com",
            phone="1111111111",
            user_id="test_user_123",  # Fixed test user
            is_active=True
        )
        
        db.add(client)
        db.commit()
        db.refresh(client)
        
        result = {
            "success": True,
            "message": "Client created successfully!",
            "client": {
                "client_id": client.client_id,
                "name": client.name,
                "email": client.email,
                "phone": client.phone,
                "created_at": client.created_at.isoformat() if client.created_at else None
            }
        }
        
        db.close()
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create client: {str(e)}")

