"""Task model for Todo CLI Application.

Spec Reference: FR-001, FR-002, FR-003, Key Entities section
Plan Reference: Component Specifications section 1
"""

from dataclasses import dataclass


@dataclass
class Task:
    """Represents a single todo item.

    Attributes:
        id: Unique sequential identifier (immutable, starts at 1)
        description: Text description of the task (1-500 characters)
        is_complete: Completion status (default: False)
    """

    id: int
    description: str
    is_complete: bool = False
