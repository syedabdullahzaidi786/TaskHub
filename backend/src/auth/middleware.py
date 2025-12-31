"""
Authentication middleware
Validates session tokens and extracts user_id from requests
"""
from typing import Optional
from uuid import UUID
from fastapi import Request, HTTPException, status
from .service import verify_token


def get_current_user_id(request: Request) -> Optional[UUID]:
    """
    Extract and validate user_id from session token

    Args:
        request: FastAPI request object

    Returns:
        User ID if authenticated, None otherwise
    """
    # Get token from cookie
    token = request.cookies.get("session_token")

    if not token:
        return None

    # Verify and decode token
    payload = verify_token(token)

    if not payload:
        return None

    # Extract user_id from payload
    user_id_str = payload.get("user_id")

    if not user_id_str:
        return None

    try:
        return UUID(user_id_str)
    except (ValueError, AttributeError):
        return None


def require_auth(request: Request) -> UUID:
    """
    Dependency that requires authentication

    Usage in FastAPI endpoints:
        @app.get("/protected")
        def protected_route(user_id: UUID = Depends(require_auth)):
            ...

    Args:
        request: FastAPI request object

    Returns:
        Authenticated user ID

    Raises:
        HTTPException: 401 if not authenticated
    """
    user_id = get_current_user_id(request)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    return user_id
