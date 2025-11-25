# Agent M Backend

FastAPI-based REST API for Agent M's automated outreach platform.

**Version:** 1.0.0  
**Language:** Python 3.12  
**Framework:** FastAPI 0.104.1

---

## 📋 Overview

The backend provides a RESTful API for:
- User authentication (JWT)
- Resume upload and AI parsing
- Context profile management
- Email generation and management
- AI chatbot interactions
- Activity logging
- SMTP configuration

---

## 🗂️ Directory Structure

```
backend/
├── app/                      # Application code
│   ├── api/                 # API routes
│   │   └── v1/
│   │       ├── endpoints/   # Route handlers
│   │       │   ├── resume.py
│   │       │   ├── context.py
│   │       │   ├── smtp.py
│   │       │   ├── email.py
│   │       │   ├── email_management.py
│   │       │   ├── chatbot.py
│   │       │   └── logs.py
│   │       └── router.py    # API router
│   ├── core/                # Core functionality
│   │   ├── config.py        # Settings (Pydantic)
│   │   └── security.py      # Auth & encryption
│   ├── database/            # Database clients
│   │   └── supabase_client.py
│   ├── models/              # Data models
│   │   └── schemas.py       # Pydantic schemas
│   └── services/            # Business logic
│       ├── resume_service.py
│       ├── context_service.py
│       ├── smtp_service.py
│       ├── email_service.py
│       ├── email_management_service.py
│       ├── chatbot_service.py
│       └── logs_service.py
├── tests/                   # Unit tests
│   ├── conftest.py
│   ├── test_resume_service.py
│   └── ...
├── main.py                  # FastAPI app entry point
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
├── .env                     # Environment variables (create this)
├── Dockerfile               # Docker configuration
└── BACKEND_SETUP.md         # Detailed setup guide
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python3 -m venv /tmp/agentm-venv

# Activate it
source /tmp/agentm-venv/bin/activate  # Linux/Mac
# OR
/tmp/agentm-venv\Scripts\activate  # Windows

# Install packages
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit with your credentials
nano .env
```

**Required variables:**
- `SECRET_KEY` - JWT signing key
- `ENCRYPTION_KEY` - Fernet encryption key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `SUPABASE_JWT_SECRET` - Supabase JWT secret
- `OPENAI_API_KEY` - OpenAI API key

**[📖 Complete Setup Guide](BACKEND_SETUP.md)**

### 3. Start Server

```bash
# Using Python directly
python main.py

# OR using management script
cd ..
./scripts/backend.sh start
```

Access at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health

---

## 🏗️ Architecture

### Layered Design

```
┌─────────────────────────────┐
│    API Layer (endpoints/)   │  ← HTTP requests/responses
├─────────────────────────────┤
│  Service Layer (services/)  │  ← Business logic
├─────────────────────────────┤
│ Database Layer (database/)  │  ← Data persistence
└─────────────────────────────┘
```

### API Layer (`app/api/v1/endpoints/`)
- Handles HTTP requests
- Validates input with Pydantic
- Calls service layer
- Returns formatted responses

### Service Layer (`app/services/`)
- Implements business logic
- Orchestrates AI/LLM calls
- Interacts with database
- Handles errors gracefully

### Database Layer (`app/database/`)
- Supabase client singleton
- Query execution
- Connection management

---

## 📚 Key Technologies

- **FastAPI** - Modern web framework
- **Pydantic** - Data validation
- **Supabase** - PostgreSQL database + auth
- **OpenAI** - GPT-4 for AI features
- **LangChain** - LLM orchestration
- **aiosmtplib** - Async email sending
- **Cryptography** - Password encryption
- **Pytest** - Testing framework

---

## 🔐 Security

- **JWT Authentication** - All endpoints require valid token
- **Row Level Security** - Database-level access control
- **Fernet Encryption** - SMTP passwords encrypted at rest
- **Input Validation** - Pydantic models validate all inputs
- **CORS Configuration** - Controlled cross-origin access

---

## 🧪 Testing

```bash
# Activate venv
source /tmp/agentm-venv/bin/activate

# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_resume_service.py -v
```

---

## 📖 API Endpoints

### Health
- `GET /health` - Health check

### Resume
- `POST /api/v1/resume/upload` - Upload resume
- `GET /api/v1/resume/` - Get resume data

### Context
- `POST /api/v1/context/` - Save context
- `GET /api/v1/context/` - Get context

### SMTP
- `POST /api/v1/smtp/save` - Save SMTP config
- `POST /api/v1/smtp/test` - Test SMTP

### Email
- `POST /api/v1/email/send` - Send email

### Email Management
- `POST /api/v1/emails/generate` - Generate email
- `GET /api/v1/emails/list` - List emails
- `GET /api/v1/emails/{id}` - Get email
- `PUT /api/v1/emails/{id}/status` - Update status
- `DELETE /api/v1/emails/{id}` - Delete email

### AI Chatbot
- `POST /api/v1/emails/chatbot/review` - Start review
- `POST /api/v1/emails/chatbot/message` - Send message
- `POST /api/v1/emails/chatbot/quick-action` - Quick action

### Activity Logs
- `POST /api/v1/logs/activity` - Create log
- `GET /api/v1/logs/activity` - List logs
- `DELETE /api/v1/logs/activity/{id}` - Delete log
- `DELETE /api/v1/logs/activity/clear` - Clear all logs

**[📖 Complete API Documentation](../docs/api/README.md)**

---

## 🛠️ Development

### Code Style
- Follow PEP 8
- Use type hints
- Add docstrings
- Use async/await for I/O

### Adding New Endpoints
1. Create Pydantic model in `app/models/schemas.py`
2. Implement service in `app/services/`
3. Add endpoint in `app/api/v1/endpoints/`
4. Register in `app/api/v1/router.py`
5. Write tests in `tests/`

### Environment Variables
See `.env.example` for all available variables.

**[📖 Environment Reference](../docs/setup/ENVIRONMENT.md)**

---

## 🐛 Troubleshooting

### Common Issues

**Module Not Found**
```bash
source /tmp/agentm-venv/bin/activate
pip install -r requirements.txt
```

**Port Already in Use**
```bash
lsof -i :8000
kill -9 <PID>
```

**Database Connection Failed**
- Check `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Ensure Supabase project is accessible

**OpenAI Errors**
- Verify `OPENAI_API_KEY` is valid
- Check API credits at platform.openai.com

**[📖 Complete Troubleshooting Guide](../docs/guides/TROUBLESHOOTING.md)**

---

## 📚 Documentation

- **[Setup Guide](BACKEND_SETUP.md)** - Detailed setup instructions
- **[API Documentation](../docs/api/README.md)** - All endpoints
- **[Architecture](../docs/architecture/OVERVIEW.md)** - System design
- **[Environment Variables](../docs/setup/ENVIRONMENT.md)** - Config reference
- **[Troubleshooting](../docs/guides/TROUBLESHOOTING.md)** - Common issues

---

## 🔗 Related

- **[Frontend README](../frontend/README.md)** - Frontend documentation
- **[Database README](../database/README.md)** - Database schema
- **[Scripts README](../scripts/README.md)** - Management scripts
- **[Main README](../README.md)** - Project overview

---

**Version:** 1.0.0 | **License:** MIT | **Python:** 3.12+ | **FastAPI:** 0.104.1
