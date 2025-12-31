---
description: "Task list for Phase II Full-Stack Todo Web Application"
---

# Tasks: Phase II Full-Stack Todo Web Application

**Input**: Design documents from `specs/001-phase-ii-fullstack/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below follow the web application structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both backend and frontend

- [x] T001 Create root project directory structure (backend/, frontend/, .env.example, README.md)
- [x] T002 [P] Create backend directory structure (backend/src/, backend/tests/, backend/alembic/)
- [x] T003 [P] Create frontend directory structure (frontend/src/app/, frontend/src/components/, frontend/src/lib/)
- [x] T004 [P] Initialize backend Python project with requirements.txt (FastAPI, SQLModel, Better Auth, uvicorn, psycopg2-binary, python-dotenv, alembic, pytest, httpx)
- [x] T005 [P] Initialize frontend Node.js project with package.json (Next.js 14+, React 18+, TypeScript 5.x, TailwindCSS, Axios, Better Auth React SDK, react-hot-toast)
- [x] T006 [P] Create backend environment template file backend/.env.example with DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, CORS_ORIGINS
- [x] T007 [P] Create frontend environment template file frontend/.env.local.example with NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BETTER_AUTH_URL
- [x] T008 [P] Configure TypeScript in frontend/tsconfig.json with strict mode and path aliases
- [x] T009 [P] Configure TailwindCSS in frontend/tailwind.config.js with responsive breakpoints
- [x] T010 Create root README.md with project overview and quickstart links

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 [P] Create backend configuration module backend/src/config.py to load environment variables (DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS)
- [x] T012 [P] Create database connection module backend/src/database.py with SQLModel engine and session management for Neon PostgreSQL
- [x] T013 [P] Initialize Alembic in backend/alembic/ for database migrations
- [x] T014 [P] Create User SQLModel entity in backend/src/models/user.py with fields (id UUID, email VARCHAR(255) unique, password_hash VARCHAR(255), created_at TIMESTAMP)
- [x] T015 [P] Create Todo SQLModel entity in backend/src/models/todo.py with fields (id UUID, user_id UUID FK, title VARCHAR(200), description TEXT nullable, completed BOOLEAN default false, created_at TIMESTAMP, updated_at TIMESTAMP)
- [x] T016 Generate Alembic migration for User and Todo tables (run: alembic revision --autogenerate -m "Create users and todos tables")
- [x] T017 [P] Create Better Auth service in backend/src/auth/service.py integrating Better Auth Python SDK for session management
- [x] T018 [P] Create authentication middleware in backend/src/auth/middleware.py to validate sessions and extract user_id from Better Auth
- [x] T019 [P] Create custom exception classes in backend/src/utils/errors.py (UnauthorizedError, ValidationError, NotFoundError)
- [x] T020 [P] Create validation utilities in backend/src/utils/validation.py for email format, password strength, title/description length
- [x] T021 [P] Create FastAPI main application in backend/src/main.py with CORS middleware configured for frontend origin
- [x] T022 [P] Create main API router in backend/src/api/router.py to aggregate auth and todo routers
- [x] T023 [P] Create API client module in frontend/src/lib/api/client.ts with Axios configured (baseURL, withCredentials true, error interceptor)
- [x] T024 [P] Create Better Auth React context in frontend/src/lib/auth/context.tsx with AuthProvider component
- [x] T025 [P] Create frontend validation utilities in frontend/src/lib/utils/validation.ts (email, password, todoTitle, todoDescription validators)
- [x] T026 [P] Create User TypeScript type in frontend/src/types/user.ts (id, email, created_at)
- [x] T027 [P] Create Todo TypeScript type in frontend/src/types/todo.ts (id, user_id, title, description, completed, created_at, updated_at)
- [x] T028 [P] Create reusable Button component in frontend/src/components/ui/Button.tsx with variants (primary, secondary) and responsive sizing
- [x] T029 [P] Create reusable Input component in frontend/src/components/ui/Input.tsx with validation error display
- [x] T030 [P] Create reusable Modal component in frontend/src/components/ui/Modal.tsx for forms
- [x] T031 [P] Create reusable Spinner component in frontend/src/components/ui/Spinner.tsx for loading states
- [x] T032 [P] Create global styles in frontend/src/app/globals.css with TailwindCSS imports and base responsive styles
- [x] T033 Create root layout in frontend/src/app/layout.tsx wrapping children with AuthProvider and toast notifications

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can create accounts, sign in, sign out, and have their sessions persist across page refreshes

**Independent Test**: Create new account → Sign out → Sign in → Verify session persists → Try accessing /todos when not authenticated (should redirect to /signin)

### Implementation for User Story 1

- [x] T034 [P] [US1] Create auth request schemas in backend/src/schemas/auth.py (SignupRequest, SigninRequest with email and password fields)
- [x] T035 [P] [US1] Create auth response schemas in backend/src/schemas/auth.py (UserResponse with id, email, created_at fields)
- [x] T036 [US1] Implement POST /auth/signup endpoint in backend/src/api/auth.py (validate email/password, hash password via Better Auth, create user, return session cookie and UserResponse)
- [x] T037 [US1] Implement POST /auth/signin endpoint in backend/src/api/auth.py (validate credentials via Better Auth, return session cookie and UserResponse on success, 401 on failure)
- [x] T038 [US1] Implement POST /auth/signout endpoint in backend/src/api/auth.py (require auth middleware, invalidate session via Better Auth, clear session cookie)
- [x] T039 [US1] Implement GET /auth/session endpoint in backend/src/api/auth.py (require auth middleware, return current UserResponse or 401 if not authenticated)
- [x] T040 [US1] Register auth router in backend/src/api/router.py with prefix /auth
- [x] T041 [P] [US1] Create auth API client in frontend/src/lib/api/auth.ts with functions (signup, signin, signout, getSession) calling respective backend endpoints
- [x] T042 [P] [US1] Create SignupForm component in frontend/src/components/auth/SignupForm.tsx with email/password inputs, validation, and error handling
- [x] T043 [P] [US1] Create SigninForm component in frontend/src/components/auth/SigninForm.tsx with email/password inputs, validation, and error handling
- [x] T044 [US1] Create signup page in frontend/src/app/signup/page.tsx rendering SignupForm and redirecting to /todos on success
- [x] T045 [US1] Create signin page in frontend/src/app/signin/page.tsx rendering SigninForm and redirecting to /todos on success
- [x] T046 [US1] Create landing page in frontend/src/app/page.tsx with links to /signup and /signin
- [x] T047 [US1] Add auth guard to frontend/src/app/todos/page.tsx redirecting to /signin if user not authenticated (check via getSession)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can register, sign in, sign out, and authentication persists.

---

## Phase 4: User Story 2 - View My Todo List (Priority: P2)

**Goal**: Authenticated users can view all their todos in a clean interface, including empty state when no todos exist

**Independent Test**: Sign in → View empty state message → (Create test todo manually in database) → Refresh page → Verify todo appears → Verify complete vs incomplete visual distinction

### Implementation for User Story 2

- [ ] T048 [P] [US2] Create todo response schema in backend/src/schemas/todo.py (TodoResponse with id, user_id, title, description, completed, created_at, updated_at fields)
- [ ] T049 [US2] Implement GET /todos endpoint in backend/src/api/todos.py (require auth middleware, query todos WHERE user_id = authenticated_user_id, return TodoResponse array ordered by created_at DESC)
- [ ] T050 [US2] Register todos router in backend/src/api/router.py with prefix /todos
- [ ] T051 [P] [US2] Create todos API client in frontend/src/lib/api/todos.ts with getAll function calling GET /todos
- [ ] T052 [P] [US2] Create TodoItem component in frontend/src/components/todos/TodoItem.tsx displaying title, description, completed status with visual distinction (strikethrough or checkmark)
- [ ] T053 [P] [US2] Create EmptyState component in frontend/src/components/todos/EmptyState.tsx with friendly message and "Create your first todo" call-to-action
- [ ] T054 [US2] Create TodoList component in frontend/src/components/todos/TodoList.tsx fetching todos via getAll, rendering TodoItem for each or EmptyState if empty, with loading spinner during fetch
- [ ] T055 [US2] Update todos page in frontend/src/app/todos/page.tsx to render TodoList component and handle responsive layout (mobile and desktop breakpoints)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can authenticate and view their todo list (empty or populated).

---

## Phase 5: User Story 3 - Create New Todo (Priority: P3)

**Goal**: Authenticated users can create new todos with title and optional description, which persist and appear in their list

**Independent Test**: Sign in → Click "Add Todo" → Enter title "Test todo" → Enter description "Test description" → Save → Verify todo appears in list → Refresh page → Verify todo persists

### Implementation for User Story 3

- [ ] T056 [P] [US3] Create todo create request schema in backend/src/schemas/todo.py (TodoCreateRequest with title required max 200 chars, description optional max 2000 chars)
- [ ] T057 [US3] Implement POST /todos endpoint in backend/src/api/todos.py (require auth middleware, validate title not empty, create todo with user_id from session, return 201 with TodoResponse)
- [ ] T058 [P] [US3] Add create function to frontend/src/lib/api/todos.ts calling POST /todos with title and description
- [ ] T059 [US3] Create CreateTodoForm component in frontend/src/components/todos/CreateTodoForm.tsx with title input (required, max 200 chars), description textarea (optional, max 2000 chars), save/cancel buttons, validation errors inline
- [ ] T060 [US3] Update TodoList component in frontend/src/components/todos/TodoList.tsx to add "Add Todo" button opening CreateTodoForm modal
- [ ] T061 [US3] Wire CreateTodoForm submission to call create API, show success toast, close modal, and refresh todo list on success

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can authenticate, view their list, and create new todos.

---

## Phase 6: User Story 4 - Update Existing Todo (Priority: P4)

**Goal**: Authenticated users can edit todo title and description, with changes persisting

**Independent Test**: Sign in → View todo → Click "Edit" → Modify title to "Updated title" → Modify description → Save → Verify changes appear immediately → Refresh page → Verify changes persist

### Implementation for User Story 4

- [ ] T062 [P] [US4] Create todo update request schema in backend/src/schemas/todo.py (TodoUpdateRequest with title required max 200 chars, description optional max 2000 chars)
- [ ] T063 [US4] Implement PUT /todos/{id} endpoint in backend/src/api/todos.py (require auth middleware, validate todo belongs to user, validate title not empty, update title and description, return 200 with TodoResponse or 404 if not found/unauthorized)
- [ ] T064 [P] [US4] Add update function to frontend/src/lib/api/todos.ts calling PUT /todos/{id} with id, title, and description
- [ ] T065 [US4] Create EditTodoForm component in frontend/src/components/todos/EditTodoForm.tsx pre-populated with existing title and description, with save/cancel buttons, validation errors inline
- [ ] T066 [US4] Update TodoItem component in frontend/src/components/todos/TodoItem.tsx to add "Edit" button opening EditTodoForm modal
- [ ] T067 [US4] Wire EditTodoForm submission to call update API, show success toast, close modal, and refresh todo list on success

**Checkpoint**: At this point, User Stories 1-4 should all work independently. Users can authenticate, view, create, and update todos.

---

## Phase 7: User Story 5 - Toggle Todo Completion Status (Priority: P5)

**Goal**: Authenticated users can mark todos as complete/incomplete with a single click, with immediate visual feedback and persistence

**Independent Test**: Sign in → View incomplete todo → Click checkbox → Verify todo shows as complete (visual distinction) → Refresh page → Verify completion persists → Click checkbox again → Verify returns to incomplete

### Implementation for User Story 5

- [ ] T068 [US5] Implement PATCH /todos/{id}/toggle endpoint in backend/src/api/todos.py (require auth middleware, validate todo belongs to user, toggle completed status, update updated_at timestamp, return 200 with TodoResponse or 404 if not found/unauthorized)
- [ ] T069 [P] [US5] Add toggle function to frontend/src/lib/api/todos.ts calling PATCH /todos/{id}/toggle with id
- [ ] T070 [US5] Update TodoItem component in frontend/src/components/todos/TodoItem.tsx to add checkbox/toggle button calling toggle API with optimistic UI update (show change immediately, revert on error)
- [ ] T071 [US5] Ensure TodoItem visual styling clearly distinguishes complete todos (strikethrough text, muted color, or checkmark icon) from incomplete todos

**Checkpoint**: At this point, User Stories 1-5 should all work independently. Users can authenticate, view, create, update, and toggle todo completion.

---

## Phase 8: User Story 6 - Delete Todo (Priority: P6)

**Goal**: Authenticated users can permanently delete todos with confirmation, with immediate removal from list

**Independent Test**: Sign in → View todo → Click "Delete" → See confirmation prompt → Click "Confirm" → Verify todo removed from list → Refresh page → Verify todo doesn't reappear → Test "Cancel" on another todo → Verify todo remains

### Implementation for User Story 6

- [ ] T072 [US6] Implement DELETE /todos/{id} endpoint in backend/src/api/todos.py (require auth middleware, validate todo belongs to user, delete todo, return 204 No Content or 404 if not found/unauthorized)
- [ ] T073 [P] [US6] Add delete function to frontend/src/lib/api/todos.ts calling DELETE /todos/{id} with id
- [ ] T074 [US6] Update TodoItem component in frontend/src/components/todos/TodoItem.tsx to add "Delete" button showing confirmation modal (using Modal component from T030)
- [ ] T075 [US6] Wire delete confirmation to call delete API, show success toast, and refresh todo list on success (removing deleted todo immediately with optimistic update)

**Checkpoint**: At this point, ALL User Stories 1-6 should work independently. Users have full CRUD + authentication functionality.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and finalize the application

- [ ] T076 [P] Add responsive mobile styling to all frontend components ensuring touch targets are 44x44px minimum
- [ ] T077 [P] Add loading spinner to all API operations in frontend (signup, signin, create, update, delete, toggle) showing during request
- [ ] T078 [P] Add error toast notifications for all failed API operations in frontend using react-hot-toast
- [ ] T079 [P] Add character counters to title input (X/200 chars) and description textarea (X/2000 chars) in CreateTodoForm and EditTodoForm
- [ ] T080 [P] Test empty state display in TodoList when last todo is deleted
- [ ] T081 [P] Test session persistence by closing browser and returning to /todos (should still be authenticated)
- [ ] T082 [P] Test unauthenticated access to /todos (should redirect to /signin)
- [ ] T083 [P] Create backend README.md in backend/ with setup instructions (venv, install dependencies, configure .env, run migrations, start server)
- [ ] T084 [P] Create frontend README.md in frontend/ with setup instructions (npm install, configure .env.local, start dev server)
- [ ] T085 Verify end-to-end flow per quickstart.md test scenarios (signup → create todo → toggle → edit → delete → signout)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - **US1 (Auth)**: Can start after Foundational - NO dependencies on other stories
  - **US2 (View)**: Depends on US1 (requires authentication)
  - **US3 (Create)**: Depends on US1 and US2 (requires auth and view list)
  - **US4 (Update)**: Depends on US1, US2, US3 (requires auth, view, and create)
  - **US5 (Toggle)**: Depends on US1, US2, US3 (requires auth, view, and create)
  - **US6 (Delete)**: Depends on US1, US2, US3 (requires auth, view, and create)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ FOUNDATION
- **User Story 2 (P2)**: Depends on US1 (authentication required to view todos)
- **User Story 3 (P3)**: Depends on US1 + US2 (auth + view list to see created todos)
- **User Story 4 (P4)**: Depends on US1 + US2 + US3 (need existing todos to edit)
- **User Story 5 (P5)**: Depends on US1 + US2 + US3 (need existing todos to toggle)
- **User Story 6 (P6)**: Depends on US1 + US2 + US3 (need existing todos to delete)

### Within Each User Story

- Backend schemas before backend endpoints
- Backend endpoints before frontend API client
- Frontend API client before frontend components
- Frontend components before page integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup (Phase 1)**: Tasks T002-T009 can run in parallel (different files, independent)
- **Foundational (Phase 2)**: Tasks T011-T033 can run in parallel where marked [P]
- **Within US1**: Tasks T034, T035, T041, T042, T043 can run in parallel
- **Within US2**: Tasks T048, T051, T052, T053 can run in parallel
- **Within US3**: Tasks T056, T058 can run in parallel
- **Within US4**: Tasks T062, T064 can run in parallel
- **Within US5**: Task T069 can run in parallel with backend work
- **Within US6**: Task T073 can run in parallel with backend work
- **Polish (Phase 9)**: Tasks T076-T084 can run in parallel

---

## Parallel Example: User Story 1 (Authentication)

```bash
# Launch backend and frontend tasks together where marked [P]:

