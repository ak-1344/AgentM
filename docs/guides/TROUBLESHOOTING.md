# Troubleshooting Guide

Common issues and solutions for Agent M.

---

## 📋 Quick Diagnostic Checklist

Before diving into specific issues, check these basics:

- [ ] Backend is running (`./scripts/backend.sh status`)
- [ ] Frontend is running (`curl http://localhost:3000`)
- [ ] Virtual environment is activated
- [ ] `.env` files exist and are configured
- [ ] Database schema is up to date
- [ ] Supabase project is accessible
- [ ] OpenAI API key is valid

---

## 🔧 Backend Issues

### Backend Won't Start

**Symptom:** Error when running `python main.py` or `./scripts/backend.sh start`

**Common Causes & Solutions:**

#### 1. Module Not Found Errors

```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```bash
# Ensure venv is activated
source /tmp/agentm-venv/bin/activate

# Verify activation
which python  # Should show /tmp/agentm-venv/bin/python

# Reinstall dependencies
pip install -r backend/requirements.txt
```

#### 2. Port Already in Use

```
OSError: [Errno 98] Address already in use
```

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000
# OR
sudo netstat -tulpn | grep 8000

# Kill the process
kill -9 <PID>

# Or use different port
BACKEND_PORT=8001 python backend/main.py
```

#### 3. Missing Environment Variables

```
pydantic_core._pydantic_core.ValidationError: 1 validation error for Settings
SECRET_KEY
  Field required
```

**Solution:**
```bash
# Check .env file exists
ls backend/.env

# If missing, create from template
cd backend
cp .env.example .env

# Generate required keys
# SECRET_KEY
openssl rand -hex 32

# ENCRYPTION_KEY
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Edit .env and add the generated keys
nano .env
```

---

### Database Connection Errors

**Symptom:** `supabase.SupabaseException` or connection timeouts

#### 1. Invalid API Key

```
supabase.SupabaseException: Invalid API key
```

**Solution:**
```bash
# Verify credentials in .env
cat backend/.env | grep SUPABASE

# Check Supabase dashboard:
# Settings → API
# - SUPABASE_URL should match Project URL
# - SUPABASE_KEY should be "anon public" key (not service_role)

# Test connection manually
curl -H "apikey: YOUR_SUPABASE_KEY" \
  YOUR_SUPABASE_URL/rest/v1/
```

#### 2. RLS Policy Errors

```
permission denied for table user_profiles
```

**Solution:**
```sql
-- In Supabase SQL Editor, check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- If rowsecurity is false, enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Re-run schema files if policies are missing
-- database/schema_phase1.sql
-- database/schema_email_management.sql
```

#### 3. Missing Tables

```
relation "email_management" does not exist
```

**Solution:**
```bash
# Run database migration scripts in order
# 1. Open Supabase SQL Editor
# 2. Run these files in order:
#    - database/schema_phase1.sql
#    - database/schema_email_management.sql

# Verify tables exist
# In Supabase: Table Editor → Check for tables
```

---

### OpenAI API Errors

**Symptom:** Errors when generating emails or using chatbot

#### 1. Authentication Error

```
openai.error.AuthenticationError: Incorrect API key provided
```

**Solution:**
```bash
# Check API key in .env
cat backend/.env | grep OPENAI_API_KEY

# Verify key is valid
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# If invalid, get new key from platform.openai.com
# Update OPENAI_API_KEY in .env
# Restart backend
./scripts/backend.sh restart
```

#### 2. Rate Limit Error

```
openai.error.RateLimitError: Rate limit exceeded
```

**Solution:**
- Check usage at platform.openai.com
- Wait a few minutes and retry
- Upgrade OpenAI plan if needed
- Implement request queuing (future enhancement)

#### 3. Insufficient Credits

```
openai.error.InsufficientQuotaError: You exceeded your current quota
```

**Solution:**
- Add payment method at platform.openai.com
- Check billing settings
- Purchase more credits
- Use gpt-3.5-turbo as cheaper alternative

---

## 🎨 Frontend Issues

### Frontend Won't Start

**Symptom:** Error when running `npm run dev`

#### 1. Dependencies Not Installed

```
Error: Cannot find module 'next'
```

**Solution:**
```bash
cd frontend
npm install
```

#### 2. Port Already in Use

