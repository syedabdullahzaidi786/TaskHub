from datetime import datetime, timedelta
from typing import Any, Dict
from fastapi import APIRouter, Body, Depends, status
from sqlmodel import Session
from uuid import uuid4
from ..database import get_session
from ..models.todo import Todo
from ..utils.events import publish_task_event

router = APIRouter()

@router.get("/dapr/subscribe")
async def subscribe():
    """
    Dapr programmatic subscription endpoint
    """
    return [
        {
            "pubsubname": "pubsub",
            "topic": "task-events",
            "route": "/events/task-events"
        }
    ]

@router.post("/events/task-events")
async def handle_task_event(
    event: Dict[str, Any] = Body(...),
    session: Session = Depends(get_session)
):
    """
    Handle incoming task events from Dapr
    """
    print(f"Received event: {event}")
    
    # Dapr cloud events wrap the data in "data" field
    data = event.get("data")
    if not data:
        # Try raw format if strict cloud event not used or simple format
        data = event
        
    # Check if data is string (json) and parse it if needed
    # Dapr usually sends dict if content-type is json
    
    event_type = data.get("event_type")
    payload = data.get("payload")
    
    if event_type == "TaskCompleted" and payload:
        await handle_task_completed(payload, session)
        
    return {"status": "success"}

async def handle_task_completed(payload: Dict[str, Any], session: Session):
    """
    Logic for recurring tasks
    """
    is_recurring = payload.get("is_recurring")
    if not is_recurring:
        return

    recurrence_interval = payload.get("recurrence_interval")
    if not recurrence_interval:
        return
        
    # Calculate next due date
    # Payload due_date might be string
    current_due_date_str = payload.get("due_date") 
    if not current_due_date_str:
        current_due_date = datetime.utcnow()
    else:
        try:
            current_due_date = datetime.fromisoformat(current_due_date_str)
        except ValueError:
            current_due_date = datetime.utcnow()

    next_date = calculate_next_date(current_due_date, recurrence_interval)
    
    # Create new task
    new_todo = Todo(
        id=uuid4(),
        user_id=payload.get("user_id"), # UUID from string
        title=payload.get("title"),
        description=payload.get("description"),
        completed=False,
        priority=payload.get("priority"),
        category=payload.get("category"),
        due_date=next_date,
        is_recurring=True, # Next one is also recurring
        recurrence_interval=recurrence_interval,
        tags=payload.get("tags", [])
    )
    
    session.add(new_todo)
    session.commit()
    session.refresh(new_todo)
    
    print(f"Created recurring task: {new_todo.id} for date {next_date}")
    
    # Publish creation event
    publish_task_event(new_todo, "TaskCreated")

def calculate_next_date(current: datetime, interval: str) -> datetime:
    """
    Simple recurrence calculation
    """
    interval = interval.lower()
    if interval == "daily":
        return current + timedelta(days=1)
    elif interval == "weekly":
        return current + timedelta(weeks=1)
    elif interval == "monthly":
        # Approximate
        return current + timedelta(days=30)
    elif interval == "yearly":
        return current + timedelta(days=365)
    return current + timedelta(days=1) # Default
