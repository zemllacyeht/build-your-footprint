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
            <div key={col.header} className="relative pl-6 md:pl-8 border-l border-border/80">
              <div className="font-display text-3xl font-light italic text-gradient-gold mb-10 pb-5 border-b border-border">
                {col.header}
              </div>
              <div className="flex flex-col">
                {col.services.map((s, i) => (
                  <div
                    key={s.title}
                    className={`py-8 ${i !== col.services.length - 1 ? "border-b border-border/70" : ""}`}
                  >
                    <s.icon className="h-5 w-5 text-primary mb-5" strokeWidth={1.25} />
                    <h3 className="font-display text-2xl font-light mb-3 leading-snug">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">{s.desc}</p>
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
