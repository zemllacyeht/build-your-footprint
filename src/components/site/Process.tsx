import { Fragment } from "react";
import { Eye, Compass, PenTool, Code2, Rocket, ArrowRight } from "lucide-react";

const steps = [
  { n: "01", title: "Discover", icon: Compass, desc: "We learn your brand, customers, and the impression you want to leave." },
  { n: "02", title: "Design", icon: PenTool, desc: "Custom layouts designed around your business goals. You review and approve in your private portal." },
  { n: "03", title: "Build", icon: Code2, desc: "Hand-coded for speed, SEO, and conversion. We use modern infrastructure that won't break six months in." },
  { n: "04", title: "Review", icon: Eye, desc: "You see what we're building in real time. Leave feedback, request changes, approve when ready. No endless email threads." },
  { n: "05", title: "Launch & Grow", icon: Rocket, desc: "We handle hosting, domains, and ongoing care so you focus on customers." },
];

export const Process = () => {
  return (
    <section id="process" className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-card/20 to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container">
        <div className="max-w-2xl mb-20">
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">How we work</div>
          <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
            A clear path from <span className="italic text-gradient-gold">idea to live</span>.
          </h2>
        </div>

        {/* Horizontal stepped flow */}
        <div className="relative mb-28">
          {/* Connecting track (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          <div className="grid gap-10 lg:gap-2 lg:grid-cols-9 lg:items-start">
            {steps.map((s, i) => (
              <Fragment key={s.n}>
                {/* Step node */}
                <div className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:col-span-1 group">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-20 w-20 rounded-full bg-background border-2 border-accent/40 grid place-items-center shadow-elegant transition-transform group-hover:scale-105">
                      <s.icon className="h-7 w-7 text-accent" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-accent grid place-items-center shadow-gold">
                      <span className="font-display text-[11px] font-semibold text-accent-foreground">{s.n}</span>
                    </div>
                  </div>

                  <div className="lg:mt-6 lg:text-center flex-1">
                    <h3 className="font-display text-lg font-medium mb-1.5">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed lg:px-1">{s.desc}</p>
                  </div>
                </div>

                {/* Connector arrow (desktop only, between steps) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex lg:col-span-1 items-center justify-center pt-7">
                    <ArrowRight className="h-4 w-4 text-accent/60" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Featured: Secure Preview & Launch Hub mockup */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <Lock className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Step 04 · Secure Preview & Launch Hub
              </span>
            </div>
            <h3 className="font-display text-3xl md:text-5xl font-light leading-tight mb-6">
              A private hub built for <span className="italic text-gradient-gold">your project</span>.
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Every client gets a password-protected dashboard. Preview your live site,
              comment on revisions, view invoices, and manage your monthly hosting all in one secure place.
            </p>

            <ul className="space-y-4">
              {[
                { icon: Eye, t: "Live website previews", d: "See your in-progress site exactly as your customers will." },
                { icon: MessageSquare, t: "Review & approve in real time", d: "Leave feedback inline. We iterate without endless email threads." },
                { icon: CreditCard, t: "One-click invoices & hosting", d: "Pay project invoices and manage monthly recurring billing securely." },
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
              {/* Browser chrome */}
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

              {/* Portal content */}
              <div className="p-6 space-y-5 bg-gradient-to-br from-background via-background to-card/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Welcome back</div>
                    <div className="font-display text-xl font-medium mt-0.5">Acme Coffee Co.</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
                    <span className="text-[10px] font-medium text-accent uppercase tracking-wider">In Review</span>
                  </div>
                </div>

                {/* Preview frame */}
                <div className="rounded-lg overflow-hidden border border-border bg-muted/30 aspect-video relative grid place-items-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                  <div className="relative text-center">
                    <Eye className="h-6 w-6 text-accent mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground font-mono">acmecoffee.com / preview</div>
                  </div>
                </div>

                {/* Activity row */}
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

            {/* Floating badge */}
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
