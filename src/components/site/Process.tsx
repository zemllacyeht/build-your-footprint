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
    <section id="process" className="py-12 md:py-[72px] relative overflow-hidden bg-gradient-to-b from-background via-card/20 to-background">
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

      </div>
    </section>
  );
};
