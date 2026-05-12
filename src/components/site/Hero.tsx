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
      className="relative min-h-screen flex items-center pt-24 md:pt-24 pb-16 md:pb-24 overflow-hidden grain"
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
            className="w-full h-full object-cover opacity-70"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/20" />
      </div>

      {/* Infinite Grid Overlay */}
      <div className="absolute inset-0 -z-5 opacity-[0.12]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="absolute inset-0 -z-5 opacity-60"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Floating glow */}
      <div className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px] animate-float" />
      <div className="absolute bottom-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[140px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10">
        <div className="w-full md:w-[60%] text-center md:text-left mx-auto md:mx-0">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground animate-fade-in mb-2">
            Design. Build. Ongoing Care.
          </div>

          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] animate-fade-up"
            style={{ fontOpticalSizing: "auto" }}
          >
            Take control of your<br />
            <span className="italic font-normal text-primary">digital footprint.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up mt-6 mx-auto md:mx-0"
            style={{ animationDelay: "0.1s" }}
          >
            A website should bring in customers, not just sit there. We build yours to convert, and we'll show you for free where your current one is falling short.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-up mt-10 justify-center md:justify-start"
            style={{ animationDelay: "0.2s" }}
          >
            <Button variant="hero" size="xl" asChild>
              <a href="/analyze">Get a Free Site Audit</a>
            </Button>
            <Button variant="gold" size="xl" asChild>
              <a href="/contact">
                Start a Project <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>

          <div className="mt-4">
            <a
              href="/pricing"
              className="text-sm text-muted-foreground no-underline hover:underline underline-offset-4"
            >
              See pricing
            </a>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Sites starting at $499. Care plans from $19/mo.
          </p>
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
            className="text-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
    </svg>
  );
};