# Backend (parallel):
Task T034: Create auth request schemas in backend/src/schemas/auth.py
Task T035: Create auth response schemas in backend/src/schemas/auth.py

# Frontend (parallel):
Task T041: Create auth API client in frontend/src/lib/api/auth.ts
Task T042: Create SignupForm component in frontend/src/components/auth/SignupForm.tsx
Task T043: Create SigninForm component in frontend/src/components/auth/SigninForm.tsx

# Then sequential backend endpoint implementation:
Task T036: Implement POST /auth/signup endpoint
Task T037: Implement POST /auth/signin endpoint
Task T038: Implement POST /auth/signout endpoint
Task T039: Implement GET /auth/session endpoint
Task T040: Register auth router

# Then sequential frontend page integration:
Task T044: Create signup page
Task T045: Create signin page
Task T046: Create landing page
Task T047: Add auth guard to todos page
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) 🎯

**Recommended First Milestone**:

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T033) - **CRITICAL** - blocks all stories
3. Complete Phase 3: User Story 1 Authentication (T034-T047)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Can create account?
   - Can sign in?
   - Can sign out?
   - Does session persist?
   - Does auth guard work on /todos?
5. Deploy/demo if ready (US1 is a viable MVP)

### Incremental Delivery

1. **Foundation** (T001-T033) → Backend + Frontend infrastructure ready
2. **+ US1 Auth** (T034-T047) → Users can register and sign in (MVP!) ✅
3. **+ US2 View** (T048-T055) → Users can view their todo list
4. **+ US3 Create** (T056-T061) → Users can add todos
5. **+ US4 Update** (T062-T067) → Users can edit todos
6. **+ US5 Toggle** (T068-T071) → Users can mark todos complete
7. **+ US6 Delete** (T072-T075) → Users can remove todos
8. **+ Polish** (T076-T085) → Production-ready application

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T033)
2. Once Foundational is done:
   - **Developer A**: US1 Authentication (T034-T047) - **MUST COMPLETE FIRST**
