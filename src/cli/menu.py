"""Menu display functions for Todo CLI Application.

Spec Reference: FR-004, FR-010, FR-011, CLI Interaction Flow section
Plan Reference: Component Specifications section 4
"""

from models.task import Task


def display_menu() -> None:
    """Display the main menu.

    Spec Reference: FR-011, CLI Interaction Flow - Main Menu Display
    """
    print("============================")
    print("      TODO APPLICATION")
    print("============================")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Toggle Complete")
    print("6. Exit")
    print("============================")


def display_tasks(tasks: list[Task], complete_count: int, incomplete_count: int) -> None:
    """Display formatted task list.

    Spec Reference: FR-004, CLI Interaction Flow - View Tasks

    Args:
        tasks: List of tasks to display
        complete_count: Number of complete tasks
        incomplete_count: Number of incomplete tasks
    """
    print("============================")
    print("        YOUR TASKS")
    print("============================")

    if not tasks:
        print("No tasks found. Add a task to get started.")
    else:
        for task in tasks:
            status = "[X]" if task.is_complete else "[ ]"
            print(f"[{task.id}] {status} {task.description}")

    print("============================")

    if tasks:
        total = complete_count + incomplete_count
        print(f"Total: {total} tasks ({complete_count} complete, {incomplete_count} incomplete)")


def display_message(message: str) -> None:
    """Display a success/info message.

    Args:
        message: Message to display
    """
    print(f"> {message}")


def display_error(message: str) -> None:
    """Display an error message.

    Spec Reference: FR-010

    Args:
        message: Error message to display
    """
    print(f"Error: {message}")
