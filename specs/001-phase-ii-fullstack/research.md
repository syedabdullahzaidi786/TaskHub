# Phase 0: Research & Technology Decisions

**Feature**: Phase II Full-Stack Todo Web Application
**Date**: 2025-12-27
**Purpose**: Document technology research, best practices, and design decisions for Phase II implementation

## Research Overview

This document consolidates research findings for the Phase II full-stack todo application. All decisions are derived from the specification requirements and constit constitutional mandates.

---

## 1. Backend Framework Selection

### Decision: FastAPI

**Rationale**:
- **Async Support**: Native async/await for Neon PostgreSQL async operations
- **Type Safety**: Built-in Pydantic validation integrates with SQLModel
- **Auto Documentation**: Generates OpenAPI schemas automatically (required for contracts/)
- **Performance**: One of the fastest Python frameworks (benchmarks show 2-3x Flask)
- **Modern Design**: Python 3.7+ features, type hints everywhere
- **Developer Experience**: Auto-reload, clear error messages, excellent docs

**Best Practices**:
1. **Project Structure**: Organize by domain (auth/, api/, models/) not by layer
2. **Dependency Injection**: Use FastAPI's dependency injection for database sessions, auth
3. **Async Throughout**: Use async def for all route handlers when using async database driver
4. **Error Handling**: Create custom exception handlers for consistent error responses
5. **CORS Configuration**: Configure explicitly for frontend origin (http://localhost:3000 in dev)

**Code Patterns**:
```python
# main.py - Application entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Todo API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from api import auth, todos
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(todos.router, prefix="/todos", tags=["todos"])
```

**Alternatives Considered**:
- **Flask**: Lacks native async, more boilerplate, no auto-validation
- **Django + DRF**: Too heavyweight (includes ORM, admin, templates we don't need)
- **Verdict**: FastAPI optimal for Phase II requirements

**Resources**:
- Official Docs: https://fastapi.tiangolo.com/
- Best Practices: https://github.com/zhanymkanov/fastapi-best-practices
- SQLModel Integration: https://sqlmodel.tiangolo.com/

---

## 2. Database & ORM Strategy

### Decision: Neon PostgreSQL + SQLModel

**Neon PostgreSQL**:
- **Serverless**: Auto-scaling, no infrastructure management
- **PostgreSQL-Compatible**: Standard SQL, full ACID compliance
- **Developer Experience**: Branching for dev/staging, instant provisioning
- **Pricing**: Free tier sufficient for Phase II development

**SQLModel**:
- **Constitutional Mandate**: "SQLModel or equivalent" - choosing SQLModel
- **Type Safety**: Combines Pydantic (validation) + SQLAlchemy (ORM)
- **Single Model Definition**: One class for both database model and API schema
- **FastAPI Integration**: Seamless validation and serialization

**Best Practices**:
1. **Use UUIDs**: Non-sequential IDs improve security (harder to enumerate)
2. **Timestamps**: Always include created_at and updated_at
3. **Cascading Deletes**: ON DELETE CASCADE for user→todos relationship
4. **Indexes**: Add index on foreign keys (user_id in todos table)
5. **Migrations**: Use Alembic for schema versioning and migrations

**Code Patterns**:
```python
# models/user.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# models/todo.py
class Todo(SQLModel, table=True):
    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Migration Strategy**:
- **Tool**: Alembic (industry standard for SQLAlchemy/SQLModel)
- **Approach**: Auto-generate migrations from model changes
- **Naming**: `YYYYMMDD_HHmmss_description.py` format
- **Versioning**: Track migrations in git alongside code

**Connection Management**:
```python
# database.py
from sqlmodel import create_engine, Session
from contextlib import contextmanager

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)  # echo=False in production

def get_session():
    with Session(engine) as session:
        yield session
```

**Resources**:
- Neon Docs: https://neon.tech/docs/
- SQLModel Docs: https://sqlmodel.tiangolo.com/
- Alembic Tutorial: https://alembic.sqlalchemy.org/en/latest/tutorial.html

---

## 3. Authentication Strategy

### Decision: Better Auth (Session-Based)

**Better Auth Overview**:
- **Session Management**: HTTP-only cookies with secure flags
- **Password Hashing**: Argon2 or bcrypt (secure by default)
- **CSRF Protection**: Built-in token validation
- **Cross-Platform**: Python SDK (backend) + React SDK (frontend)

**Session Strategy**:
- **Storage**: HTTP-only cookies (JavaScript cannot access)
- **Flags**: `Secure`, `HttpOnly`, `SameSite=Lax`
- **Duration**: 7 days default, sliding window (extends on activity)
- **Validation**: Middleware checks session on every protected request

**Best Practices**:
1. **Never Store Passwords**: Only store hashed passwords (Better Auth handles this)
2. **Session Validation**: Validate session on backend, not just frontend
3. **User ID Derivation**: Extract user_id from session, never trust frontend
4. **Secure Transport**: Always HTTPS in production (cookies with Secure flag)
5. **Logout Everywhere**: Implement proper session invalidation

**Code Patterns**:
```python
# auth/service.py
from betterauth import BetterAuth

auth = BetterAuth(
    secret=os.getenv("BETTER_AUTH_SECRET"),
    session_duration=timedelta(days=7),
    cookie_name="todo_session",
    cookie_secure=True,  # HTTPS only
    cookie_httponly=True,  # No JavaScript access
    cookie_samesite="lax"
)

# auth/middleware.py
from fastapi import Depends, HTTPException, Request

async def get_current_user(request: Request) -> UUID:
    session = await auth.validate_session(request)
    if not session:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return session.user_id
```

**Frontend Integration**:
```typescript
// lib/auth/context.tsx
import { BetterAuthProvider } from '@betterauth/react'

export function AuthProvider({ children }) {
  return (
    <BetterAuthProvider
      apiUrl={process.env.NEXT_PUBLIC_BETTER_AUTH_URL}
      credentialsMode="include"  // Send cookies
    >
      {children}
    </BetterAuthProvider>
  )
}
```

**Security Considerations**:
- **Password Requirements**: Min 8 chars (FR-003), recommend stronger in production
- **Rate Limiting**: Not in Phase II, but consider for production
- **Account Lockout**: Not in Phase II, but consider for production
- **Email Verification**: Explicitly out of scope for Phase II

**Resources**:
- Better Auth Docs: https://www.better-auth.com/docs
- OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

---

## 4. Frontend Framework & Structure

### Decision: Next.js 14+ with App Router

**Next.js App Router Benefits**:
- **File-Based Routing**: `app/signup/page.tsx` → `/signup` route
- **Layouts**: Shared UI across routes (auth layout, main layout)
- **Server Components**: Improved performance (though we use client components for auth)
- **Middleware**: Easy authentication guards at route level
- **Built-in Optimization**: Image optimization, font optimization, code splitting

**Project Structure**:
```
frontend/src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout (auth provider)
│   ├── page.tsx              # Landing page
│   ├── signup/page.tsx       # Public route
│   ├── signin/page.tsx       # Public route
│   └── todos/page.tsx        # Protected route
├── components/               # React components
│   ├── ui/                   # Generic reusable components
│   ├── auth/                 # Auth-specific components
│   └── todos/                # Todo-specific components
├── lib/                      # Business logic
│   ├── api/                  # API client
│   ├── auth/                 # Auth context/hooks
│   └── utils/                # Shared utilities
└── types/                    # TypeScript type definitions
```

**Best Practices**:
1. **Client vs Server Components**: Use "use client" for interactive components
2. **Co-location**: Keep components near their usage (todos components in todos/)
3. **Reusability**: Create generic UI components (Button, Input, Modal)
4. **Type Safety**: Define types for all API responses and props
5. **Loading States**: Show spinner/skeleton during data fetching

**Code Patterns**:
```typescript
// app/todos/page.tsx
'use client'
import { useAuth } from '@/lib/auth/context'
import { TodoList } from '@/components/todos/TodoList'
import { redirect } from 'next/navigation'

export default function TodosPage() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) redirect('/signin')

  return <TodoList userId={user.id} />
}
```

**Resources**:
- Next.js App Router Docs: https://nextjs.org/docs/app
- React Server Components: https://react.dev/reference/react/use-client
- TypeScript with Next.js: https://nextjs.org/docs/app/building-your-application/configuring/typescript

---

## 5. API Communication Pattern

### Decision: Centralized API Client with Axios

**Why Axios over Fetch**:
- **Interceptors**: Centralized error handling and request transformation
- **Automatic JSON**: No need to manually parse/stringify
- **Better Error Handling**: Rejects on non-2xx status codes
- **Request/Response Transform**: Easy to add logging, auth headers
- **TypeScript Support**: Better types out of the box

**Best Practices**:
1. **Centralized Client**: One configured Axios instance
2. **Credentials Included**: Always send cookies for session auth
3. **Error Handling**: Catch and transform API errors to user messages
4. **Type Safety**: Define request/response types for each endpoint
5. **Loading States**: Track loading in components or global state

**Code Patterns**:
```typescript
// lib/api/client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to signin
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

