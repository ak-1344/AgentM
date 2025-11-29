# Agent M - AI-Powered Automated Outreach Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14.0-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688.svg)
![Status](https://img.shields.io/badge/status-production--ready-success.svg)

[![GitHub Issues](https://img.shields.io/github/issues/ak-1344/AgentM)](https://github.com/ak-1344/AgentM/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/ak-1344/AgentM)](https://github.com/ak-1344/AgentM/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/ak-1344/AgentM?style=social)](https://github.com/ak-1344/AgentM/stargazers)

**Automate your job search, sponsorship hunting, and freelance outreach with AI-powered personalized emails**

[Quick Start](docs/setup/QUICKSTART.md) • [Documentation](docs/index.md) • [API Reference](docs/api/ENDPOINTS.md) • [Contributing](CONTRIBUTING.md)

</div>

---

## 🎉 Version 1.0.0 - Production Ready!

**Phase 1 Complete** | **Updated: November 29, 2025**

Agent M v1.0.0 is a fully functional AI-powered outreach platform with:

### Core Features ✅
- ✅ **AI-Powered Email Generation** - Personalized emails using Gemini 1.5 Pro
- ✅ **Interactive AI Chatbot** - Review and refine emails conversationally
- ✅ **Smart Resume Parsing** - Extract skills and experience automatically
- ✅ **Context Management** - Build detailed profiles for targeted outreach
- ✅ **Email Workflow** - Complete lifecycle: New → Review → Approve → Send
- ✅ **SMTP Integration** - Send emails through your own SMTP server
- ✅ **Activity Logging** - Track all system activities with filters
- ✅ **Secure Authentication** - Supabase Auth with JWT and RLS

### Recent Updates (Nov 25-29, 2025) 🆕
- 🐳 Docker containerization for easy deployment
- 🎨 Enhanced context editing with real-time sync
- 📝 Complete signup flow with validation
- 🔄 End-to-end workflow testing complete
- 📊 Comprehensive tracking and documentation

**[📖 View Release Notes](docs/releases/v1.0.0.md)** | **[🚀 Quick Start Guide](docs/setup/QUICKSTART.md)** | **[📊 Project Tracking](docs/reference/PROJECT_TRACKING.md)**

---

## 📖 Table of Contents

- [What is Agent M?](#-what-is-agent-m)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Security](#-security)
- [License](#-license)
- [Support](#-support)

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

### 📖 Guides & Tutorials
- **[Getting Started](docs/GETTING_STARTED.md)** - New user guide ⭐
- **[User Guide](docs/USER_GUIDE.md)** - Complete user workflow ⭐
- [API Guide](docs/guides/api-guide.md) - Using the REST API
- [Development Workflow](docs/guides/development.md) - Git workflow and best practices
- [Troubleshooting](docs/guides/TROUBLESHOOTING.md) - Common issues and solutions

### 📊 Reference & Tracking
- **[Project Tracking](docs/reference/PROJECT_TRACKING.md)** - Comprehensive progress tracking ⭐
- **[API Documentation](docs/api/ENDPOINTS.md)** - Complete API reference ⭐
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - One-page reference card
- [Changelog](CHANGELOG.md) - Version history
- [Project Status](docs/reference/PROJECT_STATUS.md) - Current metrics
- [Database Schema](docs/reference/database.md) - Database reference

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

# Open Pull Request on GitHub
```

**Read the full [Contributing Guide](CONTRIBUTING.md)** for detailed guidelines.

---

## 🔒 Security

Security is a top priority for Agent M. We take all security vulnerabilities seriously.

### Reporting Vulnerabilities

**Please do not report security vulnerabilities through public GitHub issues.**

- Email: [security contact - add your email]
- Include: Detailed description, steps to reproduce, potential impact
- Response time: Within 48 hours

### Security Features

- ✅ Fernet encryption for credentials
- ✅ JWT authentication with secure tokens
- ✅ Row Level Security on all database tables
- ✅ Input validation and sanitization
- ✅ HTTPS enforced in production
- ✅ Regular dependency updates

**Read the full [Security Policy](SECURITY.md)** for more information.

---

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Google** for Gemini AI
- **Supabase** for backend infrastructure
- **Vercel** for hosting platform
- **FastAPI** and **Next.js** communities
- All open-source contributors
- **Claude Sonnet 4.5** for documentation assistance
- **GitHub Copilot** for development assistance

---

## 📧 Support & Contact

- **Documentation:** [docs/index.md](docs/index.md)
- **Issues:** [GitHub Issues](https://github.com/ak-1344/AgentM/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ak-1344/AgentM/discussions)
- **Project Owner:** [@ak-1344](https://github.com/ak-1344)

For bug reports, use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).  
For feature requests, use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

---

## ⭐ Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🔀 Contributing code via pull requests
- 📢 Sharing with others who might benefit

[![Star History Chart](https://api.star-history.com/svg?repos=ak-1344/AgentM&type=Date)](https://star-history.com/#ak-1344/AgentM&Date)

---

<div align="center">

**Built with ❤️ for automating outreach at scale**

[Documentation](docs/index.md) • [Quick Start](docs/setup/QUICKSTART.md) • [API Docs](docs/api/ENDPOINTS.md) • [Contributing](CONTRIBUTING.md)

</div>
