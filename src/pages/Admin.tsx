import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Loader2,
  LogOut,
  Shield,
  ShieldOff,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const STATUSES = [
  "onboarding",
  "design",
  "review",
  "development",
  "live",
  "paused",
] as const;

interface ClientRow {
  id: string;
  email: string | null;
  company_name: string | null;
  contact_name: string | null;
  phone: string | null;
  project_status: string;
  notes: string | null;
  created_at: string;
  is_admin: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, role, loading, signOut } = useAuth();
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<ClientRow | null>(null);
  const [draftStatus, setDraftStatus] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const isAdmin = role === "admin";

  const load = async () => {
    setRefreshing(true);
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);

    setRefreshing(false);

    if (pErr || rErr) {
      toast.error("Failed to load clients");
      return;
    }

    const adminSet = new Set(
      (roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id),
    );

    setRows(
      (profiles ?? []).map((p: any) => ({
        ...p,
        is_admin: adminSet.has(p.id),
      })),
    );
  };

  useEffect(() => {
    if (!loading && isAdmin) load();
  }, [loading, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen grid place-items-center bg-background px-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <h1 className="font-display text-2xl font-semibold mb-2">
            Admin only
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            You need an admin role to view this page.
          </p>
          <Button variant="hero" onClick={() => navigate("/portal")}>
            Go to portal
          </Button>
        </div>
      </main>
    );
  }

  const openEditor = (row: ClientRow) => {
    setEditing(row);
    setDraftStatus(row.project_status);
    setDraftNotes(row.notes ?? "");
  };

  const saveEditor = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ project_status: draftStatus, notes: draftNotes || null })
      .eq("id", editing.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Client updated");
    setEditing(null);
    load();
  };

  const toggleAdmin = async (row: ClientRow) => {
    if (row.id === user?.id && row.is_admin) {
      toast.error("You can't demote yourself");
      return;
    }
    if (row.is_admin) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", row.id)
        .eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success(`${row.email} is no longer an admin`);
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: row.id, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success(`${row.email} is now an admin`);
    }
    load();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/portal")}>
              <ArrowLeft className="h-4 w-4" /> Portal
            </Button>
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold">
                Admin <span className="text-gradient-gold">Console</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Build Your Footprint
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={load} disabled={refreshing}>
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <section className="container py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm text-muted-foreground">Clients</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight mt-1">
              {rows.length} {rows.length === 1 ? "account" : "accounts"}
            </h1>
          </div>
        </div>

        <div className="glass rounded-2xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    No clients yet. Create one from the backend Users tab.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.company_name ?? "—"}
                    </TableCell>
                    <TableCell>{row.contact_name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {row.project_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {row.is_admin ? (
                        <Badge className="bg-gradient-gold text-accent-foreground">
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">Client</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditor(row)}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAdmin(row)}
                        disabled={row.id === user?.id && row.is_admin}
                      >
                        {row.is_admin ? (
                          <>
                            <ShieldOff className="h-4 w-4" /> Demote
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4" /> Make admin
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing?.company_name || editing?.email || "Edit client"}
            </DialogTitle>
            <DialogDescription>
              Update the project status and internal notes shown in the portal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project status</Label>
              <Select value={draftStatus} onValueChange={setDraftStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (visible to client)</Label>
              <Textarea
                rows={5}
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="Share an update with your client…"
                maxLength={2000}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={saveEditor} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Admin;
