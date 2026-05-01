import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import hero from "@/assets/hero-footprint.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden grain">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={hero}
          alt=""
          width={1920}
          height={1280}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/40" />
      </div>

      {/* Floating glow */}
      <div className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px] animate-float" />
      <div className="absolute bottom-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[140px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Design · Hosting · Ongoing Partnership
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] mb-8 animate-fade-up">
            Your brand's<br />
            <span className="italic font-normal text-gradient-hero">digital footprint</span><br />
            in expert hands.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
            More than a website. A long-term partnership. We shape your brand identity,
            launch a site your customers love, and keep it secure with managed hosting,
            a private client portal, and support that grows with you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">
                Start your project <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <a href="#work">See our work</a>
            </Button>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {[
              { v: "100%", l: "Custom Design" },
              { v: "24/7", l: "Hosting Support" },
              { v: "5★", l: "Client Rating" },
              { v: "∞", l: "Revisions" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl md:text-4xl font-medium text-gradient-gold">{s.v}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
