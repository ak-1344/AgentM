# Changelog

All notable changes to Agent M will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-01 - Production Ready Release 🚀

### Added - Complete Email Management & AI Chatbot

#### 🤖 Email Management System
- **Email Generation**: GPT-4 powered personalized email generation with company context
- **4-Stage Workflow**: New → Under Review → Approved → Rejected status management
- **Email CRUD Operations**: Create, read, update, delete emails via API
- **Company Metadata**: Track company name, email, position, keywords per email
- **Batch Operations**: List and filter emails by status and company
- **Email Templates**: Dynamic subject and body generation based on user context

**New API Endpoints:**
- `POST /api/v1/emails/generate` - Generate new email
- `GET /api/v1/emails/list` - List all user emails with filters
- `GET /api/v1/emails/{email_id}` - Get specific email details
- `PUT /api/v1/emails/{email_id}/status` - Update email status
- `DELETE /api/v1/emails/{email_id}` - Delete email

#### 🤖 AI Chatbot Assistant
- **Interactive Review**: Chat-based interface for reviewing and editing emails
- **Conversation Context**: Maintains chat history for contextual responses
- **Quick Actions**: Instant email transformations
  - Make it more formal
  - Make it more casual
  - Make it shorter
  - Make it more engaging
- **Real-time Editing**: Apply AI suggestions directly to email content
- **Session Management**: Persistent chatbot sessions per email

**New API Endpoints:**
- `POST /api/v1/emails/chatbot/review` - Start chatbot review session
- `POST /api/v1/emails/chatbot/message` - Send message to chatbot
- `POST /api/v1/emails/chatbot/quick-action` - Apply quick action

#### 📊 Activity Logging System
- **Real-time Logs**: Background activity tracking for all operations
- **Level Filtering**: Info, Warning, Error, Success categories
- **Auto-refresh**: Configurable polling (default: 5 seconds)
- **Export Functionality**: Download logs in JSON or CSV format
- **Metadata Storage**: Rich context data in JSONB format
- **User Isolation**: RLS ensures users only see their own logs

**New API Endpoints:**
- `POST /api/v1/logs/activity` - Create activity log
- `GET /api/v1/logs/activity` - List logs with level filter
- `DELETE /api/v1/logs/activity/{log_id}` - Delete specific log
- `DELETE /api/v1/logs/activity/clear` - Clear all user logs

#### 🗄️ Database Schema
- **New Table**: `email_management` - Email storage and workflow
- **New Table**: `chatbot_sessions` - Chat conversation history
- **New Table**: `activity_logs` - Activity tracking and monitoring
- **RLS Policies**: All tables have user-scoped access control
- **Indexes**: Optimized queries for common operations

#### 🔧 Backend Infrastructure
- **Python 3.12**: Updated to latest Python version
- **Service Architecture**: Separated business logic into services
  - `EmailManagementService` - Email CRUD operations
  - `ChatbotService` - AI chatbot interactions
  - `LogsService` - Activity logging
- **Error Handling**: Comprehensive try-catch blocks with logging
- **Type Safety**: Full type hints across all modules
- **Async Operations**: Async/await for all I/O operations
- **Health Checks**: Enhanced health endpoint with version info

#### 🎨 Frontend Features
- **Email Management Page**: Full CRUD interface for emails
- **AI Chatbot Dialog**: Interactive chat interface with quick actions
- **Activity Logs Page**: Real-time log viewer with filters and export
- **Status Badges**: Visual indicators for email workflow stages
- **Loading States**: Spinner and skeleton loaders
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-optimized layouts

#### 📚 Documentation
- **Release Notes**: Comprehensive v1.0.0 release documentation
- **API Documentation**: All 11 new endpoints documented
- **Setup Guides**: Backend setup with venv instructions
- **Management Script**: `backend.sh` for easy backend management
- **Architecture Docs**: System design and service layer docs
- **User Guides**: Email management and chatbot usage guides

#### 🔐 Security Enhancements
- **Fernet Encryption**: Upgraded SMTP credential encryption
- **JWT Validation**: Enhanced token verification
- **RLS Enforcement**: All new tables have proper policies
- **Input Validation**: Pydantic models for all requests
- **SQL Injection Protection**: Parameterized queries throughout

#### 🛠️ Developer Experience
- **Virtual Environment**: Setup script for `/tmp/agentm-venv`
- **Backend Management**: `backend.sh` script with start/stop/status/logs
- **Health Monitoring**: Health check with JSON response
- **API Documentation**: OpenAPI/Swagger at `/docs`
- **Environment Validation**: Startup checks for required variables

### Changed
- **Python Version**: Updated from 3.11 to 3.12
- **OpenAI Library**: Updated from 1.3.7 to 1.6.1 for LangChain compatibility
- **Supabase Client**: Using 2.3.4 with updated httpx dependencies
- **CORS Configuration**: Changed to JSON array format `["http://localhost:3000","*"]`
- **Error Responses**: Standardized error format across all endpoints
- **Logging Format**: Enhanced with timestamps and context data

### Fixed
- **Dependency Conflicts**: Resolved httpx version conflicts between supabase and postgrest-py
- **Missing Function**: Added `get_supabase_client()` convenience function
- **CORS Parsing**: Fixed JSON array parsing for CORS_ORIGINS
- **RLS Policies**: Corrected user_id filtering in policies
- **Chatbot State**: Fixed session state management
- **Email Status**: Resolved status update edge cases

### Removed
- **Redundant Dependencies**: Removed explicit postgrest-py and storage3 (managed by supabase)
- **Hardcoded httpx Version**: Let supabase manage its own dependencies

---

## [0.1.0] - 2024-12 - Phase 1 MVP Complete 🎉

### Added - Complete Phase 1 Implementation

#### Frontend Application
- **Authentication System**: Login, signup with Supabase Auth
- **Dynamic Dashboard**: Real-time setup progress tracking
- **Resume Management**: Upload, AI parsing, storage
- **Context Configuration**: Target roles, industries, geography
- **Email Composer**: Rich text editor, SMTP integration
- **Settings Page**: SMTP configuration and testing
- **Error Handling**: ErrorBoundary component for crash recovery
- **Notifications**: Toast notification system (ToastContext)
- **Responsive Design**: Mobile-friendly TailwindCSS UI

#### Backend API
- **Health Check**: `/health` endpoint
- **Resume Endpoints**: Upload, parse, list resumes
- **Context Endpoints**: Save, get context profiles
- **SMTP Endpoints**: Save, test SMTP configuration
- **Email Endpoint**: Send emails via SMTP
- **Authentication**: JWT token validation
- **Error Handling**: Global exception handler
- **Security**: CORS, encryption, RLS

#### Testing Infrastructure (NEW!)
- **Pytest Setup**: Configuration, fixtures, mocks
- **Backend Tests**: Resume, context, API tests
- **Coverage**: Test coverage reporting
- **Documentation**: Comprehensive testing guides
- **Frontend Tests**: Structure and setup ready

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
