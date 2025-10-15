"""
Query schemas for various legal services.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class PropertyOpinionRequest(BaseModel):
    """Schema for property opinion request."""
    property_address: str
    property_type: str = Field(description="residential, commercial, industrial, agricultural")
    survey_number: Optional[str] = None
    plot_number: Optional[str] = None
    city: str
    state: str
    documents: Optional[List[str]] = Field(default=[], description="List of document URLs or IDs")
    specific_concerns: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "property_address": "Plot 123, Sector 45",
                "property_type": "residential",
                "survey_number": "S-123/45",
                "city": "Bangalore",
                "state": "Karnataka",
                "specific_concerns": "Check for encumbrances and title clearance"
            }
        }


class PropertyOpinionResponse(BaseModel):
    """Schema for property opinion response."""
    request_id: str
    status: str
    opinion_summary: Optional[str] = None
    detailed_analysis: Optional[Dict[str, Any]] = None
    recommendations: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ResearchRequest(BaseModel):
    """Schema for legal research request."""
    query: str = Field(min_length=10, description="Legal research query")
    jurisdiction: Optional[str] = Field(default="india", description="Jurisdiction for research")
    practice_area: Optional[str] = Field(default=None, description="e.g., property, criminal, civil")
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    include_cases: bool = Field(default=True)
    include_statutes: bool = Field(default=True)
    max_results: int = Field(default=10, ge=1, le=50)
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "What are the legal requirements for property transfer in India?",
                "jurisdiction": "india",
                "practice_area": "property",
                "include_cases": True,
                "include_statutes": True,
                "max_results": 10
            }
        }


class ResearchResponse(BaseModel):
    """Schema for legal research response."""
    request_id: str
    query: str
    results: List[Dict[str, Any]]
    total_results: int
    summary: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class CaseSearchRequest(BaseModel):
    """Schema for case search request."""
    query: Optional[str] = None
    case_number: Optional[str] = None
    court: Optional[str] = None
    year: Optional[int] = None
    judge: Optional[str] = None
    party_name: Optional[str] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=10, ge=1, le=100)
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "contract breach",
                "court": "Supreme Court of India",
                "year": 2023,
                "page": 1,
                "page_size": 10
            }
        }


class CaseSearchResponse(BaseModel):
    """Schema for case search response."""
    cases: List[Dict[str, Any]]
    total: int
    page: int
    page_size: int
    
    class Config:
        from_attributes = True


class JuniorRequest(BaseModel):
    """Schema for legal junior assistant request."""
    question: str = Field(min_length=5, description="Legal question or task")
    context: Optional[str] = Field(default=None, description="Additional context for the question")
    conversation_id: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "Draft a notice for property encroachment",
                "context": "The encroachment is on a residential property in Delhi"
            }
        }


class JuniorResponse(BaseModel):
    """Schema for legal junior assistant response."""
    answer: str
    sources: Optional[List[str]] = None
    conversation_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

