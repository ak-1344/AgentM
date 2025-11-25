# Agent M - AI-Powered Automated Outreach Platform

<div align="center">

![Agent M](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.12-blue)
![Next.js](https://img.shields.io/badge/next.js-14.0-black)
![Status](https://img.shields.io/badge/status-production--ready-success)

**Automate your job search, sponsorship hunting, and freelance outreach with AI-powered personalized emails**

</div>

---

## 🎉 Version 1.0.0 Released!

We're excited to announce the first production-ready release of Agent M! This release includes:

- ✅ Complete email management system with AI chatbot
- ✅ Activity logging and monitoring  
- ✅ Resume parsing and context building
- ✅ SMTP integration for email sending
- ✅ Full authentication with Supabase
- ✅ Production-ready backend API
- ✅ Responsive React/Next.js frontend

**[📖 View Release Notes](docs/releases/v1.0.0.md)** | **[🚀 Quick Start Guide](docs/setup/QUICKSTART.md)**

---

## 🚀 Quick Start

Get up and running in 10 minutes:

```bash
# 1. Clone repository
git clone https://github.com/ak-1344/AgentM.git
cd AgentM

# 2. Run setup script
./scripts/setup.sh

# 3. Follow the guide
# See docs/setup/QUICKSTART.md for detailed instructions
```

**[📖 Read the Full Documentation](docs/index.md)**

---

## ✨ What is Agent M?

Agent M is an intelligent outreach automation platform that helps you:

- 📧 **Send personalized emails** - AI-powered email generation with GPT-4
- 🤖 **AI Chatbot Assistant** - Review and refine emails conversationally
- 📊 **Email Workflow Management** - New → Under Review → Approved → Rejected
- 🎯 **Smart Context Building** - Resume parsing and profile management
- ⏰ **Activity Monitoring** - Real-time logs with filtering and export
- 🔐 **Secure by Design** - Encrypted credentials, RLS, JWT authentication

---

## 📚 Documentation

### 🎯 Getting Started
- **[Quick Start Guide](docs/setup/QUICKSTART.md)** - Get running in 10 minutes ⭐
- **[Supabase Setup](docs/setup/SUPABASE_GUIDE.md)** - Database configuration ⭐
- [Supabase Quick Start](docs/setup/SUPABASE_QUICKSTART.md) - 5-minute checklist
- [Setup Checklist](docs/setup/SETUP_CHECKLIST.md) - Track your progress
- [Documentation Index](docs/index.md) - Complete documentation navigation

### 🚢 Deployment
- [Quick Deployment Guide](docs/deployment/DEPLOY.md) - Start here! (5-30 min) ⭐
- [Deployment Overview](docs/deployment/Deployment_plan.md) - Choose your deployment strategy
- [Track A: Vercel + Render](docs/deployment/vercel-deployment.md) - Production deployment (15 min)
- [Track B: Oracle VM](docs/deployment/oracle-vm-deployment.md) - Self-hosted (1-2 hours)
- [Docker Compose](docs/deployment/docker-deployment.md) - Local development

### 📖 Guides
- [API Guide](docs/guides/api-guide.md) - Using the REST API
- [Contributing](docs/guides/CONTRIBUTING.md) - Development guidelines
- [Development Workflow](docs/guides/development.md) - Git workflow and best practices

### 📊 Reference
- [Project Complete Report](docs/reference/PROJECT_COMPLETE.md) - Final completion status ⭐
- [Completion Report](docs/reference/COMPLETION_REPORT.md) - Detailed overview
- [Project Status](docs/reference/PROJECT_STATUS.md) - Current metrics
- [What's New](docs/reference/WHATS_NEW.md) - Latest additions
- [Database Schema](docs/reference/database.md) - Database reference
- [Changelog](docs/reference/CHANGELOG.md) - Version history

---

## 🛠️ Tech Stack

**Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS  
**Backend:** FastAPI, Python 3.11, Pydantic  
**AI/LLM:** OpenAI GPT-4, LangChain  
**Database:** Supabase (PostgreSQL)  
**Auth:** Supabase Auth (JWT)  
**Email:** SMTP (aiosmtplib)  
**Deployment:** Vercel, Render/Railway, Fly.io, Docker

---

## 📁 Project Structure

```
AgentM/
├── 📱 frontend/         # Next.js application
├── 🔧 backend/          # FastAPI application
├── 🗄️ database/         # SQL schemas & migrations
├── 📚 docs/             # Complete documentation
│   ├── setup/          # Setup guides
│   ├── deployment/     # Deployment strategies
│   ├── guides/         # Development guides
│   └── reference/      # Reference docs
├── 🤖 ai_engine/        # AI/LLM services (Phase 2)
├── 🕷️ scraper/          # Web crawlers (Phase 2)
├── 📧 email_engine/     # Email services
├── 💬 telegram_bot/     # Telegram integration (Phase 3)
└── 🚀 scripts/          # Setup and management scripts
```

---

## ✅ Current Features (v1.0.0 - Phase 1 Complete)

### 🤖 AI-Powered Email Management
- ✅ GPT-4 powered email generation with company context
- ✅ AI chatbot for reviewing and editing emails
- ✅ Quick actions (make formal, casual, shorter, more engaging)
- ✅ 4-stage workflow: New → Under Review → Approved → Rejected
- ✅ Company metadata tracking (position, keywords, status)

### 📊 Activity Monitoring
- ✅ Real-time activity logs with auto-refresh
- ✅ Filter by level (Info, Warning, Error, Success)
- ✅ Export logs to JSON/CSV
- ✅ Background activity tracking

### 📄 Resume & Context
- ✅ Resume upload (PDF/DOCX) with AI parsing
- ✅ Automatic skill extraction
- ✅ Context profile with target roles, industries, tone
- ✅ Personalized email generation based on profile

### 🔐 Security & Auth
- ✅ User authentication (Email + Google OAuth)
- ✅ JWT token-based API authentication
- ✅ SMTP credential encryption (Fernet)
- ✅ Row Level Security (RLS) on all database tables
- ✅ Secure session management with @supabase/ssr

### 🎨 User Interface
- ✅ Responsive Next.js 14 frontend
- ✅ Dashboard with progress tracking
- ✅ Real-time data updates
- ✅ Intuitive navigation and workflows

### 🔧 Backend Infrastructure
- ✅ FastAPI REST API with async operations
- ✅ Comprehensive error handling and logging
- ✅ Service-based architecture
- ✅ Type-safe Pydantic models
- ✅ Health check endpoints
- ✅ OpenAPI/Swagger documentation

---

## 🔜 Coming Soon (Future Phases)

### Phase 2 - Automation
- [ ] Web crawling for company discovery
- [ ] Automated company relevance scoring
- [ ] Batch email generation
- [ ] Email scheduling and queuing

### Phase 3 - Intelligence
- [ ] Advanced email approval workflow
- [ ] Telegram bot integration
- [ ] Email delivery tracking
- [ ] Automated follow-up sequences

### Phase 4 - Analytics
- [ ] Performance analytics dashboard
- [ ] A/B testing for email templates
- [ ] Campaign success predictions
- [ ] Advanced reporting and insights

### Phase 5 - Reply Intelligence
- [ ] Reply reading (IMAP integration)
- [ ] AI-powered reply classification
- [ ] Response pattern analysis
- [ ] Predictive success modeling

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/guides/CONTRIBUTING.md) for details.

```bash
# Fork and clone
git clone https://github.com/ak-1344/AgentM.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
# ...

# Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature

# Open Pull Request
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Supabase for backend infrastructure
- Vercel for hosting
- All open-source contributors
- Claude Sonnet 4.5 for documentation
- Github Copilot for development assitance

---

## 📧 Contact

- **Project Owner:** [@ak-1344](https://github.com/ak-1344)
- **Issues:** [GitHub Issues](https://github.com/ak-1344/AgentM/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ak-1344/AgentM/discussions)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=ak-1344/AgentM&type=Date)](https://star-history.com/#ak-1344/AgentM&Date)

---

<div align="center">

**Built with ❤️ for automating outreach at scale**

[Documentation](docs/index.md) • [Quick Start](docs/setup/QUICKSTART.md) • [Contributing](docs/guides/CONTRIBUTING.md) • [License](LICENSE)

</div>
