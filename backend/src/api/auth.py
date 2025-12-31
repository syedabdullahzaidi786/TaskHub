"""
Authentication API endpoints
Handles signup, signin, signout, and session management
"""
from fastapi import APIRouter, Depends, Response, Request, HTTPException, status
from sqlmodel import Session, select
from uuid import UUID
from ..database import get_session
from ..models.user import User
from ..schemas.auth import (
    SignupRequest,
    SigninRequest,
    UserResponse,
    AuthResponse,
    MessageResponse
)
from ..auth.service import hash_password, verify_password, create_access_token
from ..auth.middleware import require_auth
from ..utils.errors import ConflictError, UnauthorizedError
from ..utils.validation import validate_email, validate_password

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: SignupRequest,
    response: Response,
    session: Session = Depends(get_session)
):
    """
    Create new user account

    - Validates email and password
    - Checks for duplicate email
    - Hashes password
    - Creates user in database
    - Returns session cookie and user data
    """
    # Validate email
    is_valid, error_msg = validate_email(request.email)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=error_msg
        )

    # Validate password
    is_valid, error_msg = validate_password(request.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=error_msg
        )

    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash password
    password_hash = hash_password(request.password)

    # Create user
    user = User(
        email=request.email,
        password_hash=password_hash
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Create session token
    token = create_access_token({"user_id": str(user.id)})

    # Set HTTP-only cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,     # Required for cross-domain (None)
        samesite="none", # Required for cross-domain
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return AuthResponse(
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            created_at=user.created_at
        ),
        message="Account created successfully"
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(
    request: SigninRequest,
    response: Response,
    session: Session = Depends(get_session)
):
    """
    Sign in with email and password

    - Validates credentials
    - Returns session cookie and user data
    - Returns 401 if credentials are invalid
    """
    # Find user by email
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    # Verify password
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create session token
    token = create_access_token({"user_id": str(user.id)})

    # Set HTTP-only cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,     # Required for cross-domain (None)
        samesite="none", # Required for cross-domain
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return AuthResponse(
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            created_at=user.created_at
        ),
        message="Signed in successfully"
    )


@router.post("/signout", response_model=MessageResponse)
async def signout(
    response: Response,
    user_id: UUID = Depends(require_auth)
):
    """
    Sign out current user

    - Requires authentication
    - Clears session cookie
    """
    # Clear session cookie
    response.delete_cookie(
        key="session_token",
        httponly=True,
        secure=True,
        samesite="none"
    )

    return MessageResponse(message="Signed out successfully")


@router.get("/session", response_model=UserResponse)
async def get_session(
    request: Request,
    user_id: UUID = Depends(require_auth),
    session: Session = Depends(get_session)
):
    """
    Get current user session

    - Requires authentication
    - Returns current user data
    - Returns 401 if not authenticated
    """
    # Get user from database
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return UserResponse(
        id=str(user.id),
        email=user.email,
        created_at=user.created_at
    )
