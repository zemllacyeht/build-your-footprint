import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, Loader2, Check } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  description: string | null;
  plan_type: string;
  amount_cents: number;
  currency: string;
  interval: string;
};

type Subscription = {
  id: string;
  plan_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at: string | null;
  stripe_subscription_id: string | null;
};

const formatMoney = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);

export const SubscriptionPlans = ({ clientId }: { clientId: string }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [portalBusy, setPortalBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: plansData }, { data: subsData }] = await Promise.all([
      supabase.from("subscription_plans").select("*").eq("active", true).order("position"),
      supabase.from("client_subscriptions").select("*").eq("client_id", clientId),
    ]);
    setPlans((plansData as Plan[]) || []);
    setSubs((subsData as Subscription[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [clientId]);

  const subscribe = async (planId: string) => {
    setBusyId(planId);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-create-checkout", {
        body: { planId },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("not configured")) {
        toast.error("Payments are not active yet. Please check back soon.");
      } else {
        toast.error(msg || "Couldn't start checkout");
      }
    } finally {
      setBusyId(null);
    }
  };

  const openPortal = async () => {
    setPortalBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-customer-portal", {
        body: { returnUrl: window.location.href },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      toast.error(e?.message || "Couldn't open billing portal");
    } finally {
      setPortalBusy(false);
    }
  };

  const activeSubs = subs.filter((s) => ["active", "trialing", "past_due"].includes(s.status));

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading plans...</div>;
  }

  return (
    <div className="space-y-6">
      {activeSubs.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-semibold">Active subscriptions</h4>
                <p className="text-sm text-muted-foreground">
                  Manage payment method, view invoices, or cancel any time.
                </p>
              </div>
              <Button onClick={openPortal} disabled={portalBusy} variant="outline">
                {portalBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                Manage billing
              </Button>
            </div>
            <ul className="space-y-2">
              {activeSubs.map((s) => {
                const plan = plans.find((p) => p.id === s.plan_id);
                return (
                  <li key={s.id} className="text-sm flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{s.status}</Badge>
                    <span className="font-medium">{plan?.name || "Subscription"}</span>
                    {s.current_period_end && (
                      <span className="text-muted-foreground">
                        Renews {new Date(s.current_period_end).toLocaleDateString()}
                      </span>
                    )}
                    {s.cancel_at && (
                      <span className="text-amber-600">
                        Cancels {new Date(s.cancel_at).toLocaleDateString()}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="font-display text-lg font-semibold mb-1">Hosting and domain plans</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Subscribe to keep your site live. Cancel anytime.
        </p>
        {plans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No plans available right now.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {plans.map((p) => {
              const owned = activeSubs.some((s) => s.plan_id === p.id);
              return (
                <Card key={p.id} className={owned ? "border-primary" : ""}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                          {p.plan_type}
                        </div>
                      </div>
                      {owned && (
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" /> Active
                        </Badge>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    )}
                    <div className="text-2xl font-bold">
                      {formatMoney(p.amount_cents, p.currency)}
                      <span className="text-sm font-normal text-muted-foreground">/{p.interval}</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => subscribe(p.id)}
                      disabled={busyId === p.id || owned}
                    >
                      {busyId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {owned ? "Subscribed" : "Subscribe"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
