# Implementation Plan: Phase II Full-Stack Todo Web Application

**Branch**: `001-phase-ii-fullstack` | **Date**: 2025-12-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-phase-ii-fullstack/spec.md`

## Summary

Phase II implements a full-stack web application for todo management with user authentication. The system consists of a Python REST API backend with Neon PostgreSQL persistence, Better Auth for authentication, and a Next.js (React/TypeScript) frontend. Users can register, sign in, and perform CRUD operations on their personal todos. The architecture enforces data isolation ensuring users can only access their own todos.

**Primary Requirements**:
- User authentication (signup/signin) using Better Auth
- RESTful API for todo CRUD operations (create, read, update, delete, toggle completion)
- Persistent storage in Neon Serverless PostgreSQL
- Responsive Next.js web UI (desktop + mobile)
- User-to-todo data ownership with strict isolation

**Technical Approach** (from research):
- Backend: Python REST API framework (FastAPI recommended) with SQLModel ORM
- Frontend: Next.js App Router with TypeScript, React components, and API client
- Authentication: Better Auth integrated on both backend (session validation) and frontend (state management)
- Database: Neon PostgreSQL with migrations for User and Todo tables
- Communication: JSON REST APIs with proper error handling and status codes

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)

**Primary Dependencies**:
- **Backend**: FastAPI (web framework), SQLModel (ORM), Better Auth (authentication), psycopg2 or asyncpg (PostgreSQL driver), Pydantic (validation)
- **Frontend**: Next.js 14+ (React framework), TypeScript, Better Auth React SDK, TailwindCSS or CSS Modules (styling)

**Storage**: Neon Serverless PostgreSQL (cloud-hosted PostgreSQL-compatible database)

**Testing**: pytest (backend), Vitest or Jest (frontend), React Testing Library (component tests)

**Target Platform**: Web application (browser-based)
- Backend: Linux server or cloud platform (Vercel, Railway, etc.)
- Frontend: Static hosting or SSR on Node.js runtime

**Project Type**: Web application (separate backend and frontend projects)

**Performance Goals**:
- API response time: <500ms p95 for CRUD operations
- Frontend initial load: <5 seconds on standard broadband
- Todo operations complete: <3 seconds including network round-trip

**Constraints**:
- No AI or agent frameworks (Phase III+)
- No real-time features (WebSockets, Server-Sent Events)
- No background jobs or workers
- No advanced orchestration (Docker/Kubernetes deferred to Phase IV+)
- Character limits: Title (200 chars), Description (2000 chars)
- No pagination (all todos displayed on single page)
- Modern evergreen browsers only (Chrome, Firefox, Safari, Edge - last 2 years)

**Scale/Scope**:
- Expected users: Small to medium (10-1000 users initially)
- Expected todos per user: <100 (no pagination needed)
- 6 prioritized user stories (P1-P6)
- 40 functional requirements
- 10 API endpoints (4 auth + 6 todo)
- 5 frontend pages/components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase II Technology Matrix Compliance

✅ **Backend**: Python 3.11+ REST API (mandated for Phase II) - Using FastAPI
✅ **Database**: Neon Serverless PostgreSQL (mandated for Phase II)
✅ **ORM/Data Layer**: SQLModel (mandated "or equivalent" - choosing SQLModel)
✅ **Frontend**: Next.js (React, TypeScript) (mandated for Phase II)
✅ **Authentication**: Better Auth (signup/signin) (mandated for Phase II)
✅ **Architecture**: Full-stack web application (mandated for Phase II)

### Phase Gate Compliance

✅ **Authentication Allowed**: Phase II explicitly allows authentication (prohibited in Phase I)
✅ **Web Frontend Allowed**: Phase II explicitly allows web interfaces (prohibited in Phase I)
✅ **Database Allowed**: Phase II explicitly allows Neon PostgreSQL (Phase I in-memory only)
❌ **AI/Agents Prohibited**: Phase II explicitly prohibits AI frameworks and agent SDKs (Phase III+)
❌ **Advanced Infrastructure Prohibited**: No Docker, Kubernetes, Kafka, Dapr (Phase IV+)

### Spec-Driven Development Compliance

✅ **Specification Exists**: Complete Phase II specification approved (specs/001-phase-ii-fullstack/spec.md)
✅ **Plan Derived from Spec**: All design decisions trace to specification requirements
✅ **No Feature Invention**: Plan implements only specified features (6 user stories, 40 requirements)
✅ **No Scope Creep**: Out-of-scope features explicitly excluded (24 categories documented)

### Quality Principles Compliance

✅ **Stateless Services**: API will be stateless; authentication handled via Better Auth sessions
✅ **Separation of Concerns**: Backend (business logic), Frontend (presentation), Database (persistence) cleanly separated
✅ **Type Safety**: Python type hints required, TypeScript strict mode enabled
✅ **Error Handling**: All error paths explicitly handled (frontend + backend)
✅ **Configuration Externalization**: Database credentials, API URLs via environment variables

### Dependency Approval

The following dependencies require approval during planning phase:

**Backend (Python)**:
- ✅ FastAPI - Web framework for REST API
- ✅ SQLModel - ORM for database access (Pydantic + SQLAlchemy)
- ✅ Better Auth Python SDK - Authentication library
- ✅ Uvicorn - ASGI server
- ✅ psycopg2-binary or asyncpg - PostgreSQL driver
- ✅ python-dotenv - Environment variable management
- ✅ pytest - Testing framework
- ✅ httpx - HTTP client for testing

**Frontend (TypeScript/Next.js)**:
- ✅ Next.js 14+ - React framework
- ✅ React 18+ - UI library
- ✅ TypeScript 5.x - Type safety
- ✅ Better Auth React SDK - Authentication client
- ✅ TailwindCSS - Styling framework (or alternative: CSS Modules)
- ✅ Axios or native fetch - HTTP client
- ✅ Vitest or Jest - Testing framework
- ✅ React Testing Library - Component testing

All dependencies are standard industry tools appropriate for Phase II full-stack web development.

### Constitution Gate Result

**Status**: ✅ **PASSED**

The plan complies with all Phase II constitutional requirements:
- Uses only Phase II mandated technologies
- Respects phase gates (no Phase III+ features)
- Follows Spec-Driven Development workflow
- Maintains quality principles
- All dependencies approved

**Proceed to Phase 0: Research**

## Project Structure

### Documentation (this feature)

```text
specs/001-phase-ii-fullstack/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── auth-api.yaml    # Authentication endpoints OpenAPI spec
│   └── todo-api.yaml    # Todo CRUD endpoints OpenAPI spec
├── checklists/
│   └── requirements.md  # Specification quality checklist (already created)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration and environment variables
│   ├── database.py             # Database connection and session management
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py             # User SQLModel entity
│   │   └── todo.py             # Todo SQLModel entity
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── service.py          # Better Auth integration
│   │   └── middleware.py       # Authentication middleware
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py           # Main API router
│   │   ├── auth.py             # Auth endpoints (signup, signin, signout, session)
│   │   └── todos.py            # Todo CRUD endpoints
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py             # Auth request/response schemas
│   │   └── todo.py             # Todo request/response schemas
│   └── utils/
│       ├── __init__.py
│       ├── validation.py       # Input validation utilities
│       └── errors.py           # Custom exception classes
├── tests/
│   ├── conftest.py             # Pytest configuration and fixtures
│   ├── test_auth.py            # Authentication endpoint tests
│   ├── test_todos.py           # Todo CRUD endpoint tests
│   └── test_validation.py      # Validation logic tests
├── alembic/                    # Database migrations (if using Alembic)
│   ├── versions/
│   └── env.py
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variable template
└── README.md                   # Backend setup instructions

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Landing page
│   │   ├── signup/
│   │   │   └── page.tsx        # Signup page
│   │   ├── signin/
│   │   │   └── page.tsx        # Signin page
│   │   └── todos/
│   │       └── page.tsx        # Todo list page (protected)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx      # Reusable button component
│   │   │   ├── Input.tsx       # Reusable input component
│   │   │   ├── Modal.tsx       # Reusable modal component
│   │   │   └── Spinner.tsx     # Loading spinner component
│   │   ├── auth/
│   │   │   ├── SignupForm.tsx  # Signup form component
│   │   │   └── SigninForm.tsx  # Signin form component
│   │   └── todos/
│   │       ├── TodoList.tsx    # Todo list container
│   │       ├── TodoItem.tsx    # Individual todo display
│   │       ├── CreateTodoForm.tsx  # Create todo modal/form
│   │       ├── EditTodoForm.tsx    # Edit todo modal/form
│   │       └── EmptyState.tsx  # Empty state when no todos
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts       # Axios/fetch API client configuration
│   │   │   ├── auth.ts         # Auth API calls
│   │   │   └── todos.ts        # Todo API calls
│   │   ├── auth/
│   │   │   └── context.tsx     # Better Auth React context provider
│   │   └── utils/
│   │       ├── validation.ts   # Frontend validation utilities
│   │       └── formatters.ts   # Date/text formatting utilities
│   ├── types/
│   │   ├── user.ts             # User type definitions
│   │   └── todo.ts             # Todo type definitions
│   └── styles/
│       └── globals.css         # Global styles (TailwindCSS imports)
├── tests/
│   ├── components/
│   │   ├── TodoList.test.tsx
│   │   └── TodoItem.test.tsx
│   └── lib/
│       └── api.test.ts
├── public/                     # Static assets
├── package.json                # Node dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # TailwindCSS configuration
├── .env.local.example          # Environment variable template
└── README.md                   # Frontend setup instructions

