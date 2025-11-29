# Agent M - Documentation Map

**Visual guide to all documentation** | Updated: November 29, 2025

---

## ��️ Documentation Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                         ROOT DIRECTORY                           │
├─────────────────────────────────────────────────────────────────┤
│  📖 README.md              - Main project documentation          │
│  📋 CHANGELOG.md           - Version history                     │
│  🤝 CONTRIBUTING.md        - How to contribute                   │
│  📜 CODE_OF_CONDUCT.md     - Community guidelines                │
│  🔒 SECURITY.md            - Security policy                     │
│  ⚖️  LICENSE                - MIT License                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      .github/ DIRECTORY                          │
├─────────────────────────────────────────────────────────────────┤
│  📝 ISSUE_TEMPLATE/                                              │
│    ├── bug_report.md       - Bug report template                │
│    └── feature_request.md  - Feature request template           │
│  🔀 pull_request_template.md - PR template                       │
│  🤖 copilot-instructions.md  - AI assistant guidelines           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       docs/ DIRECTORY                            │
│                   (Main Documentation Hub)                       │
└─────────────────────────────────────────────────────────────────┘
         │
         ├── 📘 index.md              - Documentation index
         ├── ⭐ GETTING_STARTED.md    - New user guide
         ├── 📖 USER_GUIDE.md         - Complete workflow
         ├── ⚡ QUICK_REFERENCE.md    - One-page cheat sheet
         ├── 📄 PROJECT_OVERVIEW.md   - Project explanation
         ├── 🔄 DOCUMENTATION_UPDATE.md - Recent updates
         ├── 📊 RESTRUCTURE_SUMMARY.md  - This restructure
         └── 🗺️  DOCUMENTATION_MAP.md    - This file
         │
         ├── 📁 setup/                 # Installation & Setup
         │   ├── QUICKSTART.md         - 10-minute quick start ⭐
         │   ├── BACKEND.md            - Backend setup
         │   ├── FRONTEND.md           - Frontend setup
         │   ├── DATABASE.md           - Database setup
         │   ├── ENVIRONMENT.md        - Environment variables
         │   ├── SETUP_CHECKLIST.md    - Step-by-step tracker
         │   ├── SUPABASE_GUIDE.md     - Supabase detailed guide
         │   ├── SUPABASE_QUICKSTART.md - Supabase quick setup
         │   ├── AUTHENTICATION_GUIDE.md - Auth configuration
         │   ├── smtp_setup.md         - SMTP configuration
         │   ├── oauth_google_setup.md - Google OAuth setup
         │   └── deployment_config.md  - Deployment configuration
         │
         ├── 📁 deployment/            # Deployment Strategies
         │   ├── DEPLOY.md             - Quick deployment guide ⭐
         │   ├── DEPLOYMENT_PLAN.md    - Choose your strategy
         │   ├── Deployment_plan.md    - Detailed deployment
         │   ├── vercel-deployment.md  - Cloud (Vercel+Render)
         │   ├── oracle-vm-deployment.md - Self-hosted VM
         │   └── docker-deployment.md  - Docker Compose
         │
         ├── 📁 api/                   # API Reference
         │   ├── ENDPOINTS.md          - Complete API docs ⭐
         │   ├── README.md             - API overview
         │   ├── endpoints.md          - Legacy docs
         │   └── authentication.md     - Auth flows
         │
         ├── 📁 guides/                # User & Developer Guides
         │   ├── TROUBLESHOOTING.md    - Common issues & fixes
         │   ├── WIZARD_TESTING_GUIDE.md - Testing guide
         │   ├── api-guide.md          - Using the API
         │   └── development.md        - Development workflow
         │
         ├── 📁 architecture/          # System Architecture
         │   └── OVERVIEW.md           - Architecture guide
         │
         ├── 📁 reference/             # Reference Documentation
         │   ├── PROJECT_TRACKING.md   - Progress tracking ⭐
         │   ├── CHANGELOG.md          - Version history
         │   ├── PROJECT_STATUS.md     - Current status
         │   ├── PROJECT_COMPLETE.md   - Completion report
         │   ├── PROJECT_SUMMARY.md    - Summary
         │   ├── FIXES_SUMMARY.md      - Bug fixes
         │   ├── database.md           - Database schema
         │   ├── Work-domains.txt      - Phase breakdown
         │   ├── WHATS_NEW.md          - Latest features
         │   └── [... other references]
         │
         └── 📁 releases/              # Release Notes
             └── v1.0.0.md             - Version 1.0.0 release

┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND DOCUMENTATION                         │
├─────────────────────────────────────────────────────────────────┤
│  backend/                                                        │
│    ├── README.md              - Backend overview                 │
│    ├── BACKEND_SETUP.md       - Setup instructions              │
│    └── tests/README.md        - Testing guide                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND DOCUMENTATION                        │
├─────────────────────────────────────────────────────────────────┤
│  frontend/                                                       │
│    └── README.md              - Frontend overview                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE DOCUMENTATION                        │
├─────────────────────────────────────────────────────────────────┤
│  database/                                                       │
│    ├── README.md              - Database overview                │
│    ├── schema_phase1.sql      - Phase 1 schema                  │
│    ├── SUPABASE_SETUP.sql     - Supabase setup                  │
│    └── [... migration files]                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Documentation by User Type

