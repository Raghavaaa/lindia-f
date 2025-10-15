"""
Research Routes
Handles endpoints for legal research requests.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List

from app.schemas.query_schema import ResearchRequest, ResearchResponse
from app.controllers.research_controller import ResearchController
from app.core.security import get_current_user
from app.core.logger import logger

router = APIRouter(prefix="/research", tags=["Legal Research"])


@router.post("/", response_model=ResearchResponse)
async def perform_research(
    request: ResearchRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Perform legal research based on the query.
    
    Args:
        request: Research request data
        current_user: Current authenticated user
        
    Returns:
        ResearchResponse with research results
    """
    user_id = current_user.get("user_id", 1)
    logger.info(f"Research request from user {user_id}")
    
    try:
        result = await ResearchController.perform_research(request, user_id)
        return result
    except Exception as e:
        logger.error(f"Error performing research: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to perform legal research"
        )


@router.get("/history", response_model=List[Dict[str, Any]])
async def get_research_history(
    limit: int = 10,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get research history for the current user.
    
    Args:
        limit: Maximum number of records to return
        current_user: Current authenticated user
        
    Returns:
        List of research history records
    """
    user_id = current_user.get("user_id", 1)
    logger.info(f"Fetching research history for user {user_id}")
    
    try:
        history = await ResearchController.get_research_history(user_id, limit)
        return history
    except Exception as e:
        logger.error(f"Error fetching research history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch research history"
        )

