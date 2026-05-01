import { Button } from "@/components/ui/button";
import { Check, Megaphone, Mail, Image as ImageIcon, FileText, ShieldCheck, CreditCard, Server, LifeBuoy, RefreshCw, Hammer, Repeat, Lock, Plus, ArrowDown, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const tiers = [
  {
    name: "Core",
    price: "$499",
    desc: "Essential online presence for solopreneurs and brand-new ventures.",
    features: ["1-3 page custom site", "Mobile-responsive design", "Contact form", "Domain setup & SSL", "1 round of revisions"],
    pairsWith: "Essential Care",
    featured: false,
  },
  {
    name: "Starter",
    price: "$999",
    desc: "Perfect for new businesses establishing their first digital presence.",
    features: ["5-page custom website", "Mobile-responsive design", "Basic SEO setup", "Domain setup & SSL", "2 rounds of revisions"],
    pairsWith: "Essential Care",
    featured: false,
  },
  {
    name: "Signature",
    price: "$1,499",
    desc: "Our most popular package. Full brand identity and a website that converts.",
    features: ["Up to 12 custom pages", "Brand identity refresh", "Advanced SEO + analytics", "CMS for self-editing", "Launch strategy session"],
    pairsWith: "Growth Care",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For growing businesses needing e-commerce, integrations, or custom features.",
    features: ["Unlimited pages", "E-commerce / bookings", "Custom integrations", "Dedicated project manager", "Quarterly strategy calls"],
    pairsWith: "White-Glove Care",
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

export const Pricing = () => {
  const { addItem, items } = useCart();
  const buildIds = new Set(items.filter((i) => i.category === "Build package").map((i) => i.id));
  const careIds = new Set(items.filter((i) => i.category === "Care plan").map((i) => i.id));
  const hasBuild = buildIds.size > 0;
  const hasCare = careIds.size > 0;
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
                  <div className="text-sm text-muted-foreground mt-1">one-time build</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-1">
                    <Repeat className="h-3 w-3 text-accent" />
                    <span className="text-[11px] text-accent uppercase tracking-wider">Pairs with {t.pairsWith}</span>
                  </div>
                </div>

                {(() => {
                  const tierId = `build-${t.name.toLowerCase()}`;
                  const selected = buildIds.has(tierId);
                  return (
                    <Button
                      variant={selected ? "gold" : t.featured ? "hero" : "glass"}
                      size="lg"
                      className="w-full mb-8"
                      disabled={selected}
                      onClick={() =>
                        addItem({
                          id: tierId,
                          name: t.name,
                          price: `${t.price} one-time`,
                          category: "Build package",
                        })
                      }
                    >
                      {selected ? (
                        <>
                          <Check className="h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add to request
                        </>
                      )}
                    </Button>
                  );
                })()}

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

        {/* CARE PLAN PROMPT — appears after a build package is selected */}
        {hasBuild && !hasCare && (
          <div className="max-w-7xl mx-auto mb-10 animate-fade-up">
            <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-5 md:p-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-gold grid place-items-center shadow-gold shrink-0">
                <Sparkles className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-display text-base md:text-lg font-medium leading-tight">
                  Build package added — now choose a care plan to keep it running.
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
        <div className="max-w-7xl mx-auto">
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
            {carePlans.map((p) => (
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

                {(() => {
                  const careId = `care-${p.name.toLowerCase().replace(/\s+/g, "-")}`;
                  const selected = careIds.has(careId);
                  return (
                    <Button
                      variant={selected ? "gold" : p.featured ? "gold" : "glass"}
                      size="sm"
                      className="w-full"
                      disabled={selected}
                      onClick={() =>
                        addItem({
                          id: careId,
                          name: p.name,
                          price: p.price === "Custom" ? "Custom" : `${p.price}/mo`,
                          category: "Care plan",
                        })
                      }
                    >
                      {selected ? (
                        <>
                          <Check className="h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add {p.name.split(" ")[0]}
                        </>
                      )}
                    </Button>
                  );
                })()}
              </div>
            ))}
          </div>

          {/* Stripe billing trust note */}
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
                    Optional add-on · Stacks with any retainer
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
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() =>
                      addItem({
                        id: "addon-marketing-collateral",
                        name: "Marketing Collateral",
                        price: "From $249/mo",
                        category: "Add-on",
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add to request
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
