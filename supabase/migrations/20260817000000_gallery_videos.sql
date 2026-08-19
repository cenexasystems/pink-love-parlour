-- Add type column to gallery_images table if it does not exist
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'image';

-- Drop old unique constraint on position alone if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'gallery_images_position_key'
    ) THEN
        ALTER TABLE public.gallery_images DROP CONSTRAINT gallery_images_position_key;
    END IF;
END $$;

-- Add composite unique constraint on (position, type) if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'gallery_images_position_type_key'
    ) THEN
        ALTER TABLE public.gallery_images ADD CONSTRAINT gallery_images_position_type_key UNIQUE (position, type);
    END IF;
END $$;
