"""
Test Caching System
"""
import pytest
import time
from cache.cache_manager import InMemoryCache, CacheManager


def test_in_memory_cache_basic():
    """Test basic cache operations"""
    cache = InMemoryCache(default_ttl=5)
    
    # Set and get
    cache.set("key1", "value1")
    assert cache.get("key1") == "value1"
    
    # Miss
    assert cache.get("nonexistent") is None


def test_in_memory_cache_ttl():
    """Test cache TTL expiration"""
    cache = InMemoryCache(default_ttl=1)  # 1 second TTL
    
    cache.set("key1", "value1")
    assert cache.get("key1") == "value1"
    
    # Wait for expiration
    time.sleep(1.1)
    assert cache.get("key1") is None  # Should be expired


def test_in_memory_cache_stats():
    """Test cache statistics"""
    cache = InMemoryCache()
    
    cache.set("key1", "value1")
    cache.set("key2", "value2")
    
    # Hit
    cache.get("key1")
    
    # Miss
    cache.get("key3")
    
    stats = cache.get_stats()
    
    assert stats["size"] == 2
    assert stats["hits"] == 1
    assert stats["misses"] == 1
    assert stats["hit_rate"] > 0


def test_cache_manager_initialization():
    """Test cache manager initialization"""
    manager = CacheManager(backend="memory", default_ttl=300)
    
    assert manager.backend == "memory"
    assert manager.default_ttl == 300


def test_cache_manager_key_generation():
    """Test cache key generation"""
    manager = CacheManager()
    
    key1 = manager.cache_key_for_query(
        query="What is Section 302 IPC?",
        provider="openai",
        model="gpt-4"
    )
    
    key2 = manager.cache_key_for_query(
        query="What is Section 302 IPC?",
        provider="openai",
        model="gpt-4"
    )
    
    # Same query should generate same key
    assert key1 == key2
    
    # Different query should generate different key
    key3 = manager.cache_key_for_query(
        query="Different query",
        provider="openai",
        model="gpt-4"
    )
    
    assert key1 != key3


@pytest.mark.asyncio
async def test_cache_manager_response_caching():
    """Test response caching"""
    manager = CacheManager(default_ttl=60)
    
    query = "What is Article 21?"
    response = {
        "answer": "Right to life and personal liberty",
        "model": "gpt-4",
        "provider": "openai"
    }
    
    # Cache response
    await manager.cache_response(
        query=query,
        response=response,
        provider="openai"
    )
    
    # Retrieve cached response
    cached = await manager.get_cached_response(
        query=query,
        provider="openai"
    )
    
    assert cached is not None
    assert cached["answer"] == response["answer"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

