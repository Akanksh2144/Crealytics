CREATE TABLE public.youtube_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  channel_id text,
  channel_name text,
  channel_thumbnail text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  scopes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.youtube_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own connection"
  ON public.youtube_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connection"
  ON public.youtube_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connection"
  ON public.youtube_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);