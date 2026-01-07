import yaml
import os
from datetime import datetime
from uuid import UUID
from typing import List, Optional, Any, Dict
from sqlmodel import Session, select
from ..models.todo import Todo
from ..schemas.todo import TodoCreate, TodoUpdate
from ..config import settings

# Load tools spec
TOOLS_YAML_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "specs", "tools.yaml")

def load_tools_spec():
    with open(TOOLS_YAML_PATH, "r") as f:
        return yaml.safe_load(f)

# Tool Implementations
def add_task(session: Session, user_id: str, title: str, description: str = "") -> Dict[str, Any]:
    """Create a new task"""
    try:
        user_uuid = UUID(user_id)
        todo = Todo(title=title, description=description, user_id=user_uuid)
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return {"task_id": str(todo.id), "status": "created", "title": todo.title}
    except Exception as e:
        return {"error": str(e)}

def list_tasks(session: Session, user_id: str, status: str = "all") -> List[Dict[str, Any]]:
    """List tasks with optional filtering"""
    try:
        user_uuid = UUID(user_id)
        query = select(Todo).where(Todo.user_id == user_uuid).order_by(Todo.created_at.desc())
        
        todos = session.exec(query).all()
        
        filtered = []
        for t in todos:
            if status == "pending" and t.completed:
                continue
            if status == "completed" and not t.completed:
                continue
            filtered.append({
                "id": str(t.id),
                "title": t.title,
                "completed": t.completed,
                "description": t.description
            })
        return filtered
    except Exception as e:
        return [{"error": str(e)}]

def complete_task(session: Session, user_id: str, task_id: str) -> Dict[str, Any]:
    """Mark a task as complete"""
    try:
        user_uuid = UUID(user_id)
        task_uuid = UUID(task_id) if isinstance(task_id, str) else task_id
        
        todo = session.get(Todo, task_uuid)
        if not todo or todo.user_id != user_uuid:
            return {"error": "Task not found"}
        
        todo.completed = True
        todo.updated_at = datetime.utcnow()
        session.add(todo)
        session.commit()
        return {"task_id": str(todo.id), "status": "completed", "title": todo.title}
    except Exception as e:
        return {"error": str(e)}

def delete_task(session: Session, user_id: str, task_id: str) -> Dict[str, Any]:
    """Delete a task"""
    try:
        user_uuid = UUID(user_id)
        task_uuid = UUID(task_id) if isinstance(task_id, str) else task_id
        
        todo = session.get(Todo, task_uuid)
        if not todo or todo.user_id != user_uuid:
            return {"error": "Task not found"}
        
        title = todo.title
        session.delete(todo)
        session.commit()
        return {"task_id": str(todo.id), "status": "deleted", "title": title}
    except Exception as e:
        return {"error": str(e)}

def update_task(session: Session, user_id: str, task_id: str, title: str = None, description: str = None) -> Dict[str, Any]:
    """Update a task title or description"""
    try:
        user_uuid = UUID(user_id)
        task_uuid = UUID(task_id) if isinstance(task_id, str) else task_id
        
        todo = session.get(Todo, task_uuid)
        if not todo or todo.user_id != user_uuid:
            return {"error": "Task not found"}
        
        if title:
            todo.title = title
        if description:
            todo.description = description
            
        todo.updated_at = datetime.utcnow()
        session.add(todo)
        session.commit()
        return {"task_id": str(todo.id), "status": "updated", "title": todo.title}
    except Exception as e:
        return {"error": str(e)}

def update_task_status(session: Session, user_id: str, task_id: str, completed: bool) -> Dict[str, Any]:
    """Update task completion status (mark as complete or pending)"""
    try:
        user_uuid = UUID(user_id)
        task_uuid = UUID(task_id) if isinstance(task_id, str) else task_id
        
        todo = session.get(Todo, task_uuid)
        if not todo or todo.user_id != user_uuid:
            return {"error": "Task not found"}
        
        todo.completed = completed
        todo.updated_at = datetime.utcnow()
        session.add(todo)
        session.commit()
        
        status_text = "completed" if completed else "pending"
        return {"task_id": str(todo.id), "status": status_text, "title": todo.title}
    except Exception as e:
        return {"error": str(e)}

# Map tool names to functions
TOOL_MAP = {
    "add_task": add_task,
    "list_tasks": list_tasks,
    "complete_task": complete_task,
    "delete_task": delete_task,
    "update_task": update_task,
    "update_task_status": update_task_status
}

def get_gemini_tools_declaration():
    """
    Converts tools.yaml to Gemini tool declarations.
    """
    spec = load_tools_spec()
    declarations = []
    
    for tool in spec.get("tools", []):
        declaration = {
            "name": tool["name"],
            "description": tool["description"],
            "parameters": tool["parameters"]
        }
        declarations.append(declaration)
        
    return declarations
