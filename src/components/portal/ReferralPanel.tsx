import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, UserPlus, Gift } from "lucide-react";
import { toast } from "sonner";
import { sendNotification } from "@/lib/notifications";

interface Referral {
  id: string;
  referred_email: string;
  referred_name: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export const ReferralPanel = () => {
  const { user } = useAuth();
  const [list, setList] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    referred_email: "",
    referred_name: "",
    message: "",
  });
  const [referrer, setReferrer] = useState<{ contact_name: string | null; company_name: string | null }>({
    contact_name: null,
    company_name: null,
  });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: refs }, { data: prof }] = await Promise.all([
      supabase
        .from("client_referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("contact_name, company_name")
        .eq("id", user.id)
        .maybeSingle(),
    ]);
    setList((refs as Referral[]) ?? []);
    setReferrer({
      contact_name: prof?.contact_name ?? null,
      company_name: prof?.company_name ?? null,
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const submit = async () => {
    if (!user) return;
    const email = form.referred_email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Please enter a valid email address");
    }
    setSending(true);
    const { data, error } = await supabase
      .from("client_referrals")
      .insert({
        referrer_id: user.id,
        referred_email: email,
        referred_name: form.referred_name.trim() || null,
        message: form.message.trim() || null,
      })
      .select()
      .maybeSingle();

    if (error) {
      setSending(false);
      return toast.error(error.message);
    }

    await sendNotification({
      templateName: "referral-invitation",
      recipientEmail: email,
      idempotencyKey: `referral-${data?.id}`,
      templateData: {
        recipientName: form.referred_name.trim() || undefined,
        referrerName: referrer.contact_name || undefined,
        referrerCompany: referrer.company_name || undefined,
        message: form.message.trim() || undefined,
      },
    });

    setSending(false);
    setForm({ referred_email: "", referred_name: "", message: "" });
    toast.success("Invitation sent. Thank you for the referral.");
    load();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Refer a friend</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Know a business that could use a beautiful website? Send them a warm intro from you.
        </p>
        <div className="space-y-3 rounded-lg border border-border/50 p-4 bg-muted/20">
          <div className="grid gap-1.5">
            <Label htmlFor="ref-email" className="text-xs">Their email</Label>
            <Input
              id="ref-email"
              type="email"
              placeholder="friend@company.com"
              value={form.referred_email}
              onChange={(e) => setForm({ ...form, referred_email: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ref-name" className="text-xs">Their name (optional)</Label>
            <Input
              id="ref-name"
              placeholder="Marie"
              value={form.referred_name}
              onChange={(e) => setForm({ ...form, referred_name: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ref-msg" className="text-xs">Personal note (optional)</Label>
            <Textarea
              id="ref-msg"
              rows={3}
              maxLength={500}
              placeholder="A short note we can include with the introduction."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <Button variant="hero" onClick={submit} disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send invitation
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Your referrals</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No referrals yet.</p>
        ) : (
          <div className="space-y-2">
            {list.map((r) => (
              <div key={r.id} className="rounded-lg border border-border/50 p-3 bg-background/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {r.referred_name || r.referred_email}
                    </div>
                    {r.referred_name && (
                      <div className="text-xs text-muted-foreground truncate">{r.referred_email}</div>
                    )}
                  </div>
                  <Badge variant="secondary" className="capitalize">{r.status}</Badge>
                </div>
                {r.message && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{r.message}</p>
                )}
                <div className="text-[10px] text-muted-foreground mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
