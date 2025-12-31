"""
Custom exception classes
Defines application-specific errors with HTTP status codes
"""
from typing import Any, Dict, Optional


class AppError(Exception):
    """Base application error"""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class UnauthorizedError(AppError):
    """Raised when user is not authenticated or lacks permissions"""

    def __init__(self, message: str = "Unauthorized", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=401, details=details)


class ValidationError(AppError):
    """Raised when request validation fails"""

    def __init__(self, message: str = "Validation failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=422, details=details)


class NotFoundError(AppError):
    """Raised when requested resource is not found"""

    def __init__(self, message: str = "Resource not found", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=404, details=details)


class ConflictError(AppError):
    """Raised when resource already exists (e.g., duplicate email)"""

    def __init__(self, message: str = "Resource conflict", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=409, details=details)


class ForbiddenError(AppError):
    """Raised when user is authenticated but not allowed to access resource"""

    def __init__(self, message: str = "Forbidden", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=403, details=details)
