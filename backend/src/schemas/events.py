from pydantic import BaseModel
from typing import Any, Dict, Optional
from datetime import datetime
from uuid import UUID

class BaseEvent(BaseModel):
    event_id: str
    event_type: str
    timestamp: datetime
    payload: Dict[str, Any]

class TaskPayload(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    is_recurring: bool
    # Add other fields as needed for consumers
