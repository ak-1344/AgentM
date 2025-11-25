# Database Setup Instructions

## Overview
This folder contains SQL scripts to set up the Agent M database in Supabase.

## Files

1. **`SUPABASE_SETUP.sql`** - Initial Supabase configuration
2. **`schema_phase1.sql`** - Phase 1 tables (users, resumes, context, SMTP)
3. **`schema_email_management.sql`** - NEW: Email management system (AI emails, logs, chat)
4. **`SUPABASE_STORAGE_SETUP.sql`** - Storage buckets configuration
5. **`rollback_phase1.sql`** - Rollback script if needed

## Setup Steps

### 1. Run Initial Setup (If Not Already Done)
In Supabase SQL Editor, run these in order:

```sql
-- 1. First time setup
SUPABASE_SETUP.sql

-- 2. Phase 1 schema
schema_phase1.sql
```

### 2. Run NEW Email Management Schema
This adds the new tables for the email management system:

```sql
-- 3. Email management tables (NEW - Run this now)
schema_email_management.sql
```

This will create:
- ✅ `ai_emails` - Stores AI-generated emails with workflow status
- ✅ `activity_logs` - System activity and background task logging
- ✅ `email_chat_history` - Chat messages for email review/editing

### 3. Verify Tables
Run this query to verify all tables are created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- `user_profiles`
- `resumes`
- `context_profiles`
- `smtp_credentials`
- `ai_emails` ← NEW
- `activity_logs` ← NEW
- `email_chat_history` ← NEW

### 4. Setup Storage Buckets (If Not Done)
In Supabase Dashboard:
1. Go to **Storage** section
2. Create bucket named `resumes`
3. Settings:
   - Public: **No**
   - File size limit: **10MB**
   - Allowed MIME types: 
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## New Tables Details

### `ai_emails`
Stores AI-generated emails for the outreach workflow.

**Columns:**
- `id` - UUID primary key
- `user_id` - References user
- `recipient_email`, `recipient_name` - Email recipient
- `subject`, `content` - Email text
- `company_name`, `company_website`, `company_location` - Company info
- `position_title` - Job position
- `keywords` - Array of keywords describing the email
- `job_type`, `salary_range` - Job metadata
- **`status`** - Workflow status: `new`, `under_review`, `approved`, `rejected`
- `ai_model`, `generation_prompt`, `generation_metadata` - AI tracking
- Timestamps: `created_at`, `updated_at`, `reviewed_at`, `sent_at`

**Indexes:**
- `user_id` for fast user queries
- `status` for filtering by workflow state
- `(user_id, status)` composite index
- `created_at` for sorting

### `activity_logs`
System activity logging for transparency and debugging.

**Columns:**
- `id` - UUID primary key
- `user_id` - References user
- **`level`** - Log level: `info`, `warning`, `error`, `success`
- **`action`** - Action type: `email_generated`, `email_sent`, `resume_uploaded`, etc.
- `message` - Human-readable log message
- `details` - JSONB for additional structured data
- `related_entity_type`, `related_entity_id` - Link to related records
- `ip_address`, `user_agent` - Request metadata
- `created_at` - Timestamp

**Indexes:**
- `user_id` for user-specific logs
- `level` for filtering by severity
- `action` for filtering by action type
- `created_at` for time-based queries

### `email_chat_history`
Chat messages between user and AI for email review/editing.

**Columns:**
- `id` - UUID primary key
- `email_id` - References `ai_emails`
- `user_id` - References user
- `role` - Message sender: `user` or `assistant`
- `message` - Chat message text
- `ai_model` - AI model used (for assistant messages)
- `tokens_used` - Token count (for cost tracking)
- `created_at` - Timestamp

**Indexes:**
- `email_id` for fetching chat history per email
- `user_id` for user queries
- `created_at` for message ordering

## Helper Functions

The schema includes these helper functions:

### `get_email_stats(user_id)`
Get count of emails by status.

```sql
SELECT * FROM get_email_stats('YOUR_USER_ID');
```

Returns:
```
status         | count
---------------|------
new            | 5
under_review   | 3
approved       | 2
rejected       | 1
```

### `log_activity(...)`
Log an activity (can be called from backend).

```sql
SELECT log_activity(
  p_user_id := 'USER_ID',
  p_level := 'info',
  p_action := 'test_action',
  p_message := 'Test message',
  p_details := '{"test": true}'::jsonb
);
```

## Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- ✅ View their own data
- ✅ Insert their own data
- ✅ Update their own data
- ✅ Delete their own data

This is enforced at the database level for security.

## Testing

After running the schema, you can test with:

```sql
-- 1. Insert test email
INSERT INTO public.ai_emails (
  user_id,
  recipient_email,
  subject,
  content,
  company_name,
  company_website,
  position_title,
  keywords,
  status
) VALUES (
  auth.uid(), -- Your user ID
  'test@example.com',
  'Test Subject',
  'Test email content',
  'Test Company',
  'https://example.com',
  'Test Position',
  ARRAY['keyword1', 'keyword2'],
  'new'
);

-- 2. Insert test log
INSERT INTO public.activity_logs (
  user_id,
  level,
  action,
  message
) VALUES (
  auth.uid(),
  'info',
  'test',
  'Test log message'
);

-- 3. Verify
SELECT * FROM public.ai_emails WHERE user_id = auth.uid();
SELECT * FROM public.activity_logs WHERE user_id = auth.uid();
```

## Rollback

If you need to rollback the new tables:

```sql
DROP TABLE IF EXISTS public.email_chat_history CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.ai_emails CASCADE;

DROP FUNCTION IF EXISTS get_email_stats(UUID);
DROP FUNCTION IF EXISTS log_activity(UUID, TEXT, TEXT, TEXT, JSONB, TEXT, UUID);
```

## Next Steps

After setting up the database:

1. ✅ Update backend `.env` file with Supabase credentials
2. ✅ Run backend server: `cd backend && python main.py`
3. ✅ Test API endpoints with Postman or frontend
4. ✅ Check logs page in frontend dashboard

## Support

If you encounter issues:

1. Check Supabase logs in Dashboard → Database → Logs
2. Verify RLS policies are created: Dashboard → Authentication → Policies
3. Test with SQL queries directly in Supabase SQL Editor
4. Check backend logs for error messages

---

**Questions?** See the main project README or check PendingWork/ folder for more details.
