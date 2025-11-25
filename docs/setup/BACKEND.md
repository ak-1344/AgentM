# Backend Setup Guide

Complete guide to setting up the Agent M backend (FastAPI + Python).

---

## 📋 Prerequisites

- **Python 3.12+** installed
- **pip** package manager
- **Supabase account** (free tier works)
- **OpenAI API key**
- **Git** (for cloning)

---

## 🚀 Quick Setup (5 minutes)

```bash
# 1. Navigate to backend directory
cd AgentM/backend

# 2. Create virtual environment in /tmp
python3 -m venv /tmp/agentm-venv

# 3. Activate virtual environment
source /tmp/agentm-venv/bin/activate  # Linux/Mac
# OR
/tmp/agentm-venv\Scripts\activate  # Windows

# 4. Install dependencies
pip install -r requirements.txt

# 5. Configure environment
cp .env.example .env
# Edit .env with your credentials (see below)

# 6. Start backend
python main.py
# OR use the management script
cd ..
./scripts/backend.sh start
```

Backend will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 📦 Dependencies

All dependencies are in `requirements.txt`:

### Core Framework
- `fastapi==0.104.1` - Modern web framework
- `uvicorn[standard]==0.24.0` - ASGI server
- `pydantic==2.5.2` - Data validation
- `pydantic-settings==2.1.0` - Settings management

### Database & Storage
- `supabase==2.3.4` - Supabase Python client
- `httpx==0.25.2` - HTTP client (used by Supabase)

### AI & LLM
- `openai==1.6.1` - OpenAI GPT-4 API
- `langchain==0.0.350` - LLM orchestration
- `langchain-openai==0.0.2` - LangChain OpenAI integration

### Authentication & Security
- `python-jose[cryptography]==3.3.0` - JWT handling
- `passlib[bcrypt]==1.7.4` - Password hashing
- `cryptography==41.0.7` - Fernet encryption

### File Processing
- `PyPDF2==3.0.1` - PDF parsing
- `python-docx==1.1.0` - DOCX parsing
- `python-multipart==0.0.6` - File upload handling

### Email
- `aiosmtplib==3.0.1` - Async SMTP client

### Testing
- `pytest==7.4.3` - Testing framework
- `pytest-asyncio==0.21.1` - Async test support

---

## ⚙️ Environment Configuration

### 1. Copy Template
```bash
cp .env.example .env
```

### 2. Configure Variables

Edit `.env` with your values:

```bash
# Application Settings
APP_NAME=agent-m-backend
ENV=development
DEBUG=true

# Server Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
BACKEND_RELOAD=true

# Security Keys (GENERATE THESE!)
SECRET_KEY=your-secret-key-here
ENCRYPTION_KEY=your-fernet-key-here

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:3000","*"]

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# LangChain Settings
LANGCHAIN_TRACING_V2=false
LANGCHAIN_API_KEY=optional-langsmith-key
```

### 3. Generate Secret Keys

**SECRET_KEY** (for JWT signing):
```bash
openssl rand -hex 32
```

**ENCRYPTION_KEY** (for Fernet encryption):
```bash
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 4. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create/select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_KEY`
5. Go to **Settings** → **API** → **JWT Secret**
   - Copy **JWT Secret** → `SUPABASE_JWT_SECRET`

### 5. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Go to **API Keys**
4. Create new secret key
5. Copy to `OPENAI_API_KEY`

---

## 🗄️ Database Setup

Before starting the backend, set up the database schema:

1. Go to your Supabase project
2. Open **SQL Editor**
3. Run these scripts in order:

```sql
-- 1. Phase 1 schema (users, resumes, context, smtp)
-- Copy and run: database/schema_phase1.sql

-- 2. Email management schema (emails, chatbot, logs)
-- Copy and run: database/schema_email_management.sql
```

**[📖 Detailed Database Setup](DATABASE.md)**

---

## 🏃 Running the Backend

### Method 1: Using Python Directly

```bash
# Activate virtual environment
source /tmp/agentm-venv/bin/activate

# Start server
cd backend
python main.py

# Server starts at http://localhost:8000
```

### Method 2: Using Management Script (Recommended)

```bash
# From project root
./scripts/backend.sh start

# Other commands:
./scripts/backend.sh stop      # Stop backend
./scripts/backend.sh restart   # Restart backend
./scripts/backend.sh status    # Check status & health
./scripts/backend.sh logs      # View logs
```

### Method 3: Using Uvicorn Directly

```bash
# Activate venv
source /tmp/agentm-venv/bin/activate

# Start with custom settings
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🧪 Testing the Backend

### Health Check

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "agent-m-backend",
  "version": "1.0.0",
  "environment": "development"
}
```

### API Documentation

Open in browser:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Test Authentication

```bash
# This should return 401 Unauthorized (expected)
curl http://localhost:8000/api/v1/resume/
```

### Run Unit Tests

```bash
# Activate venv
source /tmp/agentm-venv/bin/activate

# Run all tests
cd backend
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_resume_service.py
```

---

## 🔧 Backend Management Script

The `backend.sh` script provides easy backend management.

### Features

