import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroJpg from "@/assets/hero-footprint.jpg";
import heroWebp from "@/assets/hero-footprint.webp";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "framer-motion";
import { useEffect, useRef } from "react";
import { AnalyzerWidget } from "@/components/site/AnalyzerWidget";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload the above-the-fold hero image with high priority
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroWebp;
    link.type = "image/webp";
    (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = "high";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5;
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden grain"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <picture>
          <source srcSet={heroWebp} type="image/webp" />
          <img
            src={heroJpg}
            alt=""
            width={1920}
            height={1280}
            loading="eager"
            decoding="async"
            // @ts-expect-error fetchpriority is a valid HTML attribute
            fetchpriority="high"
            className="w-full h-full object-cover opacity-40"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/40" />
      </div>

      {/* Infinite Grid Overlay */}
      <div className="absolute inset-0 -z-5 opacity-[0.03]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="absolute inset-0 -z-5 opacity-20"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

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
            launch a site your customers love, and keep your marketing fresh with
            managed hosting, a private client portal, and ongoing collateral design.
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

          <AnalyzerWidget />

        </div>
      </div>
    </section>
  );
};

const GridPattern = ({ offsetX, offsetY }: { offsetX: any, offsetY: any }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="hero-grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
    </svg>
  );
};
