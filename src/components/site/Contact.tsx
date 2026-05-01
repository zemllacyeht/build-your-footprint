import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  business: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

export const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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
    setTimeout(() => {
      setLoading(false);
      toast.success("Message received — we'll be in touch within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Let's talk</div>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-tight mb-6">
              Ready to make your <span className="italic text-gradient-gold">mark</span>?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              Tell us about your business. We'll reply within one business day with a free strategy call invitation.
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
              <Label htmlFor="message">Tell us about your project</Label>
              <Textarea id="message" name="message" rows={5} maxLength={2000} required className="bg-background/50 resize-none" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send message"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy. No spam, ever.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
