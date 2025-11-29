# Deployment Plan - AgentM

## 1. Docker Configuration
The backend is containerized using Docker.

**Dockerfile (`backend/Dockerfile`):**
- Base Image: `python:3.11-slim`
- Dependencies: Installed via `requirements.txt`
- Port: Exposes port 8000
- Command: Runs `uvicorn app.main:app --host 0.0.0.0 --port 8000`

## 2. Render Deployment (Backend)
Render will host the FastAPI backend.

**Steps:**
1.  Connect GitHub repository to Render.
2.  Create a **Web Service**.
3.  **Root Directory**: `backend`
4.  **Runtime**: Docker
5.  **Environment Variables**:
    - `GOOGLE_API_KEY`: Your Gemini API Key.
    - `SUPABASE_URL`: Your Supabase Project URL.
    - `SUPABASE_KEY`: Your Supabase Anon Key.
    - `SUPABASE_JWT_SECRET`: Your Supabase JWT Secret.
    - `DATABASE_URL`: Your Supabase Connection String.
    - `BACKEND_CORS_ORIGINS`: `https://your-frontend-domain.vercel.app`

## 3. Vercel Deployment (Frontend)
Vercel will host the Next.js frontend.

**Steps:**
1.  Connect GitHub repository to Vercel.
2.  **Root Directory**: `frontend`
3.  **Framework Preset**: Next.js
4.  **Environment Variables**:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
    - `NEXT_PUBLIC_API_URL`: `https://your-backend-service.onrender.com`

## 4. GitHub Actions (CI/CD)
A minimal workflow checks build integrity on every push.

**Workflow File**: `.github/workflows/ci.yml`
- **Triggers**: Push to `main` or Pull Requests.
- **Jobs**:
    - `build-backend`: Sets up Python, installs dependencies.
    - `build-frontend`: Sets up Node.js, installs dependencies, runs build.

## 5. Database
Managed by Supabase.
- Ensure all migrations in `database/` are applied via Supabase SQL Editor.
