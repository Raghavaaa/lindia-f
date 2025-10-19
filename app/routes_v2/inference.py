"""
Inference API Routes
Main endpoint for AI legal assistance with structured responses
"""
import time
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field

from pipeline import get_pipeline
from pipeline.models import PipelineRequest, PipelineResponse
from cache import get_cache_manager
from rate_limiter import get_rate_limiter
from observability import get_metrics_collector, get_logger
from utils.api_key_auth import verify_api_key

logger = get_logger("inference")
router = APIRouter()


class InferenceRequestAPI(BaseModel):
    """API request model for inference"""
    query: str = Field(..., min_length=3, max_length=10000, description="Legal query")
    context: Optional[str] = Field(None, description="Additional context")
    model: Optional[str] = Field(None, description="Override model selection")
    provider: Optional[str] = Field(None, description="Override provider selection")
    max_tokens: Optional[int] = Field(None, ge=1, le=4000)
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0)
    desired_response_format: str = Field("structured", description="Response format: structured, simple, detailed")
    enable_cache: bool = Field(True, description="Use cached responses if available")


class InferenceResponseAPI(BaseModel):
    """API response model for inference"""
    # Core response
    answer: str
    model_used: str
    provider_used: str
    
    # Enhanced response
    summary: Optional[str] = None
    executive_summary: Optional[str] = None
    detailed_analysis: Optional[str] = None
    
    # Citations
    citations: list = Field(default_factory=list)
    legal_citations: list = Field(default_factory=list)
    sources: list = Field(default_factory=list)
    
    # Metadata
    confidence: Optional[float] = None
    assistant_confidence: str = "medium"
    quality_score: Optional[float] = None
    tokens_used: Optional[int] = None
    latency_ms: float
    cached: bool = False
    fallback: bool = False
    
    # Pipeline info
    pipeline_stages: list = Field(default_factory=list)
    sanitization_applied: bool = False
    validation_passed: bool = True


@router.post("/inference", response_model=InferenceResponseAPI)
async def process_inference(
    request: InferenceRequestAPI,
    api_request: Request,
    current_user: dict = Depends(verify_api_key)
):
    """
    Process legal query with full pipeline.
    
    Features:
    - Multi-stage processing (sanitization, inference, structuring, validation)
    - Provider failover and selection
    - Response caching
    - Rate limiting
    - Structured response with citations
    """
    start_time = time.time()
    tenant_id = current_user.get("user_id", "default")
    
    # Get components
    pipeline = get_pipeline()
    cache_manager = get_cache_manager()
    rate_limiter = get_rate_limiter()
    metrics = get_metrics_collector()
    
    try:
        # Check rate limit
        if api_request.app.state.config.rate_limit_enabled:
            allowed, rate_info = await rate_limiter.check_rate_limit(tenant_id)
            
            if not allowed:
                metrics.record_rate_limit_rejection()
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded",
                    headers={
                        "X-RateLimit-Limit": str(rate_info["limit"]),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": rate_info["reset_at"]
                    }
                )
        
        # Check cache if enabled
        cached_response = None
        if request.enable_cache and api_request.app.state.config.enable_caching:
            cached_response = await cache_manager.get_cached_response(
                query=request.query,
                provider=request.provider,
                model=request.model,
                tenant_id=tenant_id
            )
        
        if cached_response:
            logger.info(f"Cache HIT for tenant {tenant_id}")
            
            # Record metrics
            latency_ms = (time.time() - start_time) * 1000
            metrics.record_request(
                latency_ms=latency_ms,
                success=True,
                provider=cached_response.get("provider_used"),
                cached=True
            )
            
            return InferenceResponseAPI(**cached_response, cached=True)
        
        # Process through pipeline
        pipeline_request = PipelineRequest(
            query=request.query,
            context=request.context,
            tenant_id=tenant_id,
            model=request.model,
            provider=request.provider,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            desired_response_format=request.desired_response_format
        )
        
        logger.info(f"Processing inference for tenant {tenant_id}: {request.query[:100]}")
        
        response = await pipeline.process(pipeline_request)
        
        # Cache the response if enabled
        if request.enable_cache and api_request.app.state.config.enable_caching and not response.fallback:
            await cache_manager.cache_response(
                query=request.query,
                response=response.dict(),
                provider=request.provider,
                model=request.model,
                tenant_id=tenant_id
            )
        
        # Record metrics
        metrics.record_request(
            latency_ms=response.latency_ms,
            success=not response.fallback,
            provider=response.provider_used,
            cached=False
        )
        
        # Log inference
        logger.log_inference(
            query=request.query,
            provider=response.provider_used,
            model=response.model_used,
            latency_ms=response.latency_ms,
            tokens_used=response.tokens_used,
            cached=False,
            fallback=response.fallback,
            tenant_id=tenant_id
        )
        
        return InferenceResponseAPI(**response.dict())
    
    except HTTPException:
        raise
    except Exception as e:
        logger.log_error_with_context(
            e,
            {
                "tenant_id": tenant_id,
                "query": request.query[:200],
                "provider": request.provider,
                "model": request.model
            }
        )
        
        # Record error metric
        metrics.record_request(
            latency_ms=(time.time() - start_time) * 1000,
            success=False,
            error_type=type(e).__name__
        )
        
        raise HTTPException(
            status_code=500,
            detail=f"Inference processing error: {str(e)}"
        )


@router.post("/inference/simple")
async def simple_inference(
    query: str,
    context: Optional[str] = None,
    current_user: dict = Depends(verify_api_key)
):
    """
    Simplified inference endpoint with minimal response.
    """
    request = InferenceRequestAPI(
        query=query,
        context=context,
        desired_response_format="simple"
    )
    
    # Use the main endpoint
    from fastapi import Request as FastAPIRequest
    
    # This is a simplified wrapper
    # In production, you'd want to properly handle this
    response = await process_inference(request, None, current_user)
    
    return {
        "query": query,
        "answer": response.answer,
        "model": response.model_used,
        "provider": response.provider_used
    }

