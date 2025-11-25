-- Rollback script for Phase 1 schema
-- Use this if you need to undo the Phase 1 migration

-- Drop triggers
DROP TRIGGER IF EXISTS update_context_profiles_updated_at ON public.context_profiles;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_smtp_credentials_user_id;
DROP INDEX IF EXISTS idx_context_profiles_user_id;
DROP INDEX IF EXISTS idx_resumes_user_id;

-- Drop tables (in reverse order of creation)
DROP TABLE IF EXISTS public.smtp_credentials CASCADE;
DROP TABLE IF EXISTS public.context_profiles CASCADE;
DROP TABLE IF EXISTS public.resumes CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Note: Storage bucket and policies must be deleted manually from Supabase Dashboard
