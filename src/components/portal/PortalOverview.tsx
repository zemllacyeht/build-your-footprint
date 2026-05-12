import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, FileText, Loader2, MessageSquare, Receipt, ThumbsUp } from "lucide-react";

interface Props {
  clientId: string;
  onJump: (tab: string) => void;
}

interface Summary {
  nextMilestone: { title: string; due_at: string | null } | null;
  completed: number;
  totalMilestones: number;
  pendingApprovals: number;
  outstandingCents: number;
  currency: string;
  unpaidCount: number;
  filesCount: number;
  latestMessage: { content: string; created_at: string } | null;
}

const formatMoney = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(
    (cents || 0) / 100,
  );

export const PortalOverview = ({ clientId, onJump }: Props) => {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [milestones, approvals, invoices, files, messages] = await Promise.all([
        supabase
          .from("project_milestones")
          .select("title, status, due_at, position")
          .eq("client_id", clientId)
          .order("position", { ascending: true }),
        supabase
          .from("project_approvals")
          .select("id")
          .eq("client_id", clientId)
          .eq("status", "pending"),
        supabase
          .from("client_invoices")
          .select("amount_cents, currency, status")
          .eq("client_id", clientId)
          .in("status", ["sent", "overdue"]),
        supabase
          .from("client_deliverables")
          .select("id", { count: "exact", head: true })
          .eq("client_id", clientId),
        supabase
          .from("client_messages")
          .select("content, created_at")
          .eq("client_id", clientId)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      const allMilestones = milestones.data ?? [];
      const completed = allMilestones.filter((m) => m.status === "complete").length;
      const next = allMilestones.find((m) => m.status !== "complete") ?? null;
      const inv = invoices.data ?? [];
      const outstanding = inv.reduce((s, i) => s + (i.amount_cents || 0), 0);

      setData({
        nextMilestone: next ? { title: next.title, due_at: next.due_at } : null,
        completed,
        totalMilestones: allMilestones.length,
        pendingApprovals: (approvals.data ?? []).length,
        outstandingCents: outstanding,
        currency: inv[0]?.currency ?? "USD",
        unpaidCount: inv.length,
        filesCount: files.count ?? 0,
        latestMessage: (messages.data ?? [])[0] ?? null,
      });
      setLoading(false);
    };
    load();
  }, [clientId]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const progress = data.totalMilestones
    ? Math.round((data.completed / data.totalMilestones) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              <Clock className="h-3.5 w-3.5" /> Next up
            </div>
            {data.nextMilestone ? (
              <>
                <div className="font-display text-xl font-semibold">{data.nextMilestone.title}</div>
                {data.nextMilestone.due_at && (
                  <div className="text-xs text-muted-foreground mt-1">Due {data.nextMilestone.due_at}</div>
                )}
                {data.totalMilestones > 0 && (
                  <div className="mt-3">
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {data.completed} / {data.totalMilestones} phases complete
                    </div>
                  </div>
                )}
                <Button size="sm" variant="ghost" className="mt-3 px-0" onClick={() => onJump("timeline")}>
                  View timeline <ArrowRight className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No milestones yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              <ThumbsUp className="h-3.5 w-3.5" /> Pending approvals
            </div>
            {data.pendingApprovals > 0 ? (
              <>
                <div className="font-display text-3xl font-semibold">{data.pendingApprovals}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Waiting on your review.
                </div>
                <Button size="sm" variant="ghost" className="mt-3 px-0" onClick={() => onJump("approvals")}>
                  Review now <ArrowRight className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                You're all caught up.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              <Receipt className="h-3.5 w-3.5" /> Outstanding billing
            </div>
            {data.unpaidCount > 0 ? (
              <>
                <div className="font-display text-2xl font-semibold">
                  {formatMoney(data.outstandingCents, data.currency)}
                </div>
                <Badge variant="secondary" className="mt-1">
                  {data.unpaidCount} {data.unpaidCount === 1 ? "invoice" : "invoices"}
                </Badge>
                <Button size="sm" variant="ghost" className="mt-3 px-0 ml-auto block" onClick={() => onJump("billing")}>
                  View billing <ArrowRight className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No unpaid invoices.</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              <FileText className="h-3.5 w-3.5" /> Files shared
            </div>
            <div className="font-display text-3xl font-semibold">{data.filesCount}</div>
            <Button size="sm" variant="ghost" className="mt-3 px-0" onClick={() => onJump("workspace")}>
              Open workspace <ArrowRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {data.latestMessage && (
        <Card className="glass border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              <MessageSquare className="h-3.5 w-3.5" /> Latest message
            </div>
            <p className="text-sm whitespace-pre-wrap line-clamp-3">{data.latestMessage.content}</p>
            <div className="text-[11px] text-muted-foreground mt-2">
              {new Date(data.latestMessage.created_at).toLocaleString()}
            </div>
            <Button size="sm" variant="ghost" className="mt-3 px-0" onClick={() => onJump("workspace")}>
              Open thread <ArrowRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
