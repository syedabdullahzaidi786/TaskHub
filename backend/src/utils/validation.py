"""
Validation utilities
Provides validators for email, password, and todo fields
"""
import re
from typing import Tuple


def validate_email(email: str) -> Tuple[bool, str]:
    """
    Validate email format

    Args:
        email: Email address to validate

    Returns:
        (is_valid, error_message) tuple
    """
    if not email or len(email.strip()) == 0:
        return False, "Email is required"

    if len(email) > 255:
        return False, "Email must be at most 255 characters"

    # Basic email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    if not re.match(pattern, email):
        return False, "Invalid email format"

    return True, ""


def validate_password(password: str) -> Tuple[bool, str]:
    """
    Validate password strength

    Requirements:
    - At least 8 characters
    - At most 128 characters

    Args:
        password: Password to validate

    Returns:
        (is_valid, error_message) tuple
    """
    if not password:
        return False, "Password is required"

    if len(password) < 8:
        return False, "Password must be at least 8 characters"

    if len(password) > 128:
        return False, "Password must be at most 128 characters"

    return True, ""


def validate_todo_title(title: str) -> Tuple[bool, str]:
    """
    Validate todo title

    Requirements:
    - Required (non-empty)
    - At most 200 characters

    Args:
        title: Todo title to validate

    Returns:
        (is_valid, error_message) tuple
    """
    if not title or len(title.strip()) == 0:
        return False, "Title is required"

    if len(title) > 200:
        return False, "Title must be at most 200 characters"

    return True, ""


def validate_todo_description(description: str) -> Tuple[bool, str]:
    """
    Validate todo description

    Requirements:
    - Optional (can be empty)
    - At most 2000 characters if provided

    Args:
        description: Todo description to validate

    Returns:
        (is_valid, error_message) tuple
    """
    if description and len(description) > 2000:
        return False, "Description must be at most 2000 characters"

    return True, ""
