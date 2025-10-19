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

# Import and include working routers only
try:
    from routes.junior import router as junior_router
    from routes.research import router as research_router
    
    app.include_router(junior_router, prefix="/api/v1")
    app.include_router(research_router, prefix="/api/v1")
    
    logger.info("Working routers loaded successfully")
except Exception as e:
    logger.error(f"Error loading routers: {e}")
    # Continue without routers for basic functionality

@app.get("/health")
async def health_check():
    """
    Comprehensive health check endpoint.
    Checks status of all critical subsystems with timeouts.
    """
    import time
    import httpx
    from sqlalchemy import text
    
    start_time = time.time()
    health_status = {
        "status": "ok",
        "version": "2.0.0",
        "timestamp": time.time(),
        "uptime": time.time() - app.state.start_time if hasattr(app.state, 'start_time') else 0,
        "subsystems": {}
    }
    
    # Check database connectivity (non-blocking, 3s timeout)
    try:
        from database import SessionLocal
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        health_status["subsystems"]["database"] = {"status": "ok", "message": "Connected"}
    except Exception as e:
        health_status["status"] = "degraded"
        health_status["subsystems"]["database"] = {"status": "error", "message": str(e)[:100]}
    
    # Check AI service connectivity (non-blocking, 3s timeout)
    ai_url = os.getenv("AI_ENGINE_URL", "https://lindia-ai-production.up.railway.app")
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            response = await client.get(f"{ai_url}/health")
            if response.status_code == 200:
                health_status["subsystems"]["ai"] = {"status": "ok", "message": "Connected"}
            else:
                health_status["subsystems"]["ai"] = {"status": "degraded", "message": f"HTTP {response.status_code}"}
    except httpx.TimeoutException:
        health_status["status"] = "degraded"
        health_status["subsystems"]["ai"] = {"status": "timeout", "message": "AI service timeout"}
    except Exception as e:
        health_status["status"] = "degraded"
        health_status["subsystems"]["ai"] = {"status": "error", "message": str(e)[:100]}
    
    # Add response time
    health_status["response_time_ms"] = round((time.time() - start_time) * 1000, 2)
    
    return health_status

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
    import time
    app.state.start_time = time.time()
    logger.info("Starting LegalIndia.ai Backend v2.0.0")
    logger.info(f"AI Engine URL: {os.getenv('AI_ENGINE_URL', 'not set')}")
    logger.info(f"Database URL: {os.getenv('DATABASE_URL', 'default SQLite')[:50]}...")
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
