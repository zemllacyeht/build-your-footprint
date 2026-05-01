import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  ExternalLink,
  FileUp,
  Link as LinkIcon,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Deliverable {
  id: string;
  client_id: string;
  label: string;
  description: string | null;
  file_path: string | null;
  external_url: string | null;
  created_at: string;
}

interface Message {
  id: string;
  client_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Props {
  clientId: string;
  isAdmin?: boolean;
}

export const ClientWorkspace = ({ clientId, isAdmin = false }: Props) => {
  const { user } = useAuth();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [addingLink, setAddingLink] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: dels }, { data: msgs }] = await Promise.all([
      supabase
        .from("client_deliverables")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }),
      supabase
        .from("client_messages")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true }),
    ]);
    setDeliverables((dels as Deliverable[]) ?? []);
    setMessages((msgs as Message[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`workspace:${clientId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "client_messages", filter: `client_id=eq.${clientId}` },
        () => load(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "client_deliverables", filter: `client_id=eq.${clientId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = async () => {
    if (!draft.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from("client_messages").insert({
      client_id: clientId,
      sender_id: user.id,
      content: draft.trim(),
    });
    setSending(false);
    if (error) return toast.error(error.message);
    setDraft("");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${clientId}/${Date.now()}_${safeName}`;
    const { error: upErr } = await supabase.storage
      .from("deliverables")
      .upload(path, file, { upsert: false });
    if (upErr) {
      setUploading(false);
      return toast.error(upErr.message);
    }
    const { error: insErr } = await supabase.from("client_deliverables").insert({
      client_id: clientId,
      label: file.name,
      file_path: path,
    });
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
    if (insErr) return toast.error(insErr.message);
    toast.success("File uploaded");
  };

  const addLink = async () => {
    if (!linkLabel.trim() || !linkUrl.trim()) return toast.error("Label and URL required");
    if (!/^https?:\/\//i.test(linkUrl)) return toast.error("URL must start with http(s)://");
    setAddingLink(true);
    const { error } = await supabase.from("client_deliverables").insert({
      client_id: clientId,
      label: linkLabel.trim(),
      external_url: linkUrl.trim(),
    });
    setAddingLink(false);
    if (error) return toast.error(error.message);
    setLinkLabel("");
    setLinkUrl("");
    toast.success("Link added");
  };

  const removeDeliverable = async (d: Deliverable) => {
    if (!confirm(`Delete "${d.label}"?`)) return;
    if (d.file_path) {
      await supabase.storage.from("deliverables").remove([d.file_path]);
    }
    const { error } = await supabase.from("client_deliverables").delete().eq("id", d.id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
  };

  const downloadFile = async (d: Deliverable) => {
    if (d.external_url) {
      window.open(d.external_url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!d.file_path) return;
    const { data, error } = await supabase.storage
      .from("deliverables")
      .createSignedUrl(d.file_path, 60);
    if (error || !data?.signedUrl) return toast.error(error?.message || "Failed");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Deliverables */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Deliverables</h3>
        </div>

        {isAdmin && (
          <div className="space-y-3 rounded-lg border border-border/50 p-3 bg-muted/20">
            <div>
              <Label className="text-xs">Upload a file</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  ref={fileInput}
                  type="file"
                  onChange={handleUpload}
                  className="hidden"
                  id="deliverable-file"
                />
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileUp className="h-4 w-4" />
                  )}
                  Choose file
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs">Or add a link</Label>
              <div className="grid gap-2 mt-1">
                <Input
                  placeholder="Label (e.g. Brand kit)"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="https://…"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <Button variant="hero" size="sm" onClick={addLink} disabled={addingLink}>
                    {addingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {deliverables.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No deliverables yet.
            </p>
          ) : (
            deliverables.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/50 p-3 bg-background/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{d.label}</div>
                  {d.description && (
                    <div className="text-xs text-muted-foreground truncate">{d.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => downloadFile(d)}>
                    {d.external_url ? (
                      <ExternalLink className="h-4 w-4" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => removeDeliverable(d)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Messages</h3>
        </div>

        <div className="rounded-lg border border-border/50 bg-background/50 h-72 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No messages yet. Say hello.
            </p>
          ) : (
            messages.map((m) => {
              const mine = m.sender_id === user?.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                      mine
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.content}
                    <div className={`text-[10px] mt-1 opacity-70`}>
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEnd} />
        </div>

        <div className="flex gap-2">
          <Textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message…"
            maxLength={5000}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button variant="hero" onClick={sendMessage} disabled={sending || !draft.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">⌘/Ctrl + Enter to send</p>
      </div>
    </div>
  );
};
