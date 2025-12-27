"""CLI handlers for Todo CLI Application.

Processes user input for each menu operation.

Spec Reference: FR-005 through FR-012
Plan Reference: Component Specifications section 5
"""

from services.task_repository import TaskRepository
from services.exceptions import TaskNotFoundError, InvalidDescriptionError
from cli.menu import display_tasks, display_message, display_error


def get_task_id_input(prompt: str) -> int | None:
    """Prompt user for task ID and validate numeric input.

    Spec Reference: Edge Cases - Non-numeric ID input

    Args:
        prompt: Prompt message to display

    Returns:
        Valid integer ID or None if invalid input
    """
    user_input = input(prompt).strip()
    try:
        return int(user_input)
    except ValueError:
        display_error("Please enter a valid numeric ID")
        return None


def handle_add(repo: TaskRepository) -> None:
    """Handle add task flow.

    Spec Reference: User Story 1 (FR-001, FR-002, FR-003, FR-008)

    Args:
        repo: TaskRepository instance
    """
    description = input("Enter task description: ")

    try:
        task = repo.add(description)
        display_message(f"Task added successfully with ID: {task.id}")
    except InvalidDescriptionError:
        display_error("Task description cannot be empty")


def handle_view(repo: TaskRepository) -> None:
    """Handle view tasks flow.

    Spec Reference: User Story 2 (FR-004)

    Args:
        repo: TaskRepository instance
    """
    tasks = repo.get_all()
    complete_count, incomplete_count = repo.count()
    display_tasks(tasks, complete_count, incomplete_count)


def handle_update(repo: TaskRepository) -> None:
    """Handle update task flow.

    Spec Reference: User Story 3 (FR-005, FR-008, FR-009)

    Args:
        repo: TaskRepository instance
    """
    task_id = get_task_id_input("Enter task ID to update: ")
    if task_id is None:
        return

    description = input("Enter new description: ")

    try:
        repo.update(task_id, description)
        display_message(f"Task {task_id} updated successfully")
    except TaskNotFoundError as e:
        display_error(str(e))
    except InvalidDescriptionError:
        display_error("Task description cannot be empty")


def handle_delete(repo: TaskRepository) -> None:
    """Handle delete task flow.

    Spec Reference: User Story 4 (FR-006, FR-009, FR-014)

    Args:
        repo: TaskRepository instance
    """
    task_id = get_task_id_input("Enter task ID to delete: ")
    if task_id is None:
        return

    try:
        repo.delete(task_id)
        display_message(f"Task {task_id} deleted successfully")
    except TaskNotFoundError as e:
        display_error(str(e))


def handle_toggle(repo: TaskRepository) -> None:
    """Handle toggle complete flow.

    Spec Reference: User Story 5 (FR-007, FR-009)

    Args:
        repo: TaskRepository instance
    """
    task_id = get_task_id_input("Enter task ID to toggle: ")
    if task_id is None:
        return

    try:
        task = repo.toggle_complete(task_id)
        status = "complete" if task.is_complete else "incomplete"
        display_message(f"Task {task_id} marked as {status}")
    except TaskNotFoundError as e:
        display_error(str(e))


def handle_exit() -> str:
    """Handle exit flow.

    Spec Reference: User Story 6 (FR-012)

    Returns:
        "EXIT" signal to terminate main loop
    """
    print("Goodbye!")
    return "EXIT"
