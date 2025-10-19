"""
Test Provider Abstraction Layer
"""
import pytest
import asyncio
from providers.models import ProviderConfig, ProviderType, InferenceRequest
from providers.mock_provider import MockProvider
from providers.provider_manager import ProviderManager


@pytest.fixture
def mock_provider_config():
    """Fixture for mock provider config"""
    return ProviderConfig(
        type=ProviderType.MOCK,
        name="test_mock",
        default_model="mock-model",
        priority=1,
        enabled=True
    )


@pytest.fixture
def mock_provider(mock_provider_config):
    """Fixture for mock provider instance"""
    return MockProvider(mock_provider_config)


@pytest.mark.asyncio
async def test_mock_provider_generate(mock_provider):
    """Test mock provider generates responses"""
    request = InferenceRequest(
        query="What is Section 420 IPC?",
        context="Indian Penal Code"
    )
    
    response = await mock_provider.generate(request)
    
    assert response is not None
    assert response.answer is not None
    assert len(response.answer) > 0
    assert response.model_used == "mock-model-v1"
    assert response.provider_used == "test_mock"
    assert response.latency_ms > 0


@pytest.mark.asyncio
async def test_mock_provider_health_check(mock_provider):
    """Test mock provider health check"""
    is_healthy = await mock_provider.health_check()
    assert is_healthy is True


def test_mock_provider_capabilities(mock_provider):
    """Test mock provider capabilities"""
    caps = mock_provider.get_capabilities()
    
    assert caps.supports_streaming is True
    assert caps.supports_embeddings is True
    assert caps.max_context_length > 0


@pytest.mark.asyncio
async def test_provider_manager_failover():
    """Test provider manager with failover"""
    # Create two mock providers
    config1 = ProviderConfig(
        type=ProviderType.MOCK,
        name="primary",
        default_model="mock-1",
        priority=1,
        enabled=True
    )
    
    config2 = ProviderConfig(
        type=ProviderType.MOCK,
        name="secondary",
        default_model="mock-2",
        priority=2,
        enabled=True
    )
    
    manager = ProviderManager([config1, config2])
    
    request = InferenceRequest(query="Test query")
    
    response = await manager.generate(request)
    
    assert response is not None
    assert response.answer is not None
    assert response.provider_used in ["primary", "secondary"]


@pytest.mark.asyncio
async def test_provider_manager_provider_override():
    """Test provider override in request"""
    config1 = ProviderConfig(
        type=ProviderType.MOCK,
        name="provider_a",
        default_model="mock-a",
        priority=1,
        enabled=True
    )
    
    config2 = ProviderConfig(
        type=ProviderType.MOCK,
        name="provider_b",
        default_model="mock-b",
        priority=2,
        enabled=True
    )
    
    manager = ProviderManager([config1, config2])
    
    # Request specific provider
    request = InferenceRequest(
        query="Test query",
        provider="provider_b"
    )
    
    response = await manager.generate(request)
    
    assert response.provider_used == "provider_b"


def test_provider_manager_switch():
    """Test provider switching"""
    config = ProviderConfig(
        type=ProviderType.MOCK,
        name="test_provider",
        default_model="mock",
        priority=1,
        enabled=True
    )
    
    manager = ProviderManager([config])
    
    success = manager.switch_provider("test_provider")
    assert success is True
    
    # Try switching to non-existent provider
    success = manager.switch_provider("nonexistent")
    assert success is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

