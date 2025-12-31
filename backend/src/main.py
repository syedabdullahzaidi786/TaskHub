"""
FastAPI main application
Entry point for the backend API server
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import create_db_and_tables
from .api.router import api_router

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,  # Required for cookies
    allow_methods=["*"],     # Allow all HTTP methods
    allow_headers=["*"],     # Allow all headers
)

# Include API router
app.include_router(api_router)


@app.on_event("startup")
async def on_startup():
    """
    Application startup event
    Note: Database tables should be created via Alembic migrations
    Run: alembic upgrade head
    """
    pass  # Tables created via Alembic migrations


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Todo API is running",
        "version": settings.APP_VERSION
    }


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION
    }
