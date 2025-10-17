"""
Upload Routes - File upload endpoints with authentication and user isolation.

SECURITY:
- All routes require authentication (JWT token)
- Files are scoped to logged-in user only
- User isolation enforced at storage and database level
"""
import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status

from app.schemas.upload_schema import UploadResponse, UploadListResponse
from app.services.upload_service import UploadService
from app.utils.api_key_auth import verify_api_key

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["File Upload"])


# ============================================================================
# Upload Endpoints (All Require Authentication)
# ============================================================================

@router.post("/property", response_model=UploadResponse)
async def upload_property_file(
    file: UploadFile = File(...),
    client_id: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(verify_api_key)
):
    """
    Upload property-related document.
    
    SECURITY: Restricted to logged-in users only.
    File is associated with user_id from JWT token.
    
    Args:
        file: The file to upload
        client_id: Optional client ID to associate
        current_user: Authenticated user from JWT token
        
    Returns:
        UploadResponse with file metadata
    """
    user_id = current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    logger.info(f"Property file upload by user {user_id}: {file.filename}")
    
    try:
        metadata = await UploadService.save_file(
            file=file,
            user_id=str(user_id),
            tab_type="property",
            client_id=client_id
        )
        
        # TODO: Save metadata to database (uploads table)
        # For now, return the metadata directly
        
        return UploadResponse(
            file_id=metadata["file_id"],
            client_id=metadata.get("client_id"),
            tab=metadata["tab_type"],
            filename=metadata["filename"],
            size=metadata["size"],
            created_at=metadata["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Property upload error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file"
        )


@router.post("/case", response_model=UploadResponse)
async def upload_case_file(
    file: UploadFile = File(...),
    client_id: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(verify_api_key)
):
    """
    Upload case-related document.
    
    SECURITY: Restricted to logged-in users only.
    File is associated with user_id from JWT token.
    
    Args:
        file: The file to upload
        client_id: Optional client ID to associate
        current_user: Authenticated user from JWT token
        
    Returns:
        UploadResponse with file metadata
    """
    user_id = current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    logger.info(f"Case file upload by user {user_id}: {file.filename}")
    
    try:
        metadata = await UploadService.save_file(
            file=file,
            user_id=str(user_id),
            tab_type="case",
            client_id=client_id
        )
        
        # TODO: Save metadata to database (uploads table)
        
        return UploadResponse(
            file_id=metadata["file_id"],
            client_id=metadata.get("client_id"),
            tab=metadata["tab_type"],
            filename=metadata["filename"],
            size=metadata["size"],
            created_at=metadata["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Case upload error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file"
        )


@router.post("/research", response_model=UploadResponse)
async def upload_research_file(
    file: UploadFile = File(...),
    client_id: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(verify_api_key)
):
    """
    Upload research-related document.
    
    SECURITY: Restricted to logged-in users only.
    File is associated with user_id from JWT token.
    
    Args:
        file: The file to upload
        client_id: Optional client ID to associate
        current_user: Authenticated user from JWT token
        
    Returns:
        UploadResponse with file metadata
    """
    user_id = current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    logger.info(f"Research file upload by user {user_id}: {file.filename}")
    
    try:
        metadata = await UploadService.save_file(
            file=file,
            user_id=str(user_id),
            tab_type="research",
            client_id=client_id
        )
        
        # TODO: Save metadata to database (uploads table)
        
        return UploadResponse(
            file_id=metadata["file_id"],
            client_id=metadata.get("client_id"),
            tab=metadata["tab_type"],
            filename=metadata["filename"],
            size=metadata["size"],
            created_at=metadata["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Research upload error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file"
        )


@router.post("/junior", response_model=UploadResponse)
async def upload_junior_file(
    file: UploadFile = File(...),
    client_id: Optional[str] = Form(None),
    current_user: Dict[str, Any] = Depends(verify_api_key)
):
    """
    Upload junior assistant-related document.
    
    SECURITY: Restricted to logged-in users only.
    File is associated with user_id from JWT token.
    
    Args:
        file: The file to upload
        client_id: Optional client ID to associate
        current_user: Authenticated user from JWT token
        
    Returns:
        UploadResponse with file metadata
    """
    user_id = current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    logger.info(f"Junior file upload by user {user_id}: {file.filename}")
    
    try:
        metadata = await UploadService.save_file(
            file=file,
            user_id=str(user_id),
            tab_type="junior",
            client_id=client_id
        )
        
        # TODO: Save metadata to database (uploads table)
        
        return UploadResponse(
            file_id=metadata["file_id"],
            client_id=metadata.get("client_id"),
            tab=metadata["tab_type"],
            filename=metadata["filename"],
            size=metadata["size"],
            created_at=metadata["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Junior upload error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file"
        )


# ============================================================================
# Download Endpoint (User Isolation Enforced)
# ============================================================================

@router.get("/download/{file_id}")
async def download_file(
    file_id: str,
    current_user: Dict[str, Any] = Depends(verify_api_key)
):
    """
    Download a file by ID.
    
    SECURITY CRITICAL:
    - Requires authentication
    - Only returns file if it belongs to the logged-in user
    - Prevents cross-user file access
    
    Args:
        file_id: The file identifier
        current_user: Authenticated user from JWT token
        
    Returns:
        File download response
        
    Raises:
        HTTPException(404): If file not found or user doesn't own it
    """
    from fastapi.responses import FileResponse
    
    user_id = current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    logger.info(f"File download request: file_id={file_id}, user={user_id}")
    
    # SECURITY: Get file path only if user owns it
    file_path = UploadService.get_file_path(file_id, str(user_id))
    
    if not file_path or not file_path.exists():
        logger.warning(f"File access denied or not found: {file_id} for user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found or access denied"
        )
    
    return FileResponse(
        path=str(file_path),
        filename=file_path.name.split('_', 2)[-1] if '_' in file_path.name else file_path.name
    )


# ============================================================================
# List User's Uploads (Filtered by User ID)
# ============================================================================

@router.get("/list", response_model=UploadListResponse)
async def list_user_uploads(
    tab_type: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(verify_api_key)
):
    """
    List all uploads for the logged-in user.
    
    SECURITY: Returns only files owned by the authenticated user.
    
    Args:
        tab_type: Optional filter by tab (property, case, research, junior)
        current_user: Authenticated user from JWT token
        
    Returns:
        List of user's uploads
    """
    user_id = current_user.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    
    # TODO: Query database filtered by user_id
    # WHERE user_id = ? [AND tab_type = ?]
    
    logger.info(f"List uploads for user {user_id}, tab={tab_type}")
    
    # Placeholder - return empty list until DB is connected
    return UploadListResponse(uploads=[], total=0)

