import { PageLayout } from "@/components/site/PageLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Work } from "@/components/site/Work";
import { ClientStories } from "@/components/site/ClientStories";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const WorkPage = () => {
  return (
    <PageLayout
      title="Selected Work · Build Your Footprint"
      description="A small selection of recent client launches across hospitality, healthcare, retail, and professional services. Every project is custom, no templates, no shortcuts."
    >
      <PageHeader
        eyebrow="Selected Work"
        breadcrumb="Work"
        title={<>Footprints we've <span className="italic text-gradient-gold">left behind</span>.</>}
        description="Recent client launches across hospitality, healthcare, retail, and professional services. Every site is hand-crafted around the brand and its audience."
      />

      <Work />
      <Testimonials />

      <section className="py-24 relative">
        <div className="container">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-10 md:p-14 text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Your project, next</div>
            <h2 className="font-display text-3xl md:text-5xl font-light leading-tight mb-6">
              Let's build a footprint that <span className="italic text-gradient-gold">lasts</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Every site you see here started with a single conversation. Yours can too.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Start your project <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WorkPage;
