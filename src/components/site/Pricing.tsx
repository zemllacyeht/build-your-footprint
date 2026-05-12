import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Mail,
  ShieldCheck,
  CreditCard,
  Server,
  LifeBuoy,
  RefreshCw,
  Hammer,
  Repeat,
  Lock,
  Plus,
  ArrowDown,
  Sparkles,
  X,
  Trash2,
  Search,
  Megaphone,
  Target,
  LayoutDashboard,
  TrendingUp,
  PenTool,
  FileText,
  Calendar,
  Database,
  Link as LinkIcon,
  MapPin,
  BarChart3,
  Send,
  FlaskConical,
  Zap,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";

const addons = [
  {
    id: "addon-local-service-boost",
    name: "Local Service Boost",
    price: "From $549/mo",
    priceLabel: "$549",
    priceUnit: "/mo",
    icon: TrendingUp,
    tagline: "Get found by local customers searching for what you do.",
    desc: "Ongoing SEO so local customers searching for what you do can actually find you.",
    features: [
      { icon: Search, t: "Keyword strategy", d: "Targeted to your niche" },
      { icon: PenTool, t: "On-page SEO", d: "Monthly updates" },
      { icon: MapPin, t: "Local search", d: "Google Business optimization" },
      { icon: BarChart3, t: "Monthly reporting", d: "Clear, jargon-free" },
    ],
    apply: false,
  },
  {
    id: "addon-social-presence",
    name: "Social Presence",
    price: "From $699/mo",
    priceLabel: "$699",
    priceUnit: "/mo",
    icon: Megaphone,
    tagline: "Stay visible where your customers spend their time.",
    desc: "Monthly content and email campaigns that keep your brand visible where your customers spend their time.",
    features: [
      { icon: FileText, t: "2 content pieces", d: "Blog or social, your choice" },
      { icon: Mail, t: "Email campaign", d: "One per month" },
      { icon: PenTool, t: "Brand-voice writing", d: "Sounds like you" },
      { icon: Calendar, t: "Published & scheduled", d: "Hands-off for you" },
    ],
    apply: false,
  },
  {
    id: "addon-conversion-focus",
    name: "Conversion Focus",
    price: "From $749 one-time",
    priceLabel: "$749",
    priceUnit: "one-time",
    icon: Target,
    tagline: "A landing page built to convert.",
    desc: "A high-converting landing page built for a specific campaign, product launch, or ad spend.",
    features: [
      { icon: Zap, t: "Conversion-focused design", d: "Built to drive action" },
      { icon: PenTool, t: "Campaign copy", d: "Written for your offer" },
      { icon: FlaskConical, t: "A/B testing setup", d: "Track what works" },
      { icon: Send, t: "3-5 day delivery", d: "Ready when you are" },
    ],
    apply: false,
  },
  {
    id: "addon-business-workspace",
    name: "Business Workspace",
    price: "By application",
    priceLabel: "By application",
    priceUnit: "",
    icon: LayoutDashboard,
    tagline: "Run your operations from one custom back-end.",
    desc: "A custom back-end system so you can manage bookings, customers, and operations without juggling seven different tools.",
    features: [
      { icon: LayoutDashboard, t: "Custom dashboard", d: "Built around your workflow" },
      { icon: Database, t: "Customer or booking database", d: "Everything in one place" },
      { icon: CreditCard, t: "Invoice & payment tracking", d: "Connected to Stripe" },
      { icon: LinkIcon, t: "Integrates with your site", d: "No data silos" },
    ],
    subLabel: "Limited spots each quarter",
    apply: true,
  },
];

