# Changelog

All notable changes to Agent M will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Web crawling system
- Company discovery automation
- Email approval workflow
- Telegram bot integration

---

## [0.1.0] - 2025-11-25

### Added - Project Foundation
#### Frontend
- Next.js 14 project structure with App Router
- TailwindCSS configuration
- Dashboard layout component
- Resume upload UI component
- Context setup form component
- Authentication UI (login/signup pages)
- TypeScript configuration
- Supabase client integration

#### Backend
- FastAPI application structure
- Authentication middleware
- File upload endpoints (`/api/v1/upload/resume`)
- Resume parser endpoint (`/api/v1/parse/resume`)
- Context builder endpoint (`/api/v1/context/build`)
- Health check endpoint (`/health`)
- CORS configuration
- Environment variable management
- Pydantic models for request/response validation

#### AI Engine
- LangChain integration setup
- OpenAI GPT-4 configuration
- Resume skill extraction module
- Context refinement chat bot
- Prompt templates system
- Text processing utilities

#### Email Engine
- SMTP connector implementation
- Email sending functionality
- Password encryption/decryption
- Email template system
- Manual send API endpoint

#### Database
- Supabase integration
- User profiles table schema
- Resume storage table schema
- Context profiles table schema
- SMTP credentials table schema
- Row Level Security (RLS) policies
- Database migration scripts

#### Documentation
- Complete SMTP setup guide
- Supabase configuration guide
- Google OAuth setup guide
- Deployment configuration guide
- Web crawler API keys guide
- Project README
- Version tracking system
- Changelog initialization

#### DevOps
- Docker configuration for backend
- Fly.io deployment config (`fly.toml`)
- Railway configuration
- Environment variable templates (`.env.example`)
- Git ignore configuration
- Requirements files (Python, Node)

### Configuration Files Created
- `.env.example` for all services
- `requirements.txt` for Python dependencies
- `package.json` for frontend dependencies
- `tsconfig.json` for TypeScript
- `tailwind.config.js` for styling
- `next.config.js` for Next.js

### Infrastructure
- Project folder structure established
- Development environment setup
- Local development scripts
- Testing framework setup

### Security
- Password encryption implementation
- JWT token verification
- Secure credential storage
- Row-level security policies

---

## Version Update Guidelines

When making changes, update this file following this format:

### [Version Number] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes in existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security fixes or improvements

---

## Links

- [Repository](https://github.com/ak-1344/AgentM)
- [Issues](https://github.com/ak-1344/AgentM/issues)
- [Discussions](https://github.com/ak-1344/AgentM/discussions)

---

Last Updated: November 25, 2025
