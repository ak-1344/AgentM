# Agent M - Project Explanation

## Overview
Agent M is an AI-powered automated outreach platform designed to help users manage job applications, sponsorship requests, and freelance outreach. It leverages Google's Gemini Pro AI to generate personalized emails, parse resumes, and refine user context.

## Architecture
The project follows a modern, decoupled architecture:

### 1. Frontend (`frontend/`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth (JWT)
- **State Management**: React Query
- **Key Features**:
    - Dashboard for tracking activity.
    - Resume upload and parsing interface.
    - Context profile management.
    - Interactive email generation and chat-based refinement.

### 2. Backend (`backend/`)
- **Framework**: FastAPI (Python 3.11)
- **Structure**: Modular monolith.
    - `app/api/`: REST API endpoints.
    - `app/core/`: Configuration and security.
    - `app/services/`: Business logic (Email Management, AI Service).
    - `app/modules/`: Specialized modules (AI Engine, Email Engine, Scraper).
- **AI Integration**: Uses `langchain-google-genai` to interface with Google Gemini Pro.
- **Database**: Connects to Supabase (PostgreSQL) via `supabase-py`.

### 3. Database (Supabase)
- **Tables**:
    - `user_profiles`: User identity.
    - `resumes`: Stored resumes and parsed data.
    - `context_profiles`: User targeting preferences.
    - `ai_emails`: Generated emails and status workflow.
    - `activity_logs`: System audit logs.
- **Security**: Row Level Security (RLS) ensures data isolation between users.

## Key Workflows

### Email Generation
1.  User uploads resume -> Parsed by AI.
2.  User defines context (Target roles, industries).
3.  User inputs company name/URL.
4.  Backend uses Gemini Pro to generate a personalized email based on Resume + Context + Company Info.
5.  Email is saved as "New".

### Email Refinement
1.  User views generated email.
2.  User chats with AI (e.g., "Make it shorter").
3.  AI updates the email content.
4.  User approves email -> Status changes to "Approved".

## Deployment
- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on Render (Dockerized).
- **Database**: Managed Supabase instance.
