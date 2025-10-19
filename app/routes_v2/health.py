"""
Health and Metrics Endpoints
System health checks and observability metrics
"""
import time
import logging
from fastapi import APIRouter, Request

from providers import get_provider_manager
from cache import get_cache_manager
from observability import get_metrics_collector
from config import get_config

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health")
async def health_check(request: Request):
    """
    Comprehensive health check endpoint.
    Returns status of all subsystems with provider information.
    """
    start_time = time.time()
    config = get_config()
    
    health_status = {
        "status": "ok",
        "version": "2.0.0",
        "timestamp": time.time(),
        "uptime_seconds": time.time() - request.app.state.start_time if hasattr(request.app.state, 'start_time') else 0,
        "runtime_mode": config.runtime_mode,
        "subsystems": {}
    }
    
    # Check provider manager
    try:
        provider_manager = get_provider_manager()
        provider_status = provider_manager.get_provider_status()
        
        # Count healthy providers
        healthy_count = sum(
            1 for p in provider_status["providers"].values()
            if p["status"] == "healthy"
        )
        total_providers = len(provider_status["providers"])
        
        health_status["subsystems"]["providers"] = {
            "status": "ok" if healthy_count > 0 else "degraded",
            "healthy": healthy_count,
            "total": total_providers,
            "providers": {
                name: {
                    "status": info["status"],
                    "enabled": info["enabled"],
                    "type": info["type"]
                }
                for name, info in provider_status["providers"].items()
            }
        }
        
        if healthy_count == 0:
            health_status["status"] = "degraded"
    
    except Exception as e:
        health_status["status"] = "degraded"
        health_status["subsystems"]["providers"] = {
            "status": "error",
            "message": str(e)[:100]
        }
    
    # Check cache
    try:
        cache_manager = get_cache_manager()
        cache_stats = cache_manager.get_stats()
        
        health_status["subsystems"]["cache"] = {
            "status": "ok",
            "backend": cache_stats["backend"],
            "size": cache_stats["size"],
            "hit_rate": cache_stats["hit_rate"]
        }
    except Exception as e:
        health_status["subsystems"]["cache"] = {
            "status": "error",
            "message": str(e)[:100]
        }
    
    # Check database (if configured)
    try:
        from database import SessionLocal
        from sqlalchemy import text
        
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        
        health_status["subsystems"]["database"] = {
            "status": "ok",
            "message": "Connected"
        }
    except Exception as e:
        health_status["subsystems"]["database"] = {
            "status": "degraded",
            "message": str(e)[:100]
        }
    
    # Add response time
    health_status["response_time_ms"] = round((time.time() - start_time) * 1000, 2)
    
    return health_status


@router.get("/metrics")
async def get_metrics():
    """
    Get system metrics including:
    - Request statistics
    - Provider performance
    - Cache hit rates
    - Error rates
    """
    metrics = get_metrics_collector()
    return metrics.get_metrics()


@router.get("/status")
async def system_status(request: Request):
    """
    Simplified status endpoint for monitoring.
    Returns 200 if system is operational.
    """
    config = get_config()
    provider_manager = get_provider_manager()
    metrics = get_metrics_collector()
    
    # Check if at least one provider is healthy
    provider_status = provider_manager.get_provider_status()
    healthy_providers = sum(
        1 for p in provider_status["providers"].values()
        if p["status"] == "healthy" and p["enabled"]
    )
    
    is_operational = healthy_providers > 0
    
    system_metrics = metrics.get_metrics()
    
    return {
        "status": "operational" if is_operational else "degraded",
        "version": "2.0.0",
        "runtime_mode": config.runtime_mode,
        "healthy_providers": healthy_providers,
        "total_requests": system_metrics["requests"]["total"],
        "success_rate": system_metrics["requests"]["success_rate"],
        "cache_hit_rate": system_metrics["cache"]["hit_rate"],
        "uptime_seconds": system_metrics["uptime_seconds"]
    }


@router.get("/ready")
async def readiness_check():
    """
    Readiness check for Kubernetes/container orchestration.
    Returns 200 if application is ready to serve traffic.
    """
    try:
        # Check that critical components are initialized
        provider_manager = get_provider_manager()
        
        # Check if at least one provider is available
        provider_status = provider_manager.get_provider_status()
        has_provider = len(provider_status["providers"]) > 0
        
        if not has_provider:
            return {"ready": False, "reason": "No providers configured"}, 503
        
        return {"ready": True}
    
    except Exception as e:
        return {"ready": False, "reason": str(e)}, 503


@router.get("/live")
async def liveness_check():
    """
    Liveness check for Kubernetes/container orchestration.
    Returns 200 if application process is alive.
    """
    return {"alive": True}