3. After US1 complete:
   - **Developer B**: US2 View (T048-T055)
   - **Developer C**: US3 Create (T056-T061)
4. After US2 + US3 complete:
   - **Developer D**: US4 Update (T062-T067)
   - **Developer E**: US5 Toggle (T068-T071)
   - **Developer F**: US6 Delete (T072-T075)
5. Polish tasks (T076-T085) can be distributed across team

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to parallelize
- **[Story] label**: Maps task to specific user story for traceability (US1-US6)
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Authentication (US1) is the critical foundation** - all other stories require it
- No tests included (not requested in spec, can be added later if needed)
- Character limits: Title 200 chars, Description 2000 chars (enforced frontend + backend)
- UUID primary keys for security (non-sequential IDs)
- Session-based auth with HTTP-only cookies (Better Auth handles)
- All todos filtered by user_id (data isolation enforced at database query level)

---

**Total Tasks**: 85
**Task Breakdown by Phase**:
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 23 tasks
- Phase 3 (US1 - Auth): 14 tasks
- Phase 4 (US2 - View): 8 tasks
- Phase 5 (US3 - Create): 6 tasks
- Phase 6 (US4 - Update): 6 tasks
- Phase 7 (US5 - Toggle): 4 tasks
- Phase 8 (US6 - Delete): 4 tasks
- Phase 9 (Polish): 10 tasks

**Parallel Opportunities**: 45 tasks marked [P] can be parallelized
**Critical Path**: Setup → Foundational → US1 (Auth) → US2-6 (can partially parallelize after US1)
**MVP Scope**: T001-T047 (Setup + Foundational + US1 Auth) = 47 tasks
**Full Feature**: All 85 tasks