```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 3. Environment Variables Missing

```
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Solution:**
```bash
cd frontend

# Create .env.local if missing
cp .env.example .env.local

# Edit with your Supabase credentials
nano .env.local

# Restart frontend
npm run dev
```

---

### Authentication Issues

#### 1. Unable to Login

**Symptom:** Login form submits but nothing happens

**Solution:**
```javascript
// Check browser console for errors
// Common issues:

// 1. Invalid Supabase URL
// Fix in frontend/.env.local:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co

// 2. Invalid anon key
// Get from Supabase: Settings → API → anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

// 3. CORS error
// Fix in backend/.env:
BACKEND_CORS_ORIGINS=["http://localhost:3000","*"]

// Restart both frontend and backend
```

#### 2. Token Expired Errors

**Symptom:** `JWT expired` or `Invalid token`

**Solution:**
```bash
# User needs to log out and log in again
# In browser: Clear cookies for localhost:3000

# Or implement token refresh (future enhancement)
```

---

### API Connection Errors

#### 1. Network Error / API Unreachable

```
AxiosError: Network Error
```

**Solution:**
```bash
# Check backend is running
./scripts/backend.sh status

# Check API URL in frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# Test backend manually
curl http://localhost:8000/health

# Check firewall isn't blocking port 8000
```

#### 2. CORS Errors

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
```bash
# Check CORS configuration in backend/.env
BACKEND_CORS_ORIGINS=["http://localhost:3000","*"]

# Ensure it's JSON array format (not comma-separated string)
# Restart backend
./scripts/backend.sh restart
```

---

## 📊 Email & SMTP Issues

### SMTP Configuration Failed

**Symptom:** Cannot save SMTP configuration or test fails

#### 1. Connection Refused

```
Connection refused when connecting to SMTP server
```

**Solution:**
- Verify smtp_host and smtp_port are correct
- Check firewall allows outgoing connections
- Try port 587 (TLS) or 465 (SSL)
- For Gmail: Enable "Less secure app access" or use App Password

#### 2. Authentication Failed

```
SMTP authentication failed
```

**Solution for Gmail:**
```
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Use generated password (not your Gmail password)
4. Use in Agent M:
   - smtp_host: smtp.gmail.com
   - smtp_port: 587
   - smtp_username: your@gmail.com
   - smtp_password: <app-password-from-step-3>
```

**Solution for Outlook/Office 365:**
```
- smtp_host: smtp.office365.com
- smtp_port: 587
- smtp_username: your@outlook.com
- smtp_password: <your-password>
```

#### 3. TLS/SSL Errors

```
SSL: CERTIFICATE_VERIFY_FAILED
```

**Solution:**
- Ensure using correct port (587 for TLS, 465 for SSL)
- Check smtp_host has no typos
- Try disabling SSL verification (not recommended for production)

---

## 🤖 AI Chatbot Issues

### Chatbot Not Responding

**Symptom:** Chatbot sends message but no response

#### 1. OpenAI API Error

**Solution:**
```bash
# Check backend logs
./scripts/backend.sh logs

# Look for OpenAI errors
# Common issues:
# - Invalid API key
# - Rate limit
# - Insufficient credits

# Test OpenAI connection
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 2. Session Not Found

```
Chatbot session not found
```

**Solution:**
- Start new review session
- Click "Review with AI" on an email
- Check database has chatbot_sessions table

#### 3. Long Response Times

**Symptom:** Chatbot takes 30+ seconds to respond

**Solution:**
- This is normal for GPT-4 (complex models)
- Consider using gpt-3.5-turbo for faster responses
- Check OpenAI API status at status.openai.com

---

## 📝 File Upload Issues

### Resume Upload Fails

**Symptom:** Resume upload fails or times out

#### 1. File Too Large

```
File size exceeds maximum limit
```

**Solution:**
- Compress PDF (use online tools)
- Maximum size: 10MB
- Ensure file is PDF or DOCX

#### 2. Supabase Storage Error

```
Error uploading to Supabase Storage
```

**Solution:**
```sql
-- Check storage bucket exists
-- In Supabase: Storage → Check "resumes" bucket exists

-- If not, create bucket:
-- Storage → New bucket → Name: "resumes" → Public: false

