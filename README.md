# The Evolution of Todo

A full-stack todo application demonstrating modern web development practices with authentication, persistent storage, and responsive design.

## Phase II: Full-Stack Web Application

This phase implements a complete todo application with:
- ✅ User authentication (signup/signin/signout)
- ✅ CRUD operations for todos
- ✅ Persistent storage with Neon PostgreSQL
- ✅ Responsive mobile-first design
- ✅ Session-based authentication with HTTP-only cookies

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Neon PostgreSQL database

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Neon database URL and auth secret
alembic upgrade head
uvicorn src.main:app --reload
```

Backend runs at http://localhost:8000

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with backend API URL
npm run dev
```

Frontend runs at http://localhost:3000

## Project Structure

```
.
├── backend/                 # Python FastAPI backend
│   ├── src/
│   │   ├── models/         # SQLModel database models
│   │   ├── auth/           # Authentication logic
│   │   ├── api/            # API route handlers
│   │   ├── schemas/        # Pydantic schemas
│   │   └── utils/          # Helper utilities
│   ├── tests/              # Backend tests
│   ├── alembic/            # Database migrations
│   └── requirements.txt
│
├── frontend/               # Next.js React frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Client utilities
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── tsconfig.json
│
└── specs/                  # Design documentation
    └── 001-phase-ii-fullstack/
        ├── spec.md         # Requirements specification
        ├── plan.md         # Technical implementation plan
        ├── tasks.md        # Task breakdown
        ├── data-model.md   # Database schema
        └── contracts/      # API contracts (OpenAPI)
```

## Technology Stack

### Backend
- **Framework**: FastAPI 0.109.0
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel 0.0.14
- **Migrations**: Alembic 1.13.1
- **Auth**: passlib + python-jose
- **Server**: Uvicorn

### Frontend
- **Framework**: Next.js 14.1+ (App Router)
- **UI**: React 18.2+
- **Language**: TypeScript 5.3+
- **Styling**: TailwindCSS 3.4+
- **HTTP Client**: Axios 1.6+
- **Notifications**: React Hot Toast

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in with email/password
- `POST /auth/signout` - Sign out (clear session)
- `GET /auth/session` - Get current user session

### Todos
- `GET /todos` - List all user's todos
- `POST /todos` - Create new todo
- `GET /todos/:id` - Get single todo
- `PUT /todos/:id` - Update todo
- `PATCH /todos/:id/toggle` - Toggle todo completion
- `DELETE /todos/:id` - Delete todo

## Documentation

- **Specification**: `specs/001-phase-ii-fullstack/spec.md`
- **Architecture Plan**: `specs/001-phase-ii-fullstack/plan.md`
- **Task Breakdown**: `specs/001-phase-ii-fullstack/tasks.md`
- **Data Model**: `specs/001-phase-ii-fullstack/data-model.md`
- **API Contracts**: `specs/001-phase-ii-fullstack/contracts/`
- **Constitution**: `.specify/memory/constitution.md`

## Development Workflow

This project follows Spec-Driven Development (SDD):
1. **Constitution** - Technology constraints and principles
2. **Specification** - User stories and requirements
3. **Plan** - Architecture and design decisions
4. **Tasks** - Atomic implementation breakdown
5. **Implementation** - Test-driven development

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Docker Commands
```bash
docker compose up
docker compose down
```

## License

MIT License - See LICENSE file for details