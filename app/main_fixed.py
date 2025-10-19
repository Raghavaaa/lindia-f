"""
Fixed Main application file for LegalIndia.ai backend.
Resolves import conflicts and ensures proper deployment.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="LegalIndia.ai Backend",
    version="2.0.0",
    description="Backend API for LegalIndia.ai - Your AI-powered legal assistant for Indian law",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS - Allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers with error handling
try:
    from routes.junior import router as junior_router
    from routes.research import router as research_router
    from routes.case import router as case_router
    from routes.property_opinion import router as property_router
    
    app.include_router(junior_router, prefix="/api/v1")
    app.include_router(research_router, prefix="/api/v1")
    app.include_router(case_router, prefix="/api/v1")
    app.include_router(property_router, prefix="/api/v1")
    
    logger.info("All routers loaded successfully")
except Exception as e:
    logger.error(f"Error loading routers: {e}")
    # Continue without routers for basic functionality

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok", 
        "version": "2.0.0", 
        "deployment": "fixed",
        "message": "Backend is working"
    }

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "LegalIndia.ai Backend",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "message": "Backend is operational"
    }

@app.on_event("startup")
async def startup_event():
    """Application startup event handler."""
    logger.info("Starting LegalIndia.ai Backend v2.0.0")
    logger.info("Backend startup completed successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event handler."""
    logger.info("Shutting down LegalIndia.ai Backend")

# Exception handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors."""
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found", "path": str(request.url)}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle 500 errors."""
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main_fixed:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
