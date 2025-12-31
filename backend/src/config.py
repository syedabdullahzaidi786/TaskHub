"""
Backend configuration module
Loads environment variables for database, authentication, and CORS settings
"""
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables"""

    # Database Configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost/todo_db"
    )

    # Better Auth Configuration
    BETTER_AUTH_SECRET: str = os.getenv(
        "BETTER_AUTH_SECRET",
        ""
    )
    BETTER_AUTH_URL: str = os.getenv(
        "BETTER_AUTH_URL",
        "http://localhost:8000"
    )

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000"
        ).split(",")
    ]

    # Application Settings
    APP_NAME: str = "TaskHub"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    def __init__(self):
        """Validate required settings on initialization"""
        if not self.BETTER_AUTH_SECRET:
            raise ValueError(
                "BETTER_AUTH_SECRET environment variable is required. "
                "Generate one with: openssl rand -hex 32"
            )


# Global settings instance
settings = Settings()