### 👤 New Users
**Start Here:**
1. [README.md](../README.md) - Project overview
2. [GETTING_STARTED.md](GETTING_STARTED.md) - First steps
3. [setup/QUICKSTART.md](setup/QUICKSTART.md) - Quick setup
4. [USER_GUIDE.md](USER_GUIDE.md) - Using the platform

### 👨‍💻 Developers
**Start Here:**
1. [CONTRIBUTING.md](../CONTRIBUTING.md) - How to contribute
2. [setup/BACKEND.md](setup/BACKEND.md) - Backend setup
3. [api/ENDPOINTS.md](api/ENDPOINTS.md) - API reference
4. [guides/development.md](guides/development.md) - Dev workflow

### 🚀 DevOps / Deployment
**Start Here:**
1. [deployment/DEPLOY.md](deployment/DEPLOY.md) - Quick deploy
2. [deployment/DEPLOYMENT_PLAN.md](deployment/DEPLOYMENT_PLAN.md) - Strategy
3. [deployment/docker-deployment.md](deployment/docker-deployment.md) - Docker
4. [setup/ENVIRONMENT.md](setup/ENVIRONMENT.md) - Environment vars

### 📊 Project Managers
**Start Here:**
1. [reference/PROJECT_TRACKING.md](reference/PROJECT_TRACKING.md) - Progress
2. [CHANGELOG.md](../CHANGELOG.md) - Version history
3. [reference/PROJECT_STATUS.md](reference/PROJECT_STATUS.md) - Status
4. [releases/v1.0.0.md](releases/v1.0.0.md) - Release notes

### �� Security Researchers
**Start Here:**
1. [SECURITY.md](../SECURITY.md) - Security policy
2. [architecture/OVERVIEW.md](architecture/OVERVIEW.md) - Architecture
3. [reference/database.md](reference/database.md) - Database schema

---

## 📚 Documentation by Topic

### 🚀 Getting Started
- [GETTING_STARTED.md](GETTING_STARTED.md)
- [setup/QUICKSTART.md](setup/QUICKSTART.md)
- [USER_GUIDE.md](USER_GUIDE.md)
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### ⚙️ Setup & Configuration
- [setup/BACKEND.md](setup/BACKEND.md)
- [setup/FRONTEND.md](setup/FRONTEND.md)
- [setup/DATABASE.md](setup/DATABASE.md)
- [setup/ENVIRONMENT.md](setup/ENVIRONMENT.md)
- [setup/SUPABASE_GUIDE.md](setup/SUPABASE_GUIDE.md)

### 🚢 Deployment
- [deployment/DEPLOY.md](deployment/DEPLOY.md)
- [deployment/vercel-deployment.md](deployment/vercel-deployment.md)
- [deployment/oracle-vm-deployment.md](deployment/oracle-vm-deployment.md)
- [deployment/docker-deployment.md](deployment/docker-deployment.md)

### 📡 API & Integration
- [api/ENDPOINTS.md](api/ENDPOINTS.md) ⭐
- [guides/api-guide.md](guides/api-guide.md)
- [api/authentication.md](api/authentication.md)

### 🏗️ Architecture & Design
- [architecture/OVERVIEW.md](architecture/OVERVIEW.md)
- [reference/database.md](reference/database.md)
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

### 🤝 Contributing
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)
- [guides/development.md](guides/development.md)

### 📊 Project Tracking
- [reference/PROJECT_TRACKING.md](reference/PROJECT_TRACKING.md) ⭐
- [reference/PROJECT_STATUS.md](reference/PROJECT_STATUS.md)
- [CHANGELOG.md](../CHANGELOG.md)

### 🔧 Troubleshooting
- [guides/TROUBLESHOOTING.md](guides/TROUBLESHOOTING.md)
- [SECURITY.md](../SECURITY.md)

---

## 🔍 Quick Search Guide

| Looking for... | Go to... |
|----------------|----------|
| How to get started | [GETTING_STARTED.md](GETTING_STARTED.md) |
| How to install | [setup/QUICKSTART.md](setup/QUICKSTART.md) |
| API documentation | [api/ENDPOINTS.md](api/ENDPOINTS.md) |
| How to contribute | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Project progress | [reference/PROJECT_TRACKING.md](reference/PROJECT_TRACKING.md) |
| Deployment guide | [deployment/DEPLOY.md](deployment/DEPLOY.md) |
| Troubleshooting | [guides/TROUBLESHOOTING.md](guides/TROUBLESHOOTING.md) |
| What's new | [CHANGELOG.md](../CHANGELOG.md) |
| Security issues | [SECURITY.md](../SECURITY.md) |
| Database schema | [reference/database.md](reference/database.md) |

---

## 📱 Mobile-Friendly Access

All documentation is written in Markdown and can be viewed on:
- ✅ GitHub web interface
- ✅ GitHub mobile app
- ✅ Local text editors
- ✅ VS Code
- ✅ Any Markdown viewer

---

## 🔄 Keep Documentation Updated

When adding new documentation:
1. Add it to the appropriate folder
2. Update this map
3. Update [docs/index.md](index.md)
4. Add link in [README.md](../README.md) if relevant
5. Update [CHANGELOG.md](../CHANGELOG.md)

---

**Last Updated:** November 29, 2025  
**Total Documentation Files:** 40+  
**Languages:** English  
**Format:** Markdown (.md)
