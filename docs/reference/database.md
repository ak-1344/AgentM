# Agent M - Database Management

## Overview
This directory contains database schemas, migrations, and utilities for Agent M.

## Database Structure

### Phase 1 Tables:
- `user_profiles` - User account information
- `resumes` - Uploaded resumes and parsed data
- `context_profiles` - User context and preferences
- `smtp_credentials` - Encrypted SMTP settings

### Storage Buckets:
- `resumes` - Resume file storage (PDF, DOC, DOCX)

## Running Migrations

### Initial Setup (Phase 1):
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run `schema_phase1.sql`
4. Create storage bucket manually (see Supabase setup guide)

### Rollback:
If you need to undo Phase 1 migration:
```sql
-- Run rollback_phase1.sql in Supabase SQL Editor
```

## Future Migrations

### Phase 2 (Planned):
- `companies` table
- `email_drafts` table

### Phase 3 (Planned):
- `outbound_inbox` table
- `sent_mail_logs` table

### Phase 4 (Planned):
- `follow_up_schedules` table

### Phase 5 (Planned):
- `reply_logs` table
- Analytics materialized views

## Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Service role key bypasses RLS for backend operations
- SMTP passwords are encrypted before storage

## Backup

Supabase provides automatic daily backups on paid plans.

For manual backups:
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

## Monitoring

Check database health:
- Supabase Dashboard > Database > Health
- Monitor query performance
- Check RLS policy effectiveness
