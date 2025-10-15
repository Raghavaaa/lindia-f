"""
LegalIndia Backend - Core FastAPI Application
Production-ready server with automatic router registration and middleware.
"""
import os
import sys
import time
import logging
from pathlib import Path
from importlib import import_module
from typing import Callable

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
    version="1.0.0",
    description="Production-grade FastAPI backend for LegalIndia.ai platform"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://legalindia.ai",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next: Callable) -> Response:
    """Log HTTP requests with method, path, status, and latency."""
    start_time = time.time()
    
    response = await call_next(request)
    
    latency = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} "
        f"status={response.status_code} latency={latency:.3f}s"
    )
    
    return response


# Authorization Middleware
@app.middleware("http")
async def parse_authorization(request: Request, call_next: Callable) -> Response:
    """Parse Authorization header and attach token to request state."""
    auth_header = request.headers.get("Authorization", "")
    
    # Extract token from Bearer scheme
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        request.state.token = token
        
        # TODO: auth verification implementation — call verify_token when app.utils.auth is ready
        try:
            # Attempt to import and verify token if auth module exists
            from app.utils.auth import verify_token
            user_identity = verify_token(token)
            request.state.user = user_identity
        except (ImportError, AttributeError):
            # Auth module not yet implemented, leave identity unset
            request.state.user = None
        except Exception as e:
            # Token verification failed, log and continue
            logger.warning(f"Token verification failed: {str(e)}")
            request.state.user = None
    else:
        request.state.token = None
        request.state.user = None
    
    response = await call_next(request)
    return response


# Health Check Endpoint
@app.get("/")
async def health_check():
    """Root health endpoint for readiness checks."""
    return {
        "service": "LegalIndia Backend",
        "status": "Active",
        "version": "1.0.0"
    }


# Automatic Router Registration
def register_routes():
    """
    Automatically discover and register all routers from app/routes/.
    Loads every Python module and includes routers into the app.
    """
    routes_dir = Path(__file__).parent / "app" / "routes"
    
    if not routes_dir.exists():
        logger.warning(f"Routes directory not found: {routes_dir}")
        return
    
    # Iterate through all Python files in routes directory
    for route_file in routes_dir.glob("*.py"):
        if route_file.name.startswith("_"):
            continue  # Skip __init__.py and private modules
        
        module_name = route_file.stem
        
        try:
            # Import the route module
            module = import_module(f"app.routes.{module_name}")
            
            # Check if module has a 'router' attribute
            if hasattr(module, "router"):
                router = getattr(module, "router")
                app.include_router(router)
                logger.info(f"Registered router: app.routes.{module_name}")
            else:
                logger.debug(f"No router found in app.routes.{module_name}")
        
        except Exception as e:
            # TODO: route registration fallback — implement graceful degradation for failed routes
            logger.error(f"Failed to register router from {module_name}: {str(e)}")


# Register all routes on startup
@app.on_event("startup")
async def startup_event():
    """Application startup event handler."""
    logger.info("Starting LegalIndia Backend...")
    register_routes()
    logger.info("LegalIndia Backend started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event handler."""
    logger.info("Shutting down LegalIndia Backend...")


# TODO: structured logging hook — integrate with Railway logging or external log aggregation service
# TODO: enhanced auth verification — implement full JWT validation and user context management


# Expose ASGI application callable for Gunicorn + Uvicorn
# The 'app' object is the ASGI callable that production servers will use
if __name__ == "__main__":
    # Development server (not for production)
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
