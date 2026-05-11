import { Palette, Camera, Mail, Code2, Smartphone, Globe, Search, Megaphone, Shield } from "lucide-react";

const columns = [
  {
    header: "Brand",
    services: [
      { icon: Palette, title: "Brand Identity", desc: "Logos, color, and visual systems that make you unmistakable." },
      { icon: Camera, title: "Content & Photography", desc: "Original photo, video, and copy written for your business." },
      { icon: Mail, title: "Email & Automation", desc: "Branded campaigns and automations that turn one-time visitors into repeat customers." },
    ],
  },
  {
    header: "Build",
    services: [
      { icon: Code2, title: "Custom Web Design", desc: "Hand-crafted, conversion-focused websites built around your goals." },
      { icon: Smartphone, title: "Responsive Builds", desc: "Looks right on every screen, from phones to widescreen monitors." },
      { icon: Globe, title: "Domain & Hosting", desc: "Domains, SSL, hosting, and uptime monitoring, fully managed." },
    ],
  },
  {
    header: "Grow",
    services: [
      { icon: Search, title: "SEO Foundations", desc: "Search optimization built in, so the customers looking for you can find you." },
      { icon: Megaphone, title: "Marketing Collateral", desc: "Social graphics, email banners, ads, and print pieces, always on-brand." },
      { icon: Shield, title: "Ongoing Care", desc: "Updates, security patches, and content edits, handled every month." },
    ],
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-32 relative">
      <div className="container">
        <div className="max-w-2xl mb-20">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-4">What we do</div>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
            A full studio, <span className="italic text-gradient-gold">under one roof</span>.
          </h2>
          <div className="h-px w-16 bg-gradient-gold mb-6" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            Brand. Build. Grow. Three disciplines, nine connected services. Everything your business needs to come online, stay online, and bring in customers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-10">
          {columns.map((col) => (
            <div
              key={col.header}
              className="group/col relative pl-6 md:pl-8 border-l border-border/80 transition-colors duration-500 hover:border-accent/60"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-[-1px] top-0 h-0 w-px bg-gradient-to-b from-accent via-accent/60 to-transparent transition-all duration-700 ease-out group-hover/col:h-full"
              />
              <div className="font-display text-3xl font-light italic text-gradient-gold mb-10 pb-5 border-b border-border transition-all duration-500 group-hover/col:[text-shadow:0_0_28px_hsl(var(--accent)/0.55)] group-hover/col:border-accent/50">
                {col.header}
              </div>
              <div className="flex flex-col">
                {col.services.map((s, i) => (
                  <div
                    key={s.title}
                    className={`group/item relative py-8 px-3 -mx-3 rounded-md cursor-default transition-all duration-300 hover:bg-accent/[0.04] hover:translate-x-1 ${
                      i !== col.services.length - 1 ? "border-b border-border/70" : ""
                    }`}
                  >
                    <div className="relative mb-5 inline-flex items-center justify-center">
                      <span
                        aria-hidden
                        className="absolute inset-0 -m-2 rounded-full bg-accent/20 blur-md opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
                      />
                      <s.icon
                        className="relative h-5 w-5 text-primary transition-all duration-300 group-hover/item:text-accent group-hover/item:scale-110 group-hover/item:rotate-[-4deg]"
                        strokeWidth={1.25}
                      />
                    </div>
                    <h3 className="font-display text-2xl font-light mb-3 leading-snug transition-colors duration-300 group-hover/item:text-accent">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px] transition-colors duration-300 group-hover/item:text-foreground/80">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
