"""
Main FastAPI application for LegalIndia.ai backend.
Production-ready with security configurations.
"""
import os
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
import time

# Import routes
from routes import case, client, junior, property_opinion, research, upload

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="LegalIndia.ai Backend",
    version="1.0.0",
    description="Backend API for LegalIndia.ai - Your AI-powered legal assistant for Indian law",
    docs_url="/docs" if os.getenv("ENVIRONMENT") == "development" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") == "development" else None,
    openapi_url="/openapi.json" if os.getenv("ENVIRONMENT") == "development" else None,
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["legalindia.ai", "www.legalindia.ai", "api.legalindia.ai", "*.railway.app"]
)

# Configure CORS with specific origins
allowed_origins = [
    "https://legalindia.ai",
    "https://www.legalindia.ai",
    "http://localhost:3000",  # Development
    "http://localhost:3001",  # Development
]

severity = os.getenv("ENVIRONMENT", "production")
if severity == "development":
    allowed_origins.extend([
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

# Include routers
app.include_router(case.router, prefix="/api/v1")
app.include_router(client.router, prefix="/api/v1")
app.include_router(junior.router, prefix="/api/v1")
app.include_router(property_opinion.router, prefix="/api/v1")
app.include_router(research.router, prefix="/api/v1")
app.include_router(upload.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Comprehensive health check endpoint."""
    try:
        # Check database connection
        from database import engine
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "version": "1.0.0",
            "environment": os.getenv("ENVIRONMENT", "production"),
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unhealthy")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "LegalIndia.ai Backend",
        "version": "1.0.0",
        "status": "running",
        "environment": os.getenv("ENVIRONMENT", "production"),
        "docs": "/docs" if os.getenv("ENVIRONMENT") == "development" else "disabled",
        "health": "/health"
    }


# Global exception handler
@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: Exception):
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=int(os.getenv("PORT", 8000)), 
        reload=os.getenv("ENVIRONMENT") == "development"
    )