.env.example (root)             # Combined environment template
README.md (root)                # Project overview and setup
```

**Structure Decision**: Web application structure (Option 2) selected because the specification explicitly defines separate backend (Python REST API) and frontend (Next.js) components. The backend handles business logic, data persistence, and authentication, while the frontend provides the user interface. This separation enables independent development, testing, and deployment of each layer, aligning with Phase II full-stack web architecture requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected**. The plan fully complies with Phase II constitutional requirements. No complexity tracking needed.

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (User)                          │
├─────────────────────────────────────────────────────────────────┤
│                     Next.js Frontend (React)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Auth Pages   │  │ Todo Pages   │  │  Better Auth React   │ │
│  │ (signup/in)  │  │ (list/CRUD)  │  │  Context Provider    │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│           │                │                      │             │
│           └────────────────┴──────────────────────┘             │
│                            │                                    │
│                       HTTP/JSON                                 │
│                            │                                    │
├─────────────────────────────────────────────────────────────────┤
│                     Python FastAPI Backend                      │
│  ┌──────────────────────┐          ┌──────────────────────┐   │
│  │   Auth Middleware    │          │   Better Auth SDK    │   │
│  └──────────────────────┘          └──────────────────────┘   │
│            │                                  │                 │
│  ┌──────────────────────┐          ┌──────────────────────┐   │
│  │   API Routes         │          │   SQLModel ORM       │   │
│  │  /auth/* /todos/*    │◄────────►│   (User, Todo)       │   │
│  └──────────────────────┘          └──────────────────────┘   │
│                                               │                 │
│                                        SQL Queries              │
│                                               │                 │
├─────────────────────────────────────────────────────────────────┤
│                   Neon PostgreSQL Database                      │
│  ┌──────────────────────┐          ┌──────────────────────┐   │
│  │   users table        │          │   todos table        │   │
│  │  - id (PK)           │          │  - id (PK)           │   │
│  │  - email (unique)    │          │  - user_id (FK)      │   │
│  │  - password_hash     │          │  - title             │   │
│  │  - created_at        │          │  - description       │   │
│  └──────────────────────┘          │  - completed         │   │
│                                     │  - created_at        │   │
│                                     │  - updated_at        │   │
│                                     └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

**1. Authentication Flow (User Signup)**
```
User → Signup Form (Next.js)
    → POST /auth/signup {email, password}
    → FastAPI Auth Endpoint
    → Better Auth SDK (hash password, create user)
    → SQLModel ORM → Neon PostgreSQL (INSERT users)
    → Return session token/cookie
    → Frontend stores auth state
    → Redirect to /todos
