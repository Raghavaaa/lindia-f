"""
Provider Models and Data Structures
"""
from enum import Enum
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field


class ProviderType(str, Enum):
    """Supported provider types"""
    OPENAI = "openai"
    DEEPSEEK = "deepseek"
    GROQ = "groq"
    HUGGINGFACE = "huggingface"
    REPLICATE = "replicate"
    ANTHROPIC = "anthropic"
    AI_ENGINE = "ai_engine"  # External AI engine service
    LOCAL = "local"  # Local model adapter
    MOCK = "mock"  # Mock provider for testing


class ModelConfig(BaseModel):
    """Configuration for a specific model"""
    name: str
    provider: ProviderType
    max_tokens: int = 2000
    temperature: float = 0.7
    top_p: float = 0.9
    supports_streaming: bool = False
    cost_per_1k_tokens: float = 0.0
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ProviderConfig(BaseModel):
    """Configuration for a provider"""
    type: ProviderType
    name: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    default_model: str
    models: List[ModelConfig] = Field(default_factory=list)
    priority: int = 10  # Lower number = higher priority
    enabled: bool = True
    timeout_seconds: float = 60.0
    max_retries: int = 2
    metadata: Dict[str, Any] = Field(default_factory=dict)


class InferenceRequest(BaseModel):
    """Standardized inference request"""
    query: str
    context: Optional[str] = None
    tenant_id: Optional[str] = None
    model: Optional[str] = None  # Override default model
    provider: Optional[str] = None  # Override provider selection
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    stream: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)


class InferenceResponse(BaseModel):
    """Standardized inference response"""
    answer: str
    model_used: str
    provider_used: str
    confidence: Optional[float] = None
    tokens_used: Optional[int] = None
    latency_ms: float
    cached: bool = False
    fallback: bool = False
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Enhanced response fields
    summary: Optional[str] = None
    detailed_analysis: Optional[str] = None
    sources: List[str] = Field(default_factory=list)
    legal_citations: List[Dict[str, str]] = Field(default_factory=list)
    assistant_confidence: str = "medium"  # low, medium, high

