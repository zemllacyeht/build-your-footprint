import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$1,499",
    cadence: "one-time build",
    monthly: "+ $29/mo hosting",
    desc: "Perfect for new businesses establishing their first digital presence.",
    features: ["5-page custom website", "Mobile-responsive design", "Basic SEO setup", "Domain & SSL included", "Hosting & uptime monitoring", "1 round of revisions"],
    featured: false,
  },
  {
    name: "Signature",
    price: "$3,499",
    cadence: "one-time build",
    monthly: "+ $59/mo hosting & care",
    desc: "Our most popular package — full brand identity and a website that converts.",
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
            No surprises — ever.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
      </div>
    </section>
  );
};
