import json
from dapr.clients import DaprClient
from datetime import datetime
from uuid import uuid4
from ..models.todo import Todo

DAPR_PUBSUB_NAME = "pubsub"
TOPIC_NAME = "task-events"

def publish_task_event(todo: Todo, event_type: str):
    """
    Publish a task event to the Dapr pubsub topic.
    """
    try:
        # Create payload from Todo object using model_dump for Pydantic v2/SQLModel
        # mode='json' converts UUIDs and datetimes to strings
        payload = todo.model_dump(mode='json')
        
        event = {
            "event_id": str(uuid4()),
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "payload": payload
        }
        
        # Use a context manager to ensure the client is closed properly
        with DaprClient() as d:
            d.publish_event(
                pubsub_name=DAPR_PUBSUB_NAME,
                topic_name=TOPIC_NAME,
                data=json.dumps(event),
                data_content_type='application/json'
            )
            print(f"Published event {event_type} for task {todo.id}")
            
    except Exception as e:
        # Log error but don't fail the request (fire and forget pattern for now)
        print(f"Failed to publish event: {e}")
