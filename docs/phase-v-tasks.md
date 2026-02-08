# Phase V Implementation Tasks

## 1. Database & Models (Backend)
- [x] Update `backend/src/models/todo.py` <!-- id: 1 -->
    - [x] Add `due_date: Optional[datetime] = Field(default=None)`
    - [x] Add `reminder_at: Optional[datetime] = Field(default=None)`
    - [x] Add `is_recurring: bool = Field(default=False)`
    - [x] Add `recurrence_interval: Optional[str] = Field(default=None)`
    - [x] Add `priority: str = Field(default="medium")`
    - [x] Add `tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))`
- [x] Create Database Migration <!-- id: 2 -->
    - [x] Run `alembic revision --autogenerate -m "Add Phase V fields"`
    - [x] Verify migration script
    - [x] Apply migration `alembic upgrade head`

## 2. Infrastructure & Dapr Configuration
- [x] Create `backend/components/pubsub.yaml` <!-- id: 3 -->
    - [x] Configure `pubsub.kafka` (or Redis fallback for local)
    - [x] Set topic `task-events`
- [x] Create `backend/components/statestore.yaml` <!-- id: 4 -->
    - [x] Configure `state.redis`

## 3. Backend Implementation
- [x] Create `backend/src/schemas/events.py` <!-- id: 5 -->
    - [x] Define `TaskCreatedEvent`, `TaskUpdatedEvent`, `TaskCompletedEvent`
- [x] Create `backend/src/utils/events.py` <!-- id: 6 -->
    - [x] Implement `publish_event(topic, payload)` using Dapr Client
- [x] Update `backend/src/api/todos.py` <!-- id: 7 -->
    - [x] Inject `publish_event` in `create_todo`, `update_todo`, `delete_todo`
    - [x] Add query params to `read_todos` for filtering/sorting
- [x] Create `backend/src/api/events.py` <!-- id: 8 -->
    - [x] Implement `/subscribe` Dapr subscription endpoint
    - [x] Implement event handler for `task-events`
- [x] Implement Recurring Logic in Event Handler <!-- id: 9 -->
    - [x] On `TaskCompleted`, check `is_recurring`
    - [x] If true, calculate next date and create new task

## 4. Frontend Implementation
- [x] Update `frontend/src/types/todo.ts` <!-- id: 10 -->
    - [x] Add new fields
- [x] Update `frontend/src/components/TaskModal.tsx` <!-- id: 11 -->
    - [x] Add DatePicker for `due_date`
    - [x] Add Select for `priority` and `recurrence`
- [x] Update `frontend/src/app/todos/page.tsx` <!-- id: 12 -->
    - [x] Add Filter/Sort controls
    - [x] Display badges on Todo items

## 5. Verification
- [ ] Run `docker compose up` <!-- id: 13 -->
- [ ] Create a recurring task via UI <!-- id: 14 -->
- [ ] Complete the task <!-- id: 15 -->
- [ ] Verify new task creation via events <!-- id: 16 -->
