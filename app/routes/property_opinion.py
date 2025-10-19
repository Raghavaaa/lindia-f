"""
Property Opinion Routes - Stub handler for property opinion request endpoints.
This module is not yet implemented. Returns 501 Not Implemented.
"""
import logging
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/property-opinion", tags=["Property Opinion"])


@router.post("/")
@router.get("/")
@router.get("/{opinion_id}")
async def not_implemented_handler():
    """
    Placeholder handler for property opinion endpoints.
    Returns HTTP 501 Not Implemented until business logic is added.
    """
    logger.warning("Property opinion endpoint called but not implemented")
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={
            "status": "not_implemented",
            "message": "Property opinion functionality is not yet implemented",
            "endpoint": "property-opinion",
            "note": "This is a placeholder route. Implementation pending."
        }
    )
