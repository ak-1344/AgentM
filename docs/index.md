# Agent M - Documentation Index

Welcome to the Agent M documentation! This guide will help you understand, set up, and deploy the automated outreach platform.

---

## 📚 Documentation Structure

```
docs/
├── README.md                    # Main project README
├── index.md                     # You are here - Documentation index
│
├── 🚀 setup/                    # Setup & Configuration
│   ├── QUICKSTART.md           # 10-minute quick start guide ⭐
│   ├── SETUP_CHECKLIST.md      # Step-by-step setup tracker
│   ├── smtp_setup.md           # Email/SMTP configuration
│   ├── supabase_config.md      # Database setup
│   ├── oauth_google_setup.md   # Google OAuth setup
│   ├── deployment_config.md    # Deployment guide (legacy)
│   └── crawler_api_keys.md     # API keys for Phase 2
│
├── 🚢 deployment/               # Deployment Plans
│   ├── Deployment_plan.md      # Track A (Vercel) & Track B (Oracle VM)
│   ├── vercel-deployment.md    # Track A: Vercel + Render + Supabase
│   ├── oracle-vm-deployment.md # Track B: Self-hosted on Oracle VM
│   └── docker-deployment.md    # Docker Compose local deployment
│
├── 📘 guides/                   # Development Guides
│   ├── CONTRIBUTING.md         # How to contribute
│   ├── api-guide.md           # API usage guide
│   └── development.md         # Development workflow
│
└── 📊 reference/                # Reference Documentation
    ├── PROJECT_SUMMARY.md      # Complete project summary
    ├── STATUS_REPORT.md        # Current status & metrics
    ├── VERSION.md              # Version information
    ├── CHANGELOG.md            # Detailed changelog
    ├── config_history.md       # Configuration tracking
    └── database.md             # Database schema reference
```

---

## 🎯 Quick Navigation

### New Users - Start Here!
1. 📖 [Main README](README.md) - Understand what Agent M does
2. 🚀 [Quick Start Guide](setup/QUICKSTART.md) - Get running in 10 minutes
3. ✅ [Setup Checklist](setup/SETUP_CHECKLIST.md) - Track your progress

### Setup & Configuration
- [SMTP Setup](setup/smtp_setup.md) - Configure email sending
- [Supabase Setup](setup/supabase_config.md) - Set up database
- [Google OAuth](setup/oauth_google_setup.md) - Add Google login
- [API Keys](setup/crawler_api_keys.md) - For Phase 2 web scraping

### Deployment Options

#### Track A: Production (Vercel + Render)
**Recommended for quick deployment**
- [Deployment Plan Overview](deployment/Deployment_plan.md)
- [Vercel Deployment Guide](deployment/vercel-deployment.md)
- **Stack**: Vercel (Frontend) + Render/Railway (Backend) + Supabase
- **Cost**: Free tier available
- **Time**: 15-20 minutes

#### Track B: Self-Hosted (Oracle VM)
**For learning & full control**
- [Deployment Plan Overview](deployment/Deployment_plan.md)
- [Oracle VM Deployment Guide](deployment/oracle-vm-deployment.md)
- **Stack**: Oracle VM + Docker + Caddy + PostgreSQL
- **Cost**: Free (Oracle Free Tier)
- **Time**: 1-2 hours

#### Local Development
- [Docker Compose Deployment](deployment/docker-deployment.md)
- **Stack**: Docker Compose (all services)
- **Time**: 5 minutes

### Development
- [Contributing Guide](guides/CONTRIBUTING.md) - Development guidelines
- [API Guide](guides/api-guide.md) - Using the API
- [Development Workflow](guides/development.md) - Git workflow, testing

### Reference
- [Project Summary](reference/PROJECT_SUMMARY.md) - Complete overview
- [Status Report](reference/STATUS_REPORT.md) - Current metrics & status
- [Version Info](reference/VERSION.md) - Current version
- [Changelog](reference/CHANGELOG.md) - All changes
- [Database Schema](reference/database.md) - Database reference
- [Config History](reference/config_history.md) - Environment variables

---

## 🎓 Learning Paths

### For End Users (Non-Technical)
```
1. Read: Main README
2. Follow: Quick Start Guide
3. Setup: Supabase (with screenshots)
4. Deploy: Track A (Vercel - click & deploy)
5. Use: Upload resume → Send emails
```

### For Developers (Technical)
```
1. Read: Project Summary
2. Setup: Local development environment
3. Review: Database schema & API docs
4. Deploy: Docker Compose locally
5. Contribute: Check Contributing guide
```

### For DevOps Engineers
```
1. Review: Deployment plan (both tracks)
2. Choose: Track A (cloud) or Track B (VM)
3. Deploy: Follow respective guide
4. Monitor: Set up logging & alerts
5. Scale: Optimize based on usage
```

