import { Button } from "@/components/ui/button";
import { Check, Megaphone, Mail, Image as ImageIcon, FileText, ShieldCheck, CreditCard, Server, LifeBuoy, RefreshCw } from "lucide-react";

const tiers = [
  {
    name: "Core",
    price: "$499",
    cadence: "one-time build",
    monthly: "+ $19/mo hosting",
    desc: "Essential online presence for solopreneurs and brand-new ventures.",
    features: ["1-3 page custom site", "Mobile-responsive design", "Contact form", "Domain & SSL included", "Basic hosting & uptime", "1 round of revisions"],
    featured: false,
  },
  {
    name: "Starter",
    price: "$999",
    cadence: "one-time build",
    monthly: "+ $29/mo hosting",
    desc: "Perfect for new businesses establishing their first digital presence.",
    features: ["5-page custom website", "Mobile-responsive design", "Basic SEO setup", "Domain & SSL included", "Hosting & uptime monitoring", "2 rounds of revisions"],
    featured: false,
  },
  {
    name: "Signature",
    price: "$1,499",
    cadence: "one-time build",
    monthly: "+ $59/mo hosting & care",
    desc: "Our most popular package. Full brand identity and a website that converts.",
    features: ["Up to 12 custom pages", "Brand identity refresh", "Advanced SEO + analytics", "CMS for self-editing", "Premium hosting & backups", "Monthly content updates", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "tailored scope",
    monthly: "+ custom care plan",
    desc: "For growing businesses needing e-commerce, integrations, or custom features.",
    features: ["Unlimited pages", "E-commerce / bookings", "Custom integrations", "Dedicated project manager", "White-glove hosting", "Quarterly strategy calls"],
    featured: false,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Investment</div>
          <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
            Transparent, <span className="italic text-gradient-gold">all-in</span> pricing.
          </h2>
          <p className="text-muted-foreground mt-6 leading-relaxed">
            One project fee, plus a simple monthly plan covering hosting, domain, security, and care.
            No surprises, ever.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl p-8 ${
                t.featured
                  ? "bg-gradient-to-b from-primary/10 to-card border-2 border-primary/40 shadow-elegant lg:scale-105"
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
                <div className="text-sm text-muted-foreground mt-1">{t.cadence}</div>
                <div className="text-sm text-accent mt-2">{t.monthly}</div>
              </div>

              <Button
                variant={t.featured ? "hero" : "glass"}
                size="lg"
                className="w-full mb-8"
                asChild
              >
                <a href="#contact">{t.featured ? "Start your project" : "Get started"}</a>
              </Button>

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
          ))}
        </div>

        {/* Stripe billing trust note */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Billing you can trust
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-light leading-tight mb-4">
                  Monthly billing is fully automated with <span className="italic text-gradient-gold">Stripe</span>.
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  One predictable charge each month. No invoices to chase, no surprise fees,
                  cancel or change plans anytime from your secure client portal.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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

              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-accent mb-4">
                  Included every month
                </div>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Server, t: "Premium hosting & uptime monitoring" },
                    { icon: ShieldCheck, t: "SSL, security patches & daily backups" },
                    { icon: RefreshCw, t: "Software, plugin & CMS updates" },
                    { icon: LifeBuoy, t: "Priority support & small content edits" },
                    { icon: CreditCard, t: "Automated Stripe billing & receipts" },
                    { icon: Check, t: "Access to your secure client portal" },
                  ].map((item) => (
                    <li key={item.t} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 h-7 w-7 rounded-lg bg-primary/15 grid place-items-center shrink-0">
                        <item.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/90 leading-snug">{item.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Collateral add-on */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-card via-background to-card p-10 md:p-14">
            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
                  <Megaphone className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Add-on · Available with any plan
                  </span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-light leading-tight mb-4">
                  Marketing collateral, <span className="italic text-gradient-gold">on a monthly drip</span>.
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Your brand never stops working. We design ongoing social posts, email banners,
                  digital ads, one-pagers, and print pieces. All on-brand, delivered through the same client portal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div>
                    <div className="font-display text-3xl font-medium">From <span className="text-gradient-gold">$249</span><span className="text-base text-muted-foreground font-normal">/mo</span></div>
                    <div className="text-xs text-muted-foreground uppercase tracking-[0.18em] mt-1">Tiered packages available</div>
                  </div>
                  <Button variant="hero" size="lg" asChild>
                    <a href="#contact">Add to your plan</a>
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: ImageIcon, t: "Social Graphics", d: "Instagram, Facebook, LinkedIn posts & stories" },
                  { icon: Mail, t: "Email Campaigns", d: "Branded headers, banners, and templates" },
                  { icon: Megaphone, t: "Digital Ads", d: "Google Display, Meta, and retargeting creative" },
                  { icon: FileText, t: "Print & One-Pagers", d: "Flyers, business cards, menus, signage" },
                ].map((c) => (
                  <div key={c.t} className="glass rounded-xl p-5">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center mb-4 shadow-glow">
                      <c.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="font-medium mb-1">{c.t}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{c.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
