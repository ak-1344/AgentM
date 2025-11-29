# Agent M - Quick Reference Card

**Version:** 1.0.0 | **Updated:** Nov 29, 2025 | **Phase 1:** ✅ Complete

---

## 🎯 Project at a Glance

| Aspect | Status | Details |
|--------|--------|---------|
| **Phase** | Phase 1 Complete | 100% of MVP features |
| **Version** | 1.0.0 | Production ready |
| **Backend** | ✅ Operational | 24+ API endpoints |
| **Frontend** | ✅ Operational | 8 pages, 20+ components |
| **Database** | ✅ Configured | 7 tables with RLS |
| **AI Integration** | ✅ Working | Gemini 1.5 Pro |
| **Deployment** | ✅ Ready | Docker + Multiple options |

---

## 📁 Key Documentation Files

### Must-Read Documents 📌

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [PROJECT_TRACKING.md](docs/reference/PROJECT_TRACKING.md) | Complete progress tracking | Check project status, phases, metrics |
| [API ENDPOINTS.md](docs/api/ENDPOINTS.md) | Complete API reference | Integrate with API, debug issues |
| [QUICKSTART.md](docs/setup/QUICKSTART.md) | Get started in 10 min | Initial setup |
| [CHANGELOG.md](docs/reference/CHANGELOG.md) | Version history | See what's new, track changes |

### Setup & Deployment 🚀

| Document | Purpose |
|----------|---------|
| [BACKEND.md](docs/setup/BACKEND.md) | Backend setup guide |
| [FRONTEND.md](docs/setup/FRONTEND.md) | Frontend setup guide |
| [DEPLOY.md](docs/deployment/DEPLOY.md) | Quick deployment guide |
| [ENVIRONMENT.md](docs/setup/ENVIRONMENT.md) | Environment variables |

---

## 🔧 Tech Stack

```
Frontend:  Next.js 14, React 18, TypeScript, Tailwind CSS
Backend:   FastAPI, Python 3.11, Uvicorn
Database:  Supabase (PostgreSQL), RLS enabled
AI/LLM:    Google Gemini 1.5 Pro
Auth:      Supabase Auth (JWT)
Storage:   Supabase Storage
Deploy:    Docker, Vercel, Render, Oracle VM
```

---

## 📊 Current Features (Phase 1)

### Core Functionality ✅
- ✅ Resume upload & AI parsing
- ✅ Context profile builder
- ✅ AI email generation
- ✅ Email workflow (New → Review → Approve → Reject)
- ✅ Interactive AI chatbot
- ✅ SMTP integration
- ✅ Activity logging
- ✅ User authentication

### API Endpoints (24 total)
```
Auth:         /api/v1/auth/*
Resume:       /api/v1/resume/* (3 endpoints)
Context:      /api/v1/context/* (4 endpoints)
SMTP:         /api/v1/smtp/* (3 endpoints)
Email:        /api/v1/email/* (1 endpoint)
Management:   /api/v1/email_management/* (8 endpoints)
Logs:         /api/v1/logs/* (4 endpoints)
Health:       /health (1 endpoint)
```

---

## 🚀 Quick Commands

### Development
```bash
# Backend (from /backend)
cd backend
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (from /frontend)
cd frontend
pnpm install
pnpm dev

# Docker Compose (from root)
docker-compose up --build
```

### Production
```bash
# Docker Production Build
docker-compose -f docker-compose.prod.yml up -d

# Check Status
docker-compose ps
docker-compose logs -f backend
```

---

## 🗂️ Project Structure

```
AgentM/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # REST endpoints
│   │   ├── services/     # Business logic (9 services)
│   │   ├── models/       # Pydantic schemas
│   │   ├── core/         # Config, security
│   │   └── database/     # DB client
│   ├── main.py           # Entry point
│   └── requirements.txt
│
├── frontend/             # Next.js frontend
│   ├── app/             # Pages (App Router)
│   ├── components/      # React components (20+)
│   ├── contexts/        # React contexts
│   ├── lib/             # Utilities & API client
│   └── package.json
│
├── database/            # SQL schemas
├── docs/               # Documentation (30+ files)
└── docker-compose.yml
```

---

## 🔐 Environment Variables

### Backend (.env)
```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Encryption
FERNET_KEY=your_fernet_key

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📈 Metrics (Nov 29, 2025)

```
Code:
  - Backend:     ~5,000 lines Python
  - Frontend:    ~4,000 lines TypeScript
  - Total Files: 70+ code files

Database:
  - Tables:      7 with RLS
  - Policies:    14 RLS policies
  - Buckets:     1 (resumes)

API:
  - Endpoints:   24 REST endpoints
  - Services:    9 backend services
  - Models:      15+ Pydantic schemas

Documentation:
  - Files:       30+ markdown files
  - Guides:      10+ setup guides
  - References:  8+ reference docs
```

---

## 🎯 What's Next?

### Phase 2 (Planned - Q1 2026)
- Web crawling for company discovery
- Email extraction and validation
- Company database
- Batch processing

### Phase 3 (Planned - Q2 2026)
- Telegram bot approval workflow
- Automated email sending
- Bulk operations
- Real-time notifications

---

## 🔗 Quick Links

- **Repository:** https://github.com/ak-1344/AgentM
- **Documentation:** [docs/index.md](docs/index.md)
- **API Docs:** [docs/api/ENDPOINTS.md](docs/api/ENDPOINTS.md)
- **Tracking:** [docs/reference/PROJECT_TRACKING.md](docs/reference/PROJECT_TRACKING.md)
- **Issues:** https://github.com/ak-1344/AgentM/issues

---

## 💡 Common Tasks

| Task | Command/File |
|------|--------------|
| Start backend dev server | `cd backend && uvicorn main:app --reload` |
| Start frontend dev server | `cd frontend && pnpm dev` |
| View API docs | Visit `http://localhost:8000/docs` |
| Check project status | Read `docs/reference/PROJECT_TRACKING.md` |
| See API endpoints | Read `docs/api/ENDPOINTS.md` |
| Setup from scratch | Follow `docs/setup/QUICKSTART.md` |
| Deploy to production | Follow `docs/deployment/DEPLOY.md` |
| Check recent changes | Read `docs/reference/CHANGELOG.md` |

---

## 📞 Support

- **GitHub Issues:** For bug reports and feature requests
- **Documentation:** Check `/docs` folder first
- **Quick Start:** [docs/setup/QUICKSTART.md](docs/setup/QUICKSTART.md)
- **Troubleshooting:** [docs/guides/TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md)

---

**Last Updated:** November 29, 2025  
**Maintainer:** ak-1344  
**License:** MIT
