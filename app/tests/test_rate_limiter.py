"""
Test Rate Limiting System
"""
import pytest
import asyncio
import time
from rate_limiter.rate_limiter import TenantRateLimiter, RateLimiter


def test_tenant_rate_limiter_basic():
    """Test basic rate limiting"""
    limiter = TenantRateLimiter(
        tenant_id="test_tenant",
        max_requests=5,
        window_seconds=10
    )
    
    # First 5 requests should be allowed
    for i in range(5):
        allowed, metadata = limiter.is_allowed()
        assert allowed is True
    
    # 6th request should be rejected
    allowed, metadata = limiter.is_allowed()
    assert allowed is False
    assert metadata["current_count"] == 5


def test_tenant_rate_limiter_window_sliding():
    """Test sliding window behavior"""
    limiter = TenantRateLimiter(
        tenant_id="test_tenant",
        max_requests=2,
        window_seconds=1  # 1 second window
    )
    
    # Use up the limit
    limiter.is_allowed()
    limiter.is_allowed()
    
    allowed, _ = limiter.is_allowed()
    assert allowed is False
    
    # Wait for window to slide
    time.sleep(1.1)
    
    # Should be allowed again
    allowed, _ = limiter.is_allowed()
    assert allowed is True


@pytest.mark.asyncio
async def test_rate_limiter_multi_tenant():
    """Test rate limiter with multiple tenants"""
    limiter = RateLimiter(
        default_max_requests=5,
        default_window_seconds=60
    )
    
    # Tenant 1
    for i in range(5):
        allowed, _ = await limiter.check_rate_limit("tenant1")
        assert allowed is True
    
    # Tenant 1 should be rate limited
    allowed, _ = await limiter.check_rate_limit("tenant1")
    assert allowed is False
    
    # Tenant 2 should still be allowed
    allowed, _ = await limiter.check_rate_limit("tenant2")
    assert allowed is True


@pytest.mark.asyncio
async def test_rate_limiter_custom_limits():
    """Test custom rate limits per tenant"""
    limiter = RateLimiter(
        default_max_requests=10,
        default_window_seconds=60
    )
    
    # Set custom limit for tenant
    limiter.set_tenant_limit("vip_tenant", max_requests=100, window_seconds=60)
    
    # VIP tenant should have higher limit
    for i in range(15):
        allowed, _ = await limiter.check_rate_limit("vip_tenant")
        assert allowed is True  # Should still be under 100


def test_rate_limiter_stats():
    """Test rate limiter statistics"""
    limiter = RateLimiter(
        default_max_requests=10,
        default_window_seconds=60
    )
    
    # Make some requests
    asyncio.run(limiter.check_rate_limit("tenant1"))
    asyncio.run(limiter.check_rate_limit("tenant1"))
    asyncio.run(limiter.check_rate_limit("tenant2"))
    
    stats = limiter.get_all_stats()
    
    assert stats["active_tenants"] == 2
    assert "tenant1" in stats["tenants"]
    assert "tenant2" in stats["tenants"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

