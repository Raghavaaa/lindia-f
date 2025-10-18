"""
LegalIndia Backend - Simplified FastAPI Application
Production-ready server with proper error handling and startup sequence.
"""
import os
import sys
import logging
from pathlib import Path

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="LegalIndia Backend",
    version="1.0.2",
    description="Production-grade FastAPI backend for LegalIndia.ai platform"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://legalindia.ai",
        "https://www.legalindia.ai",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.4f}s"
    )
    
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint with database status."""
    try:
        # Try to import and test database
        from app.database import engine
        from sqlalchemy import text
        
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        return {
            "status": "healthy",
            "version": "1.0.2",
            "database": "connected",
            "timestamp": "2025-10-19T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "degraded",
            "version": "1.0.2",
            "database": "disconnected",
            "error": str(e),
            "timestamp": "2025-10-19T00:00:00Z"
        }

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "LegalIndia Backend",
        "status": "Active",
        "version": "1.0.2"
    }

# Import and register routes
def register_routes():
    """Register all application routes."""
    try:
        # Import route modules
        from app.routes import junior, research, case, client, property_opinion, upload
        
        # Register routers
        app.include_router(junior.router, prefix="/api/v1")
        app.include_router(research.router, prefix="/api/v1")
        app.include_router(case.router, prefix="/api/v1")
        app.include_router(client.router, prefix="/api/v1")
        app.include_router(property_opinion.router, prefix="/api/v1")
        app.include_router(upload.router, prefix="/api/v1")
        
        logger.info("All routes registered successfully")
        
    except Exception as e:
        logger.error(f"Failed to register routes: {str(e)}", exc_info=True)

# Initialize database
def initialize_database():
    """Initialize database tables."""
    try:
        from app.models import Base
        from app.database import engine
        
        logger.info("Initializing database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables ready")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}", exc_info=True)
        logger.warning("Continuing without database - some features may not work")

# Startup event
@app.on_event("startup")
async def startup_event():
    """Application startup event handler."""
    logger.info("Starting LegalIndia Backend...")
    
    # Initialize database
    initialize_database()
    
    # Register routes
    register_routes()
    
    logger.info("LegalIndia Backend started successfully")

if __name__ == "__main__":
    import uvicorn
    import time
    
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=False,
        log_level="info"
    )
