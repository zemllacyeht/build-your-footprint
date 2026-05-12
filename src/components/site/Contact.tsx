import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MapPin, Phone, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().min(1, "Email is required").email("Invalid email").max(255),
  business: z.string().trim().max(150).optional(),
  message: z
    .string()
    .trim()
    .min(50, "Please share at least 50 characters about your project")
    .max(2000),
});

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [messageChars, setMessageChars] = useState(0);
  const { items, removeItem, clear } = useCart();
  const selections = items.filter(
    (i) =>
      i.category === "Build package" ||
      i.category === "Care plan" ||
      i.category === "Add-on",
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      business: fd.get("business"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast.error(first ?? "Please check the form");
      return;
    }
    setLoading(true);
    try {
      const id = crypto.randomUUID();
      const selectionsList = selections.map((s) => ({
        name: s.name,
        category: s.category,
        price: s.price,
      }));
      const selectionsSummary = selections.length
        ? selections.map((s) => `${s.name} (${s.category})`).join(", ")
        : "";
      const messageWithSelections = selectionsSummary
        ? `${parsed.data.message}\n\n— Selections: ${selectionsSummary}`
        : parsed.data.message;

      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-message-customer",
          recipientEmail: parsed.data.email,
          idempotencyKey: `contact-message-${id}`,
          templateData: {
            customerName: parsed.data.name,
            business: parsed.data.business,
            message: messageWithSelections,
            selections: selectionsList,
          },
        },
      });
      if (error) throw error;
      toast.success("Message received. We'll be in touch within 24 hours.");
      form.reset();
      setMessageChars(0);
      clear();
    } catch (err) {
      console.error(err);
      toast.error("Could not send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 relative scroll-mt-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Get in touch</div>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
              Let's build something <span className="italic text-gradient-gold">together</span>.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              Share a few details about your project and we'll be in touch shortly to set up your free strategy call.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg glass grid place-items-center shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</div>
                  <div className="text-foreground">hello@buildyourfootprint.com</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg glass grid place-items-center shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Phone</div>
                  <div className="text-foreground">By appointment</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg glass grid place-items-center shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Serving</div>
                  <div className="text-foreground">Clients worldwide, remotely</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="glass rounded-2xl p-8 space-y-5">
            {selections.length > 0 && (
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-3">
                <div className="text-xs uppercase tracking-[0.22em] text-accent font-mono">
                  Your selections
                </div>
                <div className="flex flex-wrap gap-2">
                  {selections.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-background/40 px-3 py-1 text-xs"
                    >
                      <span className="text-foreground/90">{s.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${s.name}`}
                        onClick={() => removeItem(s.id)}
                        className="text-muted-foreground hover:text-destructive transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" name="name" maxLength={100} required className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business">Business name</Label>
                <Input id="business" name="business" maxLength={150} className="bg-background/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" maxLength={255} required className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Tell us about your project vision</Label>
                <span
                  className={`text-xs ${
                    messageChars >= 50 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {messageChars}/50 characters
                </span>
              </div>
              <Textarea
                id="message"
                name="message"
                rows={5}
                maxLength={2000}
                required
                defaultValue={
                  selections.length
                    ? `Interested in ${selections.map((s) => s.name).join(" + ")}. `
                    : ""
                }
                onChange={(e) => setMessageChars(e.target.value.trim().length)}
                className="bg-background/50 resize-none"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send message"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy. No spam, ever.
            </p>
            <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
              Already a client?{" "}
              <a href="/login" className="text-accent hover:text-accent/80 underline underline-offset-2 transition-colors">
                Log in to your project portal
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
