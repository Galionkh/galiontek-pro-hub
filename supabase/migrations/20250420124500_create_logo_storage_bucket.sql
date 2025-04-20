
-- Create storage bucket for logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'logos', 'logos', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'logos'
);

-- Create policy to allow public read access to all files in the logos bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'logos');

-- Create policy to allow authenticated users to upload to the logos bucket
CREATE POLICY "Authenticated users can upload logos" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- Create policy to allow users to update their own files
CREATE POLICY "Users can update own logos" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'logos' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'logos' AND auth.uid() = owner);

-- Create policy to allow users to delete their own files
CREATE POLICY "Users can delete own logos" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'logos' AND auth.uid() = owner);
