"""
Todo API endpoints
Handles CRUD operations for todo items
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from uuid import UUID
from ..database import get_session
from ..models.todo import Todo
from ..schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from ..auth.middleware import require_auth

router = APIRouter()

@router.get("", response_model=List[TodoResponse])
async def list_todos(
    session: Session = Depends(get_session),
    user_id: UUID = Depends(require_auth)
):
    """List all todos for the current user"""
    todos = session.exec(
        select(Todo).where(Todo.user_id == user_id).order_by(Todo.created_at.desc())
    ).all()
    return todos

@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(
    data: TodoCreate,
    session: Session = Depends(get_session),
    user_id: UUID = Depends(require_auth)
):
    """Create a new todo for the current user"""
    todo = Todo(
        **data.model_dump(),
        user_id=user_id
    )
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: UUID,
    session: Session = Depends(get_session),
    user_id: UUID = Depends(require_auth)
):
    """Get a specific todo item"""
    todo = session.get(Todo, todo_id)
    if not todo or todo.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return todo

@router.patch("/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: UUID,
    data: TodoUpdate,
    session: Session = Depends(get_session),
    user_id: UUID = Depends(require_auth)
):
    """Update a specific todo item"""
    todo = session.get(Todo, todo_id)
    if not todo or todo.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    todo.sqlmodel_update(update_data)
    todo.updated_at = datetime.utcnow()
    
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: UUID,
    session: Session = Depends(get_session),
    user_id: UUID = Depends(require_auth)
):
    """Delete a specific todo item"""
    todo = session.get(Todo, todo_id)
    if not todo or todo.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    session.delete(todo)
    session.commit()
    return None
