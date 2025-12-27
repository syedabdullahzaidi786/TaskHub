# Implementation Plan: Phase I - Todo CLI Application

**Branch**: `001-phase-i-todo-cli` | **Date**: 2024-12-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-phase-i-todo-cli/spec.md`
**Constitution**: v1.0.0

## Summary

Implement an in-memory Python console application for basic todo management. The application provides five core operations (Add, View, Update, Delete, Toggle Complete) through a menu-based CLI interface. Data is stored in a dictionary structure with sequential integer IDs. Architecture follows three-layer separation (Model → Repository → CLI) to comply with constitutional quality principles.

---

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: None (Python standard library only per NFR-003)
**Storage**: In-memory `dict[int, Task]` (no persistence per FR-013)
**Testing**: `unittest` (Python standard library)
**Target Platform**: Cross-platform (Windows, macOS, Linux) console
**Project Type**: Single project (console application)
**Performance Goals**: <100ms response time (NFR-004), 1000+ tasks (NFR-005)
**Constraints**: No files, no database, no network, no external packages
**Scale/Scope**: Single user, single session, ~1000 tasks maximum

---

## Constitution Check

*GATE: Must pass before implementation. Re-checked after design.*

### Principle I: Spec-Driven Development ✅

| Gate | Status | Evidence |
|------|--------|----------|
| Specification exists | ✅ PASS | `specs/001-phase-i-todo-cli/spec.md` |
| Plan derived from spec | ✅ PASS | All features trace to FR-001 through FR-014 |
| No features beyond spec | ✅ PASS | Plan implements only specified features |

### Principle II: Agent Behavior Rules ✅

| Gate | Status | Evidence |
|------|--------|----------|
| No feature invention | ✅ PASS | No features beyond spec scope |
| Spec-level decisions | ✅ PASS | Architecture decisions documented in research.md |
| Clarifications resolved | ✅ PASS | All technical decisions documented |

### Principle III: Phase Governance ✅

| Gate | Status | Evidence |
|------|--------|----------|
| Phase boundaries respected | ✅ PASS | No persistence, no API, no future-phase features |
| No feature leakage | ✅ PASS | Explicitly excludes database, files, auth |
| Scope matches Phase I | ✅ PASS | In-memory console app only |

### Principle IV: Technology Constraints ✅

| Gate | Status | Evidence |
|------|--------|----------|
| Python language | ✅ PASS | Python 3.11+ |
| No unapproved dependencies | ✅ PASS | Standard library only |
| Version pinning | ✅ N/A | No external dependencies |

### Principle V: Quality Principles ✅

| Gate | Status | Evidence |
|------|--------|----------|
| Separation of concerns | ✅ PASS | Three-layer architecture |
| Single responsibility | ✅ PASS | Distinct modules for model, repository, CLI |
| Type safety | ✅ PASS | Type hints throughout |
| Error handling | ✅ PASS | Custom exceptions, explicit error paths |

**GATE STATUS**: ✅ **ALL GATES PASSED**

---

## Project Structure

### Documentation (this feature)

```
specs/001-phase-i-todo-cli/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research findings
├── data-model.md        # Entity definitions
├── quickstart.md        # Usage guide
├── checklists/
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```
src/
├── __init__.py
├── main.py                      # Application entry point
├── models/
│   ├── __init__.py
│   └── task.py                  # Task dataclass
├── services/
│   ├── __init__.py
│   ├── task_repository.py       # Task storage and CRUD
│   └── exceptions.py            # Custom exceptions
└── cli/
    ├── __init__.py
    ├── menu.py                  # Menu display functions
    └── handlers.py              # User input handlers

tests/
├── __init__.py
├── unit/
│   ├── __init__.py
│   ├── test_task.py             # Task model tests
│   └── test_task_repository.py  # Repository tests
└── integration/
    ├── __init__.py
    └── test_cli.py              # Full CLI flow tests
```

**Structure Decision**: Single project layout selected. No web/mobile components. Clean separation between models (data), services (business logic), and cli (presentation).

---

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                        CLI Layer                             │
│  ┌─────────────┐    ┌──────────────────────────────────┐   │
│  │   menu.py   │    │         handlers.py              │   │
│  │             │    │                                  │   │
│  │ display_    │    │ handle_add()    handle_delete()  │   │
│  │ menu()      │───▶│ handle_view()   handle_toggle()  │   │
│  │ display_    │    │ handle_update() handle_exit()    │   │
│  │ tasks()     │    │                                  │   │
│  └─────────────┘    └──────────────┬───────────────────┘   │
│                                     │                       │
└─────────────────────────────────────┼───────────────────────┘
                                      │ calls
                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              task_repository.py                       │  │
│  │                                                       │  │
│  │  TaskRepository                                       │  │
│  │  ├── _tasks: dict[int, Task]                         │  │
│  │  ├── _next_id: int                                   │  │
│  │  │                                                   │  │
│  │  ├── add(description) -> Task                        │  │
│  │  ├── get(id) -> Task | None                          │  │
│  │  ├── get_all() -> list[Task]                         │  │
│  │  ├── update(id, description) -> Task                 │  │
│  │  ├── delete(id) -> None                              │  │
│  │  └── toggle_complete(id) -> Task                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────┬───────────────────────┘
                                      │ uses
                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Model Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    task.py                            │  │
