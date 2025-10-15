#!/usr/bin/env python3
"""Programmatic seed loader using SQLAlchemy models with idempotent upserts."""

import os
import sys
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add parent directory to path to import models
sys.path.insert(0, str(Path(__file__).parent.parent))

from models import Base, User, Client, Case, PropertyOpinion

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tmp_seed.db")

def seed_data():
    """Load seed data using SQLAlchemy models with idempotent behavior."""
    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    try:
        # Seed users (idempotent by email)
        user_data = [
            {"name": "Amit Sharma", "email": "amit.sharma@legalindia.ai", 
             "password_hash": "$2b$12$dummy_hash_1", "role": "lawyer"},
            {"name": "Priya Patel", "email": "priya.patel@legalindia.ai", 
             "password_hash": "$2b$12$dummy_hash_2", "role": "lawyer"}
        ]
        
        users = {}
        for data in user_data:
            user = session.query(User).filter_by(email=data["email"]).first()
            if not user:
                user = User(**data)
                session.add(user)
                session.flush()
                print(f"Created user: {data['email']}")
            else:
                print(f"User already exists: {data['email']}")
            users[data["email"]] = user
        
        session.commit()
        
        # Seed clients
        amit = users["amit.sharma@legalindia.ai"]
        priya = users["priya.patel@legalindia.ai"]
        
        client_data = [
            {"lawyer_id": amit.id, "name": "Tech Solutions Pvt Ltd", 
             "contact": "+91-9876543210", "address": "Mumbai, Maharashtra"},
            {"lawyer_id": priya.id, "name": "Green Properties LLC", 
             "contact": "+91-9876543211", "address": "Delhi, NCR"}
        ]
        
        clients = {}
        for data in client_data:
            # Check by name (simple idempotency check)
            client = session.query(Client).filter_by(name=data["name"]).first()
            if not client:
                client = Client(**data)
                session.add(client)
                session.flush()
                print(f"Created client: {data['name']}")
            else:
                print(f"Client already exists: {data['name']}")
            clients[data["name"]] = client
        
        session.commit()
        
        # Seed cases
        tech_client = clients["Tech Solutions Pvt Ltd"]
        case = session.query(Case).filter_by(title="Contract Dispute Resolution").first()
        if not case:
            case = Case(
                client_id=tech_client.id,
                title="Contract Dispute Resolution",
                status="active",
                description="Dispute over service level agreement breach"
            )
            session.add(case)
            session.commit()
            print("Created case: Contract Dispute Resolution")
        else:
            print("Case already exists: Contract Dispute Resolution")
        
        # Seed property opinions
        green_client = clients["Green Properties LLC"]
        opinion = session.query(PropertyOpinion).filter_by(client_id=green_client.id).first()
        if not opinion:
            opinion = PropertyOpinion(
                client_id=green_client.id,
                document_url="https://storage.example.com/docs/prop_123.pdf",
                status="pending",
                notes="Initial review requested for land title verification"
            )
            session.add(opinion)
            session.commit()
            print("Created property opinion for Green Properties LLC")
        else:
            print("Property opinion already exists for Green Properties LLC")
        
        # Print summary
        user_count = session.query(User).count()
        client_count = session.query(Client).count()
        case_count = session.query(Case).count()
        opinion_count = session.query(PropertyOpinion).count()
        
        print("\n=== Seed Summary ===")
        print(f"Users: {user_count}")
        print(f"Clients: {client_count}")
        print(f"Cases: {case_count}")
        print(f"Property Opinions: {opinion_count}")
        
        return 0
    
    except Exception as e:
        session.rollback()
        print(f"Error seeding data: {e}", file=sys.stderr)
        return 1
    
    finally:
        session.close()

if __name__ == "__main__":
    sys.exit(seed_data())

