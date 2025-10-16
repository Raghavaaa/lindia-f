"""
Request schemas for LegalIndia.ai backend.
Pydantic models for API request validation.
"""
from typing import Optional
from pydantic import BaseModel, Field


class QueryInput(BaseModel):
    """
    Schema for research query requests.
    Used by research controller to validate incoming queries.
    """
    query_text: str = Field(..., description="The research query or question text")
    context: Optional[str] = Field(None, description="Optional additional context for the query")
    client_id: Optional[int] = Field(None, description="Optional client ID for query association")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query_text": "What are the requirements for property transfer in India?",
                "context": "Client is purchasing residential property in Bangalore",
                "client_id": 123
            }
        }
