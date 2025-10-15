"""Comprehensive tests for repository layer and DB helpers."""

import os
import sys
from pathlib import Path
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from models import Base, User, Client, Case, PropertyOpinion, ResearchQuery, JuniorLog, InferenceLog
from db_init import test_connection, create_all as db_create_all
import repositories.user_repo as user_repo
import repositories.client_repo as client_repo
import repositories.case_repo as case_repo
import repositories.property_opinion_repo as property_opinion_repo
import repositories.research_repo as research_repo
import repositories.junior_repo as junior_repo
import repositories.inference_repo as inference_repo
from utils.pagination import apply_pagination
from utils.db_exceptions import NotFound


@pytest.fixture(scope="module")
def engine():
    """Create in-memory SQLite database for testing."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()


@pytest.fixture
def session(engine):
    """Create a new database session for each test."""
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.rollback()
    session.close()


def test_user_crud_flow(session):
    """Test complete User CRUD flow."""
    # Create
    user = user_repo.create_user(
        session,
        name="Test Lawyer",
        email="test@example.com",
        password_hash="hashed_pw",
        role="lawyer"
    )
    session.commit()
    assert user.id is not None
    assert user.email == "test@example.com"
    
    # Get by ID
    fetched = user_repo.get_user_by_id(session, user.id)
    assert fetched is not None
    assert fetched.email == "test@example.com"
    
    # Get by email
    by_email = user_repo.get_by_email(session, "test@example.com")
    assert by_email is not None
    assert by_email.id == user.id
    
    # Update
    updated = user_repo.update_user(session, user.id, name="Updated Lawyer")
    session.commit()
    assert updated.name == "Updated Lawyer"
    
    # List
    users = user_repo.list_users(session, limit=10, offset=0)
    assert len(users) >= 1
    
    # Delete
    result = user_repo.delete_user(session, user.id)
    session.commit()
    assert result is True
    assert user_repo.get_user_by_id(session, user.id) is None


def test_client_crud_flow(session):
    """Test complete Client CRUD flow."""
    # Create lawyer first
    lawyer = user_repo.create_user(
        session,
        name="Lawyer For Clients",
        email="lawyer.clients@example.com",
        password_hash="hash",
        role="lawyer"
    )
    session.commit()
    
    # Create client
    client = client_repo.create_client(
        session,
        lawyer_id=lawyer.id,
        name="Test Client Co",
        contact="+91-1234567890",
        address="Mumbai"
    )
    session.commit()
    assert client.id is not None
    assert client.lawyer_id == lawyer.id
    
    # Get by ID
    fetched = client_repo.get_client_by_id(session, client.id)
    assert fetched is not None
    assert fetched.name == "Test Client Co"
    
    # List for lawyer
    clients = client_repo.list_clients_for_lawyer(session, lawyer.id, page=1, per_page=10)
    assert len(clients) >= 1
    
    # Update
    updated = client_repo.update_client(session, client.id, contact="+91-9999999999")
    session.commit()
    assert updated.contact == "+91-9999999999"
    
    # Delete
    result = client_repo.delete_client(session, client.id)
    session.commit()
    assert result is True


def test_case_crud_flow(session):
    """Test complete Case CRUD flow."""
    # Create lawyer and client
    lawyer = user_repo.create_user(
        session, name="Case Lawyer", email="case.lawyer@example.com",
        password_hash="hash", role="lawyer"
    )
    client = client_repo.create_client(
        session, lawyer_id=lawyer.id, name="Case Client", 
        contact="+91-1111111111", address="Delhi"
    )
    session.commit()
    
    # Create case
    case = case_repo.create_case(
        session,
        client_id=client.id,
        title="Test Case",
        status="active",
        description="Test description"
    )
    session.commit()
    assert case.id is not None
    
    # Get by ID
    fetched = case_repo.get_case_by_id(session, case.id)
    assert fetched is not None
    assert fetched.title == "Test Case"
    
    # List for client
    cases = case_repo.list_cases_for_client(session, client.id)
    assert len(cases) >= 1
    
    # Update
    updated = case_repo.update_case(session, case.id, status="closed")
    session.commit()
    assert updated.status == "closed"
    
    # Delete
    result = case_repo.delete_case(session, case.id)
    session.commit()
    assert result is True


def test_property_opinion_crud_flow(session):
    """Test complete PropertyOpinion CRUD flow."""
    # Create lawyer and client
    lawyer = user_repo.create_user(
        session, name="Property Lawyer", email="prop.lawyer@example.com",
        password_hash="hash", role="lawyer"
    )
    client = client_repo.create_client(
        session, lawyer_id=lawyer.id, name="Property Client",
        contact="+91-2222222222", address="Bangalore"
    )
    session.commit()
    
    # Create opinion
    opinion = property_opinion_repo.create_property_opinion(
        session,
        client_id=client.id,
        document_url="https://example.com/doc.pdf",
        status="pending",
        notes="Review needed"
    )
    session.commit()
    assert opinion.id is not None
    
    # Get by ID
    fetched = property_opinion_repo.get_property_opinion_by_id(session, opinion.id)
    assert fetched is not None
    
    # List by client
    opinions = property_opinion_repo.list_property_opinions_by_client(session, client.id)
    assert len(opinions) >= 1
    
    # Update
    updated = property_opinion_repo.update_property_opinion(
        session, opinion.id, status="completed"
    )
    session.commit()
    assert updated.status == "completed"
    
    # Delete
    result = property_opinion_repo.delete_property_opinion(session, opinion.id)
    session.commit()
    assert result is True


def test_research_query_crud_and_search(session):
    """Test ResearchQuery CRUD and search functionality."""
    # Create lawyer
    lawyer = user_repo.create_user(
        session, name="Research Lawyer", email="research@example.com",
        password_hash="hash", role="lawyer"
    )
    session.commit()
    
    # Create research queries
    query1 = research_repo.create_research_query(
        session,
        lawyer_id=lawyer.id,
        query_text="What is the law on property rights?",
        response_text="Property rights are governed by..."
    )
    query2 = research_repo.create_research_query(
        session,
        lawyer_id=lawyer.id,
        query_text="Contract law basics",
        response_text="Contracts must have..."
    )
    session.commit()
    
    # Get by ID
    fetched = research_repo.get_research_query_by_id(session, query1.id)
    assert fetched is not None
    
    # List by lawyer
    queries = research_repo.list_research_by_lawyer(session, lawyer.id, limit=10, offset=0)
    assert len(queries) >= 2
    
    # Search
    search_results = research_repo.search_queries(session, "property", limit=10, offset=0)
    assert len(search_results) >= 1
    assert "property" in search_results[0].query_text.lower()
    
    # Update
    updated = research_repo.update_research_query(
        session, query1.id, response_text="Updated response"
    )
    session.commit()
    assert updated.response_text == "Updated response"
    
    # Delete
    result = research_repo.delete_research_query(session, query1.id)
    session.commit()
    assert result is True


def test_junior_log_operations(session):
    """Test JuniorLog append and list operations."""
    # Create lawyer
    lawyer = user_repo.create_user(
        session, name="Junior Lawyer", email="junior@example.com",
        password_hash="hash", role="lawyer"
    )
    session.commit()
    
    # Append log
    log = junior_repo.append_log(
        session,
        lawyer_id=lawyer.id,
        action="draft_contract",
        context="Client X needs employment contract",
        response="Draft created with standard clauses"
    )
    session.commit()
    assert log.id is not None
    assert log.action == "draft_contract"
    
    # Get by ID
    fetched = junior_repo.get_junior_log_by_id(session, log.id)
    assert fetched is not None
    
    # List by lawyer
    logs = junior_repo.list_junior_logs_by_lawyer(session, lawyer.id, limit=10, offset=0)
    assert len(logs) >= 1


def test_inference_log_operations(session):
    """Test InferenceLog operations."""
    # Create lawyer and research query
    lawyer = user_repo.create_user(
        session, name="Inference Lawyer", email="inference@example.com",
        password_hash="hash", role="lawyer"
    )
    query = research_repo.create_research_query(
        session,
        lawyer_id=lawyer.id,
        query_text="Test query for inference",
        response_text="Test response"
    )
    session.commit()
    
    # Log inference
    log = inference_repo.log_inference(
        session,
        query_id=query.id,
        model_used="gpt-4",
        tokens=150,
        cost=0.003,
        response_hash="abc123hash"
    )
    session.commit()
    assert log.id is not None
    assert log.model_used == "gpt-4"
    
    # Get by ID
    fetched = inference_repo.get_inference_log_by_id(session, log.id)
    assert fetched is not None
    
    # List by query
    logs = inference_repo.list_inference_logs_by_query(session, query.id)
    assert len(logs) >= 1


def test_complete_workflow(session):
    """Test complete workflow: user -> client -> case -> opinion -> research -> junior -> inference."""
    # 1. Create user
    user = user_repo.create_user(
        session, name="Workflow Lawyer", email="workflow@example.com",
        password_hash="hash", role="lawyer"
    )
    session.commit()
    assert user.id is not None
    
    # 2. Create client
    client = client_repo.create_client(
        session, lawyer_id=user.id, name="Workflow Client",
        contact="+91-3333333333", address="Chennai"
    )
    session.commit()
    assert client.id is not None
    
    # 3. Create case
    case = case_repo.create_case(
        session, client_id=client.id, title="Workflow Case",
        status="active", description="Full workflow test"
    )
    session.commit()
    assert case.id is not None
    
    # 4. Create property opinion
    opinion = property_opinion_repo.create_property_opinion(
        session, client_id=client.id, document_url="https://example.com/workflow.pdf",
        status="pending", notes="Workflow test"
    )
    session.commit()
    assert opinion.id is not None
    
    # 5. Create research query
    research = research_repo.create_research_query(
        session, lawyer_id=user.id, query_text="Workflow research query",
        response_text="Workflow response"
    )
    session.commit()
    assert research.id is not None
    
    # 6. Append junior log
    junior_log = junior_repo.append_log(
        session, lawyer_id=user.id, action="workflow_action",
        context="workflow context", response="workflow response"
    )
    session.commit()
    assert junior_log.id is not None
    
    # 7. Log inference
    inference = inference_repo.log_inference(
        session, query_id=research.id, model_used="workflow-model",
        tokens=100, cost=0.001, response_hash="workflow-hash"
    )
    session.commit()
    assert inference.id is not None
    
    # Verify all connected
    assert client.lawyer_id == user.id
    assert case.client_id == client.id
    assert opinion.client_id == client.id
    assert research.lawyer_id == user.id
    assert junior_log.lawyer_id == user.id
    assert inference.query_id == research.id


def test_pagination_helper(session):
    """Test pagination utility with 25 clients."""
    # Create lawyer
    lawyer = user_repo.create_user(
        session, name="Pagination Lawyer", email="pagination@example.com",
        password_hash="hash", role="lawyer"
    )
    session.commit()
    
    # Create 25 clients
    for i in range(25):
        client_repo.create_client(
            session, lawyer_id=lawyer.id, name=f"Client {i}",
            contact=f"+91-{i:010d}", address=f"City {i}"
        )
    session.commit()
    
    # Test page 2 with per_page=10
    clients_page2 = client_repo.list_clients_for_lawyer(
        session, lawyer.id, page=2, per_page=10
    )
    assert len(clients_page2) == 10
    
    # Test page 3
    clients_page3 = client_repo.list_clients_for_lawyer(
        session, lawyer.id, page=3, per_page=10
    )
    assert len(clients_page3) == 5  # Remaining 5 clients


def test_pagination_utility_directly():
    """Test apply_pagination utility function directly."""
    from sqlalchemy.orm import Query
    from sqlalchemy import select
    
    # Create a mock query (we'll use a simple select)
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    
    # Test pagination metadata
    query = select(User)
    paginated, meta = apply_pagination(query, page=2, per_page=10)
    
    assert meta["page"] == 2
    assert meta["per_page"] == 10
    assert meta["offset"] == 10
    assert meta["limit"] == 10


def test_db_connection_healthcheck():
    """Test db_init.test_connection() healthcheck."""
    ok, latency_ms = test_connection()
    assert ok is True, "Database connection should be healthy"
    assert isinstance(latency_ms, float), "Latency should be a float"
    assert latency_ms >= 0, "Latency should be non-negative"
    print(f"\n✓ DB Connection OK - Latency: {latency_ms:.2f}ms")


def test_not_found_exception(session):
    """Test NotFound exception is raised appropriately."""
    with pytest.raises(NotFound):
        user_repo.update_user(session, 99999, name="Non-existent")
    
    with pytest.raises(NotFound):
        client_repo.update_client(session, 99999, name="Non-existent")


def test_delete_nonexistent_returns_false(session):
    """Test that deleting non-existent records returns False."""
    result = user_repo.delete_user(session, 99999)
    assert result is False
    
    result = client_repo.delete_client(session, 99999)
    assert result is False

