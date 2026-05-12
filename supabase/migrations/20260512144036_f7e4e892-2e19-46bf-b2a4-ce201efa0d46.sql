
-- ============================================
-- PHASE 2: Stripe subscriptions
-- ============================================
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  plan_type TEXT NOT NULL DEFAULT 'hosting',
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  interval TEXT NOT NULL DEFAULT 'month',
  stripe_price_id TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view active plans" ON public.subscription_plans
  FOR SELECT TO authenticated USING (active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage plans" ON public.subscription_plans
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_subscription_plans_updated BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.client_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'incomplete',
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_client_subscriptions_client ON public.client_subscriptions(client_id);
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients view own subscriptions" ON public.client_subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Admins view all subscriptions" ON public.client_subscriptions
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage subscriptions" ON public.client_subscriptions
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_client_subscriptions_updated BEFORE UPDATE ON public.client_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.stripe_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.stripe_events
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- PHASE 3: Referrals
-- ============================================
CREATE TABLE public.client_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL,
  referred_email TEXT NOT NULL,
  referred_name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_client_referrals_referrer ON public.client_referrals(referrer_id);
ALTER TABLE public.client_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own referrals" ON public.client_referrals
  FOR SELECT TO authenticated USING (auth.uid() = referrer_id);
CREATE POLICY "Admins view all referrals" ON public.client_referrals
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own referrals" ON public.client_referrals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Admins update referrals" ON public.client_referrals
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_client_referrals_updated BEFORE UPDATE ON public.client_referrals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- PHASE 4: Support tickets
-- ============================================
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_support_tickets_user ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own tickets" ON public.support_tickets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all tickets" ON public.support_tickets
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create tickets" ON public.support_tickets
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins update tickets" ON public.support_tickets
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_support_tickets_updated BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.support_ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_support_attachments_ticket ON public.support_ticket_attachments(ticket_id);
ALTER TABLE public.support_ticket_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners view attachments" ON public.support_ticket_attachments
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid())
  );
CREATE POLICY "Admins view all attachments" ON public.support_ticket_attachments
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert attachments" ON public.support_ticket_attachments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Storage bucket for support attachments (public read for simplicity, paths are uuid-prefixed)
INSERT INTO storage.buckets (id, name, public) VALUES ('support-attachments', 'support-attachments', true)
  ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public read support attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'support-attachments');
CREATE POLICY "Anyone upload support attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'support-attachments');
CREATE POLICY "Admins delete support attachments" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'support-attachments' AND has_role(auth.uid(), 'admin'));

-- ============================================
-- PHASE 5: Build content assets
-- ============================================
CREATE TABLE public.client_build_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  uploader_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  label TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_client_build_assets_client ON public.client_build_assets(client_id);
ALTER TABLE public.client_build_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients view own build assets" ON public.client_build_assets
  FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Admins view all build assets" ON public.client_build_assets
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients insert own build assets" ON public.client_build_assets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id AND auth.uid() = uploader_id);
CREATE POLICY "Admins insert build assets" ON public.client_build_assets
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') AND auth.uid() = uploader_id);
CREATE POLICY "Clients delete own build assets" ON public.client_build_assets
  FOR DELETE TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Admins delete any build assets" ON public.client_build_assets
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public) VALUES ('build-assets', 'build-assets', false)
  ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Clients read own build files" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'build-assets' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Admins read all build files" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'build-assets' AND has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Clients upload to own build folder" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'build-assets' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Admins upload to any build folder" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'build-assets' AND has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Clients delete own build files" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'build-assets' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Admins delete any build file" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'build-assets' AND has_role(auth.uid(), 'admin')
  );

-- ============================================
-- Realtime for new tables
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_build_assets;
