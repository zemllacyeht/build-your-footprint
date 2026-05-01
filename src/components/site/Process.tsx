const steps = [
  { n: "01", title: "Discover", desc: "We learn your brand, your customers, and the impression you want to leave." },
  { n: "02", title: "Design", desc: "You receive custom mockups in your private client portal — review and approve in real time." },
  { n: "03", title: "Build", desc: "We engineer your site for speed, SEO, and conversions on modern infrastructure." },
  { n: "04", title: "Launch & Grow", desc: "We handle hosting, domains, and ongoing care — you focus on your customers." },
];

export const Process = () => {
  return (
    <section id="process" className="py-32 relative">
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

        <div className="relative">
          {/* connector line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="h-24 w-24 rounded-2xl glass grid place-items-center mb-6 relative">
                  <span className="font-display text-3xl text-gradient-gold font-medium">{s.n}</span>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-6 top-1/2 h-2 w-2 rounded-full bg-accent shadow-gold" />
                  )}
                </div>
                <h3 className="font-display text-2xl font-medium mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
