"""
Case Routes - Stub handler for case search and retrieval endpoints.
This module is not yet implemented. Returns 501 Not Implemented.
"""
import logging
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cases", tags=["Case Management"])


@router.post("/")
@router.get("/")
@router.get("/{case_id}")
async def not_implemented_handler():
    """
    Placeholder handler for case management endpoints.
    Returns HTTP 501 Not Implemented until business logic is added.
    """
    logger.warning("Case management endpoint called but not implemented")
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={
            "status": "not_implemented",
            "message": "Case management functionality is not yet implemented",
            "endpoint": "cases",
            "note": "This is a placeholder route. Implementation pending."
        }
    )
