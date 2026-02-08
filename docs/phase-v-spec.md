# Phase V Specification: Advanced Cloud Deployment & Event-Driven Architecture

## 1. Advanced Features

### 1.1 Recurring Tasks
- **Requirement**: Users can create tasks that repeat on a schedule (daily, weekly, monthly, yearly).
- **Implementation**:
  - Dapr Jobs API or a dedicated scheduling service.
  - Recurrence rules stored in the database (e.g., using RRule standard or custom JSON).
  - When a task is completed, if it has a recurrence rule, the system schedules the next occurrence.
  - "Next Occurrence" is a new task instance.

### 1.2 Due Dates & Reminders
- **Requirement**: Tasks can have due dates and optional reminders.
- **Implementation**:
  - `due_date` field in Todo model (timestamp).
  - `reminder_at` field in Todo model (timestamp).
  - Notification logic triggers when `reminder_at` time is reached.
  - Use Dapr Jobs API (scheduled events) to trigger reminders.
  - Notification delivery channel: Initially just log/console or a simple "Notification" table, extensible to Email/Push later.

### 1.3 Priorities, Tags, Search, Filter, Sort
- **Data Model Updates**:
  - `priority`: Enum (Low, Medium, High, Urgent). Default: Medium.
  - `tags`: List of strings (e.g., ["work", "personal"]). Stored as JSONB or array in Postgres.
- **API Updates**:
  - `GET /todos` accepts query parameters:
    - `priority`: Filter by priority.
    - `tag`: Filter by tag.
    - `search`: Text search in title/description.
    - `sort_by`: `due_date`, `priority`, `created_at`.
    - `order`: `asc`, `desc`.

## 2. Event-Driven Architecture (Kafka)

### 2.1 Overview
Decouple task operations from side effects (notifications, analytics, audit logs) using Kafka.

### 2.2 Topics & Events

#### Topic: `task-events`
- **Purpose**: Domain events for task lifecycle.
- **Producer**: Backend API (FastAPI)
- **Events**:
  - `TaskCreated`: Triggered when a new task is added.
  - `TaskCompleted`: Triggered when a task status changes to done.
  - `TaskDeleted`: Triggered when a task is removed.
  - `TaskUpdated`: General updates (title, desc change).

**Event Schema (JSON Example)**:
```json
{
  "event_id": "uuid",
  "event_type": "TaskCreated",
  "timestamp": "2023-10-27T10:00:00Z",
  "payload": {
    "task_id": 1,
    "user_id": 123,
    "title": "Buy milk",
    "due_date": "..."
  }
}
```

#### Topic: `reminders`
- **Purpose**: Triggering notifications.
- **Producer**: Scheduler Service (or Backend via Dapr Jobs).
- **Consumer**: Notification Service (logical component).
- **Payload**:
```json
{
  "user_id": 123,
  "task_id": 1,
  "message": "Task 'Buy milk' is due in 30 mins"
}
```

#### Topic: `task-updates`
- **Purpose**: Real-time state synchronization (WebSocket push).
- **Producer**: Backend API.
- **Consumer**: WebSocket Service (frontend subscription).

## 3. Dapr Integration

### 3.1 Components
All interaction with Kafka and State Store will be mediated by Dapr Sidecars.

#### Pub/Sub (Kafka)
- **Component Name**: `pubsub`
- **Type**: `pubsub.kafka`
- **Metadata**: Brokers, auth.

#### State Store
- **Component Name**: `statestore`
- **Type**: `state.redis` (for local dev/caching) or `state.postgresql` (if persisting state in same DB).
- **Usage**:
  - Idempotency keys for event processing.
  - Caching ephemeral data.

#### Service Invocation
- **Usage**: API to Internal Services communication (if splitting into microservices later, currently monolithic backend but designed for split).
- **Pattern**: Frontend ->/api/todos-> Backend. Dapr not strictly needed for frontend-to-backend REST yet, but useful for Backend->Scheduler calls.

#### Jobs API
- **Usage**: Scheduling reminders and recurring tasks.
- **Component**: `scheduler` (Dapr internal scheduler).

#### Secrets
- **Component**: `kubernetes` secret store.
- **Usage**: Accessing DB credentials, Kafka API keys.

## 4. Deployment Targets

### 4.1 Local (Minikube)
- **Setup**:
  - Minikube cluster.
  - Dapr initialized (`dapr init -k`).
  - Kafka (Strimzi) or Redpanda deployed via Helm in cluster.
  - Postgres (Neon) external connection strings in Secrets.
  - Application via Helm Chart.

### 4.2 Cloud (AKS/GKE/OKE - Cloud Ready)
- **Configuration**:
  - External Kafka (Confluent/Redpanda Cloud) config injection.
  - Managed Dapr (if available) or self-hosted Dapr on cluster.
  - Ingress Controller for public access.
  - SSL/TLS termination.

## 5. Security & Observability Scope
- **Auth**: Continue using JWT from Phase IV.
- **Tracing**: Zipkin/Jaeger enabled in Dapr for distributed tracing.
- **Metrics**: Dapr metrics to Prometheus/Grafana.
