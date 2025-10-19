"""
Main application file for LegalIndia.ai backend.
Initializes FastAPI app with routers, middleware, and configuration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logger import logger
from app.routes import auth, property_opinion, research, case, junior

# Initialize FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for LegalIndia.ai - Your AI-powered legal assistant for Indian law",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(property_opinion.router, prefix=settings.API_V1_PREFIX)
app.include_router(research.router, prefix=settings.API_V1_PREFIX)
app.include_router(case.router, prefix=settings.API_V1_PREFIX)
app.include_router(junior.router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Dictionary with status information
    """
    return {"status": "ok", "version": "1.0.1", "deployment": "redeploy"}


@app.get("/")
async def root():
    """
    Root endpoint with API information.
    
    Returns:
        Dictionary with API information
    """
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }


@app.on_event("startup")
async def startup_event():
    """
    Application startup event handler.
    Initialize connections, load resources, etc.
    """
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {'Development' if settings.DEBUG else 'Production'}")
    logger.info(f"API Prefix: {settings.API_V1_PREFIX}")
    logger.info(f"CORS Origin: {settings.FRONTEND_ORIGIN}")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown event handler.
    Cleanup connections, resources, etc.
    """
    logger.info(f"Shutting down {settings.APP_NAME}")


# Exception handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors."""
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
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
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )

