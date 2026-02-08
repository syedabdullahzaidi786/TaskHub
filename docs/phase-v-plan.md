# Phase V Implementation Plan

## Goal
Enable recurring tasks, reminders, and event-driven architecture using Kafka and Dapr, as defined in `docs/phase-v-spec.md`.

## 1. Database & Models (Backend)
### Todo Model Updates
- Add `due_date` (DateTime, optional)
- Add `reminder_at` (DateTime, optional)
- Add `is_recurring` (Boolean, default False)
- Add `recurrence_interval` (String, optional - e.g., "daily", "weekly")
- Add `priority` (Enum: low, medium, high, urgent)
- Add `tags` (JSON/Array of strings)

### Migrations
- Generate Alembic migration for the new fields.

## 2. Infrastructure & Dapr Configuration
### Dapr Components
Create component files in `backend/components/` (or strictly in Helm charts for deployment, but local run needs them too).
1.  **Pub/Sub (`pubsub.yaml`)**:
    -   Type: `pubsub.kafka` (or `pubsub.redis` for local simplicity if Kafka is too heavy for dev, but spec says Kafka).
    -   Topic: `task-events`.
2.  **Statestore (`statestore.yaml`)**:
    -   Type: `state.redis`.
3.  **Bindings/Jobs**:
    -   Define a binding or use Dapr Jobs API for scheduled triggers.

## 3. Backend Implementation
### Event Schemas
- Create Pydantic models for events (`TaskCreatedEvent`, `TaskUpdatedEvent`, etc.) in `src/schemas/events.py`.

### Event Producer
- Create `src/utils/events.py`: Helper to publish events using Dapr SDK (`dapr-python-sdk`).
- Inject event publishing into `src/api/todos.py` (CRUD endpoints).

### Event Consumer (Processor)
- Create a new route/controller `src/api/events.py`.
- Subscribe to `task-events` topic.
- Implement handlers (e.g., just logging for now, or updating a "History" table).

### Recurring Task Engine
- Implement logic to check for recurring tasks.
- **Option A (Simpler)**: On `TaskCompleted` event, check `is_recurring`. If true, create a NEW task with new due date.
- **Option B (Robust)**: Use Dapr Jobs API to schedule the creation.
- *Decision*: Start with Option A (Event-driven recurrence) as it fits the "Event-driven" theme perfectly.

### Search & Filter API
- Update `GET /todos` in `src/api/todos.py` to support `priority`, `search`, `sort_by`.

## 4. Frontend Implementation
### UI Components
- **Todo Input**: Add date picker for Due Date, Select for Priority/Recurrence.
- **Todo List**: Show badges for Priority/Tags.
- **Filter Bar**: Add controls to filter by Priority/Tag and Sort.

### State Management
- Update API client to send new fields.
- (Optional) simple polling or SSE for "Real-time" updates if time provides.

## 5. Verification
- **Local (Docker/Minikube)**:
  - Run Kafka.
  - Run Dapr sidecar.
  - Verify messages in Kafka UI / logs.
  - Verify database updates.
