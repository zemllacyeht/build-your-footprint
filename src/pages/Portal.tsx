import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Globe, CreditCard, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string | null;
  company_name: string | null;
  contact_name: string | null;
  project_status: string;
  notes: string | null;
}

const Portal = () => {
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error("Couldn't load your profile");
        else setProfile(data as Profile);
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const displayName =
    profile?.company_name || profile?.contact_name || user?.email?.split("@")[0] || "Client";

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
              <span className="font-display font-bold text-primary-foreground">F</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold">
                Build Your <span className="text-gradient-gold">Footprint</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Client Portal
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {role === "admin" && <Badge variant="secondary">Admin</Badge>}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-12">
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mt-1">
          {displayName}
        </h1>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Project status:</span>
          <Badge className="capitalize">{profile?.project_status ?? "onboarding"}</Badge>
        </div>
      </section>

      {/* Cards */}
      <section className="container pb-20 grid gap-6 md:grid-cols-2">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Website Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg bg-muted/30 border border-border grid place-items-center text-sm text-muted-foreground">
              Your preview will appear here
            </div>
            <Button variant="glass" size="sm" className="mt-4" disabled>
              <ExternalLink className="h-4 w-4" /> Open in new tab
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              One-time invoices and monthly hosting + domain billing will live here.
            </p>
            <Button variant="hero" size="sm" disabled>
              Coming soon
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Notes from your team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {profile?.notes || "No notes yet — your designer will leave updates here."}
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Portal;
