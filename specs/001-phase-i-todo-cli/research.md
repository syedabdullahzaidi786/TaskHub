# Research: Phase I - Todo CLI Application

**Feature**: 001-phase-i-todo-cli
**Date**: 2024-12-24
**Status**: Complete

## Overview

This document captures research findings for implementing the Phase I Todo CLI application. Given the constrained scope (in-memory, single-user, Python standard library only), research focused on design patterns and Python best practices rather than technology selection.

---

## Research Topics

### 1. In-Memory Data Structure for Task Storage

**Decision**: Use a Python `dict` with task ID as key

**Rationale**:
- O(1) lookup by ID for update, delete, toggle operations
- O(n) iteration for view all tasks (acceptable for scope of 1000 tasks)
- Simple to implement and maintain
- Native Python data structure, no dependencies

**Alternatives Considered**:

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| `list` | Simple iteration | O(n) lookup by ID | Rejected - slow lookups |
| `dict` | O(1) lookup, simple | Unordered (Python 3.7+ maintains insertion order) | **Selected** |
| `OrderedDict` | Explicit ordering | Unnecessary in Python 3.7+ | Rejected - redundant |
| Custom class with list | Full control | Over-engineered for Phase I | Rejected - complexity |

---

### 2. Task ID Generation Strategy

**Decision**: Sequential integer counter starting at 1, never reused

**Rationale**:
- Meets FR-002: Unique sequential integer ID starting from 1
- Meets FR-014: IDs preserved after deletion (no renumbering)
- Simple implementation with a single integer counter
- Counter increments on each add, never decrements

**Implementation**:
```
class TaskRepository:
    _next_id: int = 1

    def add(self, description: str) -> Task:
        task = Task(id=self._next_id, description=description)
        self._next_id += 1
        return task
```

**Alternatives Considered**:

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Sequential counter | Simple, predictable | Gaps after deletion | **Selected** |
| UUID | Globally unique | Not user-friendly, overkill | Rejected |
| Reuse deleted IDs | No gaps | Complex, violates FR-014 | Rejected |
| Timestamp-based | Unique | Not sequential, not user-friendly | Rejected |

---

### 3. Application Architecture Pattern

**Decision**: Three-layer architecture (Model, Repository, CLI)

**Rationale**:
- Aligns with Constitution V (Quality Principles): Separation of Concerns
- Enables independent testing of each layer
- Clean boundary between data, business logic, and presentation
- Supports future extensibility without current over-engineering

**Layers**:

1. **Model Layer** (`models/task.py`):
   - `Task` dataclass with id, description, is_complete
   - Pure data structure, no behavior

2. **Repository Layer** (`services/task_repository.py`):
   - `TaskRepository` class managing task storage
   - CRUD operations: add, get, get_all, update, delete, toggle_complete
   - ID generation logic
   - Validation logic

3. **CLI Layer** (`cli/menu.py`, `cli/handlers.py`):
   - Menu display and input handling
   - User interaction flow
   - Error message formatting

**Alternatives Considered**:

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Single file | Simplest | Hard to test, violates SoC | Rejected |
| Two layers (Model + CLI) | Simpler | Business logic in CLI | Rejected |
| Three layers | Clean separation | Slightly more files | **Selected** |
| Full Clean Architecture | Maximum flexibility | Over-engineered for Phase I | Rejected |

---

### 4. Input Validation Strategy

**Decision**: Validate at repository layer, report errors to CLI layer

**Rationale**:
- Single point of validation (DRY principle)
- Repository protects data integrity
- CLI handles user-facing error messages
- Clear error types enable appropriate messaging

**Validation Rules** (from spec):
- Description: non-empty, non-whitespace, max 500 chars
- Task ID: must exist in repository for update/delete/toggle

**Error Handling Pattern**:
```
class TaskNotFoundError(Exception): pass
class InvalidDescriptionError(Exception): pass

# Repository raises exceptions
# CLI catches and displays user-friendly messages
```

---

### 5. CLI Menu Loop Pattern

**Decision**: While loop with dispatch dictionary

**Rationale**:
- Clean, readable control flow
- Easy to add/modify menu options
- Single exit point via return/break
- Handles invalid input gracefully

**Pattern**:
```python
def run():
    handlers = {
        "1": handle_add,
        "2": handle_view,
        "3": handle_update,
        "4": handle_delete,
        "5": handle_toggle,
        "6": handle_exit
    }

    while True:
        display_menu()
        choice = input("Select: ")
        handler = handlers.get(choice)
        if handler:
            if handler() == "EXIT":
                break
        else:
            print("Invalid option")
```

---

### 6. Testing Approach

**Decision**: Unit tests with pytest, integration tests for CLI

**Rationale**:
- pytest is Python standard (though we'll use unittest from stdlib per NFR-003)
- Correction: Use `unittest` from Python standard library to comply with NFR-003
- Unit tests for Task model and TaskRepository
- Integration tests for full CLI flow using stdin/stdout mocking

**Test Structure**:
```
tests/
├── unit/
│   ├── test_task.py           # Task model tests
│   └── test_task_repository.py # Repository tests
└── integration/
    └── test_cli.py            # Full CLI flow tests
```

---

## Resolved Clarifications

| Item | Question | Resolution |
|------|----------|------------|
| Data structure | List vs Dict? | Dict for O(1) ID lookup |
| ID strategy | Reuse or preserve? | Preserve (per FR-014) |
| Architecture | Single file or layered? | Three-layer for clean separation |
| Validation | Where to validate? | Repository layer |
| Testing | External deps allowed? | No, use unittest (stdlib) |

---

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Storage | `dict[int, Task]` | O(1) lookup by ID |
| ID generation | Sequential counter, never reuse | Simple, meets FR-002/FR-014 |
| Architecture | Model → Repository → CLI | Separation of concerns |
| Validation | Repository layer | Single point of truth |
| Error handling | Custom exceptions | Clean error propagation |
| Menu pattern | While loop + dispatch dict | Readable, maintainable |
| Testing | unittest (stdlib) | No external dependencies |

---

## Dependencies

**Runtime**:
- Python 3.11+ (per NFR-001, spec assumption)
- Standard library only (per NFR-003)

**Development** (optional, not required):
- None required; unittest is sufficient

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Memory exhaustion with many tasks | Application crash | NFR-005 scopes to 1000 tasks; dict is efficient |
| Input encoding issues | Display errors | Accept unicode; Python 3 handles natively |
| Long-running session | Memory growth | Acceptable for Phase I; persistence in future phases |
