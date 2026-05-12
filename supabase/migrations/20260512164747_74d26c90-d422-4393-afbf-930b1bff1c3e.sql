ALTER TABLE public.client_invoices
  ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_client_subscriptions_client_id ON public.client_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_subscriptions_stripe_sub ON public.client_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON public.subscription_plans(active, position);