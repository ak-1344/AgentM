# Supabase Configuration Guide

## Overview
This guide explains how to set up Supabase for Agent M as the primary database, authentication, and storage provider.

---

## 1. Create Supabase Project

### Steps:
1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Fill in details:
   - **Name**: agent-m-production
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier

---

## 2. Get API Keys

### Navigate to Project Settings > API

Copy the following:

```env
# .env file
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  # Public anon key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Secret service role key (backend only)
```

⚠️ **NEVER commit service role key to version control**

---

## 3. Database Schema Setup

### Go to SQL Editor in Supabase Dashboard

Run the following SQL scripts in order:

#### 3.1 Users Table (extends Supabase auth.users)
```sql
-- User profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  domain_context TEXT, -- e.g., "Web Dev Jobs", "Robotics Startups"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### 3.2 Resume Storage
```sql
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  extracted_text TEXT,
  parsed_data JSONB, -- Skills, experience, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### 3.3 Context Profiles
```sql
CREATE TABLE public.context_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  target_roles TEXT[],
  preferred_industries TEXT[],
  pitch_tone TEXT DEFAULT 'professional', -- professional, casual, technical
  keywords TEXT[],
  custom_message TEXT,
  geography TEXT[],
  context_json JSONB, -- Full AI-generated context
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One active context per user
);

ALTER TABLE public.context_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own context"
  ON public.context_profiles FOR ALL
  USING (auth.uid() = user_id);
```

#### 3.4 SMTP Credentials (Encrypted)
```sql
CREATE TABLE public.smtp_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_user TEXT NOT NULL,
  smtp_password_encrypted TEXT NOT NULL, -- Encrypted with backend key
  use_tls BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.smtp_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own SMTP credentials"
  ON public.smtp_credentials FOR ALL
  USING (auth.uid() = user_id);
```

---

## 4. Storage Buckets

### Create Storage Buckets for File Uploads

#### In Supabase Dashboard > Storage:

1. **Create "resumes" bucket**
   - Public: No
   - File size limit: 10MB
   - Allowed MIME types: `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

2. **Storage Policies**
   ```sql
   -- Allow users to upload their own resumes
   CREATE POLICY "Users can upload own resumes"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'resumes' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Allow users to read their own resumes
   CREATE POLICY "Users can read own resumes"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'resumes' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

---

## 5. Authentication Setup

### Enable Auth Providers

#### In Dashboard > Authentication > Providers:

1. **Email/Password**: Enable (default)
2. **Google OAuth**:
   - See `oauth_google_setup.md` for detailed steps
   - Add authorized redirect URLs:
     - `https://your-project-id.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

---

## 6. Backend Connection

### Python (FastAPI) Setup

```python
# backend/database/supabase_client.py
from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Example usage
def get_user_profile(user_id: str):
    response = supabase.table('user_profiles').select('*').eq('id', user_id).execute()
    return response.data
```

### Frontend (Next.js) Setup

```typescript
// frontend/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 7. Environment Variables

### Backend `.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

### Frontend `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 8. Testing Checklist

- [ ] Supabase project created
- [ ] API keys copied to `.env` files
- [ ] Database schema executed successfully
- [ ] Storage bucket created with policies
- [ ] Email auth enabled
- [ ] Backend can connect to Supabase
- [ ] Frontend can connect to Supabase
- [ ] Test user registration works
- [ ] Test file upload to storage works

---

## 9. Monitoring & Maintenance

### Database Logs
- Check Dashboard > Database > Logs for errors
- Monitor query performance

### Storage Usage
- Free tier: 1GB storage
- Monitor usage in Dashboard > Storage

### API Usage
- Free tier: 500MB database, 2GB bandwidth
- Upgrade when needed

---

## Next Steps
After Supabase setup:
1. Verify all tables created successfully
2. Test authentication flow
3. Test file upload/download
4. Proceed to backend API implementation
