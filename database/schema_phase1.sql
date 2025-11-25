-- Agent M Database Schema - Phase 1
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- USER PROFILES TABLE
-- ======================
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

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ======================
-- RESUMES TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  extracted_text TEXT,
  parsed_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

-- ======================
-- CONTEXT PROFILES TABLE
-- ======================
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

ALTER TABLE public.context_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own context"
  ON public.context_profiles FOR ALL
  USING (auth.uid() = user_id);

-- ======================
-- SMTP CREDENTIALS TABLE
-- ======================
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
  UNIQUE(user_id)
);

ALTER TABLE public.smtp_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own SMTP credentials"
  ON public.smtp_credentials FOR ALL
  USING (auth.uid() = user_id);

-- ======================
-- INDEXES
-- ======================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_context_profiles_user_id ON public.context_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_smtp_credentials_user_id ON public.smtp_credentials(user_id);

-- ======================
-- UPDATED_AT TRIGGER
-- ======================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_context_profiles_updated_at
  BEFORE UPDATE ON public.context_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- STORAGE BUCKETS
-- ======================
-- Note: Create these buckets manually in Supabase Dashboard > Storage
-- Bucket name: 'resumes'
-- Public: No
-- File size limit: 10MB
-- Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

-- Storage policies (run after creating bucket)
-- CREATE POLICY "Users can upload own resumes"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'resumes' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );

-- CREATE POLICY "Users can read own resumes"
-- ON storage.objects FOR SELECT
-- USING (
--   bucket_id = 'resumes' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
