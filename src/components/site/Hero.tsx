import { ArrowRight } from "lucide-react";
import heroJpg from "@/assets/hero-footprint.jpg";
import heroWebp from "@/assets/hero-footprint.webp";
import { useEffect, useRef } from "react";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden"
      style={{ background: "#0a0a0b", color: "#f0f0f2" }}
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
            className="w-full h-full object-cover opacity-20"
          />
        </picture>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.6), #0a0a0b 80%)" }} />
      </div>

      {/* Warm radial glow at top */}
      <div
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 25% 10%, rgba(212,165,116,0.18), transparent 60%), radial-gradient(50% 40% at 80% 0%, rgba(168,133,86,0.10), transparent 60%)",
        }}
      />

      <div className="container relative z-10">
        <div className="w-full md:w-3/5 max-w-[760px] mx-auto md:mx-0 text-center md:text-left">
          <div
            className="text-[11px] uppercase mb-2"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.18em",
              color: "#d4a574",
            }}
          >
            Design. Build. Ongoing care.
          </div>

          <h1
            className="font-light"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 300,
              color: "#f0f0f2",
              fontVariationSettings: "'opsz' 144",
            }}
          >
            Take control of your<br />
            digital{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "#d4a574",
                fontWeight: 300,
              }}
            >
              footprint
            </em>
            .
          </h1>

          <p
            className="mt-6 text-base md:text-[17px] leading-relaxed mx-auto md:mx-0"
            style={{
              fontFamily: "'Inter Tight', Inter, system-ui, sans-serif",
              color: "#b8b8be",
              maxWidth: "580px",
            }}
          >
            A website should bring in customers, not just sit there. We build yours to convert, and we'll show you for free where your current one is falling short.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center md:items-start gap-4 justify-center md:justify-start">
            <a
              href="/analyze"
              className="inline-flex items-center justify-center px-6 h-12 text-sm font-medium transition-colors"
              style={{
                background: "#10b981",
                color: "#0a0a0b",
                fontFamily: "'Inter Tight', Inter, sans-serif",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#22c79b")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              Get a Free Site Audit
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 text-sm font-medium transition-colors"
              style={{
                background: "transparent",
                border: "1px solid rgba(212,165,116,0.6)",
                color: "#d4a574",
                fontFamily: "'Inter Tight', Inter, sans-serif",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,165,116,0.10)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Start a Project <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-4">
            <a
              href="/pricing"
              className="text-sm group inline-block"
              style={{
                color: "#b8b8be",
                fontFamily: "'Inter Tight', Inter, sans-serif",
              }}
            >
              <span className="border-b border-transparent group-hover:border-[#d4a574] transition-colors">
                See pricing
              </span>
            </a>
          </div>

          <p
            className="mt-6 text-[12.5px]"
            style={{
              color: "#888890",
              fontFamily: "'Inter Tight', Inter, sans-serif",
            }}
          >
            Sites starting at $499. Care plans from $19/mo.
          </p>
        </div>
      </div>
    </section>
  );
};