---

## 📖 Documentation by Topic

### Authentication & Security
- [OAuth Setup](setup/oauth_google_setup.md)
- [Security Best Practices](guides/CONTRIBUTING.md#security-best-practices)
- [Database RLS Policies](reference/database.md)

### Email Configuration
- [SMTP Setup](setup/smtp_setup.md)
- [Email API Usage](guides/api-guide.md#email-endpoints)
- [Troubleshooting Email](setup/smtp_setup.md#troubleshooting)

### Database & Storage
- [Supabase Configuration](setup/supabase_config.md)
- [Database Schema](reference/database.md)
- [Storage Setup](setup/supabase_config.md#storage-buckets)

### AI & Automation
- [Resume Parsing](reference/PROJECT_SUMMARY.md#ai-integration)
- [Context Configuration](setup/QUICKSTART.md#configure-outreach-context)
- [Future: Web Crawlers](setup/crawler_api_keys.md)

### Deployment & Operations
- [Deployment Overview](deployment/Deployment_plan.md)
- [Production Deployment](deployment/vercel-deployment.md)
- [Self-Hosted Deployment](deployment/oracle-vm-deployment.md)
- [Docker Deployment](deployment/docker-deployment.md)

---

## 🔍 Finding Information

### By Task
- **"I want to set up the project"** → [Quick Start](setup/QUICKSTART.md)
- **"I want to deploy to production"** → [Deployment Plan](deployment/Deployment_plan.md)
- **"I want to contribute code"** → [Contributing Guide](guides/CONTRIBUTING.md)
- **"I want to understand the API"** → [API Guide](guides/api-guide.md)
- **"I want to know what's implemented"** → [Status Report](reference/STATUS_REPORT.md)

### By Role
- **Product Manager** → [Project Summary](reference/PROJECT_SUMMARY.md)
- **Frontend Developer** → [Contributing Guide](guides/CONTRIBUTING.md) + API Guide
- **Backend Developer** → [Database Schema](reference/database.md) + API Guide
- **DevOps Engineer** → [Deployment Guides](deployment/)
- **End User** → [Quick Start](setup/QUICKSTART.md)

### By Phase
- **Phase 1 (Current)** → [Status Report](reference/STATUS_REPORT.md)
- **Phase 2 (Next)** → [Crawler API Keys](setup/crawler_api_keys.md)
- **Future Phases** → [Project Summary](reference/PROJECT_SUMMARY.md#whats-not-implemented-yet)

---

## 🆘 Getting Help

### Documentation Issues
- Unclear instructions? → Open a GitHub issue
- Missing information? → Check [Status Report](reference/STATUS_REPORT.md)
- Want to improve docs? → See [Contributing Guide](guides/CONTRIBUTING.md)

### Technical Issues
- Setup problems? → Check [Quick Start Troubleshooting](setup/QUICKSTART.md#common-issues)
- API errors? → See [API Guide](guides/api-guide.md)
- Deployment issues? → Check respective deployment guide

### Community
- 🐛 **Bug Reports** → GitHub Issues
- 💬 **Questions** → GitHub Discussions
- 🔧 **Pull Requests** → [Contributing Guide](guides/CONTRIBUTING.md)

---

## 📝 Documentation Standards

All documentation follows these principles:
- ✅ **Clear** - Simple language, no jargon
- ✅ **Actionable** - Step-by-step instructions
- ✅ **Complete** - All necessary information
- ✅ **Up-to-date** - Updated with each release
- ✅ **Searchable** - Good headings and structure

---

## 🗺️ Sitemap

```
Quick Links:
├── 🏠 Home: Main README
├── 🚀 Start: Quick Start Guide
├── ✅ Track: Setup Checklist
├── 🚢 Deploy: Deployment Plan
├── 🔧 Develop: Contributing Guide
└── 📊 Status: Status Report

Setup:
├── Quick Start (10 min)
├── Setup Checklist
├── SMTP Configuration
├── Supabase Setup
├── OAuth Setup
└── API Keys

Deployment:
├── Deployment Plan (Overview)
├── Track A: Vercel + Render
├── Track B: Oracle VM
└── Docker Compose

Guides:
├── Contributing
├── API Usage
└── Development Workflow

Reference:
├── Project Summary
├── Status Report
├── Version Info
├── Changelog
├── Database Schema
└── Config History
```

---

## 🎉 Ready to Start?

Choose your path:

1. **New User** → [Quick Start Guide](setup/QUICKSTART.md)
2. **Deploy Production** → [Deployment Plan](deployment/Deployment_plan.md)
3. **Contribute Code** → [Contributing Guide](guides/CONTRIBUTING.md)
4. **Understand Project** → [Project Summary](reference/PROJECT_SUMMARY.md)

---

**Welcome to Agent M! Let's automate your outreach! 🚀**
