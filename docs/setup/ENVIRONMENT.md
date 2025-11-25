# Environment Variables Reference

Complete reference for all environment variables used in Agent M.

---

## 📋 Overview

Agent M uses environment variables for configuration. This guide documents all variables for both backend and frontend.

---

## 🔧 Backend Environment Variables

Location: `/backend/.env`

### Application Settings

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | No | `agent-m-backend` | Application name for logging |
| `ENV` | No | `development` | Environment: development, production, testing |
| `DEBUG` | No | `true` | Enable debug mode (verbose logging) |

**Example:**
```bash
APP_NAME=agent-m-backend
ENV=development
DEBUG=true
```

---

### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BACKEND_HOST` | No | `0.0.0.0` | Server bind address (0.0.0.0 = all interfaces) |
| `BACKEND_PORT` | No | `8000` | Server port number |
| `BACKEND_RELOAD` | No | `true` | Auto-reload on code changes (dev only) |

**Example:**
```bash
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
BACKEND_RELOAD=true
```

---

### Security Keys

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SECRET_KEY` | **Yes** | None | JWT signing key (32+ characters) |
| `ENCRYPTION_KEY` | **Yes** | None | Fernet encryption key for SMTP passwords |

**Generate Keys:**

```bash
# SECRET_KEY (for JWT)
openssl rand -hex 32

# ENCRYPTION_KEY (for Fernet)
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

**Example:**
```bash
SECRET_KEY=451CwzfKwxWYUjGyaISNxNNsQSF--jEq2dGY56w7pL0
ENCRYPTION_KEY=MrpeZjctAroxUixKyuieCa_RKGLdtfwNmxRI4dSvUvo=
```

⚠️ **Security Warning**: 
- Never commit these to version control
- Use different keys for dev/staging/production
- Rotate keys periodically
- Store production keys in secure vault

---

### CORS Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BACKEND_CORS_ORIGINS` | **Yes** | None | Allowed origins (JSON array format) |

**Format:**
```bash
# Development (allow localhost and all origins)
BACKEND_CORS_ORIGINS=["http://localhost:3000","*"]

# Production (allow specific domains only)
BACKEND_CORS_ORIGINS=["https://agentm.com","https://app.agentm.com"]
```

⚠️ **Security**: In production, never use `"*"` - specify exact domains

---

### Supabase Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SUPABASE_URL` | **Yes** | None | Your Supabase project URL |
| `SUPABASE_KEY` | **Yes** | None | Supabase anon public key |
| `SUPABASE_JWT_SECRET` | **Yes** | None | Supabase JWT secret for token verification |

**Where to Find:**

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. **Settings** → **API**:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_KEY`
   - **JWT Secret** → `SUPABASE_JWT_SECRET`

**Example:**
```bash
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-super-secret-jwt-secret-never-share-this
```

---

### OpenAI Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | **Yes** | None | OpenAI API key for GPT-4 |
| `OPENAI_MODEL` | No | `gpt-4-turbo-preview` | Model to use for generation |

**Where to Find:**

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create account
3. **API Keys** → **Create new secret key**
4. Copy key immediately (shown only once)

**Example:**
```bash
OPENAI_API_KEY=sk-proj-1234567890abcdefghijklmnopqrstuvwxyz
OPENAI_MODEL=gpt-4-turbo-preview
```

**Available Models:**
- `gpt-4-turbo-preview` - Latest GPT-4 Turbo (recommended)
- `gpt-4` - Standard GPT-4
- `gpt-3.5-turbo` - Faster, cheaper alternative

---

### LangChain Configuration (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LANGCHAIN_TRACING_V2` | No | `false` | Enable LangSmith tracing |
| `LANGCHAIN_API_KEY` | No | None | LangSmith API key (if tracing enabled) |

**Example:**
```bash
# Disable tracing (default)
LANGCHAIN_TRACING_V2=false

# Enable tracing for debugging
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls_your_langsmith_api_key
```

---

### Email Configuration (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEFAULT_SMTP_HOST` | No | None | Default SMTP server |
| `DEFAULT_SMTP_PORT` | No | `587` | Default SMTP port |

**Example:**
```bash
DEFAULT_SMTP_HOST=smtp.gmail.com
DEFAULT_SMTP_PORT=587
```

Note: Users configure their own SMTP in the app. These are just defaults.

---

## 🎨 Frontend Environment Variables

Location: `/frontend/.env.local`

### Supabase Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | None | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | None | Supabase anon public key |

**Example:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Note**: These must have `NEXT_PUBLIC_` prefix to be available in browser.

