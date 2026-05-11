import { ArrowRight } from "lucide-react";

interface Props {
  scores: { seo: number; performance: number | null; aiVisibility: number; security: number };
}

interface Service {
  key: "seo" | "performance" | "aiVisibility" | "security";
  icon: string;
  title: string;
  body: string;
  includes: string[];
  tag: string;
}

const services: Service[] = [
  {
    key: "seo",
    icon: "🔍",
    title: "SEO Foundation",
    body: "We rebuild your entire SEO structure so Google can find, understand, and rank your site. Most clients see a 30-50 point improvement within 30 days of launch.",
    includes: [
      "Title, meta, and heading rewrite",
      "Schema markup and Google indexing",
      "Image alt text and canonical setup",
    ],
    tag: "Included in all packages",
  },
  {
    key: "performance",
    icon: "⚡",
    title: "Performance Optimization",
    body: "Slow sites lose customers before they read a single word. We optimize so your site loads in under 2 seconds on mobile, where 70% of your traffic comes from.",
    includes: [
      "Image and asset compression",
      "Code splitting and lazy loading",
      "Caching and CDN configuration",
    ],
    tag: "Included in all packages",
  },
  {
    key: "aiVisibility",
    icon: "🤖",
    title: "AI & Search Visibility",
    body: "ChatGPT, Perplexity, and Google's AI Overviews are the new search. We structure your site so AI tools recommend your business when people ask.",
    includes: [
      "Open Graph and structured data",
      "AI crawler access configuration",
      "FAQ and conversational content",
    ],
    tag: "Professional & Premium packages",
  },
  {
    key: "security",
    icon: "🔒",
    title: "Security & Trust Setup",
    body: "Missing security headers signal to browsers and customers that your site isn't trustworthy. We configure everything so your site passes audits and converts more visitors.",
    includes: [
      "HTTPS, HSTS, and security headers",
      "Content Security Policy hardening",
      "Permissions and referrer policy",
    ],
    tag: "Included in all packages",
  },
];

export const ServiceMatch = ({ scores }: Props) => {
  const matched = services.filter((s) => {
    const v = scores[s.key];
    return v !== null && v < 18;
  });

  if (matched.length === 0) return null;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matched.map((s) => (
          <ServiceCard key={s.key} {...s} />
        ))}

        <div className="md:col-span-2 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card/40 to-accent/10 p-7">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">✦</div>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-medium mb-2">Full Digital Presence</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Get everything fixed at once: website redesign, SEO, performance, security,
                branding, AI visibility, and ongoing support. The fastest path from a broken
                presence to one that wins customers every day.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:shadow-glow transition"
                >
                  See Pricing <ArrowRight className="h-4 w-4" />
                </a>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/30 text-xs font-medium">
                  Starting at $800
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title, body, includes, tag }: Service) => (
  <div className="rounded-2xl border border-border bg-card/40 p-6 hover:border-primary/30 transition flex flex-col">
    <div className="text-2xl mb-3">{icon}</div>
    <h3 className="font-display text-xl font-medium mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{body}</p>
    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2">
      What's included
    </div>
    <ul className="space-y-1.5 mb-5">
      {includes.map((it) => (
        <li key={it} className="flex items-start gap-2 text-sm text-foreground/85">
          <span className="text-primary mt-0.5">✓</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
    <div className="mt-auto">
      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/30 text-xs font-medium">
        {tag}
      </span>
    </div>
  </div>
);