const tiers = [
  {
    name: "Core",
    price: "$499",
    desc: "Perfect for getting online fast with a clean, professional presence",
    turnaround: "1 week",
    pairsWith: "Essential Care",
    features: [
      "1-3 page custom website",
      "Mobile-responsive design",
      "Contact form",
      "Domain setup & SSL",
      "Basic on-page SEO",
      "1 round of revisions",
    ],
    featured: false,
  },
  {
    name: "Launch",
    price: "$999",
    desc: "For businesses ready to grow with a polished, optimized website",
    turnaround: "2 weeks",
    pairsWith: "Essential Care",
    features: [
      "Up to 5 custom pages",
      "Mobile-responsive design",
      "Contact form",
      "Domain setup & SSL",
      "Google Business Profile setup & optimization",
      "Basic SEO setup",
      "2 rounds of revisions",
      "30 days of unlimited edits after launch",
    ],
    featured: false,
  },
  {
    name: "Signature",
    price: "$1,499",
    desc: "Full brand identity and a website built to convert visitors into customers",
    turnaround: "4 weeks",
    pairsWith: "Growth Care",
    features: [
      "Up to 12 custom pages",
      "Mobile-responsive design",
      "Basic brand identity (logo concept, color palette, fonts)",
      "Advanced SEO + Google Analytics setup",
      "Google Business Profile optimization",
      "3 rounds of revisions",
      "60 days of unlimited edits after launch",
      "Launch strategy session",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Custom solutions for growing businesses that need power and flexibility",
    turnaround: "6-8 weeks",
    pairsWith: "White-Glove Care",
    features: [
      "Unlimited pages",
      "Full brand identity package",
      "E-commerce or booking integrations",
      "Custom third party integrations",
      "Dedicated project manager",
      "Quarterly strategy calls",
      "Priority support",
      "Custom retainer plan",
    ],
    featured: false,
  },
];

const carePlans = [
  {
    name: "Essential Care",
    price: "$19",
    sub: "+ $10/mo domain",
    desc: "For Core & Starter sites. Keeps the lights on, secure, and online.",
    features: [
      "Premium hosting & uptime monitoring",
      "SSL renewal & security patches",
      "Weekly backups",
      "Email support (48h response)",
    ],
  },
  {
    name: "Growth Care",
    price: "$59",
    sub: "domain & SSL included",
    desc: "Our most popular retainer. Pairs with Signature builds.",
    features: [
      "Everything in Essential",
      "Daily backups & monitoring",
      "CMS & plugin updates",
      "30 min/mo content edits",
      "Priority support (24h response)",
    ],
    featured: true,
  },
  {
    name: "White-Glove Care",
    price: "Custom",
    sub: "tailored SLA",
    desc: "For Enterprise builds, e-commerce, and high-traffic sites.",
    features: [
      "Everything in Growth",
      "Dedicated account manager",
      "Custom SLA & uptime guarantee",
      "Quarterly strategy reviews",
      "Same-day priority support",
    ],
  },
];

const scrollToContact = () => {
  const el = document.getElementById("contact");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.location.href = "/contact#contact";
  }
};

