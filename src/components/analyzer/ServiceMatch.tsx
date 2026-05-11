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
  learnMoreHref: string;
}

const PRIMARY_HREF = "https://byf-vercel-depo.vercel.app/";

const services: Service[] = [
  {
    key: "seo",
    icon: "🔍",
    title: "SEO Foundation",
    body: "We fix every signal Google uses to decide where you rank. Most of our clients see real ranking improvement within 30 days of their new site going live.",
    includes: [
      "Title tags and meta descriptions",
      "Heading structure and content",
      "Schema markup and Google indexing",
    ],
    learnMoreHref: "/services",
  },
  {
    key: "performance",
    icon: "⚡",
    title: "Performance Optimization",
    body: "A slow website loses customers before they even read your first sentence. We make your site load fast on every device, especially the phones your customers are using right now.",
    includes: [
      "Image compression and optimization",
      "Code cleanup and minification",
      "Hosting performance review",
    ],
    learnMoreHref: "/services",
  },
  {
    key: "aiVisibility",
    icon: "🤖",
    title: "AI & Search Visibility",
    body: "More and more customers find businesses by asking ChatGPT or Google's AI. We make sure your business shows up when they do, with the right information, in the right format.",
    includes: [
      "Schema markup for your business",
      "Social media preview setup",
      "AI crawler access configuration",
    ],
    learnMoreHref: "/services",
  },
  {
    key: "security",
    icon: "🔒",
    title: "Security & Trust Setup",
    body: "We add all the invisible protections that make your website safe for customers and trusted by browsers. Most visitors never see these, but they absolutely notice the 'Not Secure' warning if they're missing.",
    includes: [
      "SSL and HTTPS configuration",
      "Security header setup",
      "Ongoing security monitoring",
    ],
    learnMoreHref: "/services",
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

        <div className="md:col-span-2 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card/40 to-accent/10 p-7 flex flex-col">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">✦</div>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-medium mb-2">Full Digital Presence</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Get everything fixed at once: a brand new website that's fast, secure, and built to rank on Google and show up in AI searches. Everything your business needs to win customers online, done right.
              </p>
              <p
                className="text-xs mb-3"
                style={{ color: "#c9a84c" }}
              >
                This issue was found on your site →
              </p>
              <CardActions learnMoreHref="/services" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CardActions = ({ learnMoreHref }: { learnMoreHref: string }) => (
  <div className="flex flex-wrap items-center gap-3">
    <a
      href={PRIMARY_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:shadow-glow transition"
    >
      Start Your Project <ArrowRight className="h-4 w-4" />
    </a>
    <a
      href={learnMoreHref}
      className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-border bg-transparent text-foreground text-sm font-medium hover:border-primary/40 transition"
    >
      Learn More <ArrowRight className="h-4 w-4" />
    </a>
  </div>
);

const ServiceCard = ({ icon, title, body, includes, learnMoreHref }: Service) => (
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
      <p className="text-xs mb-3" style={{ color: "#c9a84c" }}>
        This issue was found on your site →
      </p>
      <CardActions learnMoreHref={learnMoreHref} />
    </div>
  </div>
);
