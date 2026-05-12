import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Check, CircleDashed, CircleDot, Loader2, Pencil, Plus, Trash2, Octagon, Milestone } from "lucide-react";
import { toast } from "sonner";
import { sendNotification, getClientContact } from "@/lib/notifications";

async function notifyMilestone(
  clientId: string,
  milestoneId: string,
  event: "created" | "updated" | "completed",
  data: { title: string; description?: string | null; status: string; due_at?: string | null },
) {
  const c = await getClientContact(clientId);
  if (!c.email) return;
  await sendNotification({
    templateName: "milestone-update",
    recipientEmail: c.email,
    idempotencyKey: `milestone-${milestoneId}-${event}-${data.status}`,
    templateData: {
      clientName: c.name || c.company || undefined,
      milestoneTitle: data.title,
      milestoneDescription: data.description || undefined,
      status: data.status,
      dueDate: data.due_at || undefined,
      event,
    },
  });
}

export interface Milestone {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  position: number;
  status: "pending" | "in_progress" | "complete" | "blocked";
  due_at: string | null;
  completed_at: string | null;
}

const STATUSES: Milestone["status"][] = ["pending", "in_progress", "complete", "blocked"];

const statusMeta: Record<Milestone["status"], { label: string; tone: string; Icon: typeof Check }> = {
  pending: { label: "Pending", tone: "bg-muted text-muted-foreground", Icon: CircleDashed },
  in_progress: { label: "In progress", tone: "bg-accent/15 text-accent border-accent/30", Icon: CircleDot },
  complete: { label: "Complete", tone: "bg-primary/15 text-primary border-primary/30", Icon: Check },
  blocked: { label: "Blocked", tone: "bg-destructive/15 text-destructive border-destructive/30", Icon: Octagon },
};

const DEFAULT_PHASES = [
  { title: "Discovery", description: "Goals, audience, and content audit." },
  { title: "Design", description: "Visual direction and key page mockups." },
  { title: "Build", description: "Development, integrations, and content load." },
  { title: "Review", description: "QA, accessibility, and final tweaks." },
  { title: "Launch", description: "Go-live, DNS, and post-launch monitoring." },
];

interface Props {
  clientId: string;
  isAdmin?: boolean;
}

export const ProjectTimeline = ({ clientId, isAdmin = false }: Props) => {
  const [items, setItems] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    status: "pending" as Milestone["status"],
    due_at: "",
  });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_milestones")
      .select("*")
      .eq("client_id", clientId)
      .order("position", { ascending: true });
    setLoading(false);
    if (error) return toast.error("Couldn't load timeline");
    setItems((data ?? []) as Milestone[]);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`milestones:${clientId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_milestones", filter: `client_id=eq.${clientId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const submit = async () => {
    if (!draft.title.trim()) return toast.error("Title required");
    setSaving(true);
    const position = items.length ? Math.max(...items.map((m) => m.position)) + 1 : 0;
    const { data: inserted, error } = await supabase
      .from("project_milestones")
      .insert({
        client_id: clientId,
        title: draft.title.trim(),
        description: draft.description.trim() || null,
        status: draft.status,
        due_at: draft.due_at || null,
        position,
      })
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Milestone added, client notified");
    if (inserted) {
      void notifyMilestone(clientId, inserted.id, "created", {
        title: inserted.title,
        description: inserted.description,
        status: inserted.status,
        due_at: inserted.due_at,
      });
    }
    setShowForm(false);
    setDraft({ title: "", description: "", status: "pending", due_at: "" });
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from("project_milestones")
      .update({
        title: editing.title,
        description: editing.description,
        status: editing.status,
        due_at: editing.due_at,
        completed_at:
          editing.status === "complete"
            ? editing.completed_at ?? new Date().toISOString().slice(0, 10)
            : null,
      })
      .eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setEditing(null);
  };

  const updateStatus = async (m: Milestone, status: Milestone["status"]) => {
    const { error } = await supabase
      .from("project_milestones")
      .update({
        status,
        completed_at: status === "complete" ? new Date().toISOString().slice(0, 10) : null,
      })
      .eq("id", m.id);
    if (error) return toast.error(error.message);
    void notifyMilestone(m.client_id, m.id, status === "complete" ? "completed" : "updated", {
      title: m.title,
      description: m.description,
      status,
      due_at: m.due_at,
    });
  };

  const remove = async (m: Milestone) => {
    if (!confirm(`Delete "${m.title}"?`)) return;
    const { error } = await supabase.from("project_milestones").delete().eq("id", m.id);
    if (error) return toast.error(error.message);
  };

  const seedDefaults = async () => {
    setSeeding(true);
    const rows = DEFAULT_PHASES.map((p, i) => ({
      client_id: clientId,
      title: p.title,
      description: p.description,
      position: i,
      status: "pending" as const,
    }));
    const { error } = await supabase.from("project_milestones").insert(rows);
    setSeeding(false);
    if (error) return toast.error(error.message);
    toast.success("Default phases added");
  };

  const completed = items.filter((m) => m.status === "complete").length;
  const progress = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Milestone className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Project timeline</h3>
          {items.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {completed} / {items.length} complete, {progress}%
            </span>
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            {items.length === 0 && (
              <Button variant="glass" size="sm" onClick={seedDefaults} disabled={seeding}>
                {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Seed default phases
              </Button>
            )}
            <Button variant="hero" size="sm" onClick={() => setShowForm((v) => !v)}>
              <Plus className="h-4 w-4" /> Add milestone
            </Button>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {isAdmin && showForm && (
        <div className="rounded-lg border border-border/50 p-4 bg-muted/20 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Title *</Label>
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as Milestone["status"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{statusMeta[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Due date</Label>
              <Input
                type="date"
                value={draft.due_at}
                onChange={(e) => setDraft({ ...draft, due_at: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="hero" size="sm" onClick={submit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Add
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          {isAdmin ? "No milestones yet. Seed defaults or add your own." : "Your team hasn't published a timeline yet."}
        </p>
      ) : (
        <ol className="relative border-l border-border/60 ml-2 space-y-4">
          {items.map((m) => {
            const meta = statusMeta[m.status];
            const isEditing = editing?.id === m.id;
            return (
              <li key={m.id} className="ml-6 relative">
                <span
                  className={`absolute -left-[34px] top-1 grid h-6 w-6 place-items-center rounded-full border ${meta.tone}`}
                >
                  <meta.Icon className="h-3.5 w-3.5" />
                </span>
                <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      />
                      <Textarea
                        rows={2}
                        value={editing.description ?? ""}
                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={editing.status}
                          onValueChange={(v) => setEditing({ ...editing, status: v as Milestone["status"] })}
                        >
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>{statusMeta[s].label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="date"
                          value={editing.due_at ?? ""}
                          onChange={(e) => setEditing({ ...editing, due_at: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                        <Button size="sm" variant="hero" onClick={saveEdit}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-medium">{m.title}</div>
                          <Badge className={`capitalize border ${meta.tone}`}>{meta.label}</Badge>
                          {m.due_at && (
                            <span className="text-xs text-muted-foreground">Due {m.due_at}</span>
                          )}
                          {m.completed_at && (
                            <span className="text-xs text-muted-foreground">Done {m.completed_at}</span>
                          )}
                        </div>
                        {m.description && (
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {m.description}
                          </p>
                        )}
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <Select value={m.status} onValueChange={(v) => updateStatus(m, v as Milestone["status"])}>
                            <SelectTrigger className="h-8 w-[130px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>{statusMeta[s].label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm" onClick={() => setEditing(m)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => remove(m)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