// lib/api/todos.ts
export interface Todo {
  id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

export const todoApi = {
  getAll: () => apiClient.get<Todo[]>('/todos'),
  create: (data: { title: string; description?: string }) =>
    apiClient.post<Todo>('/todos', data),
  update: (id: string, data: { title: string; description?: string }) =>
    apiClient.put<Todo>(`/todos/${id}`, data),
  toggle: (id: string) =>
    apiClient.patch<Todo>(`/todos/${id}/toggle`),
  delete: (id: string) =>
    apiClient.delete(`/todos/${id}`),
}
```

**Error Display Pattern**:
```typescript
// Use toast library (react-hot-toast recommended)
import toast from 'react-hot-toast'

try {
  await todoApi.create({ title: 'New todo' })
  toast.success('Todo created!')
} catch (error) {
  const message = error.response?.data?.error || 'Failed to create todo'
  toast.error(message)
}
```

**Resources**:
- Axios Docs: https://axios-http.com/docs/intro
- React Hot Toast: https://react-hot-toast.com/

---

## 6. Responsive UI Implementation

### Decision: TailwindCSS with Mobile-First Design

**TailwindCSS Benefits**:
- **Utility-First**: Rapid prototyping with utility classes
- **Responsive Utilities**: Built-in breakpoints (sm, md, lg, xl)
- **Consistency**: Design tokens prevent arbitrary values
- **Performance**: Purges unused CSS in production
- **Developer Experience**: Excellent VSCode extension

**Responsive Breakpoints Strategy**:
```css
/* Mobile-first approach */
.container {
  /* Base: 320px - 768px (mobile) */
  padding: 1rem;

  /* Tablet: 768px+ */
  @media (min-width: 768px) {
    padding: 2rem;
  }

  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    padding: 3rem;
  }
}
```

**TailwindCSS Equivalent**:
```tsx
<div className="p-4 md:p-8 lg:p-12">
  Content
