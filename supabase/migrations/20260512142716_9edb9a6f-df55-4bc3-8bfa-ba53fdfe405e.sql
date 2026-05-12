
-- Project milestones
CREATE TABLE public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','complete','blocked')),
  due_at DATE,
  completed_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_milestones_client ON public.project_milestones(client_id, position);
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own milestones" ON public.project_milestones
  FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Admins view all milestones" ON public.project_milestones
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert milestones" ON public.project_milestones
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update milestones" ON public.project_milestones
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete milestones" ON public.project_milestones
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Project approvals
CREATE TABLE public.project_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  preview_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','changes_requested')),
  decided_at TIMESTAMPTZ,
  decided_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_approvals_client ON public.project_approvals(client_id, created_at DESC);
ALTER TABLE public.project_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own approvals" ON public.project_approvals
  FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Admins view all approvals" ON public.project_approvals
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert approvals" ON public.project_approvals
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update approvals" ON public.project_approvals
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients decide own approvals" ON public.project_approvals
  FOR UPDATE TO authenticated USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Admins delete approvals" ON public.project_approvals
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_approvals_updated_at
  BEFORE UPDATE ON public.project_approvals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Approval comments
CREATE TABLE public.approval_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id UUID NOT NULL REFERENCES public.project_approvals(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_approval_comments ON public.approval_comments(approval_id, created_at);
ALTER TABLE public.approval_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all approval comments" ON public.approval_comments
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own approval comments" ON public.approval_comments
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.project_approvals a WHERE a.id = approval_id AND a.client_id = auth.uid())
  );
CREATE POLICY "Admins post approval comments" ON public.approval_comments
  FOR INSERT TO authenticated WITH CHECK (
    has_role(auth.uid(), 'admin') AND auth.uid() = author_id
  );
CREATE POLICY "Clients post on own approvals" ON public.approval_comments
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (SELECT 1 FROM public.project_approvals a WHERE a.id = approval_id AND a.client_id = auth.uid())
  );
CREATE POLICY "Admins delete approval comments" ON public.approval_comments
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.project_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.approval_comments;
