#!/usr/bin/env python3
"""
Database Smoke Test Script
Tests database connectivity with safe transactional operations.
"""
import os
import sys
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_database_connection():
    """
    Perform a safe database smoke test.
    
    Steps:
    1. Connect to database using DATABASE_URL
    2. Execute a simple SELECT query in a transaction
    3. Rollback transaction (no data modification)
    4. Report success/failure
    
    Returns:
        bool: True if test passed, False otherwise
    """
    # Get database URL from environment
    default_db_path = "/tmp/legalindia.db" if os.getenv("RAILWAY_ENVIRONMENT") else "./legalindia.db"
    DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{default_db_path}")
    
    logger.info("=" * 80)
    logger.info("DATABASE SMOKE TEST")
    logger.info("=" * 80)
    logger.info(f"Database URL: {DATABASE_URL[:50]}...")
    
    # Convert postgres:// to postgresql:// for SQLAlchemy compatibility
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        logger.info("Converted postgres:// to postgresql:// for SQLAlchemy")
    
    try:
        # Step 1: Create engine
        logger.info("\n[1/4] Creating database engine...")
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
            pool_pre_ping=True,
            echo=False
        )
        logger.info("✓ Engine created successfully")
        
        # Step 2: Create session
        logger.info("\n[2/4] Creating database session...")
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        session = SessionLocal()
        logger.info("✓ Session created successfully")
        
        # Step 3: Execute test query in transaction
        logger.info("\n[3/4] Executing test query...")
        result = session.execute(text("SELECT 1 as test_value"))
        row = result.fetchone()
        
        if row and row[0] == 1:
            logger.info(f"✓ Query executed successfully: SELECT 1 returned {row[0]}")
        else:
            logger.error("✗ Query returned unexpected result")
            return False
        
        # Step 4: Rollback transaction (no changes made)
        logger.info("\n[4/4] Rolling back transaction (no data modified)...")
        session.rollback()
        session.close()
        logger.info("✓ Transaction rolled back successfully")
        
        # Success
        logger.info("\n" + "=" * 80)
        logger.info("✓ DATABASE SMOKE TEST PASSED")
        logger.info("=" * 80)
        logger.info("Database is accessible and responding to queries.")
        logger.info("No data was modified during this test.")
        return True
        
    except Exception as e:
        logger.error("\n" + "=" * 80)
        logger.error("✗ DATABASE SMOKE TEST FAILED")
        logger.error("=" * 80)
        logger.error(f"Error: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        
        if "connection" in str(e).lower():
            logger.error("\nPossible causes:")
            logger.error("- Database server is not running")
            logger.error("- DATABASE_URL is incorrect")
            logger.error("- Network connectivity issues")
            logger.error("- Firewall blocking connection")
        
        return False
    
    finally:
        try:
            if 'engine' in locals():
                engine.dispose()
                logger.info("\nCleaned up database connections")
        except:
            pass


if __name__ == "__main__":
    success = test_database_connection()
    sys.exit(0 if success else 1)

