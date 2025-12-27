"""Task repository for Todo CLI Application.

Manages in-memory task storage and CRUD operations.

Spec Reference: FR-001 through FR-014
Plan Reference: Component Specifications section 3
"""

from models.task import Task
from services.exceptions import TaskNotFoundError, InvalidDescriptionError


class TaskRepository:
    """Manages task storage and CRUD operations.

    Internal State:
        _tasks: dict[int, Task] - Task storage
        _next_id: int - ID counter (starts at 1, never decrements)

    Spec Reference: FR-013 (in-memory only), FR-014 (preserve IDs)
    """

    def __init__(self) -> None:
        """Initialize empty task repository."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def _validate_description(self, description: str) -> str:
        """Validate and normalize task description.

        Spec Reference: FR-008 (validate description non-empty, non-whitespace)
        Edge Case: Truncate descriptions over 500 characters with warning

        Args:
            description: Raw description string

        Returns:
            Validated and stripped description

        Raises:
            InvalidDescriptionError: If description is empty or whitespace-only
        """
        if not description or not description.strip():
            raise InvalidDescriptionError("cannot be empty")

        stripped = description.strip()

        if len(stripped) > 500:
            print("Warning: Description truncated to 500 characters")
            return stripped[:500]

        return stripped

    def add(self, description: str) -> Task:
        """Add a new task with the given description.

        Spec Reference: FR-001, FR-002, FR-003

        Args:
            description: Task description text

        Returns:
            Newly created Task with assigned ID

        Raises:
            InvalidDescriptionError: If description is invalid
        """
        validated = self._validate_description(description)
        task = Task(id=self._next_id, description=validated)
        self._tasks[self._next_id] = task
        self._next_id += 1
        return task

    def get(self, task_id: int) -> Task | None:
        """Retrieve a task by ID.

        Spec Reference: FR-009

        Args:
            task_id: ID of the task to retrieve

        Returns:
            Task if found, None otherwise
        """
        return self._tasks.get(task_id)

    def get_all(self) -> list[Task]:
        """Retrieve all tasks.

        Spec Reference: FR-004

        Returns:
            List of all tasks ordered by ID
        """
        return list(self._tasks.values())

    def update(self, task_id: int, description: str) -> Task:
        """Update a task's description.

        Spec Reference: FR-005, FR-009

        Args:
            task_id: ID of the task to update
            description: New description text

        Returns:
            Updated Task

        Raises:
            TaskNotFoundError: If task ID does not exist
            InvalidDescriptionError: If description is invalid
        """
        task = self._tasks.get(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)

        validated = self._validate_description(description)
        task.description = validated
        return task

    def delete(self, task_id: int) -> None:
        """Delete a task by ID.

        Spec Reference: FR-006, FR-009, FR-014 (IDs not reused)

        Args:
            task_id: ID of the task to delete

        Raises:
            TaskNotFoundError: If task ID does not exist
        """
        if task_id not in self._tasks:
            raise TaskNotFoundError(task_id)

        del self._tasks[task_id]
        # Note: _next_id is NOT decremented (FR-014)

    def toggle_complete(self, task_id: int) -> Task:
        """Toggle a task's completion status.

        Spec Reference: FR-007, FR-009

        Args:
            task_id: ID of the task to toggle

        Returns:
            Updated Task with toggled status

        Raises:
            TaskNotFoundError: If task ID does not exist
        """
        task = self._tasks.get(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)

        task.is_complete = not task.is_complete
        return task

    def count(self) -> tuple[int, int]:
        """Count complete and incomplete tasks.

        Returns:
            Tuple of (complete_count, incomplete_count)
        """
        complete = sum(1 for task in self._tasks.values() if task.is_complete)
        incomplete = len(self._tasks) - complete
        return (complete, incomplete)
