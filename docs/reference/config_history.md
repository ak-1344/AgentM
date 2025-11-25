# Configuration History

This file tracks all environment variables, configuration changes, and schema modifications throughout Agent M's development.

---

## Current Configuration (v0.1.0)

### Environment Variables

#### Frontend (`frontend/.env.local`)
```env
# Added: 2025-11-25
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
NEXT_PUBLIC_API_URL=<backend-api-url>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

#### Backend (`backend/.env`)
```env
# Added: 2025-11-25
# Supabase
SUPABASE_URL=<supabase-project-url>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
SUPABASE_JWT_SECRET=<jwt-secret-from-supabase>
DATABASE_URL=<postgresql-connection-string>

# Security
ENCRYPTION_KEY=<fernet-encryption-key>
SECRET_KEY=<api-secret-key>

# AI
OPENAI_API_KEY=<openai-api-key>
OPENAI_MODEL=gpt-4-turbo-preview

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USE_TLS=true

# API
API_V1_PREFIX=/api/v1
BACKEND_CORS_ORIGINS=["http://localhost:3000","https://your-domain.com"]

# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO
```

#### Scraper (`scraper/.env`)
```env
# To be added in Phase 2
# GOOGLE_SEARCH_API_KEY=<api-key>
# GOOGLE_SEARCH_ENGINE_ID=<search-engine-id>
# SERPAPI_API_KEY=<serpapi-key>
# CRUNCHBASE_API_KEY=<crunchbase-key>
# CLEARBIT_API_KEY=<clearbit-key>
# HUNTER_IO_API_KEY=<hunter-key>
```

#### Telegram Bot (`telegram_bot/.env`)
```env
# To be added in Phase 3
# TELEGRAM_BOT_TOKEN=<bot-token>
# TELEGRAM_ADMIN_CHAT_ID=<admin-chat-id>
```

---

## Database Schema History

### Initial Schema (v0.1.0) - 2025-11-25

#### Tables Created:

**1. user_profiles**
```sql
Fields:
- id (UUID, PRIMARY KEY, references auth.users)
- email (TEXT, NOT NULL)
- full_name (TEXT)
- phone_number (TEXT)
- domain_context (TEXT)
- created_at (TIMESTAMP WITH TIME ZONE)
- updated_at (TIMESTAMP WITH TIME ZONE)

RLS Policies:
- Users can view own profile
- Users can update own profile
```

**2. resumes**
```sql
Fields:
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY -> user_profiles.id)
- file_name (TEXT, NOT NULL)
- file_path (TEXT, NOT NULL)
- extracted_text (TEXT)
- parsed_data (JSONB)
- created_at (TIMESTAMP WITH TIME ZONE)

RLS Policies:
- Users can view own resumes
- Users can insert own resumes
```

**3. context_profiles**
```sql
Fields:
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY -> user_profiles.id, UNIQUE)
- target_roles (TEXT[])
- preferred_industries (TEXT[])
- pitch_tone (TEXT, DEFAULT 'professional')
- keywords (TEXT[])
- custom_message (TEXT)
- geography (TEXT[])
- context_json (JSONB)
- created_at (TIMESTAMP WITH TIME ZONE)
- updated_at (TIMESTAMP WITH TIME ZONE)

RLS Policies:
- Users can manage own context
```

**4. smtp_credentials**
```sql
Fields:
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY -> user_profiles.id, UNIQUE)
- smtp_host (TEXT, NOT NULL)
- smtp_port (INTEGER, NOT NULL)
- smtp_user (TEXT, NOT NULL)
- smtp_password_encrypted (TEXT, NOT NULL)
- use_tls (BOOLEAN, DEFAULT true)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP WITH TIME ZONE)

RLS Policies:
- Users can manage own SMTP credentials
```

#### Storage Buckets:
- **resumes**: Private bucket for resume files
  - Max file size: 10MB
  - Allowed types: PDF, DOC, DOCX

---

## Configuration Changes Log

### 2025-11-25 - Initial Configuration
- **Action**: Created all base environment variables
- **Reason**: Project initialization
- **Files Modified**: 
  - `frontend/.env.example`
  - `backend/.env.example`
- **Breaking**: No

---

## Planned Changes

### Phase 2 (v0.2.0) - Web Crawling
**New Environment Variables**:
```env
# Scraper
GOOGLE_SEARCH_API_KEY=<key>
GOOGLE_SEARCH_ENGINE_ID=<id>
MAX_SEARCHES_PER_DAY=90
SEARCH_DELAY_SECONDS=2
```

**New Database Tables**:
- `companies`: Store discovered companies
- `email_drafts`: Store generated email drafts

### Phase 3 (v0.3.0) - Approval Workflow
**New Environment Variables**:
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=<token>

# Redis (Celery)
REDIS_URL=<redis-connection-url>
```

**New Database Tables**:
- `outbound_inbox`: Email drafts awaiting approval
- `sent_mail_logs`: Tracking sent emails

### Phase 4 (v0.4.0) - Automation
**New Environment Variables**:
```env
# Celery
CELERY_BROKER_URL=<redis-url>
CELERY_RESULT_BACKEND=<redis-url>
```

**New Database Tables**:
- `follow_up_schedules`: Scheduled follow-up emails

### Phase 5 (v0.5.0) - Reply Intelligence
**New Environment Variables**:
```env
# IMAP
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
```

**New Database Tables**:
- `reply_logs`: Store received replies
- `analytics_views`: Materialized views for analytics

---

## Deprecated Configuration

None yet.

---

## Security Notes

### Sensitive Variables (NEVER commit):
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_KEY`
- `SECRET_KEY`
- `OPENAI_API_KEY`
- `SMTP_PASSWORD`
- All API keys

### Encryption Standards:
- Passwords: Fernet symmetric encryption
- JWTs: HS256 algorithm
- Storage: At-rest encryption via Supabase

---

## Migration History

### Migration 001 - Initial Schema
- **Date**: 2025-11-25
- **Description**: Create base tables for Phase 1
- **Status**: ✅ Applied
- **Rollback**: Available in `database/migrations/001_rollback.sql`

---

## Configuration Best Practices

1. **Always use `.env` files** - Never hardcode secrets
2. **Use `.env.example`** - Template for team members
3. **Rotate keys regularly** - Especially for production
4. **Separate environments** - Dev, Staging, Production
5. **Document changes here** - Before pushing to main

---

## Maintenance Schedule

- **Weekly**: Review environment variables
- **Monthly**: Rotate non-critical API keys
- **Quarterly**: Audit database schemas
- **Yearly**: Major security audit

---

Last Updated: November 25, 2025  
Next Review: December 2, 2025
