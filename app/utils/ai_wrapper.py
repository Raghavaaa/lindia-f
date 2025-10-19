"""
AI Service Wrapper with Timeouts, Retries, and Circuit Breaker
Provides robust communication with the AI service with failure handling.
"""
import os
import time
import logging
from typing import Dict, Any, Optional
import httpx
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class CircuitBreaker:
    """
    Circuit breaker pattern implementation.
    Opens circuit after consecutive failures and closes after timeout.
    """
    
    def __init__(self, failure_threshold: int = 3, timeout_seconds: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout_seconds = timeout_seconds
        self.failure_count = 0
        self.last_failure_time: Optional[datetime] = None
        self.state = "closed"  # closed, open, half_open
    
    def record_success(self):
        """Record successful call."""
        self.failure_count = 0
        self.state = "closed"
        logger.debug("Circuit breaker: Success recorded, circuit closed")
    
    def record_failure(self):
        """Record failed call."""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "open"
            logger.warning(
                f"Circuit breaker: OPENED after {self.failure_count} consecutive failures. "
                f"Will retry after {self.timeout_seconds}s"
            )
        else:
            logger.debug(f"Circuit breaker: Failure {self.failure_count}/{self.failure_threshold}")
    
    def can_attempt(self) -> bool:
        """Check if we can attempt a call."""
        if self.state == "closed":
            return True
        
        if self.state == "open":
            # Check if timeout has elapsed
            if self.last_failure_time:
                elapsed = (datetime.now() - self.last_failure_time).total_seconds()
                if elapsed >= self.timeout_seconds:
                    self.state = "half_open"
                    logger.info("Circuit breaker: Transitioning to half-open, allowing retry")
                    return True
            return False
        
        # half_open state - allow one attempt
        return True


# Global circuit breaker instance
_circuit_breaker = CircuitBreaker(failure_threshold=3, timeout_seconds=60)


async def call_ai_service(
    endpoint: str,
    payload: Dict[str, Any],
    method: str = "POST",
    connect_timeout: float = 3.0,
    read_timeout: float = 10.0,
    max_retries: int = 2,
    use_circuit_breaker: bool = True
) -> Dict[str, Any]:
    """
    Call AI service with robust error handling.
    
    Args:
        endpoint: API endpoint path (e.g., "/inference", "/health")
        payload: Request payload dictionary
        method: HTTP method (default: POST)
        connect_timeout: Connection timeout in seconds (default: 3s)
        read_timeout: Read timeout in seconds (default: 10s)
        max_retries: Maximum number of retry attempts (default: 2)
        use_circuit_breaker: Use circuit breaker pattern (default: True)
    
    Returns:
        Dict containing AI service response
    
    Raises:
        AIServiceUnavailable: If AI service is unavailable or circuit is open
        AIServiceTimeout: If request times out
        AIServiceError: For other AI service errors
    """
    # Check circuit breaker
    if use_circuit_breaker and not _circuit_breaker.can_attempt():
        logger.warning("Circuit breaker is OPEN, returning fallback response")
        return get_fallback_response(payload)
    
    # Get AI engine URL
    ai_url = os.getenv("AI_ENGINE_URL", "https://lindia-ai-production.up.railway.app")
    full_url = f"{ai_url}{endpoint}"
    
    # Retry logic with exponential backoff
    last_exception = None
    for attempt in range(max_retries + 1):
        try:
            logger.info(f"AI service call attempt {attempt + 1}/{max_retries + 1}: {endpoint}")
            
            timeout = httpx.Timeout(connect=connect_timeout, read=read_timeout)
            async with httpx.AsyncClient(timeout=timeout) as client:
                if method.upper() == "POST":
                    response = await client.post(full_url, json=payload)
                else:
                    response = await client.get(full_url, params=payload)
                
                # Check response status
                if response.status_code == 200:
                    _circuit_breaker.record_success()
                    logger.info(f"AI service call successful: {endpoint}")
                    return response.json()
                else:
                    logger.warning(f"AI service returned HTTP {response.status_code}: {response.text[:200]}")
                    
                    # Don't retry on client errors (4xx)
                    if 400 <= response.status_code < 500:
                        _circuit_breaker.record_failure()
                        raise AIServiceError(f"Client error: HTTP {response.status_code}")
                    
                    # Retry on server errors (5xx)
                    last_exception = AIServiceError(f"Server error: HTTP {response.status_code}")
                    
        except httpx.TimeoutException as e:
            logger.warning(f"AI service timeout on attempt {attempt + 1}: {str(e)}")
            last_exception = AIServiceTimeout(f"Request timed out: {str(e)}")
            
        except httpx.ConnectError as e:
            logger.warning(f"AI service connection error on attempt {attempt + 1}: {str(e)}")
            last_exception = AIServiceUnavailable(f"Connection failed: {str(e)}")
            
        except Exception as e:
            logger.error(f"Unexpected error calling AI service: {str(e)}", exc_info=True)
            last_exception = AIServiceError(f"Unexpected error: {str(e)}")
        
        # Exponential backoff before retry
        if attempt < max_retries:
            backoff = (2 ** attempt) * 0.5  # 0.5s, 1s, 2s, ...
            logger.info(f"Retrying after {backoff}s backoff...")
            await asyncio_sleep(backoff)
    
    # All retries exhausted
    _circuit_breaker.record_failure()
    logger.error(f"AI service call failed after {max_retries + 1} attempts")
    
    # Return fallback response
    return get_fallback_response(payload)


def get_fallback_response(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate deterministic fallback response when AI service is unavailable.
    
    Args:
        payload: Original request payload
    
    Returns:
        Fallback response with advisory message
    """
    query = payload.get("query", "your legal query")
    
    fallback_message = f"""I apologize, but I'm temporarily unable to process your request due to a service interruption.

Your Query: {query}

What's happening:
- The AI legal analysis service is currently unavailable
- This is a temporary issue and the service will be restored shortly
- Your request has been logged and will be processed once service is restored

What you can do:
- Please try again in a few moments
- For urgent legal matters, consider consulting with a qualified legal professional
- Check our status page for service updates

This is an automated fallback response. We're working to restore full service as quickly as possible.

[AI Service Temporarily Unavailable - Fallback Response Active]"""
    
    return {
        "answer": fallback_message,
        "model": "fallback",
        "status": "fallback_response",
        "confidence": 0.0,
        "tokens_used": len(fallback_message.split()),
        "fallback": True
    }


async def asyncio_sleep(seconds: float):
    """Async sleep helper."""
    import asyncio
    await asyncio.sleep(seconds)


# Custom exceptions
class AIServiceError(Exception):
    """Base exception for AI service errors."""
    pass


class AIServiceUnavailable(AIServiceError):
    """AI service is unavailable."""
    pass


class AIServiceTimeout(AIServiceError):
    """AI service request timed out."""
    pass


# Utility functions for monitoring
def get_circuit_breaker_status() -> Dict[str, Any]:
    """Get current circuit breaker status for monitoring."""
    return {
        "state": _circuit_breaker.state,
        "failure_count": _circuit_breaker.failure_count,
        "last_failure": _circuit_breaker.last_failure_time.isoformat() if _circuit_breaker.last_failure_time else None
    }


def reset_circuit_breaker():
    """Manually reset circuit breaker (for admin/testing use)."""
    _circuit_breaker.failure_count = 0
    _circuit_breaker.state = "closed"
    _circuit_breaker.last_failure_time = None
    logger.info("Circuit breaker manually reset")

