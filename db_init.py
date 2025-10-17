"""
Database Initialization Script
Creates all tables defined in SQLAlchemy models.
"""
import os
import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

from app.models.upload import Base, Upload

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./legalindia.db")

# Convert postgres:// to postgresql:// for SQLAlchemy compatibility
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"🔧 Initializing database...")
print(f"📍 Database URL: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Show SQL queries for debugging
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create all tables
print("\n📊 Creating tables...")
Base.metadata.create_all(bind=engine)

# Verify tables were created
inspector = inspect(engine)
tables = inspector.get_table_names()

print("\n✅ Database initialized successfully!")
print(f"📋 Tables created: {', '.join(tables)}")

# Create a session factory for testing
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Test connection
print("\n🧪 Testing database connection...")
try:
    session = SessionLocal()
    # Try a simple query
    result = session.query(Upload).count()
    print(f"✅ Connection successful! Upload count: {result}")
    session.close()
except Exception as e:
    print(f"⚠️  Connection test failed: {str(e)}")
    sys.exit(1)

print("\n🎉 Database is ready to use!")
print("\n📝 Next steps:")
print("   1. Run the server: uvicorn main:app --reload")
print("   2. Test upload endpoints with authentication")
print("   3. Check storage/ directory for uploaded files")

