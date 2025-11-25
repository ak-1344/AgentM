-- Agent M Database Schema - Email Management System
-- Add this to your existing Supabase database

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- AI GENERATED EMAILS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.ai_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Email content
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Company information
  company_name TEXT,
  company_website TEXT,
  company_location TEXT,
  position_title TEXT,
  
  -- Metadata
  keywords TEXT[],
  job_type TEXT, -- 'full-time', 'part-time', 'contract', 'internship'
  salary_range TEXT,
  
  -- Email status workflow
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'approved', 'rejected')),
  
  -- AI generation metadata
  ai_model TEXT,
  generation_prompt TEXT,
  generation_metadata JSONB,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.ai_emails ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own emails"
  ON public.ai_emails FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emails"
  ON public.ai_emails FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emails"
  ON public.ai_emails FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emails"
  ON public.ai_emails FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_emails_user_id ON public.ai_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_emails_status ON public.ai_emails(status);
CREATE INDEX IF NOT EXISTS idx_ai_emails_user_status ON public.ai_emails(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_emails_created_at ON public.ai_emails(created_at DESC);

-- ======================
-- ACTIVITY LOGS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Log details
  level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'success')),
  action TEXT NOT NULL, -- 'email_generated', 'email_sent', 'resume_uploaded', 'context_updated'
  message TEXT NOT NULL,
  details JSONB, -- Additional structured data
  
  -- Related entity (optional)
  related_entity_type TEXT, -- 'email', 'resume', 'context', etc.
  related_entity_id UUID,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_level ON public.activity_logs(level);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON public.activity_logs(user_id, created_at DESC);

-- ======================
-- EMAIL CHAT HISTORY TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.email_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_id UUID NOT NULL REFERENCES public.ai_emails(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Chat message
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  
  -- Metadata
  ai_model TEXT,
  tokens_used INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.email_chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own chat history"
  ON public.email_chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON public.email_chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_chat_email_id ON public.email_chat_history(email_id);
CREATE INDEX IF NOT EXISTS idx_email_chat_user_id ON public.email_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_email_chat_created_at ON public.email_chat_history(created_at DESC);

-- ======================
-- UPDATED_AT TRIGGER
-- ======================
-- Reuse existing trigger function or create if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to ai_emails table
DROP TRIGGER IF EXISTS update_ai_emails_updated_at ON public.ai_emails;
CREATE TRIGGER update_ai_emails_updated_at
  BEFORE UPDATE ON public.ai_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- HELPER FUNCTIONS
-- ======================

-- Function to get email statistics by status
CREATE OR REPLACE FUNCTION get_email_stats(p_user_id UUID)
RETURNS TABLE (
  status TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.status,
    COUNT(*) as count
  FROM public.ai_emails e
  WHERE e.user_id = p_user_id
  GROUP BY e.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity (can be called from backend)
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_level TEXT,
  p_action TEXT,
  p_message TEXT,
  p_details JSONB DEFAULT NULL,
  p_related_entity_type TEXT DEFAULT NULL,
  p_related_entity_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    level,
    action,
    message,
    details,
    related_entity_type,
    related_entity_id
  )
  VALUES (
    p_user_id,
    p_level,
    p_action,
    p_message,
    p_details,
    p_related_entity_type,
    p_related_entity_id
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================
-- SAMPLE DATA (Optional - for testing)
-- ======================
/*
-- Insert sample email for testing (replace USER_ID with actual user ID)
INSERT INTO public.ai_emails (
  user_id,
  recipient_email,
  recipient_name,
  subject,
  content,
  company_name,
  company_website,
  company_location,
  position_title,
  keywords,
  job_type,
  salary_range,
  status
) VALUES (
  'USER_ID_HERE',
  'hr@techcorp.com',
  'John Smith',
  'Application for Senior Software Engineer Position',
  'Dear John Smith,\n\nI am writing to express my interest in the Senior Software Engineer position at TechCorp...',
  'TechCorp Solutions',
  'https://techcorp.com',
  'San Francisco, CA',
  'Senior Software Engineer',
  ARRAY['Python', 'FastAPI', 'React', 'AWS'],
  'full-time',
  '$120k - $180k',
  'new'
);

-- Insert sample log
INSERT INTO public.activity_logs (
  user_id,
  level,
  action,
  message,
  details
) VALUES (
  'USER_ID_HERE',
  'success',
  'email_generated',
  'Generated personalized email for TechCorp Solutions',
  '{"company": "TechCorp Solutions", "position": "Senior Software Engineer"}'::jsonb
);
*/
