"""CLI package for Todo CLI Application."""

from cli.menu import display_menu, display_tasks, display_message, display_error
from cli.handlers import (
    handle_add,
    handle_view,
    handle_update,
    handle_delete,
    handle_toggle,
    handle_exit,
)

__all__ = [
    "display_menu",
    "display_tasks",
    "display_message",
    "display_error",
    "handle_add",
    "handle_view",
    "handle_update",
    "handle_delete",
    "handle_toggle",
    "handle_exit",
]