</div>
```

**Best Practices**:
1. **Mobile-First**: Design for 320px first, scale up
2. **Touch Targets**: Min 44x44px for buttons/links on mobile
3. **Readable Text**: Min 16px font size (no zoom on iOS)
4. **Flexible Layouts**: Use flexbox/grid instead of fixed widths
5. **Responsive Images**: Use Next.js Image component for optimization

**Component Patterns**:
```tsx
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium
        transition-colors duration-200
        ${variant === 'primary'
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
        ${fullWidth ? 'w-full' : ''}
        active:scale-95 transform
      `}
    >
      {children}
    </button>
  )
}
```

**Resources**:
- TailwindCSS Docs: https://tailwindcss.com/docs
- Responsive Design Guide: https://tailwindcss.com/docs/responsive-design
- Mobile-First CSS: https://www.freecodecamp.org/news/taking-the-right-approach-to-responsive-web-design/

---

## 7. Data Validation Strategy

### Decision: Dual Validation (Frontend + Backend)

**Why Dual Validation**:
- **Frontend**: Immediate user feedback, better UX
- **Backend**: Security boundary, cannot be bypassed

**Validation Rules** (from spec):
- Title: Required, max 200 characters
- Description: Optional, max 2000 characters
- Email: Valid email format
- Password: Min 8 characters

**Frontend Validation** (TypeScript):
```typescript
// lib/utils/validation.ts
export const validators = {
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : 'Invalid email format'
  },

  password: (value: string): string | null => {
    return value.length >= 8 ? null : 'Password must be at least 8 characters'
  },

  todoTitle: (value: string): string | null => {
    if (!value.trim()) return 'Title is required'
    if (value.length > 200) return 'Title must be 200 characters or less'
    return null
  },

  todoDescription: (value: string | null): string | null => {
    if (!value) return null  // Optional field
    if (value.length > 2000) return 'Description must be 2000 characters or less'
    return null
  },
}
```

**Backend Validation** (Pydantic/SQLModel):
```python
# schemas/todo.py
from pydantic import BaseModel, Field, validator

class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2000)

    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()

# FastAPI automatically validates and returns 422 Unprocessable Entity
```

**Error Response Format**:
```json
{
  "error": "Validation failed",
  "details": "Title must be 200 characters or less"
}
```

**Resources**:
- Pydantic Validators: https://docs.pydantic.dev/latest/concepts/validators/
- Form Validation Best Practices: https://www.smashingmagazine.com/2022/08/form-validation-modern-ways/

---

## 8. Error Handling & User Feedback

### Decision: Consistent Error Patterns with Toast Notifications

**Error Categories**:
1. **Validation Errors**: Inline text near form fields (red text)
2. **API Errors**: Toast notification at top of screen
3. **Network Errors**: Toast with retry button
4. **Authorization Errors**: Redirect to signin with message

**Toast Library**: React Hot Toast (lightweight, customizable)

**Error Handling Pattern**:
```typescript
// components/todos/CreateTodoForm.tsx
const [errors, setErrors] = useState<Record<string, string>>({})
const [loading, setLoading] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setErrors({})

  // Frontend validation
  const titleError = validators.todoTitle(title)
  if (titleError) {
    setErrors({ title: titleError })
    return
  }

  // API call
  setLoading(true)
  try {
    await todoApi.create({ title, description })
    toast.success('Todo created!')
    onSuccess()
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to create todo'
    toast.error(message)
  } finally {
    setLoading(false)
  }
}
```

**Loading States**:
- **Spinner**: Full-screen or inline during operations
- **Skeleton UI**: Placeholder content while loading list
- **Disabled Buttons**: Prevent double-submission during save

**Resources**:
- React Hot Toast: https://react-hot-toast.com/
- Error UX Best Practices: https://uxdesign.cc/how-to-design-better-error-messages-9a4f3c3e0f8f

---

## 9. Development Environment Best Practices

### Local Development Setup

**Backend Requirements**:
- Python 3.11+ (use pyenv for version management)
- Virtual environment (venv or poetry)
- PostgreSQL client tools (for manual DB inspection)

**Frontend Requirements**:
- Node.js 18+ (use nvm for version management)
- npm or pnpm (pnpm faster for large projects)

**Environment Variables**:
```bash
# backend/.env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:3000

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

**Docker Compose** (Optional for Phase II):
```yaml
# docker-compose.yml (optional - Phase II doesn't require containers)
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - backend/.env

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - frontend/.env.local
```

**Hot Reload Strategy**:
- Backend: `uvicorn src.main:app --reload` (auto-reloads on file changes)
- Frontend: `npm run dev` (Next.js Fast Refresh)

**Resources**:
- pyenv: https://github.com/pyenv/pyenv
- nvm: https://github.com/nvm-sh/nvm

---

## 10. Testing Strategy

### Decision: Separate Test Suites (Backend & Frontend)

**Backend Testing** (pytest):
```python
# tests/test_todos.py
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_create_todo():
    # Arrange: Create authenticated session
    auth_response = client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "password123"
    })

    # Act: Create todo
    response = client.post("/todos", json={
        "title": "Test todo",
        "description": "Test description"
    })

    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test todo"
    assert data["completed"] == False
