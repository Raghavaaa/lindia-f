"""
OpenAI Provider
Supports OpenAI API (gpt-4, gpt-3.5-turbo, etc.)
"""
import httpx
import time
import logging
from typing import Optional

from providers.base_provider import BaseProvider, ProviderCapabilities, ProviderStatus
from providers.models import InferenceRequest, InferenceResponse, ProviderConfig

logger = logging.getLogger(__name__)


class OpenAIProvider(BaseProvider):
    """Provider for OpenAI API"""
    
    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        self.api_key = config.api_key
        self.base_url = config.base_url or "https://api.openai.com/v1"
        
        if not self.api_key:
            logger.warning("OpenAI provider initialized without API key")
    
    async def generate(self, request: InferenceRequest) -> InferenceResponse:
        """Generate response from OpenAI"""
        if not self.api_key:
            raise Exception("OpenAI API key not configured")
        
        start_time = time.time()
        
        model = request.model or self.config.default_model
        max_tokens = request.max_tokens or 2000
        temperature = request.temperature or 0.7
        
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": request.context or "You are a helpful AI legal assistant for Indian law."
                },
                {
                    "role": "user",
                    "content": request.query
                }
            ],
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    latency_ms = (time.time() - start_time) * 1000
                    
                    answer = data["choices"][0]["message"]["content"]
                    tokens_used = data.get("usage", {}).get("total_tokens", 0)
                    
                    return InferenceResponse(
                        answer=answer,
                        model_used=model,
                        provider_used=self.config.name,
                        tokens_used=tokens_used,
                        latency_ms=latency_ms,
                        cached=False,
                        fallback=False
                    )
                else:
                    raise Exception(f"OpenAI API error: {response.status_code} - {response.text[:200]}")
        
        except httpx.TimeoutException:
            raise Exception("OpenAI API timeout")
        except Exception as e:
            logger.error(f"OpenAI provider error: {str(e)}")
            raise
    
    async def health_check(self) -> bool:
        """Check OpenAI API health"""
        if not self.api_key:
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(
                    f"{self.base_url}/models",
                    headers=headers
                )
                return response.status_code == 200
        except Exception:
            return False
    
    def get_capabilities(self) -> ProviderCapabilities:
        """Get OpenAI capabilities"""
        return ProviderCapabilities(
            supports_streaming=True,
            supports_embeddings=True,
            supports_function_calling=True,
            max_context_length=128000,  # GPT-4 Turbo
            supports_vision=True,
            supports_json_mode=True
        )

