"""
Mock Provider for Testing
Returns deterministic responses for testing and development
"""
import time
import logging
from typing import Optional

from providers.base_provider import BaseProvider, ProviderCapabilities, ProviderStatus
from providers.models import InferenceRequest, InferenceResponse, ProviderConfig

logger = logging.getLogger(__name__)


class MockProvider(BaseProvider):
    """
    Mock provider for testing and development.
    Returns deterministic responses without calling external services.
    """
    
    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        self.should_fail = False  # For testing failure scenarios
    
    async def generate(self, request: InferenceRequest) -> InferenceResponse:
        """Generate mock response"""
        start_time = time.time()
        
        if self.should_fail:
            raise Exception("Mock provider configured to fail")
        
        # Generate deterministic mock response
        mock_answer = f"""Mock Legal Analysis for: {request.query}

This is a mock response from the testing provider.

**Legal Framework:**
- Indian Constitution, Article 21 (Right to Life and Personal Liberty)
- Indian Penal Code (IPC) relevant sections
- Code of Criminal Procedure (CrPC)

**Analysis:**
Your query "{request.query}" has been processed by the mock provider. In a production environment, this would be processed by a real AI model with comprehensive legal knowledge.

**Key Points:**
1. This is a test response for development purposes
2. Real responses will include actual legal analysis
3. Citations and references will be properly formatted
4. Confidence scoring will reflect actual model performance

**Recommendations:**
- Configure a real provider (OpenAI, DeepSeek, etc.) for production
- Review provider credentials and connectivity
- Test with actual legal queries

[Mock Provider Response - Testing Mode]"""
        
        latency_ms = (time.time() - start_time) * 1000
        
        return InferenceResponse(
            answer=mock_answer,
            model_used="mock-model-v1",
            provider_used=self.config.name,
            confidence=0.95,
            tokens_used=len(mock_answer.split()),
            latency_ms=latency_ms,
            cached=False,
            fallback=False,
            citations=[
                {"source": "Mock Citation 1", "relevance": 0.9},
                {"source": "Mock Citation 2", "relevance": 0.8}
            ],
            metadata={"mode": "mock", "query_length": len(request.query)}
        )
    
    async def health_check(self) -> bool:
        """Mock provider is always healthy"""
        return not self.should_fail
    
    def get_capabilities(self) -> ProviderCapabilities:
        """Get mock provider capabilities"""
        return ProviderCapabilities(
            supports_streaming=True,
            supports_embeddings=True,
            supports_function_calling=True,
            max_context_length=16384,
            supports_vision=True,
            supports_json_mode=True
        )