```

**Frontend Testing** (Vitest + React Testing Library):
```typescript
// tests/components/TodoItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoItem } from '@/components/todos/TodoItem'

describe('TodoItem', () => {
  const mockTodo = {
    id: '123',
    title: 'Test todo',
    description: 'Test description',
    completed: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }

  it('renders todo title', () => {
    render(<TodoItem todo={mockTodo} onToggle={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox clicked', () => {
    const onToggle = vi.fn()
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={() => {}} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(onToggle).toHaveBeenCalledWith('123')
  })
})
```

**Test Coverage Goals**:
- Backend: 80%+ coverage for business logic
- Frontend: Focus on critical user flows (auth, CRUD operations)

**Resources**:
- pytest Docs: https://docs.pytest.org/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Vitest: https://vitest.dev/

---

## Summary of Research Findings

### Technology Stack Confirmed
- ✅ **Backend**: FastAPI (Python 3.11+)
- ✅ **ORM**: SQLModel
- ✅ **Database**: Neon PostgreSQL
- ✅ **Auth**: Better Auth (session-based)
- ✅ **Frontend**: Next.js 14+ (App Router)
- ✅ **Styling**: TailwindCSS
- ✅ **API Client**: Axios
- ✅ **Testing**: pytest (backend), Vitest (frontend)

### Key Architectural Decisions
1. Separate backend/frontend in monorepo structure
2. Session-based authentication with HTTP-only cookies
3. Dual validation (frontend + backend)
4. Mobile-first responsive design
5. Centralized API client with error interceptors
6. UUID primary keys for security
7. No pagination (Phase II simplicity)
8. Toast notifications for user feedback

### Next Steps
Proceed to **Phase 1: Design & Contracts** to create:
- `data-model.md`: Detailed database schema
- `contracts/auth-api.yaml`: Authentication endpoints OpenAPI spec
- `contracts/todo-api.yaml`: Todo CRUD endpoints OpenAPI spec
- `quickstart.md`: Developer onboarding guide

All unknowns have been resolved. Ready to proceed with implementation planning.
