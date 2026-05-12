import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Eye, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface Attachment {
  id: string;
  ticket_id: string;
  file_path: string;
  mime_type: string | null;
  size_bytes: number | null;
}

const STATUSES = ["new", "in_progress", "resolved", "closed"];

export const AdminSupport = () => {
  const [rows, setRows] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Ticket | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Ticket[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const open = async (t: Ticket) => {
    setActive(t);
    setNotes(t.admin_notes ?? "");
    const { data } = await supabase
      .from("support_ticket_attachments")
      .select("*")
      .eq("ticket_id", t.id);
    setAttachments((data as Attachment[]) ?? []);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("support_tickets").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
    if (active?.id === id) setActive({ ...active, status });
  };

  const saveNotes = async () => {
    if (!active) return;
    setSaving(true);
    const { error } = await supabase
      .from("support_tickets")
      .update({ admin_notes: notes })
      .eq("id", active.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Notes saved");
  };

  const viewAttachment = (path: string) => {
    const { data } = supabase.storage.from("support-attachments").getPublicUrl(path);
    if (data?.publicUrl) window.open(data.publicUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Support tickets</h2>
        <Button variant="ghost" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="glass rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  No tickets yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.email}</div>
                  </TableCell>
                  <TableCell className="max-w-sm truncate">{t.subject}</TableCell>
                  <TableCell>
                    <Select value={t.status} onValueChange={(v) => updateStatus(t.id, v)}>
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(t.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => open(t)}>
                      <Eye className="h-4 w-4" /> Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{active?.subject}</SheetTitle>
          </SheetHeader>
          {active && (
            <div className="space-y-5 mt-6">
              <div className="text-sm">
                <div className="font-medium">{active.name}</div>
                <div className="text-muted-foreground text-xs">{active.email}</div>
                <div className="text-muted-foreground text-xs mt-1">
                  {new Date(active.created_at).toLocaleString()}
                </div>
                <Badge variant="secondary" className="mt-2 capitalize">
                  {active.status.replace("_", " ")}
                </Badge>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Message
                </div>
                <p className="text-sm whitespace-pre-wrap rounded-md border border-border/50 bg-muted/20 p-3">
                  {active.message}
                </p>
              </div>

              {attachments.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    Attachments
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {attachments.map((a) => {
                      const { data } = supabase.storage
                        .from("support-attachments")
                        .getPublicUrl(a.file_path);
                      const isImage = (a.mime_type ?? "").startsWith("image/");
                      return (
                        <button
                          key={a.id}
                          onClick={() => viewAttachment(a.file_path)}
                          className="rounded-md border border-border/50 overflow-hidden hover:opacity-80 transition"
                        >
                          {isImage ? (
                            <img
                              src={data.publicUrl}
                              alt="attachment"
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="h-32 grid place-items-center text-xs text-muted-foreground">
                              View file
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Internal notes
                </div>
                <Textarea
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes only visible to admins."
                />
                <Button
                  variant="hero"
                  size="sm"
                  className="mt-2"
                  onClick={saveNotes}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save notes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
