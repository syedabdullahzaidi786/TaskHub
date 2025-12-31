"""
User model
Represents authenticated users in the system
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """
    User entity for authentication

    Fields:
        id: Unique user identifier (UUID)
        email: User email address (unique)
        password_hash: Hashed password (never expose in API responses)
        created_at: Account creation timestamp
    """

    __tablename__ = "users"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        nullable=False
    )
    email: str = Field(
        max_length=255,
        unique=True,
        nullable=False,
        index=True
    )
    password_hash: str = Field(
        max_length=255,
        nullable=False
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