```

**2. Authentication Flow (User Signin)**
```
User → Signin Form (Next.js)
    → POST /auth/signin {email, password}
    → FastAPI Auth Endpoint
    → Better Auth SDK (verify password)
    → Return session token/cookie
    → Frontend stores auth state
    → Redirect to /todos
```

**3. Todo CRUD Flow (Create)**
```
Authenticated User → Create Todo Form (Next.js)
    → POST /todos {title, description}
    → FastAPI Auth Middleware (validate session)
    → FastAPI Todo Endpoint (extract user_id from session)
    → SQLModel ORM → Neon PostgreSQL (INSERT todos with user_id)
    → Return created todo JSON
    → Frontend updates UI optimistically
```

**4. Todo CRUD Flow (Read)**
```
Authenticated User → View Todo List (Next.js)
    → GET /todos (with auth credentials)
    → FastAPI Auth Middleware (validate session)
    → FastAPI Todo Endpoint (filter by user_id)
    → SQLModel ORM → Neon PostgreSQL (SELECT todos WHERE user_id = ?)
    → Return todos array JSON
    → Frontend renders todo list
```

**5. Todo CRUD Flow (Update)**
```
Authenticated User → Edit Todo Form (Next.js)
    → PUT /todos/{id} {title, description}
    → FastAPI Auth Middleware (validate session)
    → FastAPI Todo Endpoint (verify todo belongs to user)
    → SQLModel ORM → Neon PostgreSQL (UPDATE todos WHERE id = ? AND user_id = ?)
    → Return updated todo JSON
    → Frontend updates UI
