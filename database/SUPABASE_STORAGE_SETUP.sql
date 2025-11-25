-- ========================================
-- AGENT M - SUPABASE STORAGE SETUP
-- ========================================
-- Run this AFTER creating the 'resumes' bucket manually
-- in Supabase Dashboard > Storage > New Bucket
--
-- Bucket Settings:
-- - Name: resumes
-- - Public: NO (Private)
-- - File size limit: 10485760 (10MB)
-- - Allowed MIME types: 
--   * application/pdf
--   * application/msword
--   * application/vnd.openxmlformats-officedocument.wordprocessingml.document
-- ========================================

-- ========================================
-- STORAGE POLICIES FOR 'resumes' BUCKET
-- ========================================

-- Policy 1: Users can upload their own resumes
-- Files must be stored in folders named by user_id
CREATE POLICY "Users can upload own resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Users can read their own resumes
CREATE POLICY "Users can read own resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Users can update their own resumes
CREATE POLICY "Users can update own resumes"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Users can delete their own resumes
CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ========================================
-- VERIFICATION
-- ========================================
-- Check that policies are created
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%resumes%';

-- ========================================
-- FILE PATH STRUCTURE
-- ========================================
-- Files will be stored as:
-- resumes/{user_id}/{filename}
--
-- Example:
-- resumes/123e4567-e89b-12d3-a456-426614174000/resume.pdf
--
-- The backend automatically creates this structure
-- when uploading files
-- ========================================

-- ========================================
-- MANUAL BUCKET CREATION STEPS
-- ========================================
-- Since bucket creation via SQL is limited, follow these steps:
--
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New Bucket"
-- 3. Enter name: resumes
-- 4. Set "Public bucket": OFF (keep it private)
-- 5. Click "Save"
-- 6. Click on the 'resumes' bucket
-- 7. Go to "Policies" tab
-- 8. Run this SQL file to create the policies
--
-- OR use the Supabase CLI:
-- supabase storage create resumes --public false
-- ========================================
