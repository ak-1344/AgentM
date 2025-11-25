# 🗄️ Supabase Configuration Guide for Agent M

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click **"New Project"**
4. Fill in:
   - **Name:** Agent M
   - **Database Password:** (generate strong password - save it!)
   - **Region:** Choose closest to your users
5. Wait 2-3 minutes for project creation

### Step 2: Run Database Setup Script
1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy entire contents of `SUPABASE_SETUP.sql`
4. Paste into editor
5. Click **"Run"** (or press Ctrl+Enter)
6. ✅ Verify: You should see "Setup Complete!" messages

### Step 3: Create Storage Bucket
1. Go to **Storage** (left sidebar)
2. Click **"New Bucket"**
3. Enter:
   - **Name:** `resumes`
   - **Public:** OFF (keep private)
4. Click **"Save"**
5. Click on the `resumes` bucket
6. Go to **"Policies"** tab
7. Click **"New Policy"** > **"For full customization"**
8. Copy and paste policies from `SUPABASE_STORAGE_SETUP.sql`
9. Click **"Review"** > **"Save Policy"**

### Step 4: Get Your Credentials
1. Go to **Settings** > **API** (left sidebar)
2. Copy these values:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public** key (under Project API keys)
   - **service_role** key (keep this secret!)

### Step 5: Update Environment Variables

**Backend (.env):**
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Frontend (.env.local):**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

---

## Verification Checklist

Run these in SQL Editor to verify setup:

### ✅ Check Tables Created
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'resumes', 'context_profiles', 'smtp_credentials')
ORDER BY table_name;
```
**Expected:** 4 rows

### ✅ Check RLS Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'resumes', 'context_profiles', 'smtp_credentials');
```
**Expected:** All should show `true`

### ✅ Check Policies Created
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```
**Expected:** 9+ policies

### ✅ Check Storage Bucket
Go to **Storage** and verify:
- ✅ Bucket named `resumes` exists
- ✅ Bucket is private (not public)
- ✅ 4 policies are created

---

## Database Schema Overview

### Tables

#### 1. **user_profiles**
- Extends Supabase auth.users
- Stores: email, full_name, phone_number, domain_context
- RLS: Users can only access their own profile

#### 2. **resumes**
- Stores uploaded resume files
- Columns: file_name, file_path, extracted_text, parsed_data (JSONB)
- RLS: Users can only access their own resumes

#### 3. **context_profiles**
- Stores outreach preferences
- Columns: target_roles, preferred_industries, pitch_tone, keywords, geography
- RLS: Users can only access their own context
- Constraint: One context profile per user

#### 4. **smtp_credentials**
- Stores encrypted SMTP settings
- Columns: smtp_host, smtp_port, smtp_user, smtp_password_encrypted
- RLS: Users can only access their own credentials
- Constraint: One SMTP config per user

### Storage

#### **resumes** bucket
- Stores PDF/DOC/DOCX files
- Path structure: `resumes/{user_id}/{filename}`
- Max file size: 10MB
- Private with user-specific RLS policies

---

## Troubleshooting

### Error: "relation does not exist"
**Solution:** Make sure you ran `SUPABASE_SETUP.sql` completely

### Error: "permission denied for table"
**Solution:** RLS policies not applied. Re-run the policy creation section

### Error: "bucket not found"
**Solution:** Create the `resumes` bucket manually in Storage section

### Error: "new row violates row-level security policy"
**Solution:** 
1. Check user is authenticated
2. Verify `auth.uid()` matches the `user_id` being inserted
3. Check RLS policies are created correctly

### Storage upload fails
**Solution:**
1. Verify bucket exists and is named exactly `resumes`
2. Check storage policies are created
3. Ensure file path follows: `{user_id}/{filename}`

---

## Advanced Configuration

### Enable Realtime (Optional)
If you want real-time updates:

```sql
-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.resumes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.context_profiles;
```

### Add Email Rate Limiting (Recommended)
```sql
-- Track email sends
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  recipient_email TEXT NOT NULL,
  subject TEXT,
  status TEXT, -- 'sent', 'failed', 'pending'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email logs"
  ON public.email_logs FOR SELECT
  USING (auth.uid() = user_id);
```

### Backup Your Database
```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or via Dashboard: Settings > Database > Backup
```

---

## Security Best Practices

1. ✅ **Never share service_role key** - Only use on backend
2. ✅ **Use anon key on frontend** - It's safe for public use
3. ✅ **Keep RLS enabled** - Protects against data leaks
4. ✅ **Encrypt sensitive data** - SMTP passwords are encrypted
5. ✅ **Regular backups** - Backup database weekly
6. ✅ **Monitor usage** - Check Supabase dashboard for anomalies

---

## Useful SQL Queries

### Get User Statistics
```sql
SELECT 
  COUNT(DISTINCT up.id) as total_users,
  COUNT(DISTINCT r.user_id) as users_with_resume,
  COUNT(DISTINCT cp.user_id) as users_with_context,
  COUNT(DISTINCT sc.user_id) as users_with_smtp
FROM public.user_profiles up
LEFT JOIN public.resumes r ON up.id = r.user_id
LEFT JOIN public.context_profiles cp ON up.id = cp.user_id
LEFT JOIN public.smtp_credentials sc ON up.id = sc.user_id;
```

### Check Setup Completion
```sql
SELECT 
  up.email,
  up.full_name,
  EXISTS(SELECT 1 FROM resumes WHERE user_id = up.id) as has_resume,
  EXISTS(SELECT 1 FROM context_profiles WHERE user_id = up.id) as has_context,
  EXISTS(SELECT 1 FROM smtp_credentials WHERE user_id = up.id) as has_smtp
FROM user_profiles up
ORDER BY up.created_at DESC;
```

### Clean Test Data
```sql
-- WARNING: This deletes ALL data!
-- Only use in development
TRUNCATE TABLE public.resumes CASCADE;
TRUNCATE TABLE public.context_profiles CASCADE;
TRUNCATE TABLE public.smtp_credentials CASCADE;
-- User profiles will cascade delete when auth users are removed
```

---

## Next Steps

After Supabase is configured:

1. ✅ Start backend: `cd backend && uvicorn app.main:app --reload`
2. ✅ Start frontend: `cd frontend && npm run dev`
3. ✅ Register a user at `http://localhost:3000`
4. ✅ Upload resume, configure context, add SMTP
5. ✅ Send your first automated email!

---

## Support Resources

- 📖 [Supabase Docs](https://supabase.com/docs)
- 🔐 [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- 💾 [Storage Guide](https://supabase.com/docs/guides/storage)
- 🐛 [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Setup complete! Your database is ready for Agent M. 🚀**
