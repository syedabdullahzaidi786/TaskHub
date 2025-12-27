# Quickstart: Phase I - Todo CLI Application

**Feature**: 001-phase-i-todo-cli
**Date**: 2024-12-24

## Prerequisites

- Python 3.11 or higher installed
- Terminal/command prompt access

## Running the Application

```bash
# From repository root
python -m src.main

# Or directly
python src/main.py
```

## Basic Usage

### 1. Start the Application

```
============================
      TODO APPLICATION
============================
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Complete
6. Exit
============================
Select an option (1-6):
```

### 2. Add Your First Task

```
Select an option (1-6): 1
Enter task description: Buy groceries
> Task added successfully with ID: 1
```

### 3. View Your Tasks

```
Select an option (1-6): 2
============================
        YOUR TASKS
============================
[1] [ ] Buy groceries
============================
Total: 1 tasks (0 complete, 1 incomplete)
```

### 4. Mark Task Complete

```
Select an option (1-6): 5
Enter task ID to toggle: 1
> Task 1 marked as complete
```

### 5. Verify Completion

```
Select an option (1-6): 2
============================
        YOUR TASKS
============================
[1] [X] Buy groceries
============================
Total: 1 tasks (1 complete, 0 incomplete)
```

### 6. Exit

```
Select an option (1-6): 6
Goodbye!
```

## Common Operations

| Goal | Steps |
|------|-------|
| Add a task | Select 1 → Enter description |
| See all tasks | Select 2 |
| Edit a task | Select 3 → Enter ID → Enter new description |
| Remove a task | Select 4 → Enter ID |
| Mark done/undone | Select 5 → Enter ID |
| Quit | Select 6 |

## Error Handling

| Scenario | What Happens |
|----------|--------------|
| Empty description | Error message, task not created |
| Invalid task ID | Error message, operation cancelled |
| Invalid menu choice | Warning, menu redisplays |

## Important Notes

- **No persistence**: Tasks are lost when you exit the application
- **Single session**: One user at a time
- **IDs are permanent**: Deleted task IDs are not reused

## Running Tests

```bash
# From repository root
python -m unittest discover -s tests -p "test_*.py"
```

## Project Structure

```
src/
├── main.py              # Entry point
├── models/
│   └── task.py          # Task dataclass
├── services/
│   └── task_repository.py # Task storage and operations
└── cli/
    ├── menu.py          # Menu display
    └── handlers.py      # Input handling

tests/
├── unit/
│   ├── test_task.py
│   └── test_task_repository.py
└── integration/
    └── test_cli.py
```
