"""
Base Provider Interface
All provider implementations must inherit from BaseProvider
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from enum import Enum
from pydantic import BaseModel
import time

from providers.models import InferenceRequest, InferenceResponse, ProviderConfig


class ProviderStatus(str, Enum):
    """Provider health status"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


class ProviderCapabilities(BaseModel):
    """Provider capabilities and features"""
    supports_streaming: bool = False
    supports_embeddings: bool = False
    supports_function_calling: bool = False
    max_context_length: int = 4096
    supports_vision: bool = False
    supports_json_mode: bool = False


class BaseProvider(ABC):
    """
    Base class for all AI providers.
    Implements common functionality and defines the interface.
    """
    
    def __init__(self, config: ProviderConfig):
        self.config = config
        self.status = ProviderStatus.UNKNOWN
        self._last_health_check: Optional[float] = None
        self._health_check_interval = 60.0  # seconds
    
    @abstractmethod
    async def generate(self, request: InferenceRequest) -> InferenceResponse:
        """
        Generate a response for the given request.
        Must be implemented by each provider.
        """
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """
        Check if the provider is healthy and responding.
        Must be implemented by each provider.
        """
        pass
    
    @abstractmethod
    def get_capabilities(self) -> ProviderCapabilities:
        """
        Get the capabilities of this provider.
        Must be implemented by each provider.
        """
        pass
    
    async def validate_credentials(self) -> bool:
        """
        Validate provider credentials on startup.
        Default implementation uses health_check.
        """
        try:
            return await self.health_check()
        except Exception:
            return False
    
    def should_check_health(self) -> bool:
        """Check if it's time for a health check"""
        if self._last_health_check is None:
            return True
        return (time.time() - self._last_health_check) >= self._health_check_interval
    
    async def check_and_update_health(self) -> ProviderStatus:
        """Perform health check and update status"""
        if not self.should_check_health():
            return self.status
        
        try:
            is_healthy = await self.health_check()
            self.status = ProviderStatus.HEALTHY if is_healthy else ProviderStatus.UNHEALTHY
            self._last_health_check = time.time()
        except Exception:
            self.status = ProviderStatus.UNHEALTHY
            self._last_health_check = time.time()
        
        return self.status
    
    def get_info(self) -> Dict[str, Any]:
        """Get provider information"""
        return {
            "name": self.config.name,
            "type": self.config.type.value,
            "status": self.status.value,
            "enabled": self.config.enabled,
            "priority": self.config.priority,
            "default_model": self.config.default_model,
            "capabilities": self.get_capabilities().dict()
        }

