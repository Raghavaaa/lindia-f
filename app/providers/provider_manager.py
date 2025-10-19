"""
Provider Manager
Orchestrates multiple providers with failover, load balancing, and runtime switching
"""
import logging
from typing import Dict, List, Optional, Any
import asyncio
from datetime import datetime

from providers.base_provider import BaseProvider, ProviderStatus
from providers.models import (
    InferenceRequest,
    InferenceResponse,
    ProviderConfig,
    ProviderType
)
from providers.ai_engine_provider import AIEngineProvider
from providers.mock_provider import MockProvider

logger = logging.getLogger(__name__)

# Global provider manager instance
_provider_manager: Optional['ProviderManager'] = None


class ProviderManager:
    """
    Manages multiple AI providers with:
    - Runtime provider switching
    - Automatic failover
    - Health monitoring
    - Priority-based selection
    - Per-request overrides
    """
    
    def __init__(self, configs: List[ProviderConfig]):
        self.providers: Dict[str, BaseProvider] = {}
        self._configs = configs
        self._active_provider: Optional[str] = None
        self._metrics: Dict[str, Any] = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "fallback_count": 0,
            "provider_usage": {}
        }
        
        # Initialize providers
        self._initialize_providers()
    
    def _initialize_providers(self):
        """Initialize all configured providers"""
        for config in self._configs:
            if not config.enabled:
                logger.info(f"Provider {config.name} is disabled, skipping")
                continue
            
            try:
                provider = self._create_provider(config)
                self.providers[config.name] = provider
                logger.info(f"Initialized provider: {config.name} ({config.type.value})")
                
                # Initialize metrics for this provider
                self._metrics["provider_usage"][config.name] = {
                    "requests": 0,
                    "successes": 0,
                    "failures": 0,
                    "avg_latency_ms": 0.0
                }
            except Exception as e:
                logger.error(f"Failed to initialize provider {config.name}: {str(e)}")
    
    def _create_provider(self, config: ProviderConfig) -> BaseProvider:
        """Factory method to create provider instances"""
        if config.type == ProviderType.AI_ENGINE:
            return AIEngineProvider(config)
        elif config.type == ProviderType.MOCK:
            return MockProvider(config)
        elif config.type == ProviderType.OPENAI:
            from providers.openai_provider import OpenAIProvider
            return OpenAIProvider(config)
        elif config.type == ProviderType.DEEPSEEK:
            from providers.deepseek_provider import DeepSeekProvider
            return DeepSeekProvider(config)
        elif config.type == ProviderType.GROQ:
            from providers.groq_provider import GroqProvider
            return GroqProvider(config)
        else:
            raise ValueError(f"Unsupported provider type: {config.type}")
    
    async def validate_all_providers(self) -> Dict[str, bool]:
        """Validate credentials for all providers on startup"""
        results = {}
        
        for name, provider in self.providers.items():
            try:
                is_valid = await provider.validate_credentials()
                results[name] = is_valid
                logger.info(f"Provider {name} validation: {'✓ PASS' if is_valid else '✗ FAIL'}")
            except Exception as e:
                results[name] = False
                logger.error(f"Provider {name} validation error: {str(e)}")
        
        return results
    
    def get_providers_by_priority(self) -> List[BaseProvider]:
        """Get list of providers sorted by priority"""
        return sorted(
            [p for p in self.providers.values() if p.config.enabled],
            key=lambda p: p.config.priority
        )
    
    async def generate(
        self,
        request: InferenceRequest,
        attempt_failover: bool = True
    ) -> InferenceResponse:
        """
        Generate response with automatic provider failover.
        
        Args:
            request: Inference request
            attempt_failover: If True, try next provider on failure
        
        Returns:
            Inference response from successful provider
        """
        self._metrics["total_requests"] += 1
        
        # Determine provider order
        providers_to_try = self._get_provider_order(request)
        
        if not providers_to_try:
            logger.error("No available providers")
            return self._create_fallback_response(request, "No providers available")
        
        # Try providers in order
        last_exception = None
        for i, provider in enumerate(providers_to_try):
            provider_name = provider.config.name
            
            try:
                logger.info(f"Attempting provider: {provider_name} (attempt {i+1}/{len(providers_to_try)})")
                
                # Check health before using
                status = await provider.check_and_update_health()
                if status == ProviderStatus.UNHEALTHY and i < len(providers_to_try) - 1:
                    logger.warning(f"Provider {provider_name} is unhealthy, trying next")
                    continue
                
                # Generate response
                response = await provider.generate(request)
                
                # Update metrics
                self._metrics["successful_requests"] += 1
                self._update_provider_metrics(provider_name, True, response.latency_ms)
                
                # Mark if this was a fallback
                if i > 0:
                    response.fallback = True
                    self._metrics["fallback_count"] += 1
                
                logger.info(f"Provider {provider_name} succeeded (latency: {response.latency_ms:.2f}ms)")
                return response
            
            except Exception as e:
                logger.warning(f"Provider {provider_name} failed: {str(e)}")
                self._update_provider_metrics(provider_name, False, 0.0)
                last_exception = e
                
                # If failover disabled or last provider, raise
                if not attempt_failover or i == len(providers_to_try) - 1:
                    break
        
        # All providers failed
        self._metrics["failed_requests"] += 1
        logger.error(f"All providers failed. Last error: {str(last_exception)}")
        
        return self._create_fallback_response(
            request,
            f"All providers unavailable: {str(last_exception)}"
        )
    
    def _get_provider_order(self, request: InferenceRequest) -> List[BaseProvider]:
        """Determine provider order based on request and configuration"""
        # If specific provider requested, try it first
        if request.provider and request.provider in self.providers:
            provider = self.providers[request.provider]
            if provider.config.enabled:
                other_providers = [
                    p for p in self.get_providers_by_priority()
                    if p.config.name != request.provider
                ]
                return [provider] + other_providers
        
        # Otherwise use priority order
        return self.get_providers_by_priority()
    
    def _update_provider_metrics(
        self,
        provider_name: str,
        success: bool,
        latency_ms: float
    ):
        """Update metrics for a provider"""
        if provider_name not in self._metrics["provider_usage"]:
            return
        
        metrics = self._metrics["provider_usage"][provider_name]
        metrics["requests"] += 1
        
        if success:
            metrics["successes"] += 1
            # Update running average latency
            prev_avg = metrics["avg_latency_ms"]
            prev_count = metrics["successes"] - 1
            metrics["avg_latency_ms"] = (
                (prev_avg * prev_count + latency_ms) / metrics["successes"]
            )
        else:
            metrics["failures"] += 1
    
    def _create_fallback_response(
        self,
        request: InferenceRequest,
        reason: str
    ) -> InferenceResponse:
        """Create fallback response when all providers fail"""
        fallback_message = f"""I apologize, but I'm temporarily unable to process your legal query.

**Your Query:** {request.query}

**Status:** All AI providers are currently unavailable

**What's happening:**
- {reason}
- The system attempted to use multiple AI providers
- All providers were unable to respond at this time

**Next Steps:**
1. Please try again in a few moments
2. For urgent legal matters, consult a qualified legal professional
3. Check system status for updates

This is an automated fallback response. We're working to restore service.

[System Fallback - All Providers Unavailable]"""
        
        return InferenceResponse(
            answer=fallback_message,
            model_used="fallback",
            provider_used="system-fallback",
            confidence=0.0,
            tokens_used=len(fallback_message.split()),
            latency_ms=0.0,
            cached=False,
            fallback=True,
            assistant_confidence="low"
        )
    
    def get_provider_status(self) -> Dict[str, Any]:
        """Get status of all providers"""
        return {
            "providers": {
                name: provider.get_info()
                for name, provider in self.providers.items()
            },
            "active_provider": self._active_provider,
            "metrics": self._metrics,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def switch_provider(self, provider_name: str) -> bool:
        """
        Switch active provider (affects priority).
        
        Args:
            provider_name: Name of provider to make active
        
        Returns:
            True if switch successful
        """
        if provider_name not in self.providers:
            logger.error(f"Provider {provider_name} not found")
            return False
        
        provider = self.providers[provider_name]
        if not provider.config.enabled:
            logger.error(f"Provider {provider_name} is disabled")
            return False
        
        self._active_provider = provider_name
        logger.info(f"Switched active provider to: {provider_name}")
        return True
    
    def enable_provider(self, provider_name: str) -> bool:
        """Enable a provider"""
        if provider_name not in self.providers:
            return False
        
        self.providers[provider_name].config.enabled = True
        logger.info(f"Enabled provider: {provider_name}")
        return True
    
    def disable_provider(self, provider_name: str) -> bool:
        """Disable a provider"""
        if provider_name not in self.providers:
            return False
        
        self.providers[provider_name].config.enabled = False
        logger.info(f"Disabled provider: {provider_name}")
        return True
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get usage metrics"""
        return self._metrics.copy()


def get_provider_manager() -> ProviderManager:
    """Get global provider manager instance"""
    global _provider_manager
    if _provider_manager is None:
        raise RuntimeError("Provider manager not initialized. Call initialize_provider_manager() first.")
    return _provider_manager


def initialize_provider_manager(configs: List[ProviderConfig]) -> ProviderManager:
    """Initialize global provider manager"""
    global _provider_manager
    _provider_manager = ProviderManager(configs)
    return _provider_manager

