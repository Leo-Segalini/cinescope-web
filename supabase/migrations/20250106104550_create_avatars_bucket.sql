-- Supprimer le bucket s'il existe déjà (pour éviter les erreurs)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar images" ON storage.objects;

DELETE FROM storage.buckets WHERE id = 'avatars';

-- Create a new storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Allow public access to avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatar images
CREATE POLICY "Users can upload avatar images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

-- Allow users to update their own avatar images
CREATE POLICY "Users can update their own avatar images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatar images
CREATE POLICY "Users can delete their own avatar images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
