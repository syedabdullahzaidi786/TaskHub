"""
Todo schemas
Defines request and response models for todo operations
"""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field
from ..models.todo import Priority

class TodoBase(BaseModel):
    """Base todo schema with shared fields"""
    title: str = Field(..., max_length=200, description="Todo title")
    description: Optional[str] = Field(None, max_length=2000, description="Optional description")
    completed: bool = Field(False, description="Completion status")
    priority: Priority = Field(Priority.MEDIUM, description="Task priority")
    category: str = Field("General", max_length=50, description="Task category")
    due_date: Optional[datetime] = Field(None, description="Optional due date")
    reminder_at: Optional[datetime] = Field(None, description="Optional reminder date")
    is_recurring: bool = Field(False, description="Is recurring task")
    recurrence_interval: Optional[str] = Field(None, description="Recurrence interval")
    tags: list[str] = Field(default_factory=list, description="Task tags")

class TodoCreate(TodoBase):
    """Schema for creating a new todo"""
    pass

class TodoUpdate(BaseModel):
    """Schema for updating an existing todo"""
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    completed: Optional[bool] = None
    priority: Optional[Priority] = None
    category: Optional[str] = Field(None, max_length=50)
    due_date: Optional[datetime] = None
    reminder_at: Optional[datetime] = None
    is_recurring: Optional[bool] = None
    recurrence_interval: Optional[str] = None
    tags: Optional[list[str]] = None

class TodoResponse(TodoBase):
    """Schema for todo response data"""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
