# Agent M - AI-Powered Automated Outreach Platform

<div align="center">

![Agent M](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11-blue)
![Next.js](https://img.shields.io/badge/next.js-14.0-black)

**Automate your job search, sponsorship hunting, and freelance outreach with AI-powered personalized emails**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Documentation](#documentation)

</div>

---

## 🎯 Overview

Agent M is an intelligent outreach automation platform that helps you:
- 📧 Send personalized emails at scale
- 🤖 Generate AI-powered email content
- 🔍 Discover relevant companies automatically
- 📊 Track and analyze outreach performance
- ⏰ Schedule follow-ups intelligently

## ✨ Features

### Phase 1 (Current - MVP)
- ✅ Resume upload and AI parsing
- ✅ Context profile configuration
- ✅ SMTP integration for email sending
- ✅ Manual email composition and sending
- ✅ User authentication (Google OAuth + Email)

### Phase 2 (In Development)
- 🔄 Web crawling for company discovery
- 🔄 Automated email generation
- 🔄 Company relevance classification

### Phase 3 (Planned)
- 📋 Outbound inbox with approval workflow
- 💬 Telegram bot for approvals
- 📝 Email delivery logging

### Phase 4 (Planned)
- 🔁 Automated follow-up sequences
- 📈 Analytics dashboard
- ⏲️ Scheduled campaign management

### Phase 5 (Planned)
- 📬 IMAP reply reading
- 🧠 AI reply classification
- 🎯 Outcome prediction

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Auth**: Supabase Auth
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI (Python)
- **AI/LLM**: OpenAI GPT-4, LangChain
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (Supabase)
- **Email**: SMTP (aiosmtplib)

### Infrastructure
- **Hosting**: Vercel (Frontend), Fly.io/Render (Backend)
- **Database**: Supabase
- **Storage**: Supabase Storage
- **Queue**: Redis + Celery (Phase 4)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- Supabase account
- OpenAI API key

### 1. Clone the Repository
```bash
git clone https://github.com/ak-1344/AgentM.git
cd AgentM
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and fill in your credentials

# Generate encryption key
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
# Add to .env as ENCRYPTION_KEY

# Run backend
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local and add your Supabase credentials

# Run frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Setup Database

1. Create Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run `database/schema_phase1.sql`
4. Create storage bucket named `resumes` (Settings > Storage)
5. Enable Google OAuth (Settings > Authentication > Providers)

See `PendingWork/supabase_config.md` for detailed instructions.

### 5. Docker (Optional)

```bash
# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📁 Project Structure

```
AgentM/
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts (Auth)
│   └── lib/              # Utilities (Supabase, API)
│
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Config, security
│   │   ├── database/    # Database client
│   │   ├── models/      # Pydantic models
│   │   └── services/    # Business logic
│   └── main.py          # App entry point
│
├── ai_engine/            # AI/LLM services
├── scraper/              # Web crawlers (Phase 2)
├── email_engine/         # Email services
├── database/             # SQL schemas & migrations
├── telegram_bot/         # Telegram integration (Phase 3)
│
├── PendingWork/          # Setup guides
│   ├── smtp_setup.md
│   ├── supabase_config.md
│   ├── oauth_google_setup.md
│   ├── deployment_config.md
│   └── crawler_api_keys.md
│
└── version_info/         # Version tracking
    ├── VERSION.md
    ├── CHANGELOG.md
    └── config_history.md
```

---

## 📚 Documentation

### Setup Guides (PendingWork/)
- [SMTP Setup](PendingWork/smtp_setup.md) - Configure email sending
- [Supabase Configuration](PendingWork/supabase_config.md) - Database setup
- [Google OAuth Setup](PendingWork/oauth_google_setup.md) - Authentication
- [Deployment Guide](PendingWork/deployment_config.md) - Production deployment
- [API Keys Setup](PendingWork/crawler_api_keys.md) - Web scraping APIs

### Version Information
- [VERSION.md](version_info/VERSION.md) - Current version info
- [CHANGELOG.md](version_info/CHANGELOG.md) - Detailed changelog
- [Config History](version_info/config_history.md) - Configuration tracking

---

## 🔧 Configuration

### Backend Environment Variables
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_JWT_SECRET=your-jwt-secret

# OpenAI
OPENAI_API_KEY=sk-your-key

# Security
SECRET_KEY=your-secret-key
ENCRYPTION_KEY=your-fernet-key

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 Testing

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

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Fly.io)
```bash
cd backend
fly deploy
```

See [Deployment Guide](PendingWork/deployment_config.md) for detailed instructions.

---

## 📊 API Documentation

Once backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

#### Resume
- `POST /api/v1/upload/resume` - Upload resume
- `POST /api/v1/parse/resume/{id}` - Parse resume with AI

#### Context
- `POST /api/v1/context/build` - Create/update context
- `GET /api/v1/context` - Get user context

#### SMTP
- `POST /api/v1/smtp/credentials` - Save SMTP config
- `POST /api/v1/smtp/test` - Test connection

#### Email
- `POST /api/v1/email/send` - Send email

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Supabase for backend infrastructure
- Vercel for hosting
- All open-source contributors

---

## 📧 Contact

- **Project Owner**: [@ak-1344](https://github.com/ak-1344)
- **Issues**: [GitHub Issues](https://github.com/ak-1344/AgentM/issues)

---

**Built with ❤️ for automating outreach at scale**
