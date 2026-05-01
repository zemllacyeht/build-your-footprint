import { PageLayout } from "@/components/site/PageLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Process } from "@/components/site/Process";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProcessPage = () => {
  return (
    <PageLayout
      title="Our Process · Build Your Footprint"
      description="A clear, five-step path from idea to live: discover, design, build, preview in your private hub, and launch — with ongoing care included."
    >
      <PageHeader
        eyebrow="How we work"
        breadcrumb="Process"
        title={<>A clear path from <span className="italic text-gradient-gold">idea to live</span>.</>}
        description="No mystery, no waiting in the dark. Every project follows the same five steps, with previews and approvals happening inside your secure client portal."
      />

      <Process />

      <section className="py-24 relative">
        <div className="container">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-10 md:p-14 text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Ready when you are</div>
            <h2 className="font-display text-3xl md:text-5xl font-light leading-tight mb-6">
              Let's map out <span className="italic text-gradient-gold">your timeline</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Most projects launch in 3–6 weeks. Tell us about yours and we'll send back a phased plan within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Start a project <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/work">See past launches</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ProcessPage;
