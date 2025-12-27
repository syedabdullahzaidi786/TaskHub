"""Unit tests for TaskRepository.

Spec Reference: FR-001 through FR-014
Plan Reference: Testing Strategy - Unit Tests
"""

import unittest
from io import StringIO
import sys

from src.services.task_repository import TaskRepository
from src.services.exceptions import TaskNotFoundError, InvalidDescriptionError


class TestTaskRepositoryAdd(unittest.TestCase):
    """Test cases for TaskRepository.add() method."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()

    def test_add_task_with_valid_description(self) -> None:
        """Test adding a task with valid description (FR-001)."""
        task = self.repo.add("Buy groceries")

        self.assertEqual(task.description, "Buy groceries")
        self.assertFalse(task.is_complete)

    def test_add_task_assigns_sequential_ids(self) -> None:
        """Test that tasks receive sequential IDs starting from 1 (FR-002)."""
        task1 = self.repo.add("Task 1")
        task2 = self.repo.add("Task 2")
        task3 = self.repo.add("Task 3")

        self.assertEqual(task1.id, 1)
        self.assertEqual(task2.id, 2)
        self.assertEqual(task3.id, 3)

    def test_add_task_with_empty_description_raises_error(self) -> None:
        """Test that empty description raises InvalidDescriptionError (FR-008)."""
        with self.assertRaises(InvalidDescriptionError):
            self.repo.add("")

    def test_add_task_with_whitespace_only_raises_error(self) -> None:
        """Test that whitespace-only description raises error (FR-008)."""
        with self.assertRaises(InvalidDescriptionError):
            self.repo.add("   ")

    def test_add_task_strips_whitespace(self) -> None:
        """Test that description whitespace is stripped."""
        task = self.repo.add("  Buy groceries  ")

        self.assertEqual(task.description, "Buy groceries")

    def test_add_task_truncates_long_description(self) -> None:
        """Test that descriptions over 500 chars are truncated (Edge Case)."""
        long_desc = "A" * 600
        captured_output = StringIO()
        sys.stdout = captured_output

        task = self.repo.add(long_desc)

        sys.stdout = sys.__stdout__
        self.assertEqual(len(task.description), 500)
        self.assertIn("Warning", captured_output.getvalue())

    def test_add_task_default_incomplete(self) -> None:
        """Test that new tasks are incomplete by default (FR-003)."""
        task = self.repo.add("New task")

        self.assertFalse(task.is_complete)


class TestTaskRepositoryGet(unittest.TestCase):
    """Test cases for TaskRepository.get() method."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()
        self.task = self.repo.add("Test task")

    def test_get_existing_task(self) -> None:
        """Test getting an existing task by ID."""
        result = self.repo.get(1)

        self.assertIsNotNone(result)
        self.assertEqual(result.id, 1)
        self.assertEqual(result.description, "Test task")

    def test_get_nonexistent_task_returns_none(self) -> None:
        """Test that getting a non-existent task returns None."""
        result = self.repo.get(999)

        self.assertIsNone(result)


class TestTaskRepositoryGetAll(unittest.TestCase):
    """Test cases for TaskRepository.get_all() method."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()

    def test_get_all_empty_repository(self) -> None:
        """Test get_all on empty repository returns empty list."""
        result = self.repo.get_all()

        self.assertEqual(result, [])

    def test_get_all_with_tasks(self) -> None:
        """Test get_all returns all tasks (FR-004)."""
        self.repo.add("Task 1")
        self.repo.add("Task 2")
        self.repo.add("Task 3")

        result = self.repo.get_all()

        self.assertEqual(len(result), 3)
        self.assertEqual(result[0].description, "Task 1")
        self.assertEqual(result[1].description, "Task 2")
        self.assertEqual(result[2].description, "Task 3")


class TestTaskRepositoryUpdate(unittest.TestCase):
    """Test cases for TaskRepository.update() method."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()
        self.task = self.repo.add("Original description")

    def test_update_existing_task(self) -> None:
        """Test updating an existing task's description (FR-005)."""
        updated = self.repo.update(1, "Updated description")

        self.assertEqual(updated.description, "Updated description")
        self.assertEqual(updated.id, 1)

    def test_update_nonexistent_task_raises_error(self) -> None:
        """Test updating non-existent task raises TaskNotFoundError (FR-009)."""
        with self.assertRaises(TaskNotFoundError) as context:
            self.repo.update(999, "New description")

        self.assertEqual(context.exception.task_id, 999)

    def test_update_with_empty_description_raises_error(self) -> None:
        """Test updating with empty description raises error (FR-008)."""
        with self.assertRaises(InvalidDescriptionError):
            self.repo.update(1, "")

    def test_update_preserves_completion_status(self) -> None:
        """Test that update preserves is_complete status."""
        self.repo.toggle_complete(1)
        updated = self.repo.update(1, "New description")

        self.assertTrue(updated.is_complete)


