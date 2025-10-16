"""
Response schemas for LegalIndia.ai backend.
Pydantic models for API response validation.
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class InferenceResponse(BaseModel):
    """
    Response model for AI inference results.
    Used by ai_service to parse AI engine responses.
    """
    answer: str = Field(..., description="The AI-generated answer or response text")
    sources: List[str] = Field(default_factory=list, description="List of source references or citations")
    confidence: Optional[float] = Field(None, description="Confidence score (0.0 to 1.0) if provided by AI")
    
    class Config:
        json_schema_extra = {
            "example": {
                "answer": "Based on the Indian Contract Act, 1872...",
                "sources": ["Indian Contract Act 1872 Section 10", "Case: XYZ vs ABC 2020"],
                "confidence": 0.95
            }
        }
