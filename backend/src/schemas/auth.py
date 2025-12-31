"""
Authentication schemas
Request and response models for auth endpoints
"""
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    """Request body for user signup"""

    email: EmailStr = Field(
        ...,
        description="User email address",
        examples=["user@example.com"]
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="User password (8-128 characters)"
    )


class SigninRequest(BaseModel):
    """Request body for user signin"""

    email: EmailStr = Field(
        ...,
        description="User email address",
        examples=["user@example.com"]
    )
    password: str = Field(
        ...,
        description="User password"
    )


class UserResponse(BaseModel):
    """Response model for user data (excludes password_hash)"""

    id: str = Field(..., description="User UUID")
    email: str = Field(..., description="User email address")
    created_at: datetime = Field(..., description="Account creation timestamp")

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Response model for successful authentication"""

    user: UserResponse
    message: str = Field(..., description="Success message")


class MessageResponse(BaseModel):
    """Generic message response"""

    message: str
