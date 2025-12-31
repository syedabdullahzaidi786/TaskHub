# Phase 1: Data Model

**Feature**: Phase II Full-Stack Todo Web Application
**Date**: 2025-12-27
**Purpose**: Define database schema, entities, relationships, and validation rules

## Overview

This document defines the data model for Phase II, including database tables, field specifications, relationships, indexes, and constraints. The model supports user authentication and todo management with strict data isolation.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────┐
│           users                 │
├─────────────────────────────────┤
│ id (UUID, PK)                   │
│ email (VARCHAR, UNIQUE, NOT NULL│
│ password_hash (VARCHAR, NOT NULL│
│ created_at (TIMESTAMP)          │
└─────────────────────────────────┘
          │
          │ 1
          │
          │ *
          ▼
┌─────────────────────────────────┐
│           todos                 │
├─────────────────────────────────┤
│ id (UUID, PK)                   │
│ user_id (UUID, FK → users.id)   │
│ title (VARCHAR(200), NOT NULL)  │
│ description (TEXT, NULLABLE)    │
│ completed (BOOLEAN, DEFAULT F)  │
│ created_at (TIMESTAMP)          │
│ updated_at (TIMESTAMP)          │
└─────────────────────────────────┘

Relationship: One User has Many Todos (1:*)
Cascade: ON DELETE CASCADE (deleting user deletes their todos)
```

---

## Entities

### 1. User Entity

**Purpose**: Represents a registered user account with authentication credentials.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier (non-sequential for security) |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User's email address (used for signin) |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password (Better Auth handles hashing) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |

**Validation Rules**:
- **Email**:
  - Must be valid email format (regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
  - Must be unique across all users
  - Case-insensitive uniqueness (store lowercased)
  - Max length: 255 characters
- **Password** (before hashing):
  - Minimum 8 characters (FR-003)
  - No maximum length constraint (hashed output is fixed)
  - Better Auth enforces additional strength requirements

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_users_email ON users(LOWER(email));
```

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255, sa_column_kwargs={"nullable": False})
    password_hash: str = Field(max_length=255, sa_column_kwargs={"nullable": False})
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"nullable": False})
```

**State Transitions**:
- **Created**: User registers (email + password) → User record inserted
- **Authenticated**: User signs in → Session created (Better Auth manages)
- **Deleted**: User deletes account → User record deleted (CASCADE deletes todos)

---

### 2. Todo Entity

**Purpose**: Represents a task item owned by a user with completion tracking.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique todo identifier |
| `user_id` | UUID | FOREIGN KEY → users(id), NOT NULL, INDEX | Owner of this todo (enforces data isolation) |
| `title` | VARCHAR(200) | NOT NULL, CHECK(LENGTH(title) > 0) | Todo title (required) |
| `description` | TEXT | NULLABLE | Optional detailed description |
| `completed` | BOOLEAN | DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Todo creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last modification timestamp |

**Validation Rules**:
- **Title**:
  - Required (NOT NULL)
  - Min length: 1 character (after trimming whitespace)
  - Max length: 200 characters (FR-011, Assumption 8)
  - Cannot be empty string or whitespace-only
- **Description**:
  - Optional (can be NULL)
  - Max length: 2000 characters when provided (Assumption 8)
- **Completed**:
  - Boolean (true/false)
  - Defaults to false on creation
- **User ID**:
  - Must reference valid user in `users` table
  - Cannot be NULL
  - Automatically set from authenticated session (never from frontend)

**Indexes**:
```sql
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_user_id_completed ON todos(user_id, completed);
```
- **idx_todos_user_id**: Speeds up "get all todos for user" queries
- **idx_todos_user_id_completed**: Speeds up filtered queries (e.g., "get incomplete todos for user")

**Foreign Key Constraint**:
```sql
ALTER TABLE todos
ADD CONSTRAINT fk_todos_user_id
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;
```
- **ON DELETE CASCADE**: When user is deleted, all their todos are automatically deleted
- Ensures referential integrity and prevents orphaned todos

**SQLModel Definition**:
```python
class Todo(SQLModel, table=True):
    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True, sa_column_kwargs={"nullable": False})
    title: str = Field(max_length=200, sa_column_kwargs={"nullable": False})
    description: str | None = Field(default=None, max_length=2000)
    completed: bool = Field(default=False, sa_column_kwargs={"nullable": False})
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"nullable": False})
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"nullable": False})
```

**State Transitions**:
- **Created**: User creates todo → Todo record inserted with `completed=false`
- **Updated**: User edits title/description → `updated_at` timestamp updated
- **Toggled**: User clicks checkbox → `completed` flipped, `updated_at` updated
- **Deleted**: User deletes todo → Todo record permanently removed (no soft delete)

---

## Relationships

### User → Todo (One-to-Many)

**Relationship Type**: One User has Many Todos

**Cardinality**: 1:* (one-to-many)

**Foreign Key**: `todos.user_id` REFERENCES `users.id`

**Cascade Behavior**:
- **ON DELETE CASCADE**: Deleting a user deletes all their todos
- **ON UPDATE CASCADE**: If user.id changes (unlikely with UUID), todos.user_id updates

**Data Isolation Enforcement**:
1. Every todo query MUST include `WHERE user_id = <authenticated_user_id>`
2. Backend middleware extracts `user_id` from Better Auth session
3. Frontend never sends `user_id` in requests (server-side only)
4. Attempting to access another user's todo returns 403 Forbidden or 404 Not Found

**Example Queries**:
```sql
-- Get all todos for authenticated user
SELECT * FROM todos WHERE user_id = :authenticated_user_id ORDER BY created_at DESC;

