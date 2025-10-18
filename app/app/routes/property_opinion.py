"""
Property Opinion Routes
Handles endpoints for property legal opinion requests.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any

from app.schemas.query_schema import PropertyOpinionRequest, PropertyOpinionResponse
from app.controllers.property_opinion_controller import PropertyOpinionController
from app.core.security import get_current_user
from app.core.logger import logger

router = APIRouter(prefix="/property-opinion", tags=["Property Opinion"])


@router.post("/", response_model=PropertyOpinionResponse, status_code=status.HTTP_201_CREATED)
async def create_property_opinion(
    request: PropertyOpinionRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new property opinion request.
    
    Args:
        request: Property opinion request data
        current_user: Current authenticated user
        
    Returns:
        PropertyOpinionResponse with request details
    """
    user_id = current_user.get("user_id", 1)
    logger.info(f"Property opinion request from user {user_id}")
    
    try:
        result = await PropertyOpinionController.create_opinion_request(request, user_id)
        return result
    except Exception as e:
        logger.error(f"Error creating property opinion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create property opinion request"
        )


@router.get("/{request_id}", response_model=PropertyOpinionResponse)
async def get_property_opinion_status(
    request_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get the status of a property opinion request.
    
    Args:
        request_id: The unique request ID
        current_user: Current authenticated user
        
    Returns:
        PropertyOpinionResponse with current status
    """
    user_id = current_user.get("user_id", 1)
    logger.info(f"Fetching property opinion status for request {request_id}")
    
    try:
        result = await PropertyOpinionController.get_opinion_status(request_id, user_id)
        return result
    except Exception as e:
        logger.error(f"Error fetching property opinion status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch property opinion status"
        )

