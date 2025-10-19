"""
LegalIndia.ai Backend v2.0
Provider Abstraction + Structured Pipeline + Full Observability
"""
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import configuration and initialization
from config import get_config, load_config_from_env
from providers import initialize_provider_manager, get_provider_manager
from pipeline import initialize_pipeline, get_pipeline
from cache import initialize_cache, get_cache_manager
from rate_limiter import initialize_rate_limiter, get_rate_limiter
from observability import get_metrics_collector, get_logger

# Import routes
from routes_v2 import inference, management, health

# Initialize structured logger
logger = get_logger("app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown"""
    # Startup
    logger.info("Starting LegalIndia.ai Backend v2.0")
    
    # Load configuration
    config = load_config_from_env()
    app.state.config = config
    
    logger.info(f"Runtime mode: {config.runtime_mode}")
    logger.info(f"Configured providers: {len(config.provider_configs)}")
    
    # Initialize provider manager
    provider_manager = initialize_provider_manager(config.provider_configs)
    app.state.provider_manager = provider_manager
    
    # Validate providers on startup (non-blocking)
    logger.info("Validating provider credentials...")
    validation_results = await provider_manager.validate_all_providers()
    
    valid_providers = [name for name, valid in validation_results.items() if valid]
    logger.info(f"Provider validation complete: {len(valid_providers)}/{len(validation_results)} healthy")
    
    # Initialize pipeline
    pipeline = initialize_pipeline(provider_manager, config.pipeline_config)
    app.state.pipeline = pipeline
    
    # Initialize cache
    cache_manager = initialize_cache(
        backend=config.cache_backend,
        default_ttl=config.cache_ttl_seconds,
        redis_url=config.redis_url
    )
    app.state.cache_manager = cache_manager
    
    # Initialize rate limiter
    rate_limiter = initialize_rate_limiter(
        default_max_requests=config.rate_limit_requests,
        default_window_seconds=config.rate_limit_window_seconds
    )
    app.state.rate_limiter = rate_limiter
    
    # Initialize metrics collector
    metrics = get_metrics_collector()
    app.state.metrics = metrics
    
    # Store startup time
    app.state.start_time = time.time()
    
    logger.info("✓ All systems initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down LegalIndia.ai Backend")


# Create FastAPI application
app = FastAPI(
    title="LegalIndia.ai Backend v2.0",
    version="2.0.0",
    description="AI-powered legal assistant with provider abstraction and structured pipeline",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all HTTP requests"""
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    # Calculate latency
    latency_ms = (time.time() - start_time) * 1000
    
    # Log request
    logger.log_request(
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        latency_ms=latency_ms
    )
    
    return response


# Include routers
app.include_router(inference.router, prefix="/api/v2", tags=["Inference"])
app.include_router(management.router, prefix="/api/v2/management", tags=["Management"])
app.include_router(health.router, prefix="", tags=["Health"])


@app.get("/")
async def root():
    """Root endpoint"""
    config = get_config()
    
    return {
        "name": "LegalIndia.ai Backend",
        "version": "2.0.0",
        "status": "operational",
        "runtime_mode": config.runtime_mode,
        "features": {
            "provider_abstraction": True,
            "structured_pipeline": True,
            "caching": config.enable_caching,
            "rate_limiting": config.rate_limit_enabled,
            "rag": config.enable_rag
        },
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "metrics": "/metrics",
            "inference": "/api/v2/inference",
            "providers": "/api/v2/management/providers"
        }
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    logger.log_error_with_context(
        exc,
        {
            "method": request.method,
            "path": str(request.url),
            "client": request.client.host if request.client else "unknown"
        }
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": type(exc).__name__,
            "path": str(request.url.path)
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    config = load_config_from_env()
    
    uvicorn.run(
        "main_v2:app",
        host=config.host,
        port=config.port,
        reload=False,
        log_level=config.log_level.lower()
    )

