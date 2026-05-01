
-- 1. Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS project_url TEXT;

-- 2. Deliverables table
CREATE TABLE IF NOT EXISTS public.client_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  file_path TEXT,            -- storage path in 'deliverables' bucket
  external_url TEXT,         -- optional external link instead of file
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_deliverables_client_id_idx
  ON public.client_deliverables(client_id);

ALTER TABLE public.client_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own deliverables"
  ON public.client_deliverables FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Admins view all deliverables"
  ON public.client_deliverables FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert deliverables"
  ON public.client_deliverables FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update deliverables"
  ON public.client_deliverables FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete deliverables"
  ON public.client_deliverables FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_client_deliverables_updated_at
  BEFORE UPDATE ON public.client_deliverables
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Messages table
CREATE TABLE IF NOT EXISTS public.client_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_messages_client_id_idx
  ON public.client_messages(client_id, created_at DESC);

ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own thread"
  ON public.client_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Admins view all messages"
  ON public.client_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients post in own thread"
  ON public.client_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id AND auth.uid() = sender_id);

CREATE POLICY "Admins post any message"
  ON public.client_messages FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = sender_id);

CREATE POLICY "Admins delete messages"
  ON public.client_messages FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Deliverables storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('deliverables', 'deliverables', false)
ON CONFLICT (id) DO NOTHING;

-- Files are stored under <client_id>/<filename>
CREATE POLICY "Clients read own deliverable files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'deliverables'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins read all deliverable files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'deliverables'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins upload deliverable files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'deliverables'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins update deliverable files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'deliverables'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins delete deliverable files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'deliverables'
    AND public.has_role(auth.uid(), 'admin')
  );
