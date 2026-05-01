import { PageLayout } from "@/components/site/PageLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Pricing } from "@/components/site/Pricing";
import { Button } from "@/components/ui/button";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Why split the build fee from the monthly retainer?",
    a: "Because they're two different relationships. The build is a one-time project with a clear scope and deliverable. Hosting, security, backups, and care are ongoing — billed monthly so you're never surprised by a yearly invoice.",
  },
  {
    q: "Do I have to take a care plan?",
    a: "We strongly recommend it. Modern websites need security patches, backups, and uptime monitoring to stay healthy. If you'd rather host elsewhere, we'll hand off the project files at launch.",
  },
  {
    q: "Can I switch care plans later?",
    a: "Yes. Upgrade, downgrade, or cancel anytime from your client portal. Stripe handles the billing automatically.",
  },
  {
    q: "What if my project doesn't fit a package?",
    a: "Most don't, exactly. We use the tiers as a starting point and tailor scope to your goals. Custom quotes are normal.",
  },
];

const PricingPage = () => {
  return (
    <PageLayout
      title="Pricing · Build Your Footprint"
      description="Transparent two-part pricing: a one-time build fee plus a simple monthly retainer for hosting, domain, and care. Two invoices, zero surprises."
    >
      <PageHeader
        eyebrow="Investment"
        breadcrumb="Pricing"
        title={<>Two parts, <span className="italic text-gradient-gold">clearly separated</span>.</>}
        description="A one-time build fee to launch your site, plus a simple monthly retainer for hosting, domain, and care. Two invoices, two relationships, zero surprises."
      />

      <Pricing />

      <section className="py-24 relative">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Frequently asked</div>
              <h2 className="font-display text-3xl md:text-5xl font-light leading-tight">
                Pricing <span className="italic text-gradient-gold">questions</span>, answered.
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="glass rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-lg glass grid place-items-center shrink-0">
                      <HelpCircle className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium mb-2">{f.q}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Get a custom quote <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PricingPage;
