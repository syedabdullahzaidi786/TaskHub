"""Main entry point for Todo CLI Application.

Spec Reference: FR-011, FR-012
Plan Reference: Component Specifications section 6
"""

from services.task_repository import TaskRepository
from cli.menu import display_menu, display_error
from cli.handlers import (
    handle_add,
    handle_view,
    handle_update,
    handle_delete,
    handle_toggle,
    handle_exit,
)


def main() -> None:
    """Run the Todo CLI Application main loop.

    Spec Reference: FR-011 (menu-based interface), FR-012 (graceful exit)
    Plan Reference: Main Entry Point section
    """
    repo = TaskRepository()

    handlers = {
        "1": lambda: handle_add(repo),
        "2": lambda: handle_view(repo),
        "3": lambda: handle_update(repo),
        "4": lambda: handle_delete(repo),
        "5": lambda: handle_toggle(repo),
        "6": handle_exit,
    }

    while True:
        display_menu()
        choice = input("Select an option (1-6): ").strip()

        handler = handlers.get(choice)
        if handler:
            result = handler()
            if result == "EXIT":
                break
        else:
            display_error("Invalid option. Please try again.")

        print()  # Blank line for readability between operations


if __name__ == "__main__":
    main()
