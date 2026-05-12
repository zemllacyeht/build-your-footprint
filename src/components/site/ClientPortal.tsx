import { Lock, Eye, MessageSquare, CreditCard, CheckCircle2 } from "lucide-react";

export const ClientPortal = () => {
  return (
    <section id="client-portal" className="py-12 md:py-[72px] relative overflow-hidden bg-gradient-to-b from-background via-card/20 to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <Lock className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Your Private Portal
              </span>
            </div>
            <h3 className="font-display text-3xl md:text-5xl font-light leading-tight mb-6">
              Every client gets a <span className="italic text-gradient-gold">personalized portal</span>.
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Your project lives here. Your invoices live here. Your monthly hosting lives here. Yours for as long as we work together.
            </p>

            <ul className="space-y-4">
              {[
                { icon: Eye, t: "Live website previews", d: "See your in-progress site exactly as your customers will." },
                { icon: MessageSquare, t: "Real-time feedback", d: "Comment inline. We iterate without endless email threads." },
                { icon: CreditCard, t: "Invoices & hosting in one place", d: "Pay project invoices and manage monthly billing securely." },
                { icon: Lock, t: "Account-only access", d: "We provision your login. No public sign-ups, no leaks." },
              ].map((f) => (
                <li key={f.t} className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg glass grid place-items-center shrink-0">
                    <f.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">{f.t}</div>
                    <div className="text-sm text-muted-foreground">{f.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Browser mockup */}
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl -z-10" />

            <div className="rounded-2xl overflow-hidden border border-border shadow-elegant bg-background">
              <div className="flex items-center gap-2 px-4 py-3 bg-card/80 backdrop-blur border-b border-border">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                </div>
                <div className="flex-1 mx-4 h-6 rounded-md bg-background/60 border border-border/50 flex items-center justify-center gap-2 px-3">
                  <Lock className="h-3 w-3 text-accent" />
                  <span className="text-[11px] text-muted-foreground font-mono truncate">
                    portal.buildyourfootprint.com/dashboard
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5 bg-gradient-to-br from-background via-background to-card/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Welcome back</div>
                    <div className="font-display text-xl font-medium mt-0.5">Marrow Coffee Roasters</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
                    <span className="text-[10px] font-medium text-accent uppercase tracking-wider">In Review</span>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border border-border bg-muted/30 aspect-video relative grid place-items-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                  <div className="relative text-center">
                    <Eye className="h-6 w-6 text-accent mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground font-mono">acmecoffee.com / preview</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border p-3 bg-card/40">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Approved</span>
                    </div>
                    <div className="text-sm font-medium">Homepage v3</div>
                  </div>
                  <div className="rounded-lg border border-border p-3 bg-card/40">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MessageSquare className="h-3 w-3 text-primary" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">2 comments</span>
                    </div>
                    <div className="text-sm font-medium">About page</div>
                  </div>
                  <div className="rounded-lg border border-border p-3 bg-card/40">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CreditCard className="h-3 w-3 text-accent" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Paid</span>
                    </div>
                    <div className="text-sm font-medium">Hosting · Nov</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3 shadow-elegant flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Secured by</div>
                <div className="text-xs font-medium">Encrypted client login</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
