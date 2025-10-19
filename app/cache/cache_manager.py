"""
Cache Manager
Supports in-memory caching with TTL and optional Redis backend
"""
import hashlib
import json
import time
import logging
from typing import Optional, Any, Dict
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Global cache manager instance
_cache_manager: Optional['CacheManager'] = None


class InMemoryCache:
    """Simple in-memory cache with TTL"""
    
    def __init__(self, default_ttl: int = 300):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl
        self.hits = 0
        self.misses = 0
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key in self.cache:
            entry = self.cache[key]
            
            # Check if expired
            if time.time() < entry["expires_at"]:
                self.hits += 1
                logger.debug(f"Cache HIT: {key}")
                return entry["value"]
            else:
                # Expired - remove it
                del self.cache[key]
                logger.debug(f"Cache EXPIRED: {key}")
        
        self.misses += 1
        logger.debug(f"Cache MISS: {key}")
        return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """Set value in cache with TTL"""
        ttl = ttl or self.default_ttl
        expires_at = time.time() + ttl
        
        self.cache[key] = {
            "value": value,
            "expires_at": expires_at,
            "created_at": time.time()
        }
        
        logger.debug(f"Cache SET: {key} (TTL: {ttl}s)")
    
    def delete(self, key: str):
        """Delete key from cache"""
        if key in self.cache:
            del self.cache[key]
            logger.debug(f"Cache DELETE: {key}")
    
    def clear(self):
        """Clear all cache entries"""
        count = len(self.cache)
        self.cache.clear()
        logger.info(f"Cache CLEAR: {count} entries removed")
    
    def cleanup_expired(self):
        """Remove expired entries"""
        now = time.time()
        expired_keys = [
            key for key, entry in self.cache.items()
            if now >= entry["expires_at"]
        ]
        
        for key in expired_keys:
            del self.cache[key]
        
        if expired_keys:
            logger.debug(f"Cache cleanup: {len(expired_keys)} expired entries removed")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = self.hits + self.misses
        hit_rate = (self.hits / total_requests * 100) if total_requests > 0 else 0.0
        
        return {
            "size": len(self.cache),
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": round(hit_rate, 2),
            "backend": "in-memory"
        }


class CacheManager:
    """
    Cache manager with support for different backends.
    Default is in-memory, can be extended to Redis.
    """
    
    def __init__(
        self,
        backend: str = "memory",
        default_ttl: int = 300,
        redis_url: Optional[str] = None
    ):
        self.backend = backend
        self.default_ttl = default_ttl
        
        if backend == "memory":
            self.cache = InMemoryCache(default_ttl=default_ttl)
            logger.info("Cache initialized: in-memory backend")
        elif backend == "redis":
            # TODO: Implement Redis backend
            logger.warning("Redis backend not yet implemented, falling back to in-memory")
            self.cache = InMemoryCache(default_ttl=default_ttl)
        else:
            raise ValueError(f"Unsupported cache backend: {backend}")
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        return self.cache.get(key)
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """Set value in cache"""
        self.cache.set(key, value, ttl=ttl)
    
    def delete(self, key: str):
        """Delete key from cache"""
        self.cache.delete(key)
    
    def clear(self):
        """Clear all cache"""
        self.cache.clear()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return self.cache.get_stats()
    
    def cache_key_for_query(
        self,
        query: str,
        provider: Optional[str] = None,
        model: Optional[str] = None,
        tenant_id: Optional[str] = None
    ) -> str:
        """
        Generate cache key for a query.
        
        Args:
            query: Query text
            provider: Provider name
            model: Model name
            tenant_id: Tenant ID
        
        Returns:
            Cache key (hash)
        """
        # Create deterministic key from query parameters
        key_data = {
            "query": query.strip().lower(),
            "provider": provider or "default",
            "model": model or "default",
            "tenant": tenant_id or "default"
        }
        
        # Create hash
        key_string = json.dumps(key_data, sort_keys=True)
        key_hash = hashlib.sha256(key_string.encode()).hexdigest()[:16]
        
        return f"query:{key_hash}"
    
    async def get_cached_response(
        self,
        query: str,
        provider: Optional[str] = None,
        model: Optional[str] = None,
        tenant_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Get cached response for a query.
        
        Returns:
            Cached response dict or None
        """
        cache_key = self.cache_key_for_query(query, provider, model, tenant_id)
        return self.get(cache_key)
    
    async def cache_response(
        self,
        query: str,
        response: Dict[str, Any],
        provider: Optional[str] = None,
        model: Optional[str] = None,
        tenant_id: Optional[str] = None,
        ttl: Optional[int] = None
    ):
        """
        Cache a response.
        
        Args:
            query: Query text
            response: Response dict to cache
            provider: Provider name
            model: Model name
            tenant_id: Tenant ID
            ttl: Time to live in seconds
        """
        cache_key = self.cache_key_for_query(query, provider, model, tenant_id)
        self.set(cache_key, response, ttl=ttl or self.default_ttl)


def get_cache_manager() -> CacheManager:
    """Get global cache manager"""
    global _cache_manager
    if _cache_manager is None:
        # Initialize with defaults if not already initialized
        _cache_manager = CacheManager()
    return _cache_manager


def initialize_cache(
    backend: str = "memory",
    default_ttl: int = 300,
    redis_url: Optional[str] = None
) -> CacheManager:
    """Initialize global cache manager"""
    global _cache_manager
    _cache_manager = CacheManager(
        backend=backend,
        default_ttl=default_ttl,
        redis_url=redis_url
    )
    return _cache_manager