class TestTaskRepositoryDelete(unittest.TestCase):
    """Test cases for TaskRepository.delete() method."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()
        self.repo.add("Task 1")
        self.repo.add("Task 2")
        self.repo.add("Task 3")

    def test_delete_existing_task(self) -> None:
        """Test deleting an existing task (FR-006)."""
        self.repo.delete(2)

        self.assertIsNone(self.repo.get(2))
        self.assertEqual(len(self.repo.get_all()), 2)

    def test_delete_nonexistent_task_raises_error(self) -> None:
        """Test deleting non-existent task raises TaskNotFoundError (FR-009)."""
        with self.assertRaises(TaskNotFoundError) as context:
            self.repo.delete(999)

        self.assertEqual(context.exception.task_id, 999)

    def test_delete_preserves_other_task_ids(self) -> None:
        """Test that deleting a task doesn't affect other IDs (FR-014)."""
        self.repo.delete(2)

        task1 = self.repo.get(1)
        task3 = self.repo.get(3)

        self.assertEqual(task1.id, 1)
        self.assertEqual(task3.id, 3)

    def test_deleted_ids_not_reused(self) -> None:
        """Test that deleted IDs are never reused (FR-014)."""
        self.repo.delete(2)
        new_task = self.repo.add("Task 4")

        self.assertEqual(new_task.id, 4)
        self.assertIsNone(self.repo.get(2))


class TestTaskRepositoryToggleComplete(unittest.TestCase):
    """Test cases for TaskRepository.toggle_complete() method."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()
        self.task = self.repo.add("Test task")

    def test_toggle_incomplete_to_complete(self) -> None:
        """Test toggling incomplete task to complete (FR-007)."""
        result = self.repo.toggle_complete(1)

        self.assertTrue(result.is_complete)

    def test_toggle_complete_to_incomplete(self) -> None:
        """Test toggling complete task to incomplete (FR-007)."""
        self.repo.toggle_complete(1)  # Now complete
        result = self.repo.toggle_complete(1)  # Now incomplete

        self.assertFalse(result.is_complete)

    def test_toggle_nonexistent_task_raises_error(self) -> None:
        """Test toggling non-existent task raises TaskNotFoundError (FR-009)."""
        with self.assertRaises(TaskNotFoundError) as context:
            self.repo.toggle_complete(999)

        self.assertEqual(context.exception.task_id, 999)


class TestTaskRepositoryCount(unittest.TestCase):
    """Test cases for TaskRepository.count() method."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.repo = TaskRepository()

    def test_count_empty_repository(self) -> None:
        """Test count on empty repository."""
        complete, incomplete = self.repo.count()

        self.assertEqual(complete, 0)
        self.assertEqual(incomplete, 0)

    def test_count_with_tasks(self) -> None:
        """Test count with mixed task statuses."""
        self.repo.add("Task 1")
        self.repo.add("Task 2")
        self.repo.add("Task 3")
        self.repo.toggle_complete(1)

        complete, incomplete = self.repo.count()

        self.assertEqual(complete, 1)
        self.assertEqual(incomplete, 2)


if __name__ == "__main__":
    unittest.main()
