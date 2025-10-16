"""
AI Service - Backend communication layer for AI engine.
Async HTTP client for inference requests with retry logic and error handling.

TODO: Add API key header authentication when AI engine requires it
TODO: Implement circuit-breaker pattern to prevent cascade failures
TODO: Add response sanitization and provenance tagging in AI integration phase
"""
import os
import logging
import asyncio
from typing import Optional
from time import time

import httpx

from app.schemas.response_schema import InferenceResponse

# Configure logging
logger = logging.getLogger(__name__)

# Configuration
AI_ENGINE_URL = os.getenv("AI_ENGINE_URL")
REQUEST_TIMEOUT = 10.0  # seconds
MAX_RETRIES = 3
BACKOFF_DELAYS = [0.5, 1.0, 2.0]  # Exponential backoff delays in seconds


async def call_ai_engine(
    query_text: str,
    context: Optional[str] = None
) -> InferenceResponse:
    """
    Call the AI engine endpoint with retry logic and timeout.
    
    This function makes an async HTTP POST request to the configured AI engine,
    implements retry logic for transient failures, and maps the response to
    InferenceResponse schema.
    
    Args:
        query_text: The user's query or question to send to the AI
        context: Optional additional context for the query
        
    Returns:
        InferenceResponse: Parsed AI response with answer, sources, and confidence
        
    Raises:
        RuntimeError: If AI_ENGINE_URL is not configured
        RuntimeError: If all retry attempts fail
        RuntimeError: If response JSON is invalid or unexpected
        
    Examples:
        >>> response = await call_ai_engine("What is Section 10 of ICA?")
        >>> print(response.answer)
        >>> print(response.sources)
    """
    # Validate configuration
    if not AI_ENGINE_URL:
        raise RuntimeError(
            "AI_ENGINE_URL environment variable is required but not set. "
            "Please configure AI_ENGINE_URL to point to the AI engine endpoint."
        )
    
    # Build request payload
    payload = {"query": query_text}
    if context is not None:
        payload["context"] = context
    
    # Track total latency
    start_time = time()
    last_exception = None
    
    # Retry loop with exponential backoff
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            logger.info(
                f"AI engine request attempt {attempt}/{MAX_RETRIES} "
                f"for query: {query_text[:50]}..."
            )
            
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
                response = await client.post(
                    AI_ENGINE_URL,
                    json=payload
                )
                
                # Log response status
                logger.info(
                    f"AI engine response: status_code={response.status_code} "
                    f"latency={time() - start_time:.3f}s"
                )
                
                # Handle 4xx errors - don't retry
                if 400 <= response.status_code < 500:
                    error_msg = f"AI engine returned {response.status_code}: {response.text[:200]}"
                    logger.error(error_msg)
                    raise RuntimeError(error_msg)
                
                # Handle 5xx errors - retry
                if 500 <= response.status_code < 600:
                    error_msg = f"AI engine server error {response.status_code}"
                    logger.warning(f"{error_msg}, attempt {attempt}/{MAX_RETRIES}")
                    last_exception = RuntimeError(error_msg)
                    
                    # Wait before retry (except on last attempt)
                    if attempt < MAX_RETRIES:
                        await asyncio.sleep(BACKOFF_DELAYS[attempt - 1])
                    continue
                
                # Success - parse response
                try:
                    response_data = response.json()
                except Exception as e:
                    raise RuntimeError(f"AI engine returned invalid JSON: {str(e)}")
                
                # Map response to InferenceResponse
                return _parse_inference_response(response_data)
                
        except httpx.TimeoutException as e:
            logger.warning(f"AI engine timeout on attempt {attempt}/{MAX_RETRIES}")
            last_exception = RuntimeError(f"AI engine request timed out after {REQUEST_TIMEOUT}s")
            
            # Wait before retry (except on last attempt)
            if attempt < MAX_RETRIES:
                await asyncio.sleep(BACKOFF_DELAYS[attempt - 1])
            continue
            
        except httpx.NetworkError as e:
            logger.warning(f"AI engine network error on attempt {attempt}/{MAX_RETRIES}: {str(e)}")
            last_exception = RuntimeError(f"Network error connecting to AI engine: {str(e)}")
            
            # Wait before retry (except on last attempt)
            if attempt < MAX_RETRIES:
                await asyncio.sleep(BACKOFF_DELAYS[attempt - 1])
            continue
            
        except RuntimeError:
            # RuntimeError is raised for 4xx errors and invalid JSON - don't retry
            raise
            
        except Exception as e:
            logger.error(f"Unexpected error calling AI engine: {str(e)}")
            last_exception = RuntimeError(f"Unexpected AI engine error: {str(e)}")
            
            # Wait before retry (except on last attempt)
            if attempt < MAX_RETRIES:
                await asyncio.sleep(BACKOFF_DELAYS[attempt - 1])
            continue
    
    # All retries exhausted
    total_latency = time() - start_time
    logger.error(
        f"AI engine request failed after {MAX_RETRIES} attempts "
        f"(total latency: {total_latency:.3f}s)"
    )
    
    if last_exception:
        raise last_exception
    else:
        raise RuntimeError(f"AI engine request failed after {MAX_RETRIES} attempts")


def _parse_inference_response(response_data: dict) -> InferenceResponse:
    """
    Parse AI engine response into InferenceResponse model.
    
    Handles different response formats:
    - Standard format: {"answer": "...", "sources": [...], "confidence": 0.95}
    - Simple format: {"result": "..."}
    - Raw string
    
    Args:
        response_data: Dictionary or value from AI engine response
        
    Returns:
        InferenceResponse: Parsed response
        
    Raises:
        RuntimeError: If response format is completely unexpected
    """
    try:
        # Check if response_data is a dict
        if not isinstance(response_data, dict):
            # Handle raw string response
            return InferenceResponse(
                answer=str(response_data),
                sources=[],
                confidence=None
            )
        
        # Standard format: has 'answer', 'sources', 'confidence'
        if "answer" in response_data:
            return InferenceResponse(
                answer=response_data.get("answer", ""),
                sources=response_data.get("sources", []),
                confidence=response_data.get("confidence")
            )
        
        # Alternative format: has 'result' or 'text'
        if "result" in response_data:
            return InferenceResponse(
                answer=response_data["result"],
                sources=response_data.get("sources", []),
                confidence=response_data.get("confidence")
            )
        
        if "text" in response_data:
            return InferenceResponse(
                answer=response_data["text"],
                sources=response_data.get("sources", []),
                confidence=response_data.get("confidence")
            )
        
        # Unexpected format - try to extract something useful
        logger.warning(f"Unexpected AI response format: {response_data.keys()}")
        return InferenceResponse(
            answer=str(response_data),
            sources=[],
            confidence=None
        )
        
    except Exception as e:
        raise RuntimeError(f"Failed to parse AI engine response: {str(e)}")
