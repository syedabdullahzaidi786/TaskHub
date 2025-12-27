"""Custom exceptions for Todo CLI Application.

Spec Reference: FR-008, FR-009, FR-010
Plan Reference: Component Specifications section 2
"""


class TaskNotFoundError(Exception):
    """Raised when a task with the given ID does not exist.

    Spec Reference: FR-009 (validate ID exists)
    """

    def __init__(self, task_id: int) -> None:
        self.task_id = task_id
        super().__init__(f"Task with ID {task_id} not found")


class InvalidDescriptionError(Exception):
    """Raised when a task description is invalid.

    Spec Reference: FR-008 (validate description)
    """

    def __init__(self, reason: str) -> None:
        self.reason = reason
        super().__init__(f"Invalid description: {reason}")
