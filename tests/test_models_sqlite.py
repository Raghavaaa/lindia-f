import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from models import Base, User

@pytest.fixture
def engine():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    return engine

@pytest.fixture
def session(engine):
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_tables_created(engine):
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    expected_tables = [
        "users",
        "clients",
        "cases",
        "property_opinions",
        "research_queries",
        "junior_logs",
        "inference_logs"
    ]
    
    for table in expected_tables:
        assert table in tables, f"Table {table} not found in database"

def test_insert_user(session):
    user = User(
        name="Test User",
        email="test@example.com",
        password_hash="hashed_password",
        role="lawyer"
    )
    session.add(user)
    session.commit()
    
    assert user.id is not None
    assert user.name == "Test User"
    assert user.email == "test@example.com"
    assert user.created_at is not None

