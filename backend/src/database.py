"""
Database connection module
Provides SQLModel engine and session management for Neon PostgreSQL
"""
from sqlmodel import create_engine, Session, SQLModel
from .config import settings

# Create database engine
# For Neon PostgreSQL, connection pooling is handled by the serverless driver
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    pool_pre_ping=True,   # Verify connections before using them
    pool_recycle=3600,    # Recycle connections after 1 hour
)


def create_db_and_tables():
    """
    Create all database tables
    Called during application startup
    """
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency function to get database session
    Usage in FastAPI endpoints:
        def endpoint(session: Session = Depends(get_session)):
            ...
    """
    with Session(engine) as session:
        yield session