export const Pricing = () => {
  const { addItem, items, removeItem, clear } = useCart();
  const buildIds = new Set(items.filter((i) => i.category === "Build package").map((i) => i.id));
  const careIds = new Set(items.filter((i) => i.category === "Care plan").map((i) => i.id));
  const addonIds = new Set(items.filter((i) => i.category === "Add-on").map((i) => i.id));
  const hasBuild = buildIds.size > 0;
  const hasCare = careIds.size > 0;
  const careRef = useRef<HTMLDivElement>(null);
  const addonRef = useRef<HTMLDivElement>(null);

  const startProject = (id: string, name: string, price: string, category: "Build package" | "Care plan" | "Add-on") => {
    addItem({ id, name, price, category });
    setTimeout(scrollToContact, 120);
  };

  return (
    <section id="pricing" className="py-32 relative">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Investment</div>
          <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
            Two parts, <span className="italic text-gradient-gold">clearly separated</span>.
          </h2>
          <p className="text-muted-foreground mt-6 leading-relaxed">
            A one-time build fee to launch your site, plus a simple monthly retainer for hosting,
            domain, and care. Two invoices, two relationships, zero surprises.
          </p>

          {/* Visual split indicator */}
          <div className="mt-10 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em]">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
              <Hammer className="h-3.5 w-3.5 text-primary" />
              <span className="text-foreground/80">One-time build</span>
            </div>
            <span className="text-muted-foreground">+</span>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
              <Repeat className="h-3.5 w-3.5 text-accent" />
              <span className="text-foreground/80">Monthly retainer</span>
            </div>
          </div>
        </div>

        {/* SELECTION SUMMARY */}
        {(hasBuild || hasCare || addonIds.size > 0) && (
          <div className="max-w-7xl mx-auto mb-12 animate-fade-up">
            <div className="glass rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground mr-2">
                  Your selection
                </span>
                {items
                  .filter((i) => i.category === "Build package" || i.category === "Care plan" || i.category === "Add-on")
                  .map((i) => (
                    <span
                      key={i.id}
                      className="inline-flex items-center gap-2 rounded-full bg-secondary/60 border border-accent/40 px-3 py-1 text-xs"
                    >
                      <span className="text-foreground/90">{i.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${i.name}`}
                        onClick={() => removeItem(i.id)}
                        className="text-muted-foreground hover:text-destructive transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToContact}
                className="shrink-0"
              >
                Review in contact form
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* PART 1: ONE-TIME BUILD */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center shadow-glow shrink-0">
              <Hammer className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary mb-1">Part 1 · Build</div>
              <h3 className="font-display text-2xl md:text-3xl font-light">
                One-time project packages
              </h3>
            </div>
            <div className="hidden md:block flex-1 h-px bg-border ml-4" />
            <div className="hidden md:inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground">
              <CreditCard className="h-3 w-3 text-accent" />
              <span>Single invoice at launch</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((t) => {
              const tierId = `build-${t.name.toLowerCase()}`;
              const selected = buildIds.has(tierId);
              return (
                <div
                  key={t.name}
                  className={`relative rounded-2xl p-8 ${
                    t.featured
                      ? "bg-gradient-to-b from-accent/10 to-card border-2 border-teal-400/70 shadow-elegant lg:scale-105"
                      : "glass"
                  }`}
                >
                  {t.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-gold text-accent-foreground text-[10px] uppercase tracking-[0.2em] font-semibold shadow-gold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-display text-3xl font-medium mb-2">{t.name}</h3>
                  <p className="text-sm text-muted-foreground min-h-[3rem]">{t.desc}</p>

                  <div className="my-8">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl font-light">{t.price}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">Estimated delivery: {t.turnaround}</div>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-1">
                      <Repeat className="h-3 w-3 text-accent" />
                      <span className="text-[11px] text-accent uppercase tracking-wider">Pairs with {t.pairsWith}</span>
                    </div>
                  </div>

                  {selected ? (
                    <div className="w-full mb-8 flex items-stretch gap-2">
                      <div className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold text-accent-foreground shadow-gold h-12 px-4 text-sm font-medium">
                        <Check className="h-4 w-4" />
                        Selected
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${t.name} from request`}
                        onClick={() => removeItem(tierId)}
                        className="h-12 w-12 grid place-items-center rounded-md glass hover:border-destructive/50 hover:text-destructive transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="glass"
                      size="lg"
                      className={`w-full mb-8 ${t.featured ? "bg-teal-500 text-white hover:bg-teal-600 border-transparent shadow-teal-500/30" : ""}`}
                      onClick={() => startProject(tierId, t.name, `${t.price} one-time`, "Build package")}
                    >
                      <Plus className="h-4 w-4" />
                      Start a project
                    </Button>
                  )}

                  <ul className="space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/15 grid place-items-center shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="max-w-7xl mx-auto mb-10 flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border" />
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>Then,</span>
            <span className="text-accent">every month</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border" />
        </div>

        {/* CARE PLAN PROMPT */}
        {hasBuild && !hasCare && (
          <div className="max-w-7xl mx-auto mb-10 animate-fade-up">
            <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-5 md:p-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-gold grid place-items-center shadow-gold shrink-0">
                <Sparkles className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-display text-base md:text-lg font-medium leading-tight">
                  Build package added. Now choose a care plan to keep it running.
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Every site needs hosting, security, and backups. Pick a plan below.
                </div>
              </div>
              <ArrowDown className="hidden sm:block h-5 w-5 text-accent shrink-0 animate-bounce" />
            </div>
          </div>
        )}

        {/* PART 2: MONTHLY RETAINER */}
        <div className="max-w-7xl mx-auto scroll-mt-28" ref={careRef}>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-10 w-10 rounded-lg bg-gradient-gold grid place-items-center shadow-gold shrink-0">
              <Repeat className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-accent mb-1">Part 2 · Care</div>
              <h3 className="font-display text-2xl md:text-3xl font-light">
                Monthly hosting & care retainer
              </h3>
            </div>
            <div className="hidden md:block flex-1 h-px bg-border ml-4" />
            <div className="hidden md:inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3 text-accent" />
              <span>Auto-billed via Stripe · Cancel anytime</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {carePlans.map((p) => {
              const careId = `care-${p.name.toLowerCase().replace(/\s+/g, "-")}`;
              const selected = careIds.has(careId);
              return (
                <div
                  key={p.name}
                  className={`relative rounded-2xl p-8 flex flex-col ${
                    p.featured
                      ? "bg-gradient-to-b from-accent/10 to-card border-2 border-accent/40 shadow-gold"
                      : "glass"
                  }`}
                >
                  {p.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-gold text-accent-foreground text-[10px] uppercase tracking-[0.2em] font-semibold shadow-gold">
                      Most Popular
                    </div>
                  )}
                  <h4 className="font-display text-2xl font-medium mb-2">{p.name}</h4>
                  <p className="text-sm text-muted-foreground min-h-[3rem]">{p.desc}</p>

                  <div className="my-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl font-light">{p.price}</span>
                      {p.price !== "Custom" && (
                        <span className="text-base text-muted-foreground">/mo</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{p.sub}</div>
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-accent/15 grid place-items-center shrink-0">
                          <Check className="h-3 w-3 text-accent" />
                        </div>
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {selected ? (
                    <div className="w-full flex items-stretch gap-2">
                      <div className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold text-accent-foreground shadow-gold h-9 px-3 text-sm font-medium">
                        <Check className="h-4 w-4" />
                        Selected
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${p.name} from request`}
                        onClick={() => removeItem(careId)}
                        className="h-9 w-9 grid place-items-center rounded-md glass hover:border-destructive/50 hover:text-destructive transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant={p.featured ? "gold" : "glass"}
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        startProject(
                          careId,
                          p.name,
                          p.price === "Custom" ? "Custom" : `${p.price}/mo`,
                          "Care plan",
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Start a project
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trust strip — folded in from the old Stripe section */}
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="text-center mb-6">
              <div className="text-xs uppercase tracking-[0.28em] text-accent font-mono">
                Included every month
              </div>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-3xl mx-auto mb-8">
              {[
                { icon: Server, t: "Premium hosting & uptime monitoring" },
                { icon: ShieldCheck, t: "SSL, security patches & daily backups" },
                { icon: RefreshCw, t: "Software, plugin & CMS updates" },
                { icon: LifeBuoy, t: "Priority support & small content edits" },
                { icon: CreditCard, t: "Automated Stripe billing & receipts" },
                { icon: Check, t: "Access to your secure client portal" },
              ].map((item) => (
                <li key={item.t} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 h-7 w-7 rounded-lg bg-accent/15 grid place-items-center shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <span className="text-foreground/90 leading-snug">{item.t}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
                <CreditCard className="h-3 w-3 text-accent" />
                <span>PCI-compliant via Stripe</span>
              </div>
              <div className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
                <RefreshCw className="h-3 w-3 text-accent" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* OPTIONAL ADD-ONS */}
        <div className="max-w-7xl mx-auto mt-20 scroll-mt-28" ref={addonRef}>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-10 w-10 rounded-lg bg-gradient-gold grid place-items-center shadow-gold shrink-0">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-accent mb-1">Optional · Add-ons</div>
              <h3 className="font-display text-2xl md:text-3xl font-light">
                Stack any of these with your plan
              </h3>
            </div>
            <div className="hidden md:block flex-1 h-px bg-border ml-4" />
            <div className="hidden md:inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground">
              <Plus className="h-3 w-3 text-accent" />
              <span>Mix & match · Pricing confirmed by email</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {addons.map((a) => {
              const selected = addonIds.has(a.id);
              const Icon = a.icon;
              return (
                <div
                  key={a.id}
                  className={`relative rounded-2xl p-8 flex flex-col ${
                    selected
                      ? "bg-gradient-to-b from-accent/10 to-card border-2 border-accent/40 shadow-gold"
                      : "glass"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-11 w-11 rounded-lg bg-gradient-primary grid place-items-center shadow-glow shrink-0">
                      <Icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-2xl font-medium leading-tight">{a.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{a.tagline}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{a.desc}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {a.features.map((f) => (
                      <div key={f.t} className="rounded-lg border border-border bg-secondary/30 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <f.icon className="h-3.5 w-3.5 text-accent shrink-0" />
                          <div className="text-xs font-medium">{f.t}</div>
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-snug">{f.d}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4">
                    <div>
                      <div className="font-display text-2xl font-medium">
                        {a.priceUnit ? (
                          <>
                            From <span className="text-gradient-gold">{a.priceLabel}</span>
                            <span className="text-sm text-muted-foreground font-normal ml-1">{a.priceUnit}</span>
                          </>
                        ) : (
                          <span className="text-gradient-gold">{a.priceLabel}</span>
                        )}
                      </div>
                      {a.subLabel && (
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">
                          {a.subLabel}
                        </div>
                      )}
                    </div>
                    {selected ? (
                      <div className="flex items-stretch gap-2">
                        <div className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold text-accent-foreground shadow-gold h-10 px-4 text-sm font-medium">
                          <Check className="h-4 w-4" />
                          Added
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${a.name} from request`}
                          onClick={() => removeItem(a.id)}
                          className="h-10 w-10 grid place-items-center rounded-md glass hover:border-destructive/50 hover:text-destructive transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="glass"
                        size="default"
                        onClick={() => startProject(a.id, a.name, a.price, "Add-on")}
                      >
                        <Plus className="h-4 w-4" />
                        {a.apply ? "Apply to request" : "Start a project"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
