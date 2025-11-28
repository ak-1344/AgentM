-- Add step completion tracking to resumes table
-- This allows the wizard to track which steps are completed

ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS is_upload_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_parse_completed BOOLEAN DEFAULT false;

-- Update existing records to mark upload as completed (they already have files)
UPDATE public.resumes 
SET is_upload_completed = true 
WHERE file_path IS NOT NULL AND file_path != '';

-- Mark existing records with parsed_data as parse completed
UPDATE public.resumes 
SET is_parse_completed = true 
WHERE parsed_data IS NOT NULL;

COMMENT ON COLUMN public.resumes.is_upload_completed IS 'True when resume file is successfully uploaded';
COMMENT ON COLUMN public.resumes.is_parse_completed IS 'True when resume has been parsed by AI';
