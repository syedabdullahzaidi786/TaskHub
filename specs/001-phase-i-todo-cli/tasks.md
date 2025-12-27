# Tasks: Phase I - Todo CLI Application

**Input**: Design documents from `/specs/001-phase-i-todo-cli/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md, quickstart.md
**Branch**: `001-phase-i-todo-cli`
**Date**: 2024-12-24

**Tests**: Unit and integration tests included as per plan.md testing strategy.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md structure)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Spec Reference**: NFR-001 (Python console app), NFR-003 (standard library only)
**Plan Reference**: Project Structure section

- [x] T001 Create project directory structure per plan.md in src/ and tests/
- [x] T002 [P] Create src/__init__.py for package initialization
- [x] T003 [P] Create src/models/__init__.py for models package
- [x] T004 [P] Create src/services/__init__.py for services package
- [x] T005 [P] Create src/cli/__init__.py for CLI package
- [x] T006 [P] Create tests/__init__.py for tests package
- [x] T007 [P] Create tests/unit/__init__.py for unit tests package
- [x] T008 [P] Create tests/integration/__init__.py for integration tests package
- [x] T009 Create .gitignore with Python patterns (__pycache__/, *.pyc, .venv/, etc.)

**Checkpoint**: Project structure ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Spec Reference**: FR-008, FR-009, FR-010 (validation and error handling)
**Plan Reference**: Component Specifications sections 1-2

### Model Layer

- [x] T010 [P] Create Task dataclass in src/models/task.py with id, description, is_complete attributes
- [x] T011 [P] Create TaskNotFoundError exception in src/services/exceptions.py
- [x] T012 [P] Create InvalidDescriptionError exception in src/services/exceptions.py

### Service Layer Core

- [x] T013 Create TaskRepository class skeleton in src/services/task_repository.py with _tasks dict and _next_id counter
- [x] T014 Implement _validate_description() method in src/services/task_repository.py for FR-008

### CLI Display Layer

- [x] T015 [P] Create display_menu() function in src/cli/menu.py per spec CLI Interaction Flow
- [x] T016 [P] Create display_message() function in src/cli/menu.py for success messages
- [x] T017 [P] Create display_error() function in src/cli/menu.py for error messages

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Add a New Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new tasks with descriptions and unique sequential IDs

**Spec Reference**: User Story 1 (spec.md lines 36-51), FR-001, FR-002, FR-003
**Plan Reference**: TaskRepository.add(), handle_add()

**Independent Test**: Run app → Select "1" → Enter description → Verify success message with ID

### Implementation for User Story 1

- [x] T018 [US1] Implement add() method in src/services/task_repository.py (creates Task, assigns ID, stores, increments counter)
- [x] T019 [US1] Implement handle_add() function in src/cli/handlers.py (prompts for description, calls repo.add(), displays result)
- [x] T020 [US1] Add empty description validation in handle_add() to display error per FR-008

### Unit Tests for User Story 1

- [x] T021 [P] [US1] Create test_task.py in tests/unit/ with Task dataclass tests
- [x] T022 [P] [US1] Create test_task_repository.py in tests/unit/ with add() method tests (valid, empty, whitespace, sequential IDs)

**Checkpoint**: User Story 1 complete - can add tasks with validation

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Enable users to view all tasks with ID, description, and completion status

**Spec Reference**: User Story 2 (spec.md lines 54-69), FR-004
**Plan Reference**: TaskRepository.get_all(), display_tasks(), handle_view()

**Independent Test**: Add tasks → Select "2" → Verify formatted list with [ID] [X/] description

### Implementation for User Story 2

- [x] T023 [US2] Implement get_all() method in src/services/task_repository.py (returns list of all tasks)
- [x] T024 [US2] Implement count() method in src/services/task_repository.py (returns complete/incomplete counts)
- [x] T025 [US2] Implement display_tasks() function in src/cli/menu.py (formats task list per spec CLI flow)
- [x] T026 [US2] Implement handle_view() function in src/cli/handlers.py (gets tasks, displays formatted list or empty message)

### Unit Tests for User Story 2

- [x] T027 [P] [US2] Add get_all() tests to tests/unit/test_task_repository.py (empty, with tasks)
- [x] T028 [P] [US2] Add count() tests to tests/unit/test_task_repository.py

**Checkpoint**: User Stories 1 & 2 complete - can add and view tasks

---

## Phase 5: User Story 3 - Update Task Description (Priority: P2)

**Goal**: Enable users to update a task's description by ID

**Spec Reference**: User Story 3 (spec.md lines 72-87), FR-005, FR-009
**Plan Reference**: TaskRepository.update(), handle_update()

**Independent Test**: Add task → Select "3" → Enter ID → Enter new description → View to verify change

### Implementation for User Story 3

- [x] T029 [US3] Implement get() method in src/services/task_repository.py (returns Task or None by ID)
- [x] T030 [US3] Implement update() method in src/services/task_repository.py (validates ID exists, validates description, updates)
- [x] T031 [US3] Implement get_task_id_input() helper in src/cli/handlers.py (prompts for ID, validates numeric)
- [x] T032 [US3] Implement handle_update() function in src/cli/handlers.py (prompts ID/description, calls repo.update(), handles errors)

### Unit Tests for User Story 3

- [x] T033 [P] [US3] Add get() tests to tests/unit/test_task_repository.py (exists, not exists)
- [x] T034 [P] [US3] Add update() tests to tests/unit/test_task_repository.py (valid, invalid ID, invalid description)

**Checkpoint**: User Story 3 complete - can update task descriptions

---

## Phase 6: User Story 4 - Delete a Task (Priority: P2)

**Goal**: Enable users to delete a task by ID with ID preservation (no renumbering)

**Spec Reference**: User Story 4 (spec.md lines 90-105), FR-006, FR-009, FR-014
**Plan Reference**: TaskRepository.delete(), handle_delete()

**Independent Test**: Add tasks → Delete one → View to verify removal → Add new task → Verify ID not reused

### Implementation for User Story 4

- [x] T035 [US4] Implement delete() method in src/services/task_repository.py (validates ID exists, removes from dict)
- [x] T036 [US4] Implement handle_delete() function in src/cli/handlers.py (prompts ID, calls repo.delete(), handles errors)

### Unit Tests for User Story 4

- [x] T037 [P] [US4] Add delete() tests to tests/unit/test_task_repository.py (valid, invalid ID, ID preservation check)

**Checkpoint**: User Story 4 complete - can delete tasks with ID preservation

---

## Phase 7: User Story 5 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: Enable users to toggle a task's completion status

**Spec Reference**: User Story 5 (spec.md lines 108-123), FR-007, FR-009
**Plan Reference**: TaskRepository.toggle_complete(), handle_toggle()

**Independent Test**: Add task → Toggle → View to verify [X] → Toggle again → Verify [ ]

### Implementation for User Story 5

- [x] T038 [US5] Implement toggle_complete() method in src/services/task_repository.py (validates ID, flips is_complete)
- [x] T039 [US5] Implement handle_toggle() function in src/cli/handlers.py (prompts ID, calls repo.toggle_complete(), displays status)

### Unit Tests for User Story 5

- [x] T040 [P] [US5] Add toggle_complete() tests to tests/unit/test_task_repository.py (incomplete→complete, complete→incomplete, invalid ID)

**Checkpoint**: User Story 5 complete - can toggle completion status

---

## Phase 8: User Story 6 - Exit Application (Priority: P3)

**Goal**: Enable users to exit the application gracefully

**Spec Reference**: User Story 6 (spec.md lines 126-139), FR-012
**Plan Reference**: handle_exit(), main loop

**Independent Test**: Run app → Select "6" → Verify "Goodbye!" and termination

### Implementation for User Story 6

- [x] T041 [US6] Implement handle_exit() function in src/cli/handlers.py (prints "Goodbye!", returns "EXIT" signal)
- [x] T042 [US6] Create main() function in src/main.py with menu loop and handler dispatch
- [x] T043 [US6] Add invalid menu option handling in src/main.py (displays error per FR-010)

**Checkpoint**: User Story 6 complete - full application loop functional

---

## Phase 9: Integration & Polish

**Purpose**: Integration tests and cross-cutting concerns

**Spec Reference**: Edge Cases section, Success Criteria SC-001 through SC-006
**Plan Reference**: Testing Strategy - Integration Tests

### Integration Tests

- [x] T044 [P] Create test_cli.py in tests/integration/ with full add-view cycle test
- [x] T045 [P] Add CRUD cycle integration test to tests/integration/test_cli.py
- [x] T046 [P] Add error handling integration tests to tests/integration/test_cli.py (invalid ID, empty description)

### Final Validation

- [x] T047 Verify all acceptance scenarios pass per spec.md User Stories
- [x] T048 Run quickstart.md validation (manual walkthrough)
- [x] T049 Verify application handles 100+ sequential operations per SC-004

**Checkpoint**: Phase I complete - all acceptance criteria verified

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)           → No dependencies
Phase 2 (Foundational)    → Depends on Phase 1
Phase 3 (US1: Add)        → Depends on Phase 2
Phase 4 (US2: View)       → Depends on Phase 2, benefits from Phase 3
Phase 5 (US3: Update)     → Depends on Phase 2
Phase 6 (US4: Delete)     → Depends on Phase 2
Phase 7 (US5: Toggle)     → Depends on Phase 2
Phase 8 (US6: Exit)       → Depends on Phases 3-7 (integrates all handlers)
Phase 9 (Integration)     → Depends on all user stories
```

