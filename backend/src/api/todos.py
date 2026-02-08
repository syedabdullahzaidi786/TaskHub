"""
Todo API endpoints
Handles CRUD operations for todo items
"""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, col
from uuid import UUID
from ..database import get_session
from ..models.todo import Todo, Priority
from ..schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from ..auth.middleware import require_auth
from ..utils.events import publish_task_event

router = APIRouter()

@router.get("", response_model=List[TodoResponse])
async def list_todos(
    priority: Optional[Priority] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query(None, enum=["due_date", "priority", "created_at"]),
    order: Optional[str] = Query("desc", enum=["asc", "desc"]),
    session: Session = Depends(get_session),
    user_id: UUID = Depends(require_auth)
):
    """
    List all todos for the current user with filtering and sorting
    """
    query = select(Todo).where(Todo.user_id == user_id)
    
    # Filtering
    if priority:
        query = query.where(Todo.priority == priority)
    
    if search:
        # Case-insensitive search on title or description
        search_term = f"%{search}%"
        query = query.where(
            (col(Todo.title).ilike(search_term)) | 
            (col(Todo.description).ilike(search_term))
        )
    
    # Sorting
    if sort_by:
        sort_column = getattr(Todo, sort_by)
        if order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
    else:
        # Default sort
        query = query.order_by(Todo.created_at.desc())
        
    todos = session.exec(query).all()
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
    
    # Publish event
    publish_task_event(todo, "TaskCreated")
    
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
    
    # Check if completion status is changing
    was_completed = todo.completed
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    todo.sqlmodel_update(update_data)
    todo.updated_at = datetime.utcnow()
    
    session.add(todo)
    session.commit()
    session.refresh(todo)
    
    # Publish events
    publish_task_event(todo, "TaskUpdated")
    
    if not was_completed and todo.completed:
        publish_task_event(todo, "TaskCompleted")
        
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
    
    # Publish event before delete (to preserve data)
    publish_task_event(todo, "TaskDeleted")
    
    session.delete(todo)
    session.commit()
    return None
