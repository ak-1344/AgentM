# Backend Setup & Testing Guide

## Quick Start

### 1. Install Dependencies ✅
Already installed! If you need to reinstall:
```bash
cd /workspaces/AgentM/backend
pip install fastapi uvicorn python-multipart supabase python-dotenv openai langchain langchain-openai python-jose passlib cryptography aiosmtplib email-validator PyPDF2 python-docx pdfplumber pydantic pydantic-settings psycopg2-binary
```

### 2. Configure Environment Variables

Create `/workspaces/AgentM/backend/.env`:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
ENVIRONMENT=development

# Security Keys (Generate new ones for production!)
SECRET_KEY=your-secret-key-min-32-chars-long
ENCRYPTION_KEY=your-base64-encryption-key-44-chars

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_TEMPERATURE=0.7

# CORS Configuration (Frontend URL)
CORS_ORIGINS=http://localhost:3000

# File Upload Configuration
MAX_UPLOAD_SIZE=10485760  # 10MB in bytes
ALLOWED_UPLOAD_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

#### How to Get Supabase Credentials:

1. **Supabase Dashboard** → Your Project → Settings → API
   - Copy `Project URL` → `SUPABASE_URL`
   - Copy `anon public` key → `SUPABASE_ANON_KEY`
   - Copy `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`

2. **JWT Secret**: Settings → API → JWT Settings → JWT Secret
   - Copy `JWT Secret` → `SUPABASE_JWT_SECRET`

3. **Database URL**: Settings → Database → Connection String → URI
   - Copy connection string → `DATABASE_URL`

#### Generate Encryption Key:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

#### Generate Secret Key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Run Database Setup

Go to Supabase SQL Editor and run:
```sql
-- 1. First time: Run schema_phase1.sql (if not done)
-- 2. NEW: Run schema_email_management.sql
```

See `/database/README.md` for details.

### 4. Start Backend Server

```bash
cd /workspaces/AgentM/backend
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 5. Test API Endpoints

#### Check API Health
```bash
curl http://localhost:8000/health
```

#### View API Documentation
Open in browser:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🧪 Testing Endpoints

### 1. Authentication Test
First, login through frontend (http://localhost:3000) to get a session.

### 2. Test Resume Upload
```bash
# Create test file
echo "Test Resume Content" > /tmp/test_resume.txt

# Upload (requires authentication)
curl -X POST http://localhost:8000/api/v1/resume/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/tmp/test_resume.txt"
```

### 3. Test Email Generation
```bash
curl -X POST http://localhost:8000/api/v1/emails/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "TechCorp",
    "company_website": "https://techcorp.com",
    "position_title": "Software Engineer",
    "keywords": ["Python", "FastAPI", "React"]
  }'
```

### 4. Test Logs Endpoint
```bash
curl http://localhost:8000/api/v1/logs/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Troubleshooting

### Error: "Module not found"
```bash
# Reinstall dependencies
cd /workspaces/AgentM/backend
pip install -r requirements.txt
```

### Error: "Validation error for Settings"
- Missing environment variables
- Check `.env` file exists and has all required variables
- Compare with `.env.example`

### Error: "Could not connect to Supabase"
- Check `SUPABASE_URL` is correct
- Verify `SUPABASE_SERVICE_ROLE_KEY` is the service role key (not anon key)
- Test connection: Visit your Supabase URL in browser

### Error: "OpenAI API Error"
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has credits
- Test key: https://platform.openai.com/account/api-keys

### Error: "Table does not exist"
- Run database schema in Supabase SQL Editor
- Check `/database/README.md` for setup instructions
- Verify tables exist: `SELECT * FROM information_schema.tables WHERE table_schema = 'public'`

### CORS Errors
- Ensure `CORS_ORIGINS` includes your frontend URL
- Default: `http://localhost:3000`
- For production, add your domain

## 📝 Development Tips

### Hot Reload
Backend doesn't auto-reload by default. For development:
```bash
# Install uvicorn with reload support
pip install 'uvicorn[standard]'

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### View Logs
Backend logs important operations. Check terminal output for:
- API requests
- AI operations
- Database queries
- Errors and exceptions

### Database Queries
Test queries directly in Supabase:
```sql
-- View emails
SELECT * FROM public.ai_emails LIMIT 10;

-- View logs
SELECT * FROM public.activity_logs ORDER BY created_at DESC LIMIT 20;

-- Check email stats
SELECT status, COUNT(*) FROM public.ai_emails GROUP BY status;
```

### API Testing Tools
- **Swagger UI**: http://localhost:8000/docs (built-in, interactive)
- **Postman**: Import OpenAPI spec from `/docs`
- **curl**: Command-line testing
- **httpie**: `brew install httpie` (user-friendly curl alternative)

## 🚀 Production Checklist

Before deploying to production:

- [ ] Generate strong `SECRET_KEY` and `ENCRYPTION_KEY`
- [ ] Set `DEBUG=False`
- [ ] Set `ENVIRONMENT=production`
- [ ] Use production Supabase project
- [ ] Set proper `CORS_ORIGINS` (your domain)
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy
- [ ] Review RLS policies in database
- [ ] Test all endpoints with production data
- [ ] Set up CI/CD pipeline

## 📚 API Documentation

### Email Management Endpoints

#### Generate Email
```
POST /api/v1/emails/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "company_name": "TechCorp",
  "company_website": "https://techcorp.com",
  "position_title": "Software Engineer",
  "keywords": ["Python", "FastAPI"]
}
```

#### List Emails
```
GET /api/v1/emails/list?status=new
Authorization: Bearer <token>
```

#### Update Email Status
```
PATCH /api/v1/emails/{email_id}/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "approved"
}
```

#### Chat with AI
```
POST /api/v1/emails/{email_id}/chat
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "Make this more formal"
}
```

### Logs Endpoints

#### Get Logs
```
GET /api/v1/logs/?level=info&limit=50
Authorization: Bearer <token>
```

#### Get Log Statistics
```
GET /api/v1/logs/stats
Authorization: Bearer <token>
```

### Resume Endpoints

#### Upload Resume
```
POST /api/v1/resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <resume.pdf>
```

## 🔗 Related Files

- `/database/schema_email_management.sql` - Database schema
- `/database/README.md` - Database setup guide
- `/IMPLEMENTATION_SUMMARY.md` - Full implementation details
- `/backend/.env.example` - Environment variables template
- `/backend/app/api/v1/router.py` - API routes
- `/backend/app/services/` - Business logic services

## ✅ All Done!

Once you:
1. ✅ Create `.env` file with all variables
2. ✅ Run database schema in Supabase
3. ✅ Start backend server

You're ready to test the full system! 🎉

Frontend is already running at http://localhost:3000
Backend will be at http://localhost:8000

Happy coding! 🚀
