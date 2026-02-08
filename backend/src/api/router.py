"""
Main API router
Aggregates all API routers (auth, todos)
"""
from fastapi import APIRouter
from .auth import router as auth_router
from .todos import router as todos_router
from .chat import router as chat_router
from .events import router as events_router

# Create main API router
api_router = APIRouter()

# Register routers
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(todos_router, prefix="/todos", tags=["todos"])
api_router.include_router(chat_router, prefix="/api", tags=["chat"])
api_router.include_router(events_router, tags=["events"])
