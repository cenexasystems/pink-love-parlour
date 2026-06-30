-- Create gallery_images table if it does not exist
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  cloudinary_id text,
  alt text NOT NULL,
  position int NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO anon, authenticated;
GRANT ALL ON public.gallery_images TO service_role;

-- Disable RLS to allow passcode-based admin dashboard writes without Auth authentication
ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;

-- Create storage policies if bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;

-- Allow public read access to the gallery bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Allow public upload access to the gallery bucket
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

-- Allow public update access to the gallery bucket
CREATE POLICY "Public Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');

-- Allow public delete access to the gallery bucket
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery');

-- Create policies if they don't exist for public.gallery_images as a fallback
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_images' AND policyname = 'gallery public read') THEN
        CREATE POLICY "gallery public read" ON public.gallery_images FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_images' AND policyname = 'gallery public write') THEN
        CREATE POLICY "gallery public write" ON public.gallery_images FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_images' AND policyname = 'gallery public update') THEN
        CREATE POLICY "gallery public update" ON public.gallery_images FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_images' AND policyname = 'gallery public delete') THEN
        CREATE POLICY "gallery public delete" ON public.gallery_images FOR DELETE USING (true);
    END IF;
END
$$;

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'gallery_touch') THEN
        CREATE TRIGGER gallery_touch BEFORE UPDATE ON public.gallery_images
          FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
    END IF;
END
$$;
