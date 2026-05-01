import { PageLayout } from "@/components/site/PageLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Contact } from "@/components/site/Contact";
import { Clock, MessageCircle, Sparkles } from "lucide-react";

const promises = [
  { icon: Clock, t: "24-hour reply", d: "Every inquiry gets a personal response within one business day." },
  { icon: MessageCircle, t: "Free strategy call", d: "30 minutes to scope your goals — no obligation, no upsell." },
  { icon: Sparkles, t: "Custom proposal", d: "A tailored plan with timeline and pricing, delivered within a week." },
];

const ContactPage = () => {
  return (
    <PageLayout
      title="Contact · Build Your Footprint"
      description="Tell us about your business and we'll reply within one business day with a free strategy call invitation. Already a client? Log in to your project portal."
    >
      <PageHeader
        eyebrow="Let's talk"
        breadcrumb="Contact"
        title={<>Ready to make your <span className="italic text-gradient-gold">mark</span>?</>}
        description="Tell us about your business. We'll reply within one business day with a free strategy call invitation."
      />

      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {promises.map((p) => (
              <div key={p.t} className="glass rounded-2xl p-6">
                <div className="h-11 w-11 rounded-lg glass grid place-items-center mb-4">
                  <p.icon className="h-4 w-4 text-accent" />
                </div>
                <div className="font-display text-lg font-medium mb-1">{p.t}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </PageLayout>
  );
};

export default ContactPage;
