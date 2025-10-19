"""
AI Engine Provider
Connects to the external AI engine service (current deployment)
"""
import httpx
import time
import logging
from typing import Optional

from providers.base_provider import BaseProvider, ProviderCapabilities, ProviderStatus
from providers.models import InferenceRequest, InferenceResponse, ProviderConfig

logger = logging.getLogger(__name__)


class AIEngineProvider(BaseProvider):
    """
    Provider that connects to the external AI Engine service.
    This is the current production setup.
    """
    
    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        self.base_url = config.base_url or "https://lindia-ai-production.up.railway.app"
        self.timeout = config.timeout_seconds
    
    async def generate(self, request: InferenceRequest) -> InferenceResponse:
        """Generate response from AI Engine"""
        start_time = time.time()
        
        try:
            # Prepare payload for AI Engine
            payload = {
                "query": request.query,
                "context": request.context,
                "tenant_id": request.tenant_id or "default",
                "max_tokens": request.max_tokens or 500,
                "temperature": request.temperature or 0.7
            }
            
            # Add provider/model override if specified
            if request.model:
                payload["model"] = request.model
            if request.provider:
                payload["provider"] = request.provider
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/inference",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    latency_ms = (time.time() - start_time) * 1000
                    
                    return InferenceResponse(
                        answer=data.get("answer", ""),
                        model_used=data.get("model", self.config.default_model),
                        provider_used=self.config.name,
                        confidence=data.get("confidence"),
                        tokens_used=data.get("tokens_used"),
                        latency_ms=latency_ms,
                        cached=data.get("cached", False),
                        fallback=False,
                        citations=data.get("citations", []),
                        metadata=data.get("metadata", {})
                    )
                else:
                    raise Exception(f"AI Engine returned status {response.status_code}: {response.text[:200]}")
        
        except httpx.TimeoutException as e:
            logger.error(f"AI Engine timeout: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"AI Engine error: {str(e)}")
            raise
    
    async def health_check(self) -> bool:
        """Check if AI Engine is healthy"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"AI Engine health check failed: {str(e)}")
            return False
    
    def get_capabilities(self) -> ProviderCapabilities:
        """Get AI Engine capabilities"""
        return ProviderCapabilities(
            supports_streaming=False,
            supports_embeddings=True,
            supports_function_calling=False,
            max_context_length=8192,
            supports_vision=False,
            supports_json_mode=True
        )

