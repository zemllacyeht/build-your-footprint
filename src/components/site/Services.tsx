import { Palette, Code2, Globe, LineChart, Shield, Smartphone, Megaphone, Camera, Mail } from "lucide-react";

const services = [
  { icon: Palette, title: "Brand Identity", desc: "Logo systems, color palettes, and visual languages that make you unmistakable." },
  { icon: Code2, title: "Custom Web Design", desc: "Hand-crafted, conversion-focused websites built around your business goals." },
  { icon: Globe, title: "Domain & Hosting", desc: "We handle the technical side: domains, SSL, hosting, and uptime monitoring." },
  { icon: Smartphone, title: "Responsive Builds", desc: "Pixel-perfect on every device, from 4-inch phones to 4K displays." },
  { icon: LineChart, title: "SEO Foundations", desc: "Built-in search optimization so your customers can actually find you." },
  { icon: Megaphone, title: "Marketing Collateral", desc: "Social graphics, email banners, ads, and print pieces, always on-brand." },
  { icon: Camera, title: "Content & Photography", desc: "Original photography, video, and copy that bring your brand story to life." },
  { icon: Mail, title: "Email & Automation", desc: "Branded email templates and automations that nurture leads while you sleep." },
  { icon: Shield, title: "Ongoing Care", desc: "Updates, security patches, content edits, all handled every month." },
];

export const Services = () => {
  return (
    <section id="services" className="py-32 relative">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">What we do</div>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
            A full studio, <span className="italic text-gradient-gold">under one roof</span>.
          </h2>
          <div className="h-px w-16 bg-gradient-gold mb-6" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            Nine connected services covering brand, build, and growth — so nothing about your online presence is left to chance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="glass glass-hover rounded-2xl p-8 group relative overflow-hidden"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative">
                <div className="h-12 w-12 rounded-lg glass grid place-items-center mb-6 group-hover:bg-gradient-primary group-hover:border-transparent transition-all duration-500">
                  <s.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-2xl font-medium mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
