"""Unit tests for Task model.

Spec Reference: Key Entities section
Plan Reference: Testing Strategy - Unit Tests
"""

import unittest
from src.models.task import Task


class TestTask(unittest.TestCase):
    """Test cases for Task dataclass."""

    def test_task_creation_with_valid_attributes(self) -> None:
        """Test creating a task with valid attributes."""
        task = Task(id=1, description="Buy groceries")

        self.assertEqual(task.id, 1)
        self.assertEqual(task.description, "Buy groceries")
        self.assertFalse(task.is_complete)

    def test_task_default_is_complete_false(self) -> None:
        """Test that is_complete defaults to False (FR-003)."""
        task = Task(id=1, description="Test task")

        self.assertFalse(task.is_complete)

    def test_task_creation_with_explicit_is_complete(self) -> None:
        """Test creating a task with explicit is_complete value."""
        task = Task(id=1, description="Completed task", is_complete=True)

        self.assertTrue(task.is_complete)

    def test_task_equality(self) -> None:
        """Test task equality comparison."""
        task1 = Task(id=1, description="Test", is_complete=False)
        task2 = Task(id=1, description="Test", is_complete=False)
        task3 = Task(id=2, description="Test", is_complete=False)

        self.assertEqual(task1, task2)
        self.assertNotEqual(task1, task3)

    def test_task_id_is_integer(self) -> None:
        """Test that task ID is an integer."""
        task = Task(id=42, description="Test")

        self.assertIsInstance(task.id, int)

    def test_task_description_is_string(self) -> None:
        """Test that task description is a string."""
        task = Task(id=1, description="Test description")

        self.assertIsInstance(task.description, str)


if __name__ == "__main__":
    unittest.main()
