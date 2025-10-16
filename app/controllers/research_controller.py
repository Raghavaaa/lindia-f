"""
Research Controller - Business logic for legal research queries.
Pre/post-processing, context templating, and error handling.

# TODO: Research controller — pre/post-processing, context templating, error handling; no DB writes here
# TODO: persist query to history DB (deferred to DB integration phase)
# TODO: role enforcement via RBAC (DB-backed) in later phase
# TODO: provenance tagging for source attribution
# TODO: rate-limiting integration per user
# TODO: cache hooks for frequently-asked queries
"""
import logging
import re
from time import time
from typing import Optional

from fastapi import HTTPException, Request

from app.schemas.request_schema import QueryInput
from app.schemas.response_schema import InferenceResponse
from app.services.ai_service import call_ai_engine

# Configure logging
logger = logging.getLogger(__name__)

# Configuration
MAX_QUERY_LENGTH = 5000
RESEARCH_TEMPLATE = "Legal research context:"  # TODO: refine research prompt template


async def handle_research_query(
    payload: QueryInput,
    request: Request
) -> InferenceResponse:
    """
    Handle a legal research query request.
    
    Performs input sanitization, applies context templating, calls AI service,
    and maps the response to InferenceResponse format. This is an ephemeral
    request→AI flow with no database persistence.
    
    Args:
        payload: QueryInput containing query_text and optional context
        request: FastAPI Request object (for accessing request.state.user)
        
    Returns:
        InferenceResponse: AI-generated answer with sources and confidence
        
    Raises:
        HTTPException(400): If query is empty or invalid
        HTTPException(413): If query exceeds maximum length
        HTTPException(502): If upstream AI service fails
        HTTPException(500): On unexpected internal errors
    """
    start_time = time()
    
    # Extract user info from request state (set by auth middleware)
    user_id = None
    user_role = None
    if hasattr(request.state, "user") and request.state.user:
        user_id = request.state.user.get("sub") or request.state.user.get("user_id")
        user_role = request.state.user.get("role")
        # Log role for observability (enforcement happens in DB phase)
        logger.debug(f"Research query from user_id={user_id}, role={user_role}")
    
    try:
        # Input sanitization - trim whitespace
        sanitized_query = payload.query_text.strip()
        
        # Collapse excessive internal whitespace
        sanitized_query = re.sub(r'\s+', ' ', sanitized_query)
        
        # Reject empty queries
        if not sanitized_query:
            logger.warning("Empty query rejected")
            raise HTTPException(
                status_code=400,
                detail="Query text cannot be empty"
            )
        
        # Enforce maximum length
        if len(sanitized_query) > MAX_QUERY_LENGTH:
            logger.warning(f"Query length {len(sanitized_query)} exceeds maximum {MAX_QUERY_LENGTH}")
            raise HTTPException(
                status_code=413,
                detail=f"Query text exceeds maximum length of {MAX_QUERY_LENGTH} characters"
            )
        
        # Context templating - prepend research template
        templated_query = f"{RESEARCH_TEMPLATE} {sanitized_query}"
        
        # Extract context from payload
        context = payload.context
        
        # Call AI service
        logger.info(f"Calling AI service for research query (user_id={user_id})")
        
        try:
            inference_result = await call_ai_engine(
                query_text=templated_query,
                context=context
            )
        except Exception as ai_error:
            logger.error(f"AI service error: {str(ai_error)}", exc_info=True)
            raise HTTPException(
                status_code=502,
                detail="Upstream AI service error"
            )
        
        # Validate response type
        if not isinstance(inference_result, InferenceResponse):
            # If AI service returned raw dict or other format, map it
            logger.warning("AI service returned non-InferenceResponse, mapping...")
            
            if isinstance(inference_result, dict):
                inference_result = InferenceResponse(
                    answer=inference_result.get("answer", str(inference_result)),
                    sources=inference_result.get("sources", []),
                    confidence=inference_result.get("confidence")
                )
            else:
                # Fallback for unexpected types
                inference_result = InferenceResponse(
                    answer=str(inference_result),
                    sources=[],
                    confidence=None
                )
        
        # Calculate latency
        elapsed_ms = (time() - start_time) * 1000
        
        # Log observability info
        logger.info(
            f"module=research user_id={user_id} elapsed_ms={elapsed_ms:.2f} "
            f"sources_count={len(inference_result.sources)}"
        )
        
        return inference_result
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
        
    except Exception as e:
        # Catch all other unexpected errors
        logger.error(f"Unexpected error in research controller: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