### User Story Dependencies

- **US1 (Add)**: Foundation only - No dependencies on other stories
- **US2 (View)**: Foundation + needs tasks to exist (benefits from US1)
- **US3 (Update)**: Foundation + get() method (can parallel with US1/US2)
- **US4 (Delete)**: Foundation only - Can parallel with US1-3
- **US5 (Toggle)**: Foundation only - Can parallel with US1-4
- **US6 (Exit)**: Requires all handlers to exist for main loop integration

### Within Each User Story

1. Repository method implementation first
2. CLI handler implementation second
3. Unit tests can parallel with implementation
4. Story complete when handler works end-to-end

### Parallel Opportunities

- T002-T008: All __init__.py files can be created in parallel
- T010-T012: Task model and exceptions can be created in parallel
- T015-T017: Display functions can be created in parallel
- T021-T022, T027-T028, T033-T034, T037, T040: Unit tests within each story
- T044-T046: Integration tests can run in parallel

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: Add Task (US1)
4. Complete Phase 4: View Tasks (US2)
5. **STOP and VALIDATE**: Can add and view tasks
6. Continue with remaining stories

### Incremental Delivery

```
Setup → Foundation → US1 (Add) → US2 (View) → [MVP CHECKPOINT]
                                     ↓
                   US3 (Update) → US4 (Delete) → US5 (Toggle)
                                     ↓
                              US6 (Exit/Main Loop)
                                     ↓
                              Integration Tests
```