│  │                                                       │  │
│  │  @dataclass                                           │  │
│  │  class Task:                                          │  │
│  │      id: int                                          │  │
│  │      description: str                                 │  │
│  │      is_complete: bool = False                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input ──▶ handlers.py ──▶ TaskRepository ──▶ Task
                   │                 │              │
                   │                 │              │
                   ▼                 ▼              ▼
              Validates         Stores/        Pure data
              and formats      Retrieves       structure
                   │                 │              │
                   └────────────────┼──────────────┘
                                    │
                                    ▼
                              Display Output
```

---

## Component Specifications

### 1. Task Model (`src/models/task.py`)

**Purpose**: Pure data structure representing a todo item

**Implementation**:
```python
from dataclasses import dataclass

@dataclass
class Task:
    """Represents a single todo item."""
    id: int
    description: str
    is_complete: bool = False
```

**Requirement Traceability**:
- `id`: FR-002 (unique sequential ID)
- `description`: FR-001 (task with description)
- `is_complete`: FR-003, FR-007 (completion status)

---

### 2. Exceptions (`src/services/exceptions.py`)

**Purpose**: Custom exceptions for error handling

**Implementation**:
```python
class TaskNotFoundError(Exception):
    """Raised when task ID does not exist."""
    def __init__(self, task_id: int):
        self.task_id = task_id
        super().__init__(f"Task with ID {task_id} not found")

class InvalidDescriptionError(Exception):
    """Raised when task description is invalid."""
    def __init__(self, reason: str):
        self.reason = reason
        super().__init__(f"Invalid description: {reason}")