```

**6. Todo CRUD Flow (Toggle Completion)**
```
Authenticated User → Click checkbox (Next.js)
    → PATCH /todos/{id}/toggle
    → FastAPI Auth Middleware (validate session)
    → FastAPI Todo Endpoint (verify todo belongs to user)
    → SQLModel ORM → Neon PostgreSQL (UPDATE todos SET completed = !completed WHERE id = ? AND user_id = ?)
    → Return updated todo JSON
    → Frontend updates UI with visual feedback
```

**7. Todo CRUD Flow (Delete)**
```
Authenticated User → Click delete + confirm (Next.js)
    → DELETE /todos/{id}
    → FastAPI Auth Middleware (validate session)
    → FastAPI Todo Endpoint (verify todo belongs to user)
    → SQLModel ORM → Neon PostgreSQL (DELETE FROM todos WHERE id = ? AND user_id = ?)
    → Return 204 No Content
    → Frontend removes todo from UI
```

### Security Model

**Data Isolation Strategy**:
1. Every todo has a `user_id` foreign key referencing the `users` table
2. All todo queries include `WHERE user_id = <authenticated_user_id>` filter
3. Backend auth middleware extracts `user_id` from Better Auth session
4. Frontend never sends `user_id` in requests (backend derives from session)
5. Attempting to access another user's todo returns 403 Forbidden or 404 Not Found

**Authentication Strategy**:
1. Better Auth handles session creation, validation, and expiration
2. Sessions stored as HTTP-only cookies (secure, httpOnly, sameSite flags)
3. Frontend Better Auth React context manages auth state
4. Backend auth middleware validates session on every protected endpoint
5. Unauthenticated requests to `/todos/*` return 401 Unauthorized
6. Frontend redirects unauthenticated users to `/signin`

**Validation Strategy**:
1. **Frontend validation** (immediate user feedback):
   - Title required, max 200 characters
   - Description optional, max 2000 characters
   - Email format validation
   - Password min 8 characters
2. **Backend validation** (security boundary):
   - Duplicate all frontend validations
   - SQL injection prevention (SQLModel parameterized queries)
   - XSS prevention (JSON encoding, no HTML rendering)
   - CSRF protection (Better Auth built-in)

### Error Handling Strategy

**Backend Error Responses**:
```python
{
  "error": "Brief user-friendly message",
  "details": "Optional technical details for debugging"
}
```

**HTTP Status Code Mapping**:
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation errors, malformed JSON
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but accessing forbidden resource
- **404 Not Found**: Todo doesn't exist or doesn't belong to user
- **500 Internal Server Error**: Unexpected server errors

**Frontend Error Display**:
- **Validation errors**: Inline red text near form fields
- **API errors**: Toast notification or banner at top of page
- **Network errors**: Retry button with error message
- **Loading states**: Spinner or skeleton UI during API calls

### Development Environment Setup

**Prerequisites**:
- Python 3.11+
- Node.js 18+
- PostgreSQL access (Neon account)

**Backend Setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with Neon DATABASE_URL and Better Auth config
alembic upgrade head  # Run migrations
uvicorn src.main:app --reload
# API available at http://localhost:8000
```

**Frontend Setup**:
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
# Frontend available at http://localhost:3000
```

**Environment Variables**:

Backend `.env`:
```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:3000
```

Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

---

## Design Decisions & Rationale

### 1. Separate Backend and Frontend Repositories/Directories

**Decision**: Use separate `backend/` and `frontend/` directories in monorepo structure.

**Rationale**:
- Clear separation of concerns (API vs UI)
- Independent deployment possible (backend to cloud server, frontend to static hosting)
- Different dependency management (Python vs Node.js)
- Easier to enforce type safety boundaries
- Aligns with Phase II "full-stack web application" architecture

**Alternatives Considered**:
- **Single Next.js app with API routes**: Rejected because spec explicitly requires "Python REST API" backend, not Next.js API routes
- **Completely separate repos**: Rejected for Phase II simplicity; monorepo easier for small team development

### 2. FastAPI as Backend Framework

**Decision**: Use FastAPI as the Python REST API framework.

**Rationale**:
- Native async support for Neon PostgreSQL async connections
- Automatic OpenAPI documentation generation (helps with contracts)
- Built-in Pydantic validation (integrates with SQLModel)
- Fast and modern (designed for Python 3.7+)
- Excellent developer experience with auto-reload

**Alternatives Considered**:
- **Flask**: More mature but lacks native async, requires more boilerplate
- **Django + DRF**: Too heavyweight for Phase II; includes ORM (we need SQLModel), admin UI, and features we don't need

### 3. SQLModel as ORM

**Decision**: Use SQLModel for database interactions.

**Rationale**:
- Constitution explicitly mandates "SQLModel or equivalent"
- Combines Pydantic (validation) + SQLAlchemy (ORM)
- Type-safe with excellent IDE support
- Integrates seamlessly with FastAPI
- Simpler than raw SQLAlchemy for this use case

**Alternatives Considered**:
- **Raw SQL**: Rejected for maintainability and safety concerns
- **SQLAlchemy Core**: More verbose, SQLModel provides better DX

### 4. Better Auth Integration Strategy

**Decision**: Integrate Better Auth on both backend (session validation) and frontend (React context).

**Rationale**:
- Spec mandates "Better Auth (signup/signin)"
- Better Auth provides secure session management out of the box
- Handles password hashing, session cookies, CSRF protection
- React SDK provides auth state management for frontend
- Reduces custom auth code (security best practice)

**Implementation Approach**:
- Backend: Better Auth Python SDK validates sessions, provides `user_id`
- Frontend: Better Auth React SDK manages auth state, provides login/logout functions
- Sessions: HTTP-only cookies with secure flags

**Alternatives Considered**:
- **JWT tokens**: Rejected because Better Auth uses session-based auth (more secure for web apps)
- **Custom auth**: Rejected due to security risks and reinventing the wheel

### 5. Database Schema Design

**Decision**: Two tables (`users`, `todos`) with foreign key relationship.

**Rationale**:
- Spec defines two key entities: User and Todo
- One-to-many relationship: One user owns many todos
- Foreign key ensures referential integrity
- Enables efficient filtering: `SELECT * FROM todos WHERE user_id = ?`

**Schema**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
```

**Alternatives Considered**:
- **Single table with user info in todos**: Rejected due to data redundancy
- **Integer IDs**: Using UUIDs for better security (non-sequential, harder to guess)

### 6. Next.js App Router vs Pages Router

**Decision**: Use Next.js App Router (Next.js 14+).

**Rationale**:
- App Router is the modern, recommended approach
- Better support for React Server Components (future-proofing)
- Improved routing with file-based convention
- Better layout and template support
- Easier authentication middleware integration

**Alternatives Considered**:
- **Pages Router**: Older approach, still supported but not recommended for new projects

### 7. API Communication Strategy

**Decision**: Use Axios or native fetch from Next.js frontend to FastAPI backend.

**Rationale**:
- Spec requires "Frontend communicates with backend via REST API"
- JSON request/response format specified
- Need to include Better Auth session cookies in requests
- Axios provides better error handling and interceptors
- Native fetch is lightweight alternative

**Implementation**:
- Create centralized API client (`lib/api/client.ts`)
- Include credentials in all requests (`credentials: 'include'`)
- Handle errors globally with try/catch and toast notifications
- Implement loading states for all API calls

**Alternatives Considered**:
- **tRPC**: Rejected because spec explicitly requires REST API, not RPC
- **GraphQL**: Rejected because spec explicitly requires RESTful endpoints

### 8. Responsive UI Strategy

**Decision**: Use TailwindCSS with mobile-first responsive design.

**Rationale**:
- Spec requires "responsive and usable on desktop and mobile devices"
- Success criterion: "320px (mobile) to 1920px (desktop) width"
- TailwindCSS provides utility classes for responsive breakpoints
- Mobile-first approach ensures core functionality works on smallest screens
- Easier to scale up than scale down

**Responsive Breakpoints**:
- Mobile: 320px - 768px (default, no prefix)
- Tablet: 768px - 1024px (`md:` prefix)
- Desktop: 1024px+ (`lg:`, `xl:` prefixes)

**Alternatives Considered**:
- **CSS Modules**: More boilerplate, harder to maintain responsive styles
- **Styled Components**: Runtime overhead, less performant

### 9. No Pagination Strategy

**Decision**: Display all todos on single page without pagination.

**Rationale**:
- Spec assumption: "No pagination: All todos for a user are displayed on a single page (acceptable for Phase II given expected small dataset per user)"
- Expected scale: <100 todos per user
- Simplifies implementation (no cursor/offset logic)
- Better UX for small datasets (no clicking through pages)

**Future Consideration**: Phase III+ can add pagination if needed.

### 10. Error Boundary and Loading State Strategy

**Decision**: Implement consistent loading and error states across all components.

**Rationale**:
- Spec requirement FR-035: "Frontend MUST display loading states during API operations"
- Spec requirement FR-036: "Frontend MUST display error messages when operations fail"
- Success criterion SC-011: "Error messages displayed within 2 seconds"
- Better UX with immediate feedback

**Implementation**:
- Loading: Spinner component or skeleton UI
- Errors: Toast notifications for API errors, inline text for validation
- Optimistic updates: Update UI immediately, revert on error

---

**Plan Status**: Ready for Phase 0 (Research) to generate detailed `research.md` documenting best practices and resolving any remaining unknowns.
