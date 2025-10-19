"""
Management API Routes
Provider management, configuration, and system control
"""
import logging
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from providers import get_provider_manager
from cache import get_cache_manager
from rate_limiter import get_rate_limiter
from observability import get_metrics_collector
from config import get_config
from utils.api_key_auth import verify_api_key

logger = logging.getLogger(__name__)
router = APIRouter()


class ProviderSwitchRequest(BaseModel):
    """Request to switch active provider"""
    provider_name: str


class ProviderToggleRequest(BaseModel):
    """Request to enable/disable provider"""
    provider_name: str
    enabled: bool


@router.get("/providers")
async def list_providers(current_user: dict = Depends(verify_api_key)):
    """
    List all configured providers with their status.
    """
    provider_manager = get_provider_manager()
    status = provider_manager.get_provider_status()
    
    return status


@router.post("/providers/switch")
async def switch_provider(
    request: ProviderSwitchRequest,
    current_user: dict = Depends(verify_api_key)
):
    """
    Switch active provider.
    This affects the priority order for future requests.
    """
    provider_manager = get_provider_manager()
    
    success = provider_manager.switch_provider(request.provider_name)
    
    if not success:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to switch to provider: {request.provider_name}"
        )
    
    return {
        "success": True,
        "active_provider": request.provider_name,
        "message": f"Switched to provider: {request.provider_name}"
    }


@router.post("/providers/toggle")
async def toggle_provider(
    request: ProviderToggleRequest,
    current_user: dict = Depends(verify_api_key)
):
    """
    Enable or disable a provider.
    """
    provider_manager = get_provider_manager()
    
    if request.enabled:
        success = provider_manager.enable_provider(request.provider_name)
        action = "enabled"
    else:
        success = provider_manager.disable_provider(request.provider_name)
        action = "disabled"
    
    if not success:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to {action} provider: {request.provider_name}"
        )
    
    return {
        "success": True,
        "provider": request.provider_name,
        "enabled": request.enabled,
        "message": f"Provider {action}: {request.provider_name}"
    }


@router.get("/cache/stats")
async def cache_stats(current_user: dict = Depends(verify_api_key)):
    """Get cache statistics"""
    cache_manager = get_cache_manager()
    stats = cache_manager.get_stats()
    
    return stats


@router.post("/cache/clear")
async def clear_cache(current_user: dict = Depends(verify_api_key)):
    """Clear all cache entries"""
    cache_manager = get_cache_manager()
    cache_manager.clear()
    
    return {
        "success": True,
        "message": "Cache cleared successfully"
    }


@router.get("/rate-limits")
async def get_rate_limits(current_user: dict = Depends(verify_api_key)):
    """Get rate limiting statistics for all tenants"""
    rate_limiter = get_rate_limiter()
    stats = rate_limiter.get_all_stats()
    
    return stats


@router.get("/rate-limits/{tenant_id}")
async def get_tenant_rate_limit(
    tenant_id: str,
    current_user: dict = Depends(verify_api_key)
):
    """Get rate limiting statistics for a specific tenant"""
    rate_limiter = get_rate_limiter()
    stats = rate_limiter.get_tenant_stats(tenant_id)
    
    return stats


@router.get("/config")
async def get_configuration(current_user: dict = Depends(verify_api_key)):
    """
    Get current system configuration.
    Secrets are redacted.
    """
    config = get_config()
    
    # Return safe config (no secrets)
    return {
        "runtime_mode": config.runtime_mode,
        "cache": {
            "backend": config.cache_backend,
            "ttl_seconds": config.cache_ttl_seconds,
            "enabled": config.enable_caching
        },
        "rate_limiting": {
            "enabled": config.rate_limit_enabled,
            "max_requests": config.rate_limit_requests,
            "window_seconds": config.rate_limit_window_seconds
        },
        "features": {
            "local_model": config.enable_local_model,
            "rag": config.enable_rag,
            "caching": config.enable_caching
        },
        "providers_configured": len(config.provider_configs),
        "pipeline": {
            "sanitization": config.pipeline_config.enable_sanitization,
            "retrieval": config.pipeline_config.enable_retrieval,
            "citation_extraction": config.pipeline_config.enable_citation_extraction,
            "response_structuring": config.pipeline_config.enable_response_structuring,
            "output_validation": config.pipeline_config.enable_output_validation
        }
    }