-- Check RLS policies on storage
-- Storage → resumes → Policies → Enable RLS
```

#### 3. Parse Error

```
Failed to parse resume
```

**Solution:**
- Ensure file is valid PDF/DOCX
- Check file isn't password-protected
- Try converting to different format
- Check backend logs for specific error

---

## 🐛 Development Issues

### Hot Reload Not Working

#### Frontend

**Solution:**
```bash
# Clear Next.js cache
rm -rf frontend/.next

# Restart dev server
cd frontend
npm run dev
```

#### Backend

**Solution:**
```bash
# Ensure --reload flag is set
cd backend
source /tmp/agentm-venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or check BACKEND_RELOAD in .env
BACKEND_RELOAD=true
```

---

### Database Schema Out of Sync

**Symptom:** Errors about missing columns or tables

**Solution:**
```bash
# Export current data (backup)
# In Supabase: Database → Backups

# Re-run migrations in order
# 1. database/schema_phase1.sql
# 2. database/schema_email_management.sql

# Verify tables and columns
# In Supabase: Table Editor
```

---

## 🧪 Testing Issues

### Tests Failing

**Symptom:** `pytest` shows failures

**Solution:**
```bash
# Activate venv
source /tmp/agentm-venv/bin/activate

# Install test dependencies
pip install pytest pytest-asyncio

# Run with verbose output
cd backend
pytest -v

# Run specific test
pytest tests/test_resume_service.py -v

# Check test configuration
cat pytest.ini
```

---

## 💡 Performance Issues

### Slow API Responses

**Symptom:** API calls take 5+ seconds

**Possible Causes:**

1. **Database queries** - Add indexes
2. **OpenAI calls** - Expected for GPT-4 (2-3 seconds)
3. **Network latency** - Check Supabase region
4. **No connection pooling** - Supabase handles this

**Solution:**
```sql
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_emails_user_status 
  ON email_management(user_id, status);

CREATE INDEX IF NOT EXISTS idx_logs_user_created 
  ON activity_logs(user_id, created_at DESC);
```

---

## 🔍 Debugging Tips

### Enable Debug Logging

**Backend:**
```bash
# In .env
DEBUG=true
ENV=development

# Restart backend
./scripts/backend.sh restart

# View logs
./scripts/backend.sh logs
```

**Frontend:**
```javascript
// Add to component
console.log('Debug:', variable);

// Check browser console: F12 → Console
```

### Check Running Processes

```bash
# Check backend
./scripts/backend.sh status

# Check what's on port 8000
lsof -i :8000

# Check frontend
curl http://localhost:3000

# Check what's on port 3000
lsof -i :3000
```

### Verify Environment Variables

```bash
# Backend
cd backend
source /tmp/agentm-venv/bin/activate
python3 -c "from app.core.config import settings; print(settings.SUPABASE_URL)"

# Frontend (in browser console)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

---

## 🆘 Still Need Help?

### 1. Check Logs

**Backend:**
```bash
./scripts/backend.sh logs
# OR
tail -f /tmp/backend.log
```

**Frontend:**
```bash
# Check terminal where npm run dev is running
# Check browser console (F12)
```

### 2. Search Documentation

- [Setup Guide](../setup/QUICKSTART.md)
- [API Documentation](../api/README.md)
- [Architecture](../architecture/OVERVIEW.md)

### 3. Search Existing Issues

Check [GitHub Issues](https://github.com/ak-1344/AgentM/issues) for similar problems.

### 4. Create New Issue

If problem persists:

1. Go to [GitHub Issues](https://github.com/ak-1344/AgentM/issues/new)
2. Provide:
   - Error message (full stack trace)
   - Steps to reproduce
   - Environment (OS, Python version, Node version)
   - Relevant logs
   - What you've tried

### 5. Ask in Discussions

For questions: [GitHub Discussions](https://github.com/ak-1344/AgentM/discussions)

---

## 📚 Additional Resources

- **[Setup Guide](../setup/QUICKSTART.md)** - Complete setup instructions
- **[Backend Setup](../setup/BACKEND.md)** - Backend configuration
- **[Environment Variables](../setup/ENVIRONMENT.md)** - All env vars explained
- **[API Documentation](../api/README.md)** - Endpoint reference

---

**[← Back to Documentation](../index.md)** | **[View Setup Guide →](../setup/QUICKSTART.md)**
