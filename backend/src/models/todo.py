"""
Todo model
Represents todo items owned by users
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from enum import Enum


class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Todo(SQLModel, table=True):
    """
    Todo entity with user ownership

    Fields:
        id: Unique todo identifier (UUID)
        user_id: Owner's user ID (foreign key to users.id)
        title: Todo title (max 200 chars)
        description: Optional description (max 2000 chars)
        completed: Completion status (default false)
        priority: Task priority (low, medium, high)
        category: Task category (e.g., Work, Personal)
        due_date: Optional due date
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    __tablename__ = "todos"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        nullable=False
    )
    user_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        ondelete="CASCADE"
    )
    title: str = Field(
        max_length=200,
        nullable=False
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        nullable=True
    )
    completed: bool = Field(
        default=False,
        nullable=False
    )
    priority: Priority = Field(
        default=Priority.MEDIUM,
        nullable=False
    )
    category: str = Field(
        default="General",
        max_length=50,
        nullable=False
    )
    due_date: Optional[datetime] = Field(
        default=None,
        nullable=True
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
