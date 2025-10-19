"""
Caching System
In-memory cache with optional Redis backend
"""
from cache.cache_manager import CacheManager, get_cache_manager, initialize_cache

__all__ = ['CacheManager', 'get_cache_manager', 'initialize_cache']

