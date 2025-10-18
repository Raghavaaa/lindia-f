"""
Research Routes - AI-powered legal research endpoints.
"""
import logging
import httpx
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from utils.api_key_auth import verify_api_key

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/research", tags=["Legal Research"])

# AI Engine URL from environment
AI_ENGINE_URL = "https://lindia-ai-production.up.railway.app"


class ResearchRequest(BaseModel):
    query: str
    client_id: Optional[str] = None
    context: Optional[str] = None


class ResearchResponse(BaseModel):
    query: str
    enhanced_query: Optional[str] = None
    answer: str
    model_used: str
    confidence: Optional[float] = None
    tokens_used: Optional[int] = None


@router.post("/", response_model=ResearchResponse)
async def research_legal_query(
    request: ResearchRequest,
    current_user: Dict[str, Any] = Depends(verify_api_key)
):
    """
    Perform AI-powered legal research with InLegalBERT + DeepSeek workflow.
    
    1. Send query to InLegalBERT for enhancement/reframing
    2. Send enhanced query to DeepSeek for final response
    3. Return comprehensive legal analysis
    
    Args:
        request: Research query with optional context
        current_user: Authenticated user
        
    Returns:
        Enhanced legal research response
    """
    user_id = current_user.get("user_id")
    logger.info(f"Legal research request from user {user_id}: {request.query}")
    
    try:
        # Step 1: Send to InLegalBERT for query enhancement
        inlegal_response = await enhance_query_with_inlegalbert(request.query)
        
        # Step 2: Send enhanced query to DeepSeek for final response
        enhanced_query = inlegal_response.get("enhanced_query", request.query)
        deepseek_response = await get_deepseek_response(enhanced_query)
        
        return ResearchResponse(
            query=request.query,
            enhanced_query=enhanced_query,
            answer=deepseek_response["answer"],
            model_used=deepseek_response.get("model", "DeepSeek"),
            confidence=deepseek_response.get("confidence"),
            tokens_used=deepseek_response.get("tokens_used")
        )
        
    except Exception as e:
        logger.error(f"Research error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Research failed: {str(e)}"
        )


async def enhance_query_with_inlegalbert(query: str) -> Dict[str, Any]:
    """Enhance query using InLegalBERT model."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AI_ENGINE_URL}/inference",
            json={
                "query": query,
                "provider": "inlegal_bert",
                "enhancement_mode": True,
                "max_tokens": 100
            },
            timeout=30.0
        )
        
        if response.status_code != 200:
            raise Exception(f"InLegalBERT enhancement failed: {response.status_code}")
            
        return response.json()


async def get_deepseek_response(enhanced_query: str) -> Dict[str, Any]:
    """Get final response from DeepSeek using enhanced query."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AI_ENGINE_URL}/inference",
            json={
                "query": enhanced_query,
                "provider": "deepseek",
                "max_tokens": 500
            },
            timeout=60.0
        )
        
        if response.status_code != 200:
            raise Exception(f"DeepSeek response failed: {response.status_code}")
            
        return response.json()


@router.get("/health")
async def research_health_check():
    """Check if research service and AI engines are healthy."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{AI_ENGINE_URL}/health", timeout=10.0)
            
            if response.status_code == 200:
                ai_status = response.json()
                return {
                    "status": "healthy",
                    "ai_engine": ai_status,
                    "research_service": "operational"
                }
            else:
                return {
                    "status": "degraded",
                    "ai_engine": "unavailable",
                    "research_service": "operational"
                }
                
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "research_service": "operational"
        }