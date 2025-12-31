# Phase II Quickstart Guide

**Feature**: Phase II Full-Stack Todo Web Application
**Date**: 2025-12-27
**Purpose**: Developer onboarding guide for local development setup

## Overview

This guide walks you through setting up the Phase II Todo application locally. After completing these steps, you'll have a running backend API and frontend web application.

**Prerequisites**:
- Python 3.11+
- Node.js 18+
- Git
- Neon PostgreSQL account (free tier)
- Code editor (VS Code recommended)

**Architecture**:
- **Backend**: Python FastAPI REST API on http://localhost:8000
- **Frontend**: Next.js web app on http://localhost:3000
- **Database**: Neon Serverless PostgreSQL (cloud-hosted)

---

## 1. Repository Setup

### Clone the Repository

```bash
git clone <repository-url>
cd todo-fullstack
```

### Verify Branch

```bash
git status
# Should show: On branch 001-phase-ii-fullstack
```

---

## 2. Database Setup (Neon PostgreSQL)

### Create Neon Account

1. Go to https://neon.tech
2. Sign up for free tier account
3. Create a new project named "todo-app-dev"

### Get Connection String

1. In Neon dashboard, click "Connection Details"
2. Copy the connection string (it looks like):
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Save this - you'll need it in step 3

### Create Database (Optional)

Neon provides a default database (`neondb`). You can use it or create a new one:

```sql
-- In Neon SQL Editor (optional)
CREATE DATABASE todo_app_phase2;
```

---

## 3. Backend Setup

### Navigate to Backend Directory

```bash
cd backend
```

### Create Virtual Environment

```bash
# Create venv
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

Verify activation - your terminal prompt should show `(venv)`.

### Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected packages**:
- fastapi
- uvicorn[standard]
- sqlmodel
- psycopg2-binary (or asyncpg)
- python-dotenv
- better-auth (or betterauth)
- pydantic
- alembic

### Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
```

**Required `.env` values**:
```bash
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
BETTER_AUTH_URL=http://localhost:8000

# CORS
CORS_ORIGINS=http://localhost:3000

# Environment
ENVIRONMENT=development
```

**Generate BETTER_AUTH_SECRET** (bash/terminal):
```bash
openssl rand -base64 32
# Copy output to .env file
```

### Run Database Migrations

```bash
# Initialize Alembic (if not done)
alembic init alembic

# Generate initial migration
alembic revision --autogenerate -m "Create users and todos tables"

# Run migrations
alembic upgrade head
```

### Verify Database Tables

Connect to Neon using their SQL Editor and verify:
```sql
\dt  -- List tables
# Should show: users, todos

SELECT * FROM users;
# Should return empty result (no users yet)
```

### Start Backend Server

```bash
uvicorn src.main:app --reload
```

