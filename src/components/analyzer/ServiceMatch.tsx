import { ArrowRight } from "lucide-react";

interface Props {
  scores: { seo: number; performance: number | null; aiVisibility: number; security: number };
}

const services = [
  {
    key: "seo",
    threshold: 15,
    icon: "🔍",
    title: "SEO Foundation",
    body: "We rebuild your entire SEO structure, title tags, meta descriptions, heading hierarchy, schema markup, and Google indexing. Most clients see a 30-50 point improvement within 30 days of launch.",
    tag: "Included in all packages",
  },
  {
    key: "performance",
    threshold: 15,
    icon: "⚡",
    title: "Performance Optimization",
    body: "Slow sites lose customers before they read a single word. We optimize images, code, and infrastructure so your site loads in under 2 seconds on mobile, where 70% of your traffic comes from.",
    tag: "Included in all packages",
  },
  {
    key: "aiVisibility",
    threshold: 15,
    icon: "🤖",
    title: "AI & Search Visibility",
    body: "ChatGPT, Perplexity, and Google's AI Overviews are the new search. We structure your content and schema so your business gets recommended when people ask AI for services in your industry.",
    tag: "Professional & Premium packages",
  },
  {
    key: "security",
    threshold: 15,
    icon: "🔒",
    title: "Security & Trust Setup",
    body: "Missing security headers signal to browsers and customers that your site isn't trustworthy. We configure everything so your site passes security audits and converts more visitors.",
    tag: "Included in all packages",
  },
];

export const ServiceMatch = ({ scores }: Props) => {
  const matched = services.filter((s) => {
    const v = scores[s.key as keyof typeof scores];
    return v !== null && v < s.threshold;
  });

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-5xl font-light mb-3">
          Here's how <span className="italic text-gradient-gold">we fix this</span>.
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Every issue we found is something Build Your Footprint specializes in.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {matched.map((s) => (
          <ServiceCard key={s.key} {...s} />
        ))}

        <div className="md:col-span-2 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card/40 to-accent/10 p-7">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">✦</div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">
                Starting at $800
              </div>
              <h3 className="font-display text-2xl font-medium mb-2">Full Digital Presence</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Get everything fixed at once, website redesign, SEO, performance, security,
                branding, AI visibility, and ongoing support. The fastest path from a broken
                presence to one that wins customers every day.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:shadow-glow transition"
              >
                See Pricing <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title, body, tag }: any) => (
  <div className="rounded-2xl border border-border bg-card/40 p-6 hover:border-primary/30 transition">
    <div className="text-2xl mb-3">{icon}</div>
    <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">{tag}</div>
    <h3 className="font-display text-xl font-medium mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
);
