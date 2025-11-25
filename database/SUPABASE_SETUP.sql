-- ========================================
-- AGENT M - SUPABASE DATABASE SETUP
-- ========================================
-- Run this script in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
--
-- This will create all tables, policies, and functions
-- needed for Agent M Phase 1 MVP
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- 1. USER PROFILES TABLE
-- ========================================
-- Stores additional user information beyond Supabase auth
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  domain_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ========================================
-- 2. RESUMES TABLE
-- ========================================
-- Stores uploaded resumes and parsed data
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  extracted_text TEXT,
  parsed_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own resumes
CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 3. CONTEXT PROFILES TABLE
-- ========================================
-- Stores user's outreach context and preferences
CREATE TABLE IF NOT EXISTS public.context_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  target_roles TEXT[],
  preferred_industries TEXT[],
  pitch_tone TEXT DEFAULT 'professional',
  keywords TEXT[],
  custom_message TEXT,
  geography TEXT[],
  context_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.context_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Full access to own context
CREATE POLICY "Users can manage own context"
  ON public.context_profiles FOR ALL
  USING (auth.uid() = user_id);

-- ========================================
-- 4. SMTP CREDENTIALS TABLE
-- ========================================
-- Stores encrypted SMTP configuration
CREATE TABLE IF NOT EXISTS public.smtp_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_user TEXT NOT NULL,
  smtp_password_encrypted TEXT NOT NULL,
  use_tls BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.smtp_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Full access to own SMTP credentials
CREATE POLICY "Users can manage own SMTP credentials"
  ON public.smtp_credentials FOR ALL
  USING (auth.uid() = user_id);

-- ========================================
-- 5. INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON public.resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_context_profiles_user_id ON public.context_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_smtp_credentials_user_id ON public.smtp_credentials(user_id);

-- ========================================
-- 6. AUTOMATIC TIMESTAMP UPDATES
-- ========================================
-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to context_profiles
CREATE TRIGGER update_context_profiles_updated_at
  BEFORE UPDATE ON public.context_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to smtp_credentials
CREATE TRIGGER update_smtp_credentials_updated_at
  BEFORE UPDATE ON public.smtp_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 7. HELPER FUNCTIONS (OPTIONAL)
-- ========================================

-- Function to get user's latest resume
CREATE OR REPLACE FUNCTION get_latest_resume(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  file_name TEXT,
  file_path TEXT,
  extracted_text TEXT,
  parsed_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.file_name, r.file_path, r.extracted_text, r.parsed_data, r.created_at
  FROM public.resumes r
  WHERE r.user_id = p_user_id
  ORDER BY r.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has completed setup
CREATE OR REPLACE FUNCTION is_user_setup_complete(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_resume BOOLEAN;
  has_context BOOLEAN;
  has_smtp BOOLEAN;
BEGIN
  -- Check if user has a resume
  SELECT EXISTS(
    SELECT 1 FROM public.resumes WHERE user_id = p_user_id
  ) INTO has_resume;
  
  -- Check if user has context profile
  SELECT EXISTS(
    SELECT 1 FROM public.context_profiles WHERE user_id = p_user_id
  ) INTO has_context;
  
  -- Check if user has SMTP credentials
  SELECT EXISTS(
    SELECT 1 FROM public.smtp_credentials WHERE user_id = p_user_id
  ) INTO has_smtp;
  
  RETURN has_resume AND has_context AND has_smtp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 8. VERIFICATION QUERIES
-- ========================================
-- Run these after setup to verify everything is created

-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'resumes', 'context_profiles', 'smtp_credentials')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'resumes', 'context_profiles', 'smtp_credentials');

-- Check policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ========================================
-- SETUP COMPLETE! 
-- ========================================
-- Next steps:
-- 1. Go to Storage > Create bucket named 'resumes'
--    - Make it private (not public)
--    - Set file size limit: 10MB
--    - Allowed MIME types: application/pdf, .doc, .docx
--
-- 2. Create storage policies (see below)
--
-- 3. Copy your Supabase URL and anon key to .env files
-- ========================================
