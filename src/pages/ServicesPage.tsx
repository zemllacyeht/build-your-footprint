import { PageLayout } from "@/components/site/PageLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Services } from "@/components/site/Services";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  return (
    <PageLayout
      title="Services · Build Your Footprint"
      description="Custom web design, brand identity, hosting, SEO, and ongoing care — everything you need to launch and maintain a digital footprint that grows with your business."
    >
      <PageHeader
        eyebrow="Services"
        breadcrumb="Services"
        title={<>Everything you need to <span className="italic text-gradient-gold">go live</span>, and stay ahead.</>}
        description="From the first sketch to the monthly invoice, we handle the full stack of design, development, and care so you can focus on running your business."
      />

      <Services />

      <section className="py-24 relative">
        <div className="container">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-10 md:p-14 text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Next step</div>
            <h2 className="font-display text-3xl md:text-5xl font-light leading-tight mb-6">
              See how we deliver these services, <span className="italic text-gradient-gold">step by step</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our process turns scope into a launched site without surprises — full transparency through your private client portal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/process">View our process <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ServicesPage;
