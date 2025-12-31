---
id: 002
title: Create Phase II Implementation Plan
stage: plan
date: 2025-12-27
surface: agent
model: claude-sonnet-4-5
feature: 001-phase-ii-fullstack
branch: 001-phase-ii-fullstack
user: system
command: /sp.plan
labels: ["planning", "phase-ii", "architecture", "full-stack", "fastapi", "nextjs"]
links:
  spec: specs/001-phase-ii-fullstack/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-phase-ii-fullstack/plan.md
 - specs/001-phase-ii-fullstack/research.md
 - specs/001-phase-ii-fullstack/data-model.md
 - specs/001-phase-ii-fullstack/contracts/auth-api.yaml
 - specs/001-phase-ii-fullstack/contracts/todo-api.yaml
 - specs/001-phase-ii-fullstack/quickstart.md
tests:
 - Constitution Check: PASSED (all Phase II requirements met)
 - Phase gate compliance validated
 - All dependencies approved
---

## Prompt

Create the Phase II technical plan for the "Evolution of Todo" project.

The plan must be strictly derived from the Phase II specification and constitution.

BACKEND PLAN:
1. Backend framework responsibility (REST API)
2. API routing and controller structure
3. Authentication integration using Better Auth
4. Data persistence using Neon PostgreSQL
5. User-to-do data ownership handling
6. Error handling and validation approach

FRONTEND PLAN:
1. Next.js application structure
2. Page-level routing (auth pages + todo pages)
3. Component responsibilities
4. API communication strategy
5. Authentication state handling
6. Responsive UI strategy

DATABASE PLAN:
1. User data model
2. Todo data model
3. Relationship between user and todo
4. Migration or schema management approach

INTEGRATION PLAN:
1. Frontend ↔ Backend communication flow
2. Auth token/session flow
3. Local development setup

CONSTRAINTS:
- No AI
- No agents
- No background workers
- No future phase infrastructure
- No implementation code

The plan must explain HOW Phase II will be built without introducing new features.

## Response snapshot

**Implementation Plan Created**: Phase II Full-Stack Todo Web Application

**Artifacts Generated**:
1. `specs/001-phase-ii-fullstack/plan.md` - Complete implementation plan (682 lines)
2. `specs/001-phase-ii-fullstack/research.md` - Technology research and best practices
3. `specs/001-phase-ii-fullstack/data-model.md` - Database schema and entity definitions
4. `specs/001-phase-ii-fullstack/contracts/auth-api.yaml` - Authentication API OpenAPI spec
5. `specs/001-phase-ii-fullstack/contracts/todo-api.yaml` - Todo CRUD API OpenAPI spec
6. `specs/001-phase-ii-fullstack/quickstart.md` - Developer onboarding guide

**Plan Structure**:

**Technical Context**:
- **Languages**: Python 3.11+ (backend), TypeScript 5.x (frontend)
- **Backend**: FastAPI, SQLModel, Better Auth, Uvicorn, psycopg2/asyncpg
- **Frontend**: Next.js 14+, React, TailwindCSS, Axios, Better Auth React SDK
- **Database**: Neon Serverless PostgreSQL
- **Testing**: pytest (backend), Vitest (frontend)
- **Performance Goals**: <500ms API response, <5s initial load, <3s operations
- **Constraints**: No AI, no real-time, no background jobs, character limits (200/2000)

**Constitution Check Results**: ✅ **PASSED**
- Phase II tech matrix compliance: FastAPI, Neon PostgreSQL, SQLModel, Next.js, Better Auth ✅
- Phase gates respected: No Phase III+ features (AI, agents, cloud infra) ✅
- Spec-Driven Development: All decisions trace to spec ✅
- Quality principles: Stateless, separation of concerns, type safety, error handling ✅
- Dependencies approved: 16 backend + frontend packages all standard industry tools ✅

**Project Structure**:
- **Monorepo**: Separate `backend/` and `frontend/` directories
- **Backend**: FastAPI with domain-based organization (auth/, api/, models/)
- **Frontend**: Next.js App Router with component co-location
- **Contracts**: OpenAPI specs for Auth (4 endpoints) + Todo (6 endpoints)

**Architecture Overview**:
- **3-Tier**: Browser (Next.js) → Python Backend (FastAPI) → PostgreSQL (Neon)
- **Authentication**: Session-based with Better Auth (HTTP-only cookies)
- **Data Isolation**: Every todo has `user_id` FK, all queries filter by authenticated user
- **Security**: Dual validation (frontend + backend), CORS configured, sessions secure
- **Error Handling**: Toast notifications (frontend), structured JSON errors (backend)

