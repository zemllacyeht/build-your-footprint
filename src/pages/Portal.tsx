import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Globe, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ClientWorkspace } from "@/components/portal/ClientWorkspace";
import { ClientInvoices } from "@/components/portal/ClientInvoices";

interface Profile {
  id: string;
  email: string | null;
  company_name: string | null;
  contact_name: string | null;
  project_status: string;
  project_url: string | null;
  notes: string | null;
}

const Portal = () => {
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoadingProfile(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoadingProfile(false);
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
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <Button variant="glass" size="sm" onClick={() => navigate("/admin")}>
                Admin Console
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

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

      <section className="container pb-20 space-y-6">
        {/* Embedded site preview */}
        <Card className="glass border-border/50 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Your website preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProfile ? (
              <div className="aspect-video grid place-items-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : profile?.project_url ? (
              <div className="rounded-lg border border-border overflow-hidden bg-background relative">
                <iframe
                  src={profile.project_url}
                  title="Website preview"
                  className="w-full h-[70vh]"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-muted/30 border border-border grid place-items-center text-sm text-muted-foreground">
                Your preview will appear here once your project is ready.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes from team */}
        {profile?.notes && (
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Notes from your team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{profile.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Files + Messages */}
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            {user && <ClientWorkspace clientId={user.id} isAdmin={false} />}
          </CardContent>
        </Card>

        {/* Billing */}
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            {user && <ClientInvoices clientId={user.id} isAdmin={false} />}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Portal;
