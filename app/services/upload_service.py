"""
Upload Service - File upload handling with user isolation.
Handles file storage and metadata tracking with strict user-based access control.

SECURITY: All file access is filtered by user_id to prevent cross-user data leaks.
"""
import os
import uuid
import logging
from pathlib import Path
from typing import Optional, List
from datetime import datetime

from fastapi import UploadFile, HTTPException

logger = logging.getLogger(__name__)

# Configuration
STORAGE_BASE_PATH = os.getenv("STORAGE_PATH", "./storage")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))  # 10MB default
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'}


class UploadService:
    """Service for handling file uploads with user isolation."""
    
    @staticmethod
    def validate_file(file: UploadFile) -> None:
        """
        Validate uploaded file.
        
        Args:
            file: The uploaded file
            
        Raises:
            HTTPException: If file is invalid
        """
        # Check filename
        if not file.filename:
            raise HTTPException(status_code=400, detail="Filename is required")
        
        # Check extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file_ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
    
    @staticmethod
    async def save_file(
        file: UploadFile,
        user_id: str,
        tab_type: str,
        client_id: Optional[str] = None
    ) -> dict:
        """
        Save uploaded file and return metadata.
        
        SECURITY: Files are saved in user-specific directories to prevent access conflicts.
        
        Args:
            file: The uploaded file
            user_id: ID of the user uploading (for isolation)
            tab_type: Upload context (property, case, research, junior)
            client_id: Optional associated client ID
            
        Returns:
            Dictionary with file metadata
            
        Raises:
            HTTPException: On validation or storage errors
        """
        # Validate file
        UploadService.validate_file(file)
        
        # Generate unique file_id
        file_id = f"upload_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:8]}"
        
        # Create user-specific storage directory (security: user isolation)
        user_storage_dir = Path(STORAGE_BASE_PATH) / user_id / tab_type
        user_storage_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate safe filename
        safe_filename = f"{file_id}_{Path(file.filename).name}"
        file_path = user_storage_dir / safe_filename
        
        # Read and validate file size
        file_content = await file.read()
        file_size = len(file_content)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File size {file_size} exceeds maximum {MAX_FILE_SIZE} bytes"
            )
        
        # Save file to storage
        try:
            with open(file_path, 'wb') as f:
                f.write(file_content)
        except Exception as e:
            logger.error(f"Failed to save file: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to save file")
        
        # Return metadata for database storage
        return {
            "file_id": file_id,
            "filename": file.filename,
            "size": file_size,
            "content_type": file.content_type,
            "storage_path": str(file_path),
            "tab_type": tab_type,
            "client_id": client_id,
            "user_id": user_id,
            "created_at": datetime.utcnow()
        }
    
    @staticmethod
    def get_file_path(file_id: str, user_id: str) -> Optional[Path]:
        """
        Get file path with user_id verification for security.
        
        SECURITY: Only returns path if file belongs to the specified user.
        
        Args:
            file_id: The file identifier
            user_id: The requesting user's ID (for security check)
            
        Returns:
            Path to file if user owns it, None otherwise
        """
        # TODO: Query database to verify user_id matches file owner
        # For now, search in user's directory only
        user_storage_dir = Path(STORAGE_BASE_PATH) / user_id
        
        for file_path in user_storage_dir.rglob(f"{file_id}_*"):
            if file_path.is_file():
                return file_path
        
        return None

