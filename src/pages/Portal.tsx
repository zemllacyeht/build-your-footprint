import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Globe,
  MessageSquare,
  Loader2,
  LayoutDashboard,
  Milestone,
  ThumbsUp,
  Briefcase,
  Receipt,
  Settings,
  Gift,
  LifeBuoy,
  FolderUp,
} from "lucide-react";
import { toast } from "sonner";
import { ClientWorkspace } from "@/components/portal/ClientWorkspace";
import { ClientInvoices } from "@/components/portal/ClientInvoices";
import { ProjectTimeline } from "@/components/portal/ProjectTimeline";
import { ProjectApprovals } from "@/components/portal/ProjectApprovals";
import { PortalOverview } from "@/components/portal/PortalOverview";
import { AccountSettings } from "@/components/portal/AccountSettings";
import { ReferralPanel } from "@/components/portal/ReferralPanel";
import { BuildAssetsPanel } from "@/components/portal/BuildAssetsPanel";
import { Link } from "react-router-dom";

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
  const [tab, setTab] = useState("overview");

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

      <section className="container pt-10 pb-6">
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mt-1">
          {displayName}
        </h1>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Project status:</span>
          <Badge className="capitalize">{profile?.project_status ?? "onboarding"}</Badge>
        </div>
      </section>

      <section className="container pb-20">
        {!user ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="space-y-6">
            <TabsList className="flex w-full flex-wrap h-auto gap-1 bg-muted/40 p-1">
              <TabsTrigger value="overview" className="gap-1.5">
                <LayoutDashboard className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-1.5">
                <Milestone className="h-4 w-4" /> Timeline
              </TabsTrigger>
              <TabsTrigger value="approvals" className="gap-1.5">
                <ThumbsUp className="h-4 w-4" /> Approvals
              </TabsTrigger>
              <TabsTrigger value="workspace" className="gap-1.5">
                <Briefcase className="h-4 w-4" /> Files & Messages
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-1.5">
                <Receipt className="h-4 w-4" /> Billing
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5">
                <Settings className="h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <PortalOverview clientId={user.id} onJump={setTab} />
              {profile?.notes && (
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" /> Note from your team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{profile.notes}</p>
                  </CardContent>
                </Card>
              )}
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
                    <div className="rounded-lg border border-border overflow-hidden bg-background">
                      <iframe
                        src={profile.project_url}
                        title="Website preview"
                        className="w-full h-[60vh]"
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
            </TabsContent>

            <TabsContent value="timeline">
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <ProjectTimeline clientId={user.id} isAdmin={false} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approvals">
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <ProjectApprovals clientId={user.id} isAdmin={false} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workspace">
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <ClientWorkspace clientId={user.id} isAdmin={false} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <ClientInvoices clientId={user.id} isAdmin={false} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="glass border-border/50">
                <CardContent className="pt-6">
                  <AccountSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </section>
    </main>
  );
};

export default Portal;
