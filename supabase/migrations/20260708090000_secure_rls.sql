-- Create is_admin helper function to verify request header
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
  RETURN coalesce(nullif(current_setting('request.headers', true), '')::json->>'x-admin-passcode', '') = '0265';
END;
$$;

-- Enable Row Level Security on all public tables
ALTER TABLE public.combo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Recreate policies for public.combo_items
DROP POLICY IF EXISTS "combo_items public read" ON public.combo_items;
DROP POLICY IF EXISTS "combo_items public write" ON public.combo_items;
DROP POLICY IF EXISTS "combo_items public update" ON public.combo_items;
DROP POLICY IF EXISTS "combo_items public delete" ON public.combo_items;

CREATE POLICY "combo_items public read" ON public.combo_items FOR SELECT USING (true);
CREATE POLICY "combo_items admin insert" ON public.combo_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "combo_items admin update" ON public.combo_items FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "combo_items admin delete" ON public.combo_items FOR DELETE USING (public.is_admin());

-- Recreate policies for public.individual_services
DROP POLICY IF EXISTS "indiv public read" ON public.individual_services;
DROP POLICY IF EXISTS "indiv public write" ON public.individual_services;
DROP POLICY IF EXISTS "indiv public update" ON public.individual_services;
DROP POLICY IF EXISTS "indiv public delete" ON public.individual_services;

CREATE POLICY "indiv public read" ON public.individual_services FOR SELECT USING (true);
CREATE POLICY "indiv admin insert" ON public.individual_services FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "indiv admin update" ON public.individual_services FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "indiv admin delete" ON public.individual_services FOR DELETE USING (public.is_admin());

-- Recreate policies for public.gallery_images
DROP POLICY IF EXISTS "gallery public read" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery public write" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery public update" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery public delete" ON public.gallery_images;

CREATE POLICY "gallery public read" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "gallery admin insert" ON public.gallery_images FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "gallery admin update" ON public.gallery_images FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "gallery admin delete" ON public.gallery_images FOR DELETE USING (public.is_admin());

-- Recreate policies for storage.objects in gallery bucket
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;

CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery' AND public.is_admin())
WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND public.is_admin());
