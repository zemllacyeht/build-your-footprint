import { useState } from "react";
import { Palette, Camera, Mail, Code2, Smartphone, Globe, Search, Megaphone, Shield, Plus } from "lucide-react";

type Service = {
  icon: typeof Palette;
  title: string;
  desc: string;
  details: string;
  examples: string[];
};

type Column = {
  header: string;
  number: string;
  tagline: string;
  services: Service[];
};

const columns: Column[] = [
  {
    header: "Brand",
    number: "01",
    tagline: "Identity, voice, and presence.",
    services: [
      {
        icon: Palette,
        title: "Brand Identity",
        desc: "Logos, color, and visual systems that make you unmistakable.",
        details:
          "We design a complete identity system, from primary mark and color palette to typography and usage rules, so every touchpoint feels intentional.",
        examples: ["Logo and wordmark suite", "Color and type system", "Brand guidelines PDF"],
      },
      {
        icon: Camera,
        title: "Content & Photography",
        desc: "Original photo, video, and copy written for your business.",
        details:
          "We produce on-brand imagery and words that match your voice, from product and lifestyle shots to short-form video and website copy.",
        examples: ["Product and lifestyle photography", "Short-form video", "Website and email copywriting"],
      },
      {
        icon: Mail,
        title: "Email & Automation",
        desc: "Branded campaigns and automations that turn one-time visitors into repeat customers.",
        details:
          "We design and wire up the lifecycle flows that keep customers coming back, from welcome series to abandoned cart and re-engagement.",
        examples: ["Welcome and onboarding flows", "Abandoned cart recovery", "Monthly newsletters"],
      },
    ],
  },
  {
    header: "Build",
    number: "02",
    tagline: "Sites that load, work, and last.",
    services: [
      {
        icon: Code2,
        title: "Custom Web Design",
        desc: "Hand-crafted, conversion-focused websites built around your goals.",
        details:
          "Every page is designed and built around what you want visitors to do, with clear hierarchy, fast load times, and accessible interactions.",
        examples: ["Marketing sites", "Landing pages", "Booking and lead-gen flows"],
      },
      {
        icon: Smartphone,
        title: "Responsive Builds",
        desc: "Looks right on every screen, from phones to widescreen monitors.",
        details:
          "We design mobile-first and test across real devices, so layout, typography, and interactions feel native at every breakpoint.",
        examples: ["Mobile-first layouts", "Tablet and desktop tuning", "Cross-browser QA"],
      },
      {
        icon: Globe,
        title: "Domain & Hosting",
        desc: "Domains, SSL, hosting, and uptime monitoring, fully managed.",
        details:
          "We handle the infrastructure end of things, so you do not have to think about renewals, certificates, or who to call when something breaks.",
        examples: ["Domain registration and DNS", "SSL and security headers", "Uptime monitoring"],
      },
    ],
  },
  {
    header: "Grow",
    number: "03",
    tagline: "Reach the right customers.",
    services: [
      {
        icon: Search,
        title: "SEO Foundations",
        desc: "Search optimization built in, so the customers looking for you can find you.",
        details:
          "We set up the on-page and technical foundations that help search engines understand your site, and the content structure that helps you rank.",
        examples: ["Keyword and content mapping", "Technical SEO audit", "Local search setup"],
      },
      {
        icon: Megaphone,
        title: "Marketing Collateral",
        desc: "Social graphics, email banners, ads, and print pieces, always on-brand.",
        details:
          "We design the supporting assets your campaigns need, sized and styled correctly for every channel you run.",
        examples: ["Social and ad creative", "Email banners and headers", "Print and trade-show pieces"],
      },
      {
        icon: Shield,
        title: "Ongoing Care",
        desc: "Updates, security patches, and content edits, handled every month.",
        details:
          "A monthly retainer that keeps your site secure, current, and improving, with a real person on the other end of every request.",
        examples: ["Security and dependency updates", "Content and copy edits", "Monthly performance review"],
      },
    ],
  },
];

export const Services = () => {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section id="services" className="py-12 md:py-16 relative overflow-hidden bg-background">
      {/* Smooth transition from hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background z-10"
      />
      {/* Accent divider line */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[860px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, hsl(var(--accent) / 0.35), transparent)" }}
      />

      <div className="container relative">
        <div className="max-w-2xl mb-24">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-4">What we do</div>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
            A full studio, <span className="italic text-gradient-gold">under one roof</span>.
          </h2>
          <div className="h-px w-16 bg-gradient-gold mb-6" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            Brand. Build. Grow. Three disciplines, nine connected services. Everything your business needs to come online, stay online, and bring in customers.
          </p>
          <p className="mt-4 text-sm text-muted-foreground/70">
            Tap any service to see what is included.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {columns.map((col) => (
            <div
              key={col.header}
              className="group/col relative rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm p-6 md:p-8 transition-all duration-500 hover:border-accent/40 hover:bg-card/50 hover:shadow-[0_30px_80px_-30px_hsl(var(--accent)/0.35)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/col:opacity-100"
                style={{
                  background:
                    "radial-gradient(600px circle at 50% 0%, hsl(var(--accent) / 0.08), transparent 60%)",
                }}
              />

              <div className="relative flex items-baseline justify-between mb-8 pb-5 border-b border-border/70 transition-colors duration-500 group-hover/col:border-accent/40">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                    {col.number} / {col.tagline}
                  </div>
                  <div className="font-display text-3xl md:text-4xl font-light italic text-gradient-gold transition-all duration-500 group-hover/col:[text-shadow:0_0_28px_hsl(var(--accent)/0.55)]">
                    {col.header}
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col">
                {col.services.map((s, i) => {
                  const key = `${col.header}-${s.title}`;
                  const isOpen = openKey === key;
                  return (
                    <div
                      key={s.title}
                      className={
                        i !== col.services.length - 1 ? "border-b border-border/50" : ""
                      }
                    >
                      <button
                        type="button"
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className="group/item w-full text-left py-6 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/40 transition-all duration-300 group-hover/item:border-accent/50 group-hover/item:bg-accent/10">
                            <span
                              aria-hidden
                              className="absolute inset-0 -m-1 rounded-lg bg-accent/20 blur-md opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
                            />
                            <s.icon
                              className="relative h-4 w-4 text-primary transition-all duration-300 group-hover/item:text-accent group-hover/item:scale-110"
                              strokeWidth={1.5}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-display text-xl md:text-2xl font-light leading-snug transition-colors duration-300 group-hover/item:text-accent">
                                {s.title}
                              </h3>
                              <Plus
                                className={`h-4 w-4 mt-2 shrink-0 text-muted-foreground transition-all duration-500 group-hover/item:text-accent ${
                                  isOpen ? "rotate-45 text-accent" : ""
                                }`}
                                strokeWidth={1.5}
                              />
                            </div>
                            <p className="mt-2 text-muted-foreground leading-relaxed text-[15px] transition-colors duration-300 group-hover/item:text-foreground/80">
                              {s.desc}
                            </p>
                          </div>
                        </div>
                      </button>

                      <div
                        className={`grid transition-all duration-500 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="ml-[3.25rem] border-l border-accent/30 pl-5 space-y-4">
                            <p className="text-sm leading-relaxed text-foreground/80">
                              {s.details}
                            </p>
                            <div>
                              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-2">
                                Includes
                              </div>
                              <ul className="space-y-1.5">
                                {s.examples.map((ex) => (
                                  <li
                                    key={ex}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                                    <span>{ex}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
