import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface Issue {
  id: string;
  name: string;
  category: string;
  priority: "critical" | "important" | "minor";
  whyItMatters?: string;
  found: string;
  howToFix?: string;
}

const priorityClass: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  important: "bg-accent/15 text-accent border-accent/30",
  minor: "bg-muted text-muted-foreground border-border",
};

const categoryLabel: Record<string, string> = {
  seo: "SEO",
  performance: "Performance",
  aiVisibility: "AI Visibility",
  security: "Security",
};

const categoryClass: Record<string, string> = {
  seo: "bg-primary/10 text-primary border-primary/30",
  performance: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  aiVisibility: "bg-accent/10 text-accent border-accent/30",
  security: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

const winsById: Record<string, string> = {
  "sec-https": "Your site uses secure connections",
  "seo-h1": "Your page has a clear main heading",
  "seo-title-exists": "Search engines can identify your page",
  "seo-title-length": "Your title fits perfectly in search results",
  "seo-meta-desc": "Search engines have a description to show",
  "seo-meta-desc-len": "Your description displays in full on Google",
  "seo-img-alt": "Your images are accessible and crawlable",
  "seo-canonical": "Duplicate content issues are prevented",
  "seo-robots": "Search bots can crawl your site",
  "ai-og-title": "Your page previews well when shared",
  "ai-og-desc": "AI tools can summarize your page accurately",
  "ai-og-image": "Your social shares show a preview image",
  "ai-schema": "AI tools understand your business type",
  "ai-faq": "Your content matches how people ask AI",
  "ai-location": "Local AI searches can find you",
  "ai-bots-allowed": "ChatGPT and Perplexity can read your site",
  "sec-hsts": "HTTPS is enforced for every visitor",
  "sec-xframe": "Your site is protected from clickjacking",
  "sec-xcto": "MIME-sniffing attacks are blocked",
  "sec-referrer": "Referrer data is properly controlled",
  "sec-csp": "Script injection is defended",
  "sec-permissions": "Unused browser features are locked down",
  "perf-psi": "Your site scores well on Google PageSpeed",
  "perf-fcp": "Visitors see content quickly",
  "perf-lcp": "Your main content loads fast",
  "perf-tbt": "Your page stays responsive while loading",
};

const winFor = (p: any) => winsById[p.id] || p.found || "Looking good";

export const IssuesList = ({ issues, passed }: { issues: any[]; passed: any[] }) => {
  const [showAllPassed, setShowAllPassed] = useState(false);
  const visiblePassed = showAllPassed ? passed : passed.slice(0, 4);
  const remaining = passed.length - 4;

  const sorted = [...issues].sort((a, b) => {
    const order = { critical: 0, important: 1, minor: 2 };
    return order[a.priority as keyof typeof order] - order[b.priority as keyof typeof order];
  });

  return (
    <div className="space-y-3">
      {sorted.map((iss: Issue) => (
        <div
          key={iss.id}
          className="rounded-xl border border-border bg-card/40 p-5 hover:border-border/80 transition"
        >
          <div className="flex items-start gap-4">
            <span
              className={`shrink-0 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${priorityClass[iss.priority]}`}
            >
              {iss.priority}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h4 className="font-display text-base font-medium">{iss.name}</h4>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryClass[iss.category]}`}
                >
                  {categoryLabel[iss.category]}
                </span>
              </div>
              {iss.whyItMatters && (
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="text-foreground/80 font-medium">Why this matters: </span>
                  {iss.whyItMatters}
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-2">
                <span className="text-foreground/80 font-medium">What we found: </span>
                {iss.found}
              </p>
              {iss.howToFix && (
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground/80 font-medium">How to fix it: </span>
                  {iss.howToFix}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {passed.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-medium mb-4">
            <Check className="h-4 w-4 text-primary" />
            What's already working
          </div>
          <ul className="space-y-3">
            {visiblePassed.map((p: any) => (
              <li key={p.id} className="flex items-start gap-3 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-foreground/90 font-medium">{p.name}</span>
                  <span className="text-muted-foreground"> — {winFor(p)}</span>
                </div>
              </li>
            ))}
          </ul>
          {remaining > 0 && (
            <button
              onClick={() => setShowAllPassed(!showAllPassed)}
              className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition"
            >
              {showAllPassed ? "Show less" : `Show all ${passed.length} passed checks`}
              <ChevronDown className={`h-3 w-3 transition ${showAllPassed ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
