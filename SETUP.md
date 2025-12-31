# Setup Instructions

This guide will help you set up and run the Phase II Full-Stack Todo Application.

## Prerequisites

- **Python 3.11+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **Neon PostgreSQL Database** - Cloud database (sign up at https://neon.tech)

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.neon.tech/dbname?sslmode=require

# Authentication Secret (generate with: openssl rand -hex 32)
BETTER_AUTH_SECRET=your-secret-key-here

# CORS Origins
CORS_ORIGINS=http://localhost:3000

# Optional
DEBUG=False
```

**Important**: Replace the `DATABASE_URL` with your actual Neon PostgreSQL connection string from your Neon dashboard.

### 3. Run Database Migrations

```bash
# Make sure you're in the backend/ directory
alembic upgrade head
```

This will create the `users` and `todos` tables in your database.

### 4. Start Backend Server

```bash
# Start the FastAPI server with auto-reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: http://localhost:8000

- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc

## Frontend Setup

### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## Testing the MVP

### 1. Create an Account

1. Navigate to http://localhost:3000
2. Click "Get Started" or navigate to http://localhost:3000/signup
3. Enter your email and password (minimum 8 characters)
4. Click "Create Account"
5. You should be redirected to `/todos` page

### 2. Sign Out and Sign In

1. Click "Sign Out" in the header
2. You'll be redirected to the homepage
3. Click "Sign In" or navigate to http://localhost:3000/signin
4. Enter your credentials
5. You should be signed in and redirected to `/todos`

### 3. Session Persistence

1. While signed in, refresh the page
2. You should remain authenticated (session persists)
3. Try accessing http://localhost:3000/todos without being signed in
4. You should be redirected to `/signin`

## Project Structure

```
.
├── backend/                 # Python FastAPI backend
│   ├── src/
│   │   ├── models/         # SQLModel database models
│   │   ├── auth/           # Authentication logic
│   │   ├── api/            # API route handlers
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── utils/          # Helper utilities
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database connection
│   │   └── main.py         # FastAPI app entry point
│   ├── tests/              # Backend tests
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables (create from .env.example)
│
├── frontend/               # Next.js React frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Client utilities
│   │   └── types/         # TypeScript types
│   ├── package.json       # Node dependencies
│   └── .env.local        # Environment variables (create from .env.local.example)
│
└── specs/                  # Design documentation
    └── 001-phase-ii-fullstack/
        ├── spec.md         # Requirements specification
        ├── plan.md         # Technical implementation plan
        ├── tasks.md        # Task breakdown
        └── data-model.md   # Database schema
```

## MVP Scope Completed

The MVP implementation includes:

✅ **Phase 1: Setup (T001-T010)**
- Project structure
- Configuration files
- Dependencies

✅ **Phase 2: Foundational (T011-T033)**
- Database models (User, Todo)
- Authentication service (JWT-based)
- API infrastructure
- UI components
- Validation utilities

✅ **Phase 3: US1 Authentication (T034-T047)**
- User registration (POST /auth/signup)
- User signin (POST /auth/signin)
- User signout (POST /auth/signout)
- Session management (GET /auth/session)
- Auth guards and protected routes
- Session persistence across page refreshes

## Next Steps (Not in MVP)

The following features are defined in the specification but not yet implemented:

- **US2**: View all todos (GET /todos)
- **US3**: Create new todo (POST /todos)
- **US4**: Update todo (PUT /todos/:id)
- **US5**: Toggle todo completion (PATCH /todos/:id/toggle)
- **US6**: Delete todo (DELETE /todos/:id)

These can be implemented following the tasks in `specs/001-phase-ii-fullstack/tasks.md` (T048-T085).

## Troubleshooting

### Backend Issues

**ModuleNotFoundError**: Make sure you've installed all dependencies:
```bash
cd backend
pip install -r requirements.txt
```

**Database Connection Error**: Verify your `DATABASE_URL` in `.env` is correct and your Neon database is accessible.

**Alembic command not found**: Install alembic:
```bash
pip install alembic
```

### Frontend Issues

**Module not found errors**: Ensure all dependencies are installed:
```bash
cd frontend
npm install
```

**API connection errors**: Verify the backend is running on port 8000 and `NEXT_PUBLIC_API_URL` in `.env.local` is correct.

**CORS errors**: Make sure `CORS_ORIGINS` in backend `.env` includes `http://localhost:3000`.

## Development Commands

### Backend
```bash
# Run development server
uvicorn src.main:app --reload

# Run tests
pytest

# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Frontend
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check
```

## Support

For issues or questions:
1. Check the specification: `specs/001-phase-ii-fullstack/spec.md`
2. Review the technical plan: `specs/001-phase-ii-fullstack/plan.md`
3. See task breakdown: `specs/001-phase-ii-fullstack/tasks.md`
