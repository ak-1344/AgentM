-- Add resume data to context_profiles table
-- This stores extracted and parsed resume data with context for email generation

ALTER TABLE public.context_profiles 
ADD COLUMN IF NOT EXISTS resume_extracted_text TEXT,
ADD COLUMN IF NOT EXISTS resume_parsed_data JSONB;

-- Add comments explaining the fields
COMMENT ON COLUMN public.context_profiles.resume_extracted_text IS 'Raw text extracted from resume file';
COMMENT ON COLUMN public.context_profiles.resume_parsed_data IS 'AI-parsed structured resume data (skills, experience, etc.)';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_context_profiles_user_id ON public.context_profiles(user_id);
