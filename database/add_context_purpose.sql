-- Add purpose field to context_profiles table
-- This allows users to specify why they're using the platform

ALTER TABLE public.context_profiles 
ADD COLUMN IF NOT EXISTS purpose TEXT;

-- Add comment explaining the purpose field
COMMENT ON COLUMN public.context_profiles.purpose IS 'User purpose: Jobs, Sponsorship, Freelancing, Business Growth, Networking, etc.';

-- Update existing records to have a default purpose
UPDATE public.context_profiles 
SET purpose = 'Jobs' 
WHERE purpose IS NULL;
