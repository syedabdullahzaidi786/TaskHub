"""Integration tests for CLI flow.

Spec Reference: Success Criteria SC-001 through SC-006
Plan Reference: Testing Strategy - Integration Tests
"""

import unittest
from io import StringIO
import sys

from src.services.task_repository import TaskRepository
from src.cli.handlers import (
    handle_add,
    handle_view,
    handle_update,
    handle_delete,
    handle_toggle,
    handle_exit,
)


class TestAddViewCycle(unittest.TestCase):
    """Integration tests for add-view cycle."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()
        self.held_output = StringIO()
        sys.stdout = self.held_output

    def tearDown(self) -> None:
        """Restore stdout."""
        sys.stdout = sys.__stdout__

    def test_add_then_view_cycle(self) -> None:
        """Test full add-view cycle (SC-001)."""
        # Simulate add
        task = self.repo.add("Buy groceries")
        self.assertEqual(task.id, 1)

        # Verify via get_all
        tasks = self.repo.get_all()
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0].description, "Buy groceries")

    def test_add_multiple_then_view(self) -> None:
        """Test adding multiple tasks and viewing."""
        self.repo.add("Task 1")
        self.repo.add("Task 2")
        self.repo.add("Task 3")

        tasks = self.repo.get_all()

        self.assertEqual(len(tasks), 3)
        self.assertEqual(tasks[0].id, 1)
        self.assertEqual(tasks[1].id, 2)
        self.assertEqual(tasks[2].id, 3)


class TestCRUDCycle(unittest.TestCase):
    """Integration tests for full CRUD cycle."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()

    def test_full_crud_cycle(self) -> None:
        """Test complete CRUD cycle (SC-001, SC-002)."""
        # Create
        task = self.repo.add("Original task")
        self.assertEqual(task.id, 1)
        self.assertEqual(task.description, "Original task")
        self.assertFalse(task.is_complete)

        # Read
        retrieved = self.repo.get(1)
        self.assertEqual(retrieved.description, "Original task")

        # Update
        updated = self.repo.update(1, "Updated task")
        self.assertEqual(updated.description, "Updated task")

        # Toggle
        toggled = self.repo.toggle_complete(1)
        self.assertTrue(toggled.is_complete)

        # Delete
        self.repo.delete(1)
        self.assertIsNone(self.repo.get(1))

    def test_id_preservation_after_delete(self) -> None:
        """Test ID preservation across operations (SC-006)."""
        self.repo.add("Task 1")
        self.repo.add("Task 2")
        self.repo.add("Task 3")

        # Delete middle task
        self.repo.delete(2)

        # Add new task
        new_task = self.repo.add("Task 4")

        # Verify IDs
        self.assertEqual(new_task.id, 4)  # Not 2
        self.assertIsNone(self.repo.get(2))  # ID 2 gone
        self.assertIsNotNone(self.repo.get(1))
        self.assertIsNotNone(self.repo.get(3))


class TestErrorHandling(unittest.TestCase):
    """Integration tests for error handling."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()

    def test_operations_on_nonexistent_task(self) -> None:
        """Test error handling for non-existent task ID (SC-003)."""
        from src.services.exceptions import TaskNotFoundError

        with self.assertRaises(TaskNotFoundError):
            self.repo.update(999, "New description")

        with self.assertRaises(TaskNotFoundError):
            self.repo.delete(999)

        with self.assertRaises(TaskNotFoundError):
            self.repo.toggle_complete(999)

    def test_invalid_description_handling(self) -> None:
        """Test error handling for invalid descriptions (SC-003)."""
        from src.services.exceptions import InvalidDescriptionError

        with self.assertRaises(InvalidDescriptionError):
            self.repo.add("")

        with self.assertRaises(InvalidDescriptionError):
            self.repo.add("   ")

        self.repo.add("Valid task")
        with self.assertRaises(InvalidDescriptionError):
            self.repo.update(1, "")


class TestExitBehavior(unittest.TestCase):
    """Integration tests for exit behavior."""

    def test_handle_exit_returns_signal(self) -> None:
        """Test that handle_exit returns EXIT signal (FR-012)."""
        held_output = StringIO()
        sys.stdout = held_output

        result = handle_exit()

        sys.stdout = sys.__stdout__
        self.assertEqual(result, "EXIT")
        self.assertIn("Goodbye!", held_output.getvalue())


class TestSequentialOperations(unittest.TestCase):
    """Integration tests for sequential operations."""

    def test_100_sequential_adds(self) -> None:
        """Test application handles 100+ sequential add operations (SC-004)."""
        repo = TaskRepository()

        for i in range(100):
            task = repo.add(f"Task {i + 1}")
            self.assertEqual(task.id, i + 1)

        self.assertEqual(len(repo.get_all()), 100)

    def test_mixed_operations_sequence(self) -> None:
        """Test mixed operations maintain consistency."""
        repo = TaskRepository()

        # Add 10 tasks
        for i in range(10):
            repo.add(f"Task {i + 1}")

        # Delete odd IDs
        for i in range(1, 11, 2):
            repo.delete(i)

        # Toggle even IDs
        for i in range(2, 11, 2):
            repo.toggle_complete(i)

        # Verify state
        tasks = repo.get_all()
        self.assertEqual(len(tasks), 5)

        for task in tasks:
            self.assertTrue(task.is_complete)
            self.assertEqual(task.id % 2, 0)  # All even IDs


if __name__ == "__main__":
    unittest.main()
