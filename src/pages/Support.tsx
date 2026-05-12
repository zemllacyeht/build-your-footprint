import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ImageUp, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { sendNotification, getAdminEmail } from "@/lib/notifications";

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 5;
const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

const Support = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: user?.email ?? "",
    subject: "",
    message: "",
  });

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(e.target.files ?? []);
    const valid = next.filter((f) => {
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name} is over 10 MB`);
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
    if (fileInput.current) fileInput.current.value = "";
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      return toast.error("Please fill in every required field");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error("Please enter a valid email address");
    }
    setSending(true);

    const ticketId = crypto.randomUUID();
    const { error: tErr } = await supabase.from("support_tickets").insert({
      id: ticketId,
      user_id: user?.id ?? null,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    if (tErr) {
      setSending(false);
      return toast.error(tErr.message);
    }

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${ticketId}/${Date.now()}_${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("support-attachments")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) {
        toast.error(`${file.name}: ${upErr.message}`);
        continue;
      }
      await supabase.from("support_ticket_attachments").insert({
        ticket_id: ticketId,
        file_path: path,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
    }

    const adminEmail = await getAdminEmail();
    await Promise.all([
      sendNotification({
        templateName: "support-ticket-received",
        recipientEmail: form.email.trim().toLowerCase(),
        idempotencyKey: `ticket-receipt-${ticketId}`,
        templateData: {
          name: form.name.trim(),
          subject: form.subject.trim(),
          ticketId,
        },
      }),
      adminEmail
        ? sendNotification({
            templateName: "support-ticket-new",
            recipientEmail: adminEmail,
            idempotencyKey: `ticket-admin-${ticketId}`,
            templateData: {
              name: form.name.trim(),
              email: form.email.trim().toLowerCase(),
              subject: form.subject.trim(),
              message: form.message.trim(),
              ticketId,
              attachmentCount: files.length,
            },
          })
        : Promise.resolve(),
    ]);

    setSending(false);
    setForm({ name: "", email: user?.email ?? "", subject: "", message: "" });
    setFiles([]);
    toast.success("Thanks. We'll be in touch shortly.");
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="container flex items-center justify-between py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Link to="/" className="font-display text-sm font-semibold">
            Build Your <span className="text-gradient-gold">Footprint</span>
          </Link>
          <span className="w-16" />
        </div>
      </header>

      <section className="container py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground">Support</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mt-1">
            How can we help?
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Send us a note and attach screenshots if it helps explain the issue.
          </p>

          <Card className="glass border-border/50 mt-8">
            <CardHeader>
              <CardTitle>Open a ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="s-name" className="text-xs">Your name</Label>
                  <Input
                    id="s-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="s-email" className="text-xs">Email</Label>
                  <Input
                    id="s-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-subject" className="text-xs">Subject</Label>
                <Input
                  id="s-subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-message" className="text-xs">Message</Label>
                <Textarea
                  id="s-message"
                  rows={6}
                  maxLength={5000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs">Screenshots (optional, up to 5, 10 MB each)</Label>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  accept={ACCEPT}
                  onChange={onPick}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  className="w-fit"
                  onClick={() => fileInput.current?.click()}
                  disabled={files.length >= MAX_FILES}
                >
                  <ImageUp className="h-4 w-4" /> Add screenshot
                </Button>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md border border-border/50 bg-background/50 px-2 py-1 text-xs"
                      >
                        <span className="truncate max-w-[180px]">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Remove"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="hero" onClick={submit} disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send message
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Support;
