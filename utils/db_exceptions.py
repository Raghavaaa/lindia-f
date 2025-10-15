"""Custom database exceptions for clean error handling."""


class NotFound(Exception):
    """Raised when a requested resource is not found."""
    pass


class Conflict(Exception):
    """Raised when an operation conflicts with existing data."""
    pass


class IntegrityErrorWrapper(Exception):
    """Wrapper for SQLAlchemy IntegrityError with cleaner messaging."""
    pass

