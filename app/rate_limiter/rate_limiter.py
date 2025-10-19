"""
Rate Limiter
Implements sliding window rate limiting per tenant
"""
import time
import logging
from typing import Dict, Optional, List
from collections import deque
from datetime import datetime

logger = logging.getLogger(__name__)

# Global rate limiter instance
_rate_limiter: Optional['RateLimiter'] = None


class TenantRateLimiter:
    """Rate limiter for a single tenant using sliding window"""
    
    def __init__(
        self,
        tenant_id: str,
        max_requests: int = 100,
        window_seconds: int = 60
    ):
        self.tenant_id = tenant_id
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: deque = deque()
    
    def is_allowed(self) -> tuple[bool, Dict[str, any]]:
        """
        Check if request is allowed.
        
        Returns:
            Tuple of (allowed, metadata)
        """
        now = time.time()
        window_start = now - self.window_seconds
        
        # Remove requests outside current window
        while self.requests and self.requests[0] < window_start:
            self.requests.popleft()
        
        # Check if under limit
        current_count = len(self.requests)
        allowed = current_count < self.max_requests
        
        if allowed:
            self.requests.append(now)
        
        metadata = {
            "tenant_id": self.tenant_id,
            "current_count": current_count + (1 if allowed else 0),
            "limit": self.max_requests,
            "window_seconds": self.window_seconds,
            "reset_at": datetime.fromtimestamp(
                self.requests[0] + self.window_seconds if self.requests else now
            ).isoformat(),
            "allowed": allowed
        }
        
        return allowed, metadata
    
    def get_stats(self) -> Dict[str, any]:
        """Get statistics for this tenant"""
        now = time.time()
        window_start = now - self.window_seconds
        
        # Clean up old requests
        while self.requests and self.requests[0] < window_start:
            self.requests.popleft()
        
        return {
            "tenant_id": self.tenant_id,
            "current_requests": len(self.requests),
            "limit": self.max_requests,
            "window_seconds": self.window_seconds,
            "utilization_percent": (len(self.requests) / self.max_requests * 100) if self.max_requests > 0 else 0
        }


class RateLimiter:
    """
    Multi-tenant rate limiter with configurable limits.
    """
    
    def __init__(
        self,
        default_max_requests: int = 100,
        default_window_seconds: int = 60,
        tenant_limits: Optional[Dict[str, Dict[str, int]]] = None
    ):
        self.default_max_requests = default_max_requests
        self.default_window_seconds = default_window_seconds
        self.tenant_limits = tenant_limits or {}
        self.tenant_limiters: Dict[str, TenantRateLimiter] = {}
        
        logger.info(
            f"Rate limiter initialized: {default_max_requests} requests per "
            f"{default_window_seconds}s (default)"
        )
    
    def _get_limiter(self, tenant_id: str) -> TenantRateLimiter:
        """Get or create rate limiter for tenant"""
        if tenant_id not in self.tenant_limiters:
            # Check for custom limits
            if tenant_id in self.tenant_limits:
                limits = self.tenant_limits[tenant_id]
                max_requests = limits.get("max_requests", self.default_max_requests)
                window_seconds = limits.get("window_seconds", self.default_window_seconds)
            else:
                max_requests = self.default_max_requests
                window_seconds = self.default_window_seconds
            
            self.tenant_limiters[tenant_id] = TenantRateLimiter(
                tenant_id=tenant_id,
                max_requests=max_requests,
                window_seconds=window_seconds
            )
        
        return self.tenant_limiters[tenant_id]
    
    async def check_rate_limit(
        self,
        tenant_id: str
    ) -> tuple[bool, Dict[str, any]]:
        """
        Check if request is within rate limit.
        
        Args:
            tenant_id: Tenant identifier
        
        Returns:
            Tuple of (allowed, metadata)
        """
        limiter = self._get_limiter(tenant_id)
        allowed, metadata = limiter.is_allowed()
        
        if not allowed:
            logger.warning(
                f"Rate limit exceeded for tenant {tenant_id}: "
                f"{metadata['current_count']}/{metadata['limit']} requests"
            )
        
        return allowed, metadata
    
    def get_tenant_stats(self, tenant_id: str) -> Dict[str, any]:
        """Get rate limit stats for tenant"""
        if tenant_id in self.tenant_limiters:
            return self.tenant_limiters[tenant_id].get_stats()
        
        return {
            "tenant_id": tenant_id,
            "current_requests": 0,
            "limit": self.default_max_requests,
            "window_seconds": self.default_window_seconds,
            "utilization_percent": 0.0
        }
    
    def get_all_stats(self) -> Dict[str, any]:
        """Get stats for all tenants"""
        return {
            "default_limits": {
                "max_requests": self.default_max_requests,
                "window_seconds": self.default_window_seconds
            },
            "active_tenants": len(self.tenant_limiters),
            "tenants": {
                tenant_id: limiter.get_stats()
                for tenant_id, limiter in self.tenant_limiters.items()
            }
        }
    
    def set_tenant_limit(
        self,
        tenant_id: str,
        max_requests: int,
        window_seconds: int
    ):
        """Set custom rate limit for a tenant"""
        self.tenant_limits[tenant_id] = {
            "max_requests": max_requests,
            "window_seconds": window_seconds
        }
        
        # Reset limiter if it exists
        if tenant_id in self.tenant_limiters:
            del self.tenant_limiters[tenant_id]
        
        logger.info(
            f"Set rate limit for tenant {tenant_id}: "
            f"{max_requests} requests per {window_seconds}s"
        )


def get_rate_limiter() -> RateLimiter:
    """Get global rate limiter"""
    global _rate_limiter
    if _rate_limiter is None:
        # Initialize with defaults if not already initialized
        _rate_limiter = RateLimiter()
    return _rate_limiter


def initialize_rate_limiter(
    default_max_requests: int = 100,
    default_window_seconds: int = 60,
    tenant_limits: Optional[Dict[str, Dict[str, int]]] = None
) -> RateLimiter:
    """Initialize global rate limiter"""
    global _rate_limiter
    _rate_limiter = RateLimiter(
        default_max_requests=default_max_requests,
        default_window_seconds=default_window_seconds,
        tenant_limits=tenant_limits
    )
    return _rate_limiter

