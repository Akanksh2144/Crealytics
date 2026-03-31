ALTER TABLE public.youtube_connections
ADD COLUMN IF NOT EXISTS niche_data jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS watch_hours_total numeric DEFAULT NULL;