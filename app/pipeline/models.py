"""
Pipeline Models
"""
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field


class PipelineRequest(BaseModel):
    """Request for pipeline processing"""
    query: str
    context: Optional[str] = None
    tenant_id: Optional[str] = None
    model: Optional[str] = None
    provider: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Pipeline control
    skip_sanitization: bool = False
    skip_retrieval: bool = False
    skip_citation_extraction: bool = False
    desired_response_format: str = "structured"  # structured, simple, detailed


class PipelineResponse(BaseModel):
    """Response from pipeline processing"""
    # Core response
    answer: str
    model_used: str
    provider_used: str
    
    # Enhanced fields
    summary: Optional[str] = None
    detailed_analysis: Optional[str] = None
    executive_summary: Optional[str] = None
    
    # Citations and sources
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    legal_citations: List[Dict[str, str]] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list)
    
    # Confidence and quality
    confidence: Optional[float] = None
    assistant_confidence: str = "medium"  # low, medium, high
    quality_score: Optional[float] = None
    
    # Metadata
    tokens_used: Optional[int] = None
    latency_ms: float = 0.0
    cached: bool = False
    fallback: bool = False
    
    # Pipeline metadata
    pipeline_stages: List[str] = Field(default_factory=list)
    sanitization_applied: bool = False
    retrieval_used: bool = False
    validation_passed: bool = True
    
    metadata: Dict[str, Any] = Field(default_factory=dict)


class PipelineConfig(BaseModel):
    """Configuration for pipeline stages"""
    enable_sanitization: bool = True
    enable_retrieval: bool = False  # Optional RAG integration
    enable_citation_extraction: bool = True
    enable_response_structuring: bool = True
    enable_output_validation: bool = True
    
    # Limits
    max_query_length: int = 10000
    max_response_length: int = 50000
    
    # Per-tenant configs
    tenant_configs: Dict[str, Dict[str, Any]] = Field(default_factory=dict)

