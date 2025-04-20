
-- Create storage bucket for system assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'system-assets', 'system-assets', TRUE
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'system-assets');

-- Set up security policy to allow authenticated users to access their own files
INSERT INTO storage.policies (name, bucket_id, definition, policy)
SELECT 
  'Allow access to own system assets',
  'system-assets',
  'auth.uid() = (storage.foldername(name))[1]::uuid',
  'SELECT'
WHERE NOT EXISTS (
  SELECT 1 FROM storage.policies 
  WHERE bucket_id = 'system-assets' AND policy = 'SELECT'
);

-- Allow authenticated users to update their own files
INSERT INTO storage.policies (name, bucket_id, definition, policy)
SELECT 
  'Allow update to own system assets',
  'system-assets',
  'auth.uid() = (storage.foldername(name))[1]::uuid',
  'INSERT'
WHERE NOT EXISTS (
  SELECT 1 FROM storage.policies 
  WHERE bucket_id = 'system-assets' AND policy = 'INSERT'
);

-- Allow authenticated users to update their own files
INSERT INTO storage.policies (name, bucket_id, definition, policy)
SELECT 
  'Allow update to own system assets',
  'system-assets',
  'auth.uid() = (storage.foldername(name))[1]::uuid',
  'UPDATE'
WHERE NOT EXISTS (
  SELECT 1 FROM storage.policies 
  WHERE bucket_id = 'system-assets' AND policy = 'UPDATE'
);