---

## Task Summary

| Phase | Tasks | Parallel Tasks | Story |
|-------|-------|----------------|-------|
| 1: Setup | T001-T009 | 7 | - |
| 2: Foundational | T010-T017 | 6 | - |
| 3: US1 Add | T018-T022 | 2 | US1 |
| 4: US2 View | T023-T028 | 2 | US2 |
| 5: US3 Update | T029-T034 | 2 | US3 |
| 6: US4 Delete | T035-T037 | 1 | US4 |
| 7: US5 Toggle | T038-T040 | 1 | US5 |
| 8: US6 Exit | T041-T043 | 0 | US6 |
| 9: Polish | T044-T049 | 3 | - |

**Total Tasks**: 49
**Parallel Opportunities**: 24 tasks can run in parallel within their phases

---

## Requirement Traceability

| Requirement | Tasks |
|-------------|-------|
| FR-001 (Add tasks) | T018, T019 |
| FR-002 (Sequential IDs) | T013, T018 |
| FR-003 (Default incomplete) | T010, T018 |
| FR-004 (View tasks) | T023, T024, T025, T026 |
| FR-005 (Update task) | T029, T030, T032 |
| FR-006 (Delete task) | T035, T036 |
| FR-007 (Toggle complete) | T038, T039 |
| FR-008 (Validate description) | T014, T019, T020 |
| FR-009 (Validate ID exists) | T029, T030, T035, T038 |
| FR-010 (Error messages) | T016, T017, T043 |
| FR-011 (Menu interface) | T015, T042 |
| FR-012 (Exit gracefully) | T041, T042 |
| FR-013 (In-memory only) | T013 |
| FR-014 (Preserve IDs) | T013, T035 |

---

## Notes

- All tasks reference specific files per plan.md Project Structure
- [P] tasks can run in parallel within their phase
- [USn] labels map tasks to user stories for traceability
- Each checkpoint validates independent story functionality
- Commit after each completed task or logical group
- Run unit tests after each story phase before proceeding
