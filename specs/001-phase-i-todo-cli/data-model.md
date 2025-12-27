# Data Model: Phase I - Todo CLI Application

**Feature**: 001-phase-i-todo-cli
**Date**: 2024-12-24
**Status**: Complete

## Overview

This document defines the data model for the Phase I Todo CLI application. The model is intentionally minimal, supporting only the required task entity with in-memory storage.

---

## Entities

### Task

Represents a single todo item in the system.

**Source**: Spec FR-001 through FR-007, Key Entities section

```python
@dataclass
class Task:
    id: int
    description: str
    is_complete: bool = False
```

#### Attributes

| Attribute | Type | Constraints | Source |
|-----------|------|-------------|--------|
| `id` | `int` | Unique, sequential, immutable, ≥ 1 | FR-002 |
| `description` | `str` | 1-500 characters, non-empty, non-whitespace | FR-001, FR-008 |
| `is_complete` | `bool` | Default: `False` | FR-003 |

#### Validation Rules

| Rule | Constraint | Error Type | Source |
|------|------------|------------|--------|
| Description not empty | `len(description.strip()) > 0` | `InvalidDescriptionError` | FR-008 |
| Description not too long | `len(description) <= 500` | Warning + truncate | Edge case |
| Task exists for operations | `id in tasks` | `TaskNotFoundError` | FR-009 |

#### State Transitions

```
[Created] ──── is_complete=False ────> [Incomplete]
                                            │
                                            │ toggle_complete()
                                            ▼
                                       [Complete]
                                            │
                                            │ toggle_complete()
                                            ▼
                                       [Incomplete]
```

---

## Storage Schema

### In-Memory Structure

```python
# TaskRepository internal storage
_tasks: dict[int, Task] = {}
_next_id: int = 1
```

**Design Rationale**:
- `dict[int, Task]`: O(1) lookup by ID for CRUD operations
- `_next_id`: Counter for sequential ID generation (FR-002)
- IDs never reused after deletion (FR-014)

### Example State

```python
# After adding 3 tasks and deleting task 2:
_tasks = {
    1: Task(id=1, description="Buy groceries", is_complete=False),
    3: Task(id=3, description="Call mom", is_complete=True)
}
_next_id = 4  # Next task will get ID 4, not 2
```

---

## Operations

### Create (Add Task)

**Source**: FR-001, FR-002, FR-003

```
Input: description (str)
Output: Task

Preconditions:
  - description is valid (non-empty, non-whitespace)

Postconditions:
  - New Task created with next sequential ID
  - Task.is_complete = False
  - Task stored in _tasks
  - _next_id incremented
```

### Read (Get Task / Get All)

**Source**: FR-004, FR-009

```
Get by ID:
  Input: id (int)
  Output: Task | None

Get All:
  Input: None
  Output: list[Task]  # Ordered by ID (dict preserves insertion order)
```

### Update (Update Description)

**Source**: FR-005, FR-008, FR-009

```
Input: id (int), new_description (str)
Output: Task

Preconditions:
  - Task with id exists
  - new_description is valid

Postconditions:
  - Task.description = new_description
  - Task.id unchanged
  - Task.is_complete unchanged
```

### Delete

**Source**: FR-006, FR-009, FR-014

```
Input: id (int)
Output: None

Preconditions:
  - Task with id exists

Postconditions:
  - Task removed from _tasks
  - _next_id unchanged (IDs not reused)
```

### Toggle Complete

**Source**: FR-007, FR-009

```
Input: id (int)
Output: Task

Preconditions:
  - Task with id exists

Postconditions:
  - Task.is_complete = not Task.is_complete
```

---

## Error Types

```python
class TaskNotFoundError(Exception):
    """Raised when a task with the given ID does not exist."""
    def __init__(self, task_id: int):
        self.task_id = task_id
        super().__init__(f"Task with ID {task_id} not found")

class InvalidDescriptionError(Exception):
    """Raised when a task description is invalid."""
    def __init__(self, reason: str):
        self.reason = reason
        super().__init__(f"Invalid description: {reason}")
```

---

## Data Invariants

These invariants MUST hold true at all times:

1. **Unique IDs**: No two tasks share the same ID
2. **Sequential IDs**: All IDs are positive integers ≥ 1
3. **ID Immutability**: Once assigned, a task's ID never changes
4. **ID Preservation**: Deleted IDs are never reassigned
5. **Valid Descriptions**: All stored tasks have valid descriptions (1-500 chars, non-whitespace)
6. **Consistent State**: `_next_id` is always greater than any existing task ID

---

## Relationship to Specification

| Spec Requirement | Data Model Implementation |
|------------------|--------------------------|
| FR-001: Add tasks | `TaskRepository.add(description)` |
| FR-002: Sequential IDs | `_next_id` counter |
| FR-003: Default incomplete | `Task.is_complete = False` |
| FR-004: View all | `TaskRepository.get_all()` |
| FR-005: Update description | `TaskRepository.update(id, description)` |
| FR-006: Delete task | `TaskRepository.delete(id)` |
| FR-007: Toggle complete | `TaskRepository.toggle_complete(id)` |
| FR-008: Validate description | `InvalidDescriptionError` |
| FR-009: Validate ID exists | `TaskNotFoundError` |
| FR-013: In-memory only | `dict` storage, no persistence |
| FR-014: Preserve IDs | ID counter never decrements |