---

### Backend API Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000` | Backend API base URL |

**Example:**
```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production
NEXT_PUBLIC_API_URL=https://api.agentm.com
```

---

### Optional Analytics

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | None | Google Analytics measurement ID |
| `NEXT_PUBLIC_SENTRY_DSN` | No | None | Sentry error tracking DSN |

**Example:**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## 📝 Environment File Templates

### Backend `.env` Template

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

# LangChain Settings (Optional)
LANGCHAIN_TRACING_V2=false
LANGCHAIN_API_KEY=
```

### Frontend `.env.local` Template

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 🔐 Security Best Practices

### 1. Never Commit Secrets

```bash
# ✅ Good - Use .env files (in .gitignore)
SECRET_KEY=abc123

# ❌ Bad - Hardcoded in code
SECRET_KEY = "abc123"  # DON'T DO THIS!
```

### 2. Use Different Keys Per Environment

```bash
# Development
SECRET_KEY=dev-simple-key-for-testing

# Production
SECRET_KEY=prod-very-long-random-key-8f7a9b2c3d4e5f6g7h8i9j0k
```

### 3. Rotate Keys Periodically

- **Development**: Every 3 months
- **Production**: Every month
- **After Breach**: Immediately

### 4. Restrict CORS in Production

```bash
# ✅ Good - Specific domains
BACKEND_CORS_ORIGINS=["https://app.agentm.com"]

# ❌ Bad - Allow all origins
BACKEND_CORS_ORIGINS=["*"]
```

### 5. Use Environment Variable Management

For production, use:
- **Vercel**: Environment Variables in project settings
- **Render**: Environment Variables in service settings
- **Docker**: Docker secrets or `.env` files
- **Kubernetes**: ConfigMaps and Secrets

---

## 🧪 Testing Configuration

Create a separate `.env.test` for testing:

```bash
# Backend test environment
ENV=testing
DEBUG=true
SUPABASE_URL=https://test-project.supabase.co
SUPABASE_KEY=test-anon-key
OPENAI_API_KEY=sk-test-key
```

Load in tests:
```python
# pytest.ini or conftest.py
import os
from dotenv import load_dotenv

load_dotenv('.env.test')
```

---

## 🐛 Troubleshooting

### Issue: Variables Not Loading

**Solution:**
```bash
# Check file exists
ls backend/.env

# Check file format (no spaces around =)
cat backend/.env

# Ensure no quotes around values (unless value contains spaces)
SECRET_KEY=abc123  # ✅ Good
SECRET_KEY="abc123"  # ⚠️ Quotes become part of value
```

### Issue: CORS Errors

**Error**: `Access-Control-Allow-Origin header is missing`

**Solution:**
```bash
# Check CORS_ORIGINS is JSON array format
BACKEND_CORS_ORIGINS=["http://localhost:3000","*"]

# Restart backend after changing
./scripts/backend.sh restart
```

### Issue: Supabase Connection Failed

**Error**: `Invalid API key`

**Solution:**
1. Verify `SUPABASE_URL` has no trailing slash
2. Check `SUPABASE_KEY` is **anon public** key (not service_role)
3. Ensure no extra spaces or quotes
4. Test manually:
   ```bash
   curl -H "apikey: $SUPABASE_KEY" $SUPABASE_URL/rest/v1/
   ```

### Issue: OpenAI Authentication Error

**Solution:**
1. Check key starts with `sk-`
2. Verify key is active at platform.openai.com
3. Check account has credits
4. Test key:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

---

## 📊 Environment Validation

Backend validates required variables on startup:

```python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Required fields will raise error if missing
    SECRET_KEY: str
    SUPABASE_URL: str
    OPENAI_API_KEY: str
    
    class Config:
        env_file = ".env"

settings = Settings()  # Raises error if any required var missing
```

---

## 📚 Additional Resources

- **[Backend Setup](BACKEND.md)** - Complete backend setup guide
- **[Frontend Setup](FRONTEND.md)** - Frontend configuration
- **[Database Setup](DATABASE.md)** - Supabase configuration
- **[Troubleshooting](../guides/TROUBLESHOOTING.md)** - Common issues

---

## 🆘 Getting Help

- **Documentation**: [docs/index.md](../index.md)
- **GitHub Issues**: [Report problems](https://github.com/ak-1344/AgentM/issues)
- **Discussions**: [Ask questions](https://github.com/ak-1344/AgentM/discussions)

---

**[← Back to Setup Guides](README.md)** | **[Next: Database Setup →](DATABASE.md)**
