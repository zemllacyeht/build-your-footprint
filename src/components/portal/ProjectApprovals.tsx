import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  ThumbsUp,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { sendNotification, getClientContact, getAdminEmail } from "@/lib/notifications";

interface Approval {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  preview_url: string | null;
  status: "pending" | "approved" | "changes_requested";
  decided_at: string | null;
  decided_by: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  approval_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

const statusMeta: Record<Approval["status"], { label: string; tone: string; Icon: typeof Clock }> = {
  pending: { label: "Awaiting review", tone: "bg-muted text-muted-foreground", Icon: Clock },
  approved: { label: "Approved", tone: "bg-primary/15 text-primary border-primary/30", Icon: CheckCircle2 },
  changes_requested: {
    label: "Changes requested",
    tone: "bg-destructive/15 text-destructive border-destructive/30",
    Icon: XCircle,
  },
};

interface Props {
  clientId: string;
  isAdmin?: boolean;
}

export const ProjectApprovals = ({ clientId, isAdmin = false }: Props) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Approval[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "", preview_url: "" });
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data: approvals, error } = await supabase
      .from("project_approvals")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    if (error) {
      setLoading(false);
      return toast.error("Couldn't load approvals");
    }
    const list = (approvals ?? []) as Approval[];
    setItems(list);

    if (list.length) {
      const { data: cmts } = await supabase
        .from("approval_comments")
        .select("*")
        .in("approval_id", list.map((a) => a.id))
        .order("created_at", { ascending: true });
      const grouped: Record<string, Comment[]> = {};
      (cmts ?? []).forEach((c) => {
        grouped[c.approval_id] ??= [];
        grouped[c.approval_id].push(c as Comment);
      });
      setComments(grouped);
    } else {
      setComments({});
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`approvals:${clientId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_approvals", filter: `client_id=eq.${clientId}` },
        () => load(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "approval_comments" },
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
    if (draft.preview_url && !/^https?:\/\//i.test(draft.preview_url)) {
      return toast.error("Preview URL must start with http(s)://");
    }
    setSaving(true);
    const { data: inserted, error } = await supabase
      .from("project_approvals")
      .insert({
        client_id: clientId,
        title: draft.title.trim(),
        description: draft.description.trim() || null,
        preview_url: draft.preview_url.trim() || null,
      })
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Approval requested, client notified");
    if (inserted) {
      const c = await getClientContact(clientId);
      if (c.email) {
        void sendNotification({
          templateName: "approval-requested",
          recipientEmail: c.email,
          idempotencyKey: `approval-req-${inserted.id}`,
          templateData: {
            clientName: c.name || c.company || undefined,
            approvalTitle: inserted.title,
            approvalDescription: inserted.description,
            previewUrl: inserted.preview_url,
          },
        });
      }
    }
    setShowForm(false);
    setDraft({ title: "", description: "", preview_url: "" });
  };

  const decide = async (a: Approval, status: Approval["status"]) => {
    if (!user) return;
    const { error } = await supabase
      .from("project_approvals")
      .update({
        status,
        decided_at: new Date().toISOString(),
        decided_by: user.id,
      })
      .eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success(status === "approved" ? "Approved, the team has been notified" : "Feedback sent to the team");
    const [adminEmail, client] = await Promise.all([getAdminEmail(), getClientContact(a.client_id)]);
    if (adminEmail) {
      void sendNotification({
        templateName: "approval-decided",
        recipientEmail: adminEmail,
        idempotencyKey: `approval-decide-${a.id}-${status}`,
        templateData: {
          clientName: client.name || undefined,
          clientCompany: client.company || undefined,
          approvalTitle: a.title,
          decision: status,
        },
      });
    }
  };

  const remove = async (a: Approval) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    const { error } = await supabase.from("project_approvals").delete().eq("id", a.id);
    if (error) return toast.error(error.message);
  };

  const postComment = async (approvalId: string) => {
    const text = (commentDraft[approvalId] || "").trim();
    if (!text || !user) return;
    const { data: inserted, error } = await supabase
      .from("approval_comments")
      .insert({
        approval_id: approvalId,
        author_id: user.id,
        content: text,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setCommentDraft((d) => ({ ...d, [approvalId]: "" }));
    const approval = items.find((a) => a.id === approvalId);
    if (approval && inserted) {
      const audience: "admin" | "client" = isAdmin ? "client" : "admin";
      const recipient = isAdmin
        ? (await getClientContact(approval.client_id)).email
        : await getAdminEmail();
      if (recipient) {
        const authorName = isAdmin ? "Your team" : "Client";
        void sendNotification({
          templateName: "approval-comment",
          recipientEmail: recipient,
          idempotencyKey: `approval-comment-${inserted.id}`,
          templateData: {
            authorName,
            approvalTitle: approval.title,
            comment: text,
            audience,
          },
        });
      }
    }
  };

  const pendingCount = items.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Approvals & feedback</h3>
          {pendingCount > 0 && (
            <Badge className="bg-accent/15 text-accent border-accent/30 border">{pendingCount} pending</Badge>
          )}
        </div>
        {isAdmin && (
          <Button variant="hero" size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" /> Request approval
          </Button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="rounded-lg border border-border/50 p-4 bg-muted/20 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Title *</Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Homepage v2 mockup"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="What you want them to review and look out for"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Preview URL</Label>
            <Input
              value={draft.preview_url}
              onChange={(e) => setDraft({ ...draft, preview_url: e.target.value })}
              placeholder="https://figma.com/..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="hero" size="sm" onClick={submit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Send for approval
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
          No approval requests yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((a) => {
            const meta = statusMeta[a.status];
            const isOpen = openId === a.id;
            const itemComments = comments[a.id] ?? [];
            return (
              <div key={a.id} className="rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-medium">{a.title}</div>
                      <Badge className={`capitalize border ${meta.tone}`}>
                        <meta.Icon className="h-3 w-3 mr-1 inline" />
                        {meta.label}
                      </Badge>
                    </div>
                    {a.description && (
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        {a.description}
                      </p>
                    )}
                    {a.preview_url && (
                      <a
                        href={a.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                      >
                        <ExternalLink className="h-3 w-3" /> Open preview
                      </a>
                    )}
                  </div>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => remove(a)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {!isAdmin && a.status !== "approved" && (
                    <Button size="sm" variant="hero" onClick={() => decide(a, "approved")}>
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </Button>
                  )}
                  {!isAdmin && a.status !== "changes_requested" && (
                    <Button size="sm" variant="glass" onClick={() => decide(a, "changes_requested")}>
                      <XCircle className="h-4 w-4" /> Request changes
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setOpenId(isOpen ? null : a.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {itemComments.length} {itemComments.length === 1 ? "comment" : "comments"}
                  </Button>
                </div>

                {isOpen && (
                  <div className="mt-3 border-t border-border/50 pt-3 space-y-3">
                    {itemComments.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No comments yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {itemComments.map((c) => {
                          const mine = c.author_id === user?.id;
                          return (
                            <div key={c.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                                  mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                                }`}
                              >
                                {c.content}
                                <div className="text-[10px] mt-1 opacity-70">
                                  {new Date(c.created_at).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Textarea
                        rows={2}
                        value={commentDraft[a.id] ?? ""}
                        onChange={(e) => setCommentDraft((d) => ({ ...d, [a.id]: e.target.value }))}
                        placeholder="Leave a comment"
                        maxLength={2000}
                      />
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => postComment(a.id)}
                        disabled={!(commentDraft[a.id] || "").trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