**Data Model**:
- **2 Tables**: `users` (id, email, password_hash, created_at) + `todos` (id, user_id, title, description, completed, created_at, updated_at)
- **Relationship**: 1:* (one user has many todos) with ON DELETE CASCADE
- **3 Indexes**: users.email, todos.user_id, todos.user_id+completed
- **Validation**: CHECK constraints, NOT NULL, UNIQUE, FK constraints
- **Migrations**: Alembic for schema versioning

**API Contracts (10 endpoints)**:
- **Auth (4)**: POST /auth/signup, POST /auth/signin, POST /auth/signout, GET /auth/session
- **Todo (6)**: GET /todos, POST /todos, GET /todos/:id, PUT /todos/:id, PATCH /todos/:id/toggle, DELETE /todos/:id
- **All documented** in OpenAPI 3.0 YAML with request/response schemas, examples, error codes

**Design Decisions (10 key decisions)**:
1. **Separate Backend/Frontend**: Monorepo structure for independent deployment
2. **FastAPI Framework**: Async support, auto-docs, Pydantic integration
3. **SQLModel ORM**: Constitutional mandate, type-safe, FastAPI integration
4. **Better Auth**: Session-based, secure cookies, Python + React SDKs
5. **Database Schema**: UUIDs for security, indexes for performance, CASCADE delete
6. **Next.js App Router**: Modern approach, better layouts, auth middleware
7. **Axios API Client**: Interceptors for errors, auto JSON, better DX
8. **TailwindCSS**: Mobile-first responsive, utility-first, rapid development
9. **No Pagination**: Spec assumption, <100 todos per user acceptable Phase II
10. **Dual Validation**: Frontend (UX) + Backend (security boundary)

**Development Workflow**:
- **Backend**: Python venv, FastAPI with --reload, Alembic migrations, pytest
- **Frontend**: npm install, Next.js dev server with Fast Refresh, Vitest
- **Database**: Neon cloud PostgreSQL, connection via DATABASE_URL env var
- **Environment**: .env (backend) + .env.local (frontend) for config
- **Testing**: Backend unit/integration tests, Frontend component tests

**Research Findings (10 topics)**:
1. FastAPI best practices (domain organization, dependency injection, async)
2. Neon PostgreSQL + SQLModel integration (connection pooling, migrations)
3. Better Auth implementation (session cookies, CSRF protection, Python + React)
4. Next.js App Router patterns (layouts, middleware, file-based routing)
5. API communication (Axios client, interceptors, error handling)
6. Responsive UI (TailwindCSS, mobile-first, touch targets)
7. Data validation (Pydantic validators, frontend validation, error display)
8. Error handling (toast notifications, status codes, user feedback)
9. Development environment (pyenv, nvm, hot reload, Docker optional)
10. Testing strategy (pytest fixtures, React Testing Library, coverage goals)

**Quickstart Guide**:
- **10 sections**: Repository setup, database setup, backend setup, frontend setup, E2E test, development workflow, troubleshooting, next steps, resources, command reference
- **Estimated setup time**: 15-20 minutes
- **Prerequisites**: Python 3.11+, Node.js 18+, Neon account
- **Verification**: Step-by-step E2E test (signup → create todo → toggle → edit → delete → signout)

**Status**: ✅ **READY FOR TASK GENERATION** (`/sp.tasks`)

The plan is complete, constitution-compliant, and ready for task breakdown. All technical decisions are documented with rationale and alternatives considered. No unknowns remain.

## Outcome

- ✅ Impact: Complete Phase II implementation plan created with architecture, data model, API contracts, and developer onboarding. All constitutional requirements validated. Ready for task generation.
- 🧪 Tests: Constitution Check passed all gates. Phase II technology matrix compliance validated. All dependencies approved. No phase leakage detected.
- 📁 Files: Created plan.md (682 lines), research.md (10 topics), data-model.md (2 entities), 2 OpenAPI contracts (10 endpoints), quickstart.md (10 sections)
- 🔁 Next prompts: `/sp.tasks` to generate implementation tasks from this plan and spec
- 🧠 Reflection: Plan successfully balances technical detail with architectural clarity. All decisions trace to spec requirements. Constitution compliance ensures no scope creep or premature optimization. Research phase resolved all unknowns. Data model enforces security through database constraints. API contracts provide clear interface definitions for implementation. Quickstart enables rapid developer onboarding.

## Evaluation notes (flywheel)

- Failure modes observed: None. Planning workflow executed smoothly.
- Graders run and results (PASS/FAIL): Constitution Check - PASS (Phase II compliance, no violations). Spec traceability - PASS (all decisions trace to requirements). Dependency approval - PASS (16 packages all industry standard).
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Consider automating OpenAPI contract generation from SQLModel schemas and FastAPI route definitions to reduce manual contract authoring in future phases.