**Expected output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXXX] using WatchFiles
INFO:     Started server process [XXXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Test Backend API

Open http://localhost:8000/docs in your browser to see auto-generated API documentation (Swagger UI).

**Quick API test** (curl or Postman):
```bash
# Test health check (if implemented)
curl http://localhost:8000/

# Test signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}'

# Expected: 201 Created with user JSON
```

---

## 4. Frontend Setup

### Open New Terminal

Keep backend running. Open a new terminal window/tab.

### Navigate to Frontend Directory

```bash
cd frontend
# (from project root)
```

### Install Dependencies

```bash
npm install
# or
pnpm install
```

**Expected packages**:
- next
- react
- react-dom
- typescript
- tailwindcss
- axios
- @betterauth/react (or better-auth)
- react-hot-toast
- @types/* (TypeScript types)

### Configure Environment Variables

```bash
# Copy example env file
cp .env.local.example .env.local

# Edit .env.local file
```

**Required `.env.local` values**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

### Start Frontend Development Server

```bash
npm run dev
```

**Expected output**:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

### Test Frontend

Open http://localhost:3000 in your browser.

**Expected**:
- Landing page loads
- You can navigate to `/signup`
- Signup form is visible

---

## 5. End-to-End Test

### Create Account

1. Navigate to http://localhost:3000/signup
2. Enter email: `test@example.com`
3. Enter password: `testpassword123`
4. Click "Sign Up"
5. Expected: Redirected to `/todos` page (empty state)

### Create Todo

1. On `/todos` page, click "Add Todo"
2. Enter title: "Test my first todo"
3. Enter description: "This is a test"
4. Click "Save"
5. Expected: Todo appears in list

### Toggle Completion

1. Click checkbox next to todo
2. Expected: Visual feedback (strikethrough or style change)
3. Refresh page
4. Expected: Completion status persists

### Edit Todo

1. Click "Edit" button on todo
2. Change title to "Updated test todo"
3. Click "Save"
4. Expected: Title updates in list

### Delete Todo

1. Click "Delete" button on todo
2. Confirm deletion
3. Expected: Todo removed from list
4. Expected: Empty state displayed

### Sign Out

1. Click "Sign Out" button
2. Expected: Redirected to `/signin`
3. Try to access `/todos` directly
4. Expected: Redirected to `/signin` (auth guard working)

---

## 6. Development Workflow

### Backend Development

**Hot Reload**: Backend auto-reloads on file changes (uvicorn `--reload` flag)

**Common Commands**:
```bash
# Start server
uvicorn src.main:app --reload

# Run tests
pytest

# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Check database schema
alembic current
```

**File Structure**:
```
backend/src/
├── main.py           # Edit to add new routers
├── models/           # Edit to change database schema
├── api/              # Edit to add/modify endpoints
├── schemas/          # Edit to change request/response schemas
└── auth/             # Edit authentication logic
```

### Frontend Development

**Fast Refresh**: Frontend auto-reloads on file changes (Next.js Fast Refresh)

**Common Commands**:
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

**File Structure**:
```
frontend/src/
├── app/              # Add new pages here
│   ├── signup/
│   ├── signin/
│   └── todos/
├── components/       # Add new components here
│   ├── ui/
│   ├── auth/
│   └── todos/
└── lib/              # Edit API calls, auth, utils
    ├── api/
    ├── auth/
    └── utils/
```

---

## 7. Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
**Solution**: Activate venv and reinstall dependencies
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**Problem**: `sqlalchemy.exc.OperationalError: could not connect to server`
**Solution**: Check DATABASE_URL in `.env` file, verify Neon project is running

**Problem**: `CORS policy: No 'Access-Control-Allow-Origin' header`
**Solution**: Check CORS_ORIGINS in `.env` matches frontend URL (http://localhost:3000)

**Problem**: Backend crashes on startup
**Solution**: Check logs for error details, verify all env vars are set, check Alembic migrations applied

### Frontend Issues

**Problem**: `Error: Cannot find module 'next'`
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem**: `Module not found: Can't resolve '@/components/...'`
**Solution**: Check `tsconfig.json` has correct path aliases, restart dev server

**Problem**: API calls fail with `ERR_CONNECTION_REFUSED`
**Solution**: Verify backend is running on http://localhost:8000, check NEXT_PUBLIC_API_URL in `.env.local`

**Problem**: Authentication not working (always redirected to signin)
**Solution**:
- Check cookies are enabled in browser
- Verify CORS credentials are included (`withCredentials: true` in Axios)
- Check Better Auth config matches on backend and frontend

### Database Issues

**Problem**: "Table does not exist" error
**Solution**: Run Alembic migrations
```bash
cd backend
alembic upgrade head
```

**Problem**: "Unique constraint violation" on user email
**Solution**: Email already registered, use different email or delete existing user from database

**Problem**: Migration fails
**Solution**: Check database connection, review migration file, rollback and try again
```bash
alembic downgrade -1
alembic upgrade head
```

---

## 8. Next Steps

### For Implementation (sp.tasks)

After completing quickstart setup, proceed to:
1. Run `/sp.tasks` to generate task breakdown
2. Implement tasks in priority order (P1 → P6)
3. Test each user story independently
4. Create pull request when ready

### For Testing

- **Backend**: Write pytest tests in `backend/tests/`
- **Frontend**: Write Vitest tests in `frontend/tests/`
- **Integration**: Test full user flows end-to-end

### For Deployment

Phase II focuses on local development. Deployment strategies (Vercel, Railway, etc.) will be covered in future phases.

---

## 9. Useful Resources

### Documentation Links

- **FastAPI**: https://fastapi.tiangolo.com/
- **SQLModel**: https://sqlmodel.tiangolo.com/
- **Next.js**: https://nextjs.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **Better Auth**: https://www.better-auth.com/docs
- **Neon**: https://neon.tech/docs

### Spec Documents

- [spec.md](spec.md) - Feature requirements
- [plan.md](plan.md) - Implementation plan
- [research.md](research.md) - Technology research
- [data-model.md](data-model.md) - Database schema
- [contracts/auth-api.yaml](contracts/auth-api.yaml) - Auth API spec
- [contracts/todo-api.yaml](contracts/todo-api.yaml) - Todo API spec

### API Documentation

- **Backend Swagger UI**: http://localhost:8000/docs
- **Backend ReDoc**: http://localhost:8000/redoc

---

## 10. Quick Command Reference

### Backend

```bash
# Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head

# Run
uvicorn src.main:app --reload

# Test
pytest

# Migrate
alembic revision --autogenerate -m "Message"
alembic upgrade head
```

### Frontend

```bash
# Setup
cd frontend
npm install
cp .env.local.example .env.local

# Run
npm run dev

# Test
npm test

# Build
npm run build
```

---

**Setup Time**: ~15-20 minutes (including Neon account creation)

**Questions**: Refer to spec documents or Phase II planning artifacts.

**Ready to implement**: Proceed to `/sp.tasks` command to generate implementation tasks.
