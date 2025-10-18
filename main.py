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

# Database setup - Auto-create tables on startup
try:
    from app.models import Base
    from app.database import engine
    
    # Debug: Log environment variables
    logger.info(f"RAILWAY_ENVIRONMENT: {os.getenv('RAILWAY_ENVIRONMENT', 'Not set')}")
    logger.info(f"DATABASE_URL present: {'Yes' if os.getenv('DATABASE_URL') else 'No'}")
    
    # Create all tables if not present
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ready")
except Exception as e:
    logger.error(f"Database initialization failed: {str(e)}", exc_info=True)
    logger.warning("Continuing without database - some features may not work")

# Initialize FastAPI application
app = FastAPI(
    title="LegalIndia Backend",
    version="1.0.1",
    description="Production-grade FastAPI backend for LegalIndia.ai platform with Client Management"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://legalindia.ai",
        "https://www.legalindia.ai",
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
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


# Database Status Endpoint
@app.get("/db-status")
async def database_status():
    """Check database connection and table status."""
    try:
        from app.database import engine
        from app.models import Upload
        from sqlalchemy import text
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        
        # Check if uploads table exists
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        return {
            "database_connected": True,
            "database_url": os.getenv("DATABASE_URL", "Not set")[:50] + "..." if os.getenv("DATABASE_URL") else "Not set",
            "tables": tables,
            "uploads_table_exists": "uploads" in tables
        }
    except Exception as e:
        return {
            "database_connected": False,
            "error": str(e),
            "database_url": os.getenv("DATABASE_URL", "Not set")[:50] + "..." if os.getenv("DATABASE_URL") else "Not set"
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
    
    # Also include routes from the main routes directory
    main_routes_dir = Path("routes")
    if main_routes_dir.exists():
        logger.info("Including routes from main routes directory")
        for route_file in main_routes_dir.glob("*.py"):
            if route_file.name.startswith("_"):
                continue  # Skip __init__.py and private modules
            
            module_name = route_file.stem
            
            try:
                # Import the route module
                module = import_module(f"routes.{module_name}")
                
                # Check if module has a 'router' attribute
                if hasattr(module, "router"):
                    router = getattr(module, "router")
                    app.include_router(router, prefix="/api/v1")
                    logger.info(f"Registered router: routes.{module_name} with /api/v1 prefix")
                else:
                    logger.debug(f"No router found in routes.{module_name}")
            
            except Exception as e:
                logger.warning(f"Failed to register router routes.{module_name}: {e}")


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
