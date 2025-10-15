import os
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")

# Recommended production engine kwargs for PostgreSQL
# Not applied by default - use get_engine_kwargs() to retrieve these values
PRODUCTION_ENGINE_KWARGS = {
    "pool_size": 10,        # Number of connections to keep open
    "max_overflow": 20,     # Max connections beyond pool_size
    "pool_timeout": 30,     # Seconds to wait for connection from pool
    "pool_pre_ping": True,  # Verify connections before using
}

def get_engine_kwargs():
    """
    Get recommended engine kwargs for production PostgreSQL.
    
    Returns dict with pool_size, max_overflow, pool_timeout, pool_pre_ping.
    Apply these when creating engine for Railway/production deployment.
    """
    return PRODUCTION_ENGINE_KWARGS.copy()

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_all():
    from models import Base
    Base.metadata.create_all(bind=engine)

def test_connection() -> tuple[bool, float]:
    """
    Test database connection health.
    
    Returns:
        Tuple of (ok: bool, latency_ms: float)
        ok=True if connection successful, latency_ms is round-trip time
    """
    try:
        start = time.time()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        latency_ms = (time.time() - start) * 1000
        return (True, latency_ms)
    except Exception as e:
        print(f"Connection test failed: {e}")
        return (False, 0.0)

if __name__ == "__main__":
    create_all()
    print("Database tables created successfully.")