```

**Requirement Traceability**:
- `TaskNotFoundError`: FR-009 (validate ID exists)
- `InvalidDescriptionError`: FR-008 (validate description)

---

### 3. Task Repository (`src/services/task_repository.py`)

**Purpose**: Manages task storage and CRUD operations

**Interface**:

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| `add(description)` | `str` | `Task` | Create new task |
| `get(id)` | `int` | `Task \| None` | Retrieve task by ID |
| `get_all()` | - | `list[Task]` | Retrieve all tasks |
| `update(id, description)` | `int`, `str` | `Task` | Update task description |
| `delete(id)` | `int` | `None` | Remove task |
| `toggle_complete(id)` | `int` | `Task` | Toggle completion status |
| `count()` | - | `tuple[int, int]` | (complete, incomplete) counts |

**Internal State**:
- `_tasks: dict[int, Task]` - Task storage
- `_next_id: int` - ID counter (starts at 1)

**Validation**:
- Description validation in `add()` and `update()`
- ID existence check in `get()`, `update()`, `delete()`, `toggle_complete()`

**Requirement Traceability**: FR-001 through FR-014

---

### 4. Menu Display (`src/cli/menu.py`)

**Purpose**: Display formatting functions

**Functions**:

| Function | Description | Output |
|----------|-------------|--------|
| `display_menu()` | Show main menu | Prints menu to stdout |
| `display_tasks(tasks)` | Show task list | Formatted task display |
| `display_message(msg)` | Show success/info | Prefixed message |
| `display_error(msg)` | Show error | Error-prefixed message |

**Requirement Traceability**: FR-004, FR-010, FR-011

---

### 5. Input Handlers (`src/cli/handlers.py`)

**Purpose**: Process user input for each operation

**Functions**:

| Function | Description | Returns |
|----------|-------------|---------|
| `handle_add(repo)` | Add task flow | None |
| `handle_view(repo)` | View tasks flow | None |
| `handle_update(repo)` | Update task flow | None |
| `handle_delete(repo)` | Delete task flow | None |
| `handle_toggle(repo)` | Toggle complete flow | None |
| `handle_exit()` | Exit flow | "EXIT" |
| `get_task_id_input()` | Prompt for ID | `int \| None` |
| `get_description_input()` | Prompt for description | `str` |

**Error Handling**:
- Catches `TaskNotFoundError`, `InvalidDescriptionError`
- Displays user-friendly error messages
- Returns to menu on error

**Requirement Traceability**: FR-005 through FR-012

---

### 6. Main Entry Point (`src/main.py`)

**Purpose**: Application entry point and main loop

**Flow**:
```python
def main():
    repo = TaskRepository()
    handlers = {
        "1": lambda: handle_add(repo),
        "2": lambda: handle_view(repo),
        "3": lambda: handle_update(repo),
        "4": lambda: handle_delete(repo),
        "5": lambda: handle_toggle(repo),
        "6": handle_exit
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

if __name__ == "__main__":
    main()
```

**Requirement Traceability**: FR-011, FR-012

---

## Control Flow

### Main Loop

```
┌─────────────────────────────────────────────────────────────┐
│                         START                                │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Initialize TaskRepository                       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │       Display Main Menu       │◀─────────────┐
              └───────────────┬───────────────┘              │
                              │                              │
                              ▼                              │
              ┌───────────────────────────────┐              │
              │      Get User Input           │              │
              └───────────────┬───────────────┘              │
                              │                              │
                              ▼                              │
              ┌───────────────────────────────┐              │
              │      Valid Option?            │              │
              └───────────┬───────────────────┘              │
                    │           │                            │
                   Yes          No                           │
                    │           │                            │
                    │           ▼                            │
                    │   ┌───────────────────┐               │
                    │   │ Display Error     │───────────────┤
                    │   └───────────────────┘               │
                    │                                        │
                    ▼                                        │
              ┌───────────────────────────────┐              │
              │      Execute Handler          │              │
              └───────────────┬───────────────┘              │
                              │                              │
                              ▼                              │
              ┌───────────────────────────────┐              │
              │      Handler = Exit?          │              │
              └───────────┬───────────────────┘              │
                    │           │                            │
                   Yes          No                           │
                    │           │                            │
                    │           └────────────────────────────┘
                    ▼
              ┌───────────────────────────────┐
              │      Display "Goodbye!"       │
              └───────────────┬───────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │            END                │
              └───────────────────────────────┘
```

### Error Handling Flow

```
User Operation
      │
      ▼
┌─────────────────┐
│ Handler Called  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     Exception    ┌─────────────────┐
│ Repository      │─────────────────▶│ Display Error   │
│ Method          │                  │ Message         │
└────────┬────────┘                  └────────┬────────┘
         │                                    │
         │ Success                            │
         ▼                                    │
┌─────────────────┐                           │
│ Display Success │                           │
│ Message         │                           │
└────────┬────────┘                           │
         │                                    │
         └────────────────┬───────────────────┘
                          │
                          ▼
                   Return to Menu
```

---

## ID Generation Strategy

**Approach**: Sequential counter, never reused

```python
class TaskRepository:
    def __init__(self):
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add(self, description: str) -> Task:
        # Validate description
        validated = self._validate_description(description)

        # Create task with current ID
        task = Task(id=self._next_id, description=validated)

        # Store and increment counter
        self._tasks[self._next_id] = task
        self._next_id += 1

        return task
```

**Guarantees**:
- IDs start at 1 (FR-002)
- IDs are unique and sequential
- Deleted IDs are never reused (FR-014)
- Counter monotonically increases

---

## Input Validation

### Description Validation

```python
def _validate_description(self, description: str) -> str:
    """Validate and normalize task description."""
    if not description or not description.strip():
        raise InvalidDescriptionError("cannot be empty")

    stripped = description.strip()

    if len(stripped) > 500:
        # Truncate with warning (per spec edge case)
        print("Warning: Description truncated to 500 characters")
        return stripped[:500]

    return stripped
```

### ID Input Validation

```python
def get_task_id_input(prompt: str) -> int | None:
    """Get and validate task ID from user."""
    user_input = input(prompt).strip()
    try:
        return int(user_input)
    except ValueError:
        display_error("Please enter a valid numeric ID")
        return None
```

---

## Testing Strategy

### Unit Tests

**Task Model** (`tests/unit/test_task.py`):
- Task creation with valid attributes
- Default is_complete value
- Task equality

**Task Repository** (`tests/unit/test_task_repository.py`):
- Add task with valid description
- Add task with invalid description (empty, whitespace)
- Add multiple tasks (ID sequence)
- Get existing task
- Get non-existent task
- Get all tasks (empty, with tasks)
- Update existing task
- Update non-existent task
- Delete existing task
- Delete non-existent task
- Toggle complete on existing task
- Toggle complete on non-existent task
- ID preservation after deletion

### Integration Tests

**CLI Flow** (`tests/integration/test_cli.py`):
- Full add-view cycle
- Full CRUD cycle
- Error handling for invalid inputs
- Menu loop behavior
- Exit behavior

---

## Complexity Tracking

> No constitution violations requiring justification.

| Check | Status | Notes |
|-------|--------|-------|
| Architecture layers | ✅ 3 layers | Minimum for SoC compliance |
| External dependencies | ✅ 0 | Standard library only |
| Feature count | ✅ 5 | Per specification |
| File count | ✅ ~10 | Reasonable for scope |

---

## Implementation Order

1. **Models** (no dependencies)
   - `src/models/task.py`
   - `src/services/exceptions.py`

2. **Services** (depends on models)
   - `src/services/task_repository.py`

3. **CLI** (depends on services)
   - `src/cli/menu.py`
   - `src/cli/handlers.py`

4. **Entry Point** (depends on all)
   - `src/main.py`

5. **Tests** (parallel with implementation)
   - Unit tests after each component
   - Integration tests after CLI

---

## Artifacts Generated

| Artifact | Path | Purpose |
|----------|------|---------|
| Research | `specs/001-phase-i-todo-cli/research.md` | Design decisions |
| Data Model | `specs/001-phase-i-todo-cli/data-model.md` | Entity definitions |
| Quickstart | `specs/001-phase-i-todo-cli/quickstart.md` | Usage guide |
| Plan | `specs/001-phase-i-todo-cli/plan.md` | This document |

---

## Next Steps

Run `/sp.tasks` to generate implementation tasks from this plan.
