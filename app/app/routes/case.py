"""
Case Routes
Handles endpoints for case search and retrieval.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, Any, Optional

from app.schemas.query_schema import CaseSearchRequest, CaseSearchResponse
from app.controllers.case_controller import CaseController
from app.core.security import get_current_user
from app.core.logger import logger

router = APIRouter(prefix="/cases", tags=["Case Search"])


@router.post("/search", response_model=CaseSearchResponse)
async def search_cases(
    request: CaseSearchRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Search for legal cases based on criteria.
    
    Args:
        request: Case search request data
        current_user: Current authenticated user
        
    Returns:
        CaseSearchResponse with search results
    """
    user_id = current_user.get("user_id", 1)
    logger.info(f"Case search request from user {user_id}")
    
    try:
        result = await CaseController.search_cases(request, user_id)
        return result
    except Exception as e:
        logger.error(f"Error searching cases: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search cases"
        )


@router.get("/search", response_model=CaseSearchResponse)
async def search_cases_get(
    query: Optional[str] = None,
    case_number: Optional[str] = None,
    court: Optional[str] = None,
    year: Optional[int] = None,
    judge: Optional[str] = None,
    party_name: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Search for legal cases using GET method with query parameters.
    
    Args:
        query: Search query
        case_number: Case number
        court: Court name
        year: Year of the case
        judge: Judge name
        party_name: Party name
        page: Page number
        page_size: Page size
        current_user: Current authenticated user
        
    Returns:
        CaseSearchResponse with search results
    """
    user_id = current_user.get("user_id", 1)
    logger.info(f"Case search GET request from user {user_id}")
    
    # Build search request
    request = CaseSearchRequest(
        query=query,
        case_number=case_number,
        court=court,
        year=year,
        judge=judge,
        party_name=party_name,
        page=page,
        page_size=page_size
    )
    
    try:
        result = await CaseController.search_cases(request, user_id)
        return result
    except Exception as e:
        logger.error(f"Error searching cases: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search cases"
        )


@router.get("/{case_id}", response_model=Dict[str, Any])
async def get_case_details(
    case_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get detailed information about a specific case.
    
    Args:
        case_id: The unique case identifier
        current_user: Current authenticated user
        
    Returns:
        Dictionary containing case details
    """
    user_id = current_user.get("user_id", 1)
    logger.info(f"Fetching case details for case {case_id}")
    
    try:
        result = await CaseController.get_case_details(case_id, user_id)
        return result
    except Exception as e:
        logger.error(f"Error fetching case details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch case details"
        )

