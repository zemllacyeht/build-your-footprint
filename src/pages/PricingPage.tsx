import { PageLayout } from "@/components/site/PageLayout";

import { Pricing } from "@/components/site/Pricing";
import { PlanFinderWizard } from "@/components/site/PlanFinderWizard";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Why split the build fee from the monthly retainer?",
    a: "Because they're two different relationships. The build is a one-time project with a clear scope and deliverable. Hosting, security, backups, and care are ongoing, billed monthly so you're never surprised by a yearly invoice.",
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
      description="Answer a few questions to get a tailored plan, then send it straight to your project request. Transparent two part pricing with a one time build fee plus a simple monthly retainer."
    >
      <section className="relative pt-28 md:pt-32 pb-2 overflow-hidden grain">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[360px] w-[760px] bg-primary/10 blur-[140px] rounded-full" />
        </div>
        <div className="container">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 animate-fade-in">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-accent">Pricing</span>
          </nav>
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-3 animate-fade-up">Plan finder</div>
            <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.04] animate-fade-up" style={{ animationDelay: "0.05s" }}>
              Your <span className="italic text-gradient-gold">right plan</span>, in 60 seconds.
            </h1>
          </div>
        </div>
      </section>

      <PlanFinderWizard />

      {/* Browse all packages, opt in */}
      <section className="py-16 relative">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card/30 backdrop-blur">
              <AccordionItem value="all" className="border-b-0">
                <AccordionTrigger className="px-6 md:px-8 py-5 hover:no-underline">
                  <div className="text-left">
                    <div className="text-xs uppercase tracking-[0.25em] text-accent mb-1">
                      Prefer to browse
                    </div>
                    <div className="font-display text-xl md:text-2xl font-light">
                      See every build package, care plan, and add-on
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="-mt-8">
                    <Pricing />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

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