-- Get incomplete todos for authenticated user
SELECT * FROM todos WHERE user_id = :authenticated_user_id AND completed = false;

-- Update todo (ensures ownership)
UPDATE todos
SET title = :new_title, description = :new_description, updated_at = NOW()
WHERE id = :todo_id AND user_id = :authenticated_user_id;

-- Delete todo (ensures ownership)
DELETE FROM todos WHERE id = :todo_id AND user_id = :authenticated_user_id;
```

---

## Database Schema (SQL)

### Complete Schema Definition

```sql
-- Enable UUID generation (PostgreSQL 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Unique index on lowercased email for case-insensitive uniqueness
CREATE UNIQUE INDEX idx_users_email ON users(LOWER(email));

-- Todos table
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL CHECK (LENGTH(TRIM(title)) > 0),
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Foreign key with cascade delete
    CONSTRAINT fk_todos_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for query performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_user_id_completed ON todos(user_id, completed);

-- Trigger to auto-update updated_at on todo modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Migration Strategy

### Tool: Alembic

**Migration Files**:
```
backend/alembic/versions/
├── 20250127_001_create_users_table.py
└── 20250127_002_create_todos_table.py
```

**Initial Migration (users table)**:
```python
# alembic/versions/20250127_001_create_users_table.py
"""create users table

Revision ID: 001
Revises:
Create Date: 2025-01-27 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False, server_default=sa.text('NOW()'))
    )
    op.create_index('idx_users_email', 'users', [sa.text('LOWER(email)')], unique=True)

def downgrade():
    op.drop_index('idx_users_email', table_name='users')
    op.drop_table('users')
```

**Second Migration (todos table)**:
```python
# alembic/versions/20250127_002_create_todos_table.py
"""create todos table

Revision ID: 002
Revises: 001
Create Date: 2025-01-27 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'todos',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_todos_user_id', ondelete='CASCADE'),
        sa.CheckConstraint("LENGTH(TRIM(title)) > 0", name='check_title_not_empty')
    )
    op.create_index('idx_todos_user_id', 'todos', ['user_id'])
    op.create_index('idx_todos_user_id_completed', 'todos', ['user_id', 'completed'])

    # Create trigger for auto-updating updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    """)
    op.execute("""
        CREATE TRIGGER update_todos_updated_at
            BEFORE UPDATE ON todos
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    """)

def downgrade():
    op.execute("DROP TRIGGER IF EXISTS update_todos_updated_at ON todos")
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column()")
    op.drop_index('idx_todos_user_id_completed', table_name='todos')
    op.drop_index('idx_todos_user_id', table_name='todos')
    op.drop_table('todos')
```

---

## Data Integrity Rules

### Enforced by Database

1. **Referential Integrity**: Foreign key constraint ensures `todos.user_id` always references valid `users.id`
2. **Unique Email**: Unique index prevents duplicate email registrations
3. **Non-Empty Title**: CHECK constraint prevents empty todo titles
4. **Non-NULL Fields**: NOT NULL constraints on required fields
5. **Default Values**: `completed=false`, timestamps auto-populated

### Enforced by Application (Backend)

1. **Email Format Validation**: Regex validation before INSERT
2. **Password Strength**: Better Auth enforces minimum 8 characters
3. **Character Limits**: Pydantic/SQLModel max_length validators
4. **Whitespace Trimming**: Strip whitespace from title/email before save
5. **User ID Injection**: Backend sets `user_id` from session (never trust frontend)

### Enforced by Application (Frontend)

1. **Immediate Feedback**: Validate inputs before API call
2. **Character Counters**: Show "X/200 characters" for title
3. **Required Field Indicators**: Visual * for required fields
4. **Email Format**: Check format before allowing submit

---

## Query Patterns

### Common Queries

**1. User Registration**:
```sql
INSERT INTO users (email, password_hash)
VALUES (:email, :password_hash)
RETURNING id, email, created_at;
```

**2. User Signin**:
```sql
SELECT id, email, password_hash
FROM users
WHERE LOWER(email) = LOWER(:email);
-- Better Auth verifies password hash
```

**3. Get All Todos for User**:
```sql
SELECT id, user_id, title, description, completed, created_at, updated_at
FROM todos
WHERE user_id = :authenticated_user_id
ORDER BY created_at DESC;
```

**4. Create Todo**:
```sql
INSERT INTO todos (user_id, title, description)
VALUES (:authenticated_user_id, :title, :description)
RETURNING id, user_id, title, description, completed, created_at, updated_at;
```

**5. Update Todo**:
```sql
UPDATE todos
SET title = :title, description = :description, updated_at = NOW()
WHERE id = :todo_id AND user_id = :authenticated_user_id
RETURNING id, user_id, title, description, completed, created_at, updated_at;
```

**6. Toggle Todo Completion**:
```sql
UPDATE todos
SET completed = NOT completed, updated_at = NOW()
WHERE id = :todo_id AND user_id = :authenticated_user_id
RETURNING id, user_id, title, description, completed, created_at, updated_at;
```

**7. Delete Todo**:
```sql
DELETE FROM todos
WHERE id = :todo_id AND user_id = :authenticated_user_id;
-- Returns number of rows deleted (0 if not found/unauthorized)
```

---

## Performance Considerations

### Index Strategy

1. **idx_users_email**: Enables fast email lookup during signin (UNIQUE INDEX on LOWER(email))
2. **idx_todos_user_id**: Speeds up "get all todos for user" query (most common)
3. **idx_todos_user_id_completed**: Supports filtered queries (e.g., get incomplete todos)

### Query Optimization

- **Always filter by user_id**: Reduces result set, uses index
- **Limit result sets**: Phase II doesn't paginate but keep queries focused
- **Use RETURNING clause**: Avoid separate SELECT after INSERT/UPDATE
- **Prepared statements**: SQLModel/SQLAlchemy use parameterized queries (prevents SQL injection, enables query plan caching)

### Database Configuration (Neon)

- **Connection Pooling**: Neon handles automatically
- **SSL Mode**: Always use `sslmode=require` in connection string
- **Connection Limits**: Neon free tier supports 100 concurrent connections

---

## Data Model Summary

**Tables**: 2 (users, todos)
**Relationships**: 1 (users 1:* todos)
**Indexes**: 3 (users.email, todos.user_id, todos.user_id+completed)
**Triggers**: 1 (auto-update todos.updated_at)
**Constraints**: 3 (FK cascade, unique email, non-empty title)

**Ready for Contract Definition**: Proceed to API contract generation.
