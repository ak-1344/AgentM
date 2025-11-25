# Agent M - AI-Powered Automated Outreach Platform

<div align="center">

![Agent M](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11-blue)
![Next.js](https://img.shields.io/badge/next.js-14.0-black)

**Automate your job search, sponsorship hunting, and freelance outreach with AI-powered personalized emails**

</div>

---

## 🚀 Quick Start

Get up and running in 10 minutes:

```bash
# 1. Clone repository
git clone https://github.com/ak-1344/AgentM.git
cd AgentM

# 2. Run setup script
./setup.sh

# 3. Follow the guide
# See docs/setup/QUICKSTART.md for detailed instructions
```

**[📖 Read the Full Documentation](docs/index.md)**

---

## ✨ What is Agent M?

Agent M is an intelligent outreach automation platform that helps you:

- 📧 **Send personalized emails at scale** - AI-powered email generation
- 🤖 **Automate company discovery** - Web crawling and relevance scoring
- 📊 **Track outreach performance** - Analytics and follow-up management
- 🎯 **Smart targeting** - Role, industry, and location-based filtering
- ⏰ **Intelligent follow-ups** - Automated sequences and scheduling

---

## 📚 Documentation

### 🎯 Getting Started
- **[Quick Start Guide](docs/setup/QUICKSTART.md)** - Get running in 10 minutes ⭐
- [Setup Checklist](docs/setup/SETUP_CHECKLIST.md) - Track your progress
- [Documentation Index](docs/index.md) - Complete documentation navigation

### 🚢 Deployment
- [Deployment Overview](docs/deployment/Deployment_plan.md) - Choose your deployment strategy
- [Track A: Vercel + Render](docs/deployment/vercel-deployment.md) - Production deployment (15 min)
- [Track B: Oracle VM](docs/deployment/oracle-vm-deployment.md) - Self-hosted (1-2 hours)
- [Docker Compose](docs/deployment/docker-deployment.md) - Local development

### 📖 Guides
- [API Guide](docs/guides/api-guide.md) - Using the REST API
- [Contributing](docs/guides/CONTRIBUTING.md) - Development guidelines
- [Development Workflow](docs/guides/development.md) - Git workflow and best practices

### 📊 Reference
- [Project Summary](docs/reference/PROJECT_SUMMARY.md) - Complete overview
- [Status Report](docs/reference/STATUS_REPORT.md) - Current status & metrics
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
└── 🚀 setup.sh          # Automated setup script
```

---

## ✅ Current Features (Phase 1)

- ✅ User authentication (Email + Google OAuth)
- ✅ Resume upload (PDF/DOCX) with AI parsing
- ✅ Context profile configuration
- ✅ SMTP email credential management
- ✅ Manual email sending
- ✅ Secure password encryption (Fernet)
- ✅ Row Level Security (RLS) on database

---

## 🔜 Coming Soon

### Phase 2
- Web crawling for company discovery
- Automated email generation
- Bulk email UI

### Phase 3
- Outbound inbox with approval workflow
- Telegram bot integration
- Email delivery tracking

### Phase 4
- Automated follow-up sequences
- Analytics dashboard
- Campaign scheduling

### Phase 5
- Reply reading (IMAP)
- AI reply classification
- Success prediction

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/guides/CONTRIBUTING.md) for details.

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/AgentM.git

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