- ✅ Start/stop/restart backend
- ✅ Health check validation
- ✅ Status monitoring with PID
- ✅ Log viewing
- ✅ Color-coded output
- ✅ Background process management

### Commands

```bash
# Start backend in background
./scripts/backend.sh start
# Output: ✅ Backend started successfully
#         PID: 12345
#         URL: http://localhost:8000

# Check status
./scripts/backend.sh status
# Output: ✅ Backend is running
#         PID: 12345
#         Health: OK

# View logs
./scripts/backend.sh logs
# Shows live tail of backend.log

# Stop backend
./scripts/backend.sh stop
# Output: ✅ Backend stopped successfully

# Restart backend
./scripts/backend.sh restart
# Stops then starts with health check
```

### Script Details

- **Virtual Environment**: `/tmp/agentm-venv`
- **PID File**: `/tmp/backend.pid`
- **Log File**: `/tmp/backend.log`
- **Working Directory**: `backend/`

---

## 🐛 Troubleshooting

### Issue: Import Errors

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
# Make sure venv is activated
source /tmp/agentm-venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Port Already in Use

**Error**: `OSError: [Errno 98] Address already in use`

**Solution**:
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
BACKEND_PORT=8001 python main.py
```

### Issue: Supabase Connection Failed

**Error**: `supabase.SupabaseException: Invalid API key`

**Solution**:
1. Check `SUPABASE_URL` is correct
2. Verify `SUPABASE_KEY` is the **anon public** key
3. Ensure no extra spaces in `.env`
4. Test connection:
   ```bash
   curl https://your-project.supabase.co/rest/v1/
   ```

### Issue: OpenAI API Errors

**Error**: `openai.error.AuthenticationError`

**Solution**:
1. Check `OPENAI_API_KEY` is correct
2. Verify API key is active at platform.openai.com
3. Check account has credits
4. Test key:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

### Issue: Database Migration Errors

**Error**: `relation "email_management" does not exist`

**Solution**:
1. Ensure you ran `schema_phase1.sql` first
2. Then run `schema_email_management.sql`
3. Check SQL Editor for errors
4. Verify tables exist in Table Editor

### Issue: Virtual Environment Not Found

**Error**: `bash: /tmp/agentm-venv/bin/activate: No such file or directory`

**Solution**:
```bash
# Recreate virtual environment
python3 -m venv /tmp/agentm-venv

# Activate and install
source /tmp/agentm-venv/bin/activate
pip install -r backend/requirements.txt
```

### Issue: Permission Denied on backend.sh

**Error**: `bash: ./scripts/backend.sh: Permission denied`

**Solution**:
```bash
# Make script executable
chmod +x scripts/backend.sh

# Now run it
./scripts/backend.sh start
```

---

## 📊 Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (create this)
├── .env.example            # Environment template
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/  # API route handlers
│   │   │   │   ├── resume.py
│   │   │   │   ├── context.py
│   │   │   │   ├── smtp.py
│   │   │   │   ├── email.py
│   │   │   │   ├── email_management.py
│   │   │   │   ├── chatbot.py
│   │   │   │   └── logs.py
│   │   │   └── router.py   # Router aggregation
│   ├── core/
│   │   ├── config.py       # Settings and config
│   │   └── security.py     # Auth and encryption
│   ├── database/
│   │   └── supabase_client.py  # Supabase singleton
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   └── services/
│       ├── resume_service.py
│       ├── context_service.py
│       ├── smtp_service.py
│       ├── email_service.py
│       ├── email_management_service.py
│       ├── chatbot_service.py
│       └── logs_service.py
└── tests/
    ├── test_resume_service.py
    ├── test_context_service.py
    └── ...
```

---

## 🔐 Security Best Practices

### Never Commit Secrets
```bash
# .env is in .gitignore
# Never commit:
# - SUPABASE_KEY
# - SUPABASE_JWT_SECRET
# - OPENAI_API_KEY
# - SECRET_KEY
# - ENCRYPTION_KEY
```

### Rotate Keys Regularly
- Change `SECRET_KEY` periodically
- Regenerate `ENCRYPTION_KEY` if compromised
- Rotate OpenAI API keys
- Update Supabase keys if leaked

### Use Environment-Specific Keys
```bash
# Development
SECRET_KEY=dev-secret-key

# Production (use different keys!)
SECRET_KEY=prod-secret-key-much-longer-and-random
```

---

## 📚 Additional Resources

- **[Environment Variables Guide](ENVIRONMENT.md)** - Complete variable reference
- **[Database Setup](DATABASE.md)** - Database schema guide
- **[API Documentation](../api/README.md)** - API endpoint reference
- **[Troubleshooting](../guides/TROUBLESHOOTING.md)** - Common issues
- **[Deployment Guide](../deployment/PRODUCTION.md)** - Production deployment

---

## 🆘 Getting Help

- **Documentation**: Check [docs/index.md](../index.md)
- **GitHub Issues**: [Report bugs](https://github.com/ak-1344/AgentM/issues)
- **Discussions**: [Ask questions](https://github.com/ak-1344/AgentM/discussions)

---

**[← Back to Setup Guides](README.md)** | **[Next: Frontend Setup →](FRONTEND.md)**
