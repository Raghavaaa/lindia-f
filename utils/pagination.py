"""Pagination helper for SQLAlchemy queries."""

from typing import TypedDict


class PaginationMeta(TypedDict):
    page: int
    per_page: int
    offset: int
    limit: int


def apply_pagination(query, page: int = 1, per_page: int = 10):
    """
    Apply pagination to a SQLAlchemy query.
    
    Args:
        query: SQLAlchemy query object
        page: Page number (1-indexed)
        per_page: Number of items per page
        
    Returns:
        Tuple of (paginated_query, metadata_dict)
    """
    if page < 1:
        page = 1
    if per_page < 1:
        per_page = 10
    
    offset = (page - 1) * per_page
    limit = per_page
    
    paginated_query = query.limit(limit).offset(offset)
    
    metadata: PaginationMeta = {
        "page": page,
        "per_page": per_page,
        "offset": offset,
        "limit": limit
    }
    
    return paginated_query, metadata

