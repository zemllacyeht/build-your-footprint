import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

type Metric = { value: string; label: string };
type Story = {
  id: string;
  videoSrc?: string;
  poster?: string;
  client: string;
  business: string;
  quote: string;
  metrics: Metric[];
  description: string;
  href?: string;
};

const STORIES: Story[] = [
  {
    id: "01",
    client: "Maya Chen",
    business: "Founder, Cloth & Verse Studio",
    quote:
      "My conversion rate doubled in six weeks, but more importantly, the site finally feels like me.",
    metrics: [
      { value: "+148%", label: "conversion rate" },
      { value: "6 wks", label: "to launch" },
      { value: "3.4×", label: "session duration" },
    ],
    description:
      "A boutique fashion brand needed a digital home as considered as their craft. We rebuilt the entire experience around editorial storytelling, and the conversions followed.",
  },
  {
    id: "02",
    videoSrc: "/videos/byf-02.mp4",
    client: "Marcus Reid",
    business: "CEO, Reid & Sons Construction",
    quote:
      "The phone hasn't stopped ringing since we relaunched. We had to hire two more project managers.",
    metrics: [
      { value: "312%", label: "lead volume" },
      { value: "2×", label: "avg project size" },
    ],
    description:
      "Generations of craftsmanship deserved a digital presence that matched. A brand-first redesign turned a 90s contractor site into a credibility machine.",
  },
  {
    id: "03",
    videoSrc: "/videos/byf-03.mp4",
    client: "Aisha Okonkwo",
    business: "Founder, Lumen Wellness",
    quote:
      "I stopped competing on price the day my new site went live. My clients started taking me seriously.",
    metrics: [
      { value: "+$4,200", label: "avg client value" },
      { value: "90%", label: "retention" },
      { value: "12 wks", label: "ROI" },
    ],
    description:
      "A wellness practitioner trapped in commodity-pricing territory. We rebuilt her positioning, her booking flow, and her visual language around premium intimacy.",
  },
];

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const RollingNumber = ({ value }: { value: string }) => (
  <span className="relative inline-block overflow-hidden h-[1.1em] align-bottom" style={{ minWidth: "1.6em" }}>
    <span
      key={value}
      className="block"
      style={{
        animation: "byf-roll 600ms cubic-bezier(0.32, 0.72, 0, 1) both",
      }}
    >
      {value}
    </span>
  </span>
);

export const ClientStories = () => {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hovering, setHovering] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const dragStart = useRef<number | null>(null);
  const userInteracted = useRef(false);

  // reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // reveal on scroll
  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setRevealed(true),
      { threshold: 0.2 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const goTo = useCallback((i: number) => {
    setActive((prev) => {
      const next = (i + STORIES.length) % STORIES.length;
      if (next !== prev) {
        const v = videoRefs.current[prev];
        if (v) {
          v.pause();
          try { v.currentTime = 0; } catch {}
        }
      }
      return next;
    });
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // play active video
  useEffect(() => {
    const v = videoRefs.current[active];
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
    setProgress(0);
  }, [active]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === "ArrowRight") { userInteracted.current = true; next(); }
      if (e.key === "ArrowLeft") { userInteracted.current = true; prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // auto advance
  useEffect(() => {
    if (reduced || hovering || userInteracted.current) return;
    const t = window.setTimeout(() => next(), 12000);
    return () => window.clearTimeout(t);
  }, [active, hovering, reduced, next]);

  const onSectionLeave = () => {
    setHovering(false);
    userInteracted.current = false;
  };

  const handleVideoEnter = (i: number) => {
    if (i !== active) return;
    setShowHint(false);
    const v = videoRefs.current[i];
    if (v) v.muted = false;
  };
  const handleVideoLeave = (i: number) => {
    const v = videoRefs.current[i];
    if (v) v.muted = true;
  };

  const onTimeUpdate = (i: number) => {
    if (i !== active) return;
    const v = videoRefs.current[i];
    if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
  };

  // drag
  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current == null) return;
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) > 60) {
      userInteracted.current = true;
      dx < 0 ? next() : prev();
    }
    dragStart.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="client-stories"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onSectionLeave}
      className="relative overflow-hidden py-32"
      style={{
        background: "#0a0a0b",
        color: "#f0f0f2",
        fontFamily: "'Inter Tight', Inter, system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes byf-roll {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes byf-reveal {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .byf-grain::before {
          content: "";
          position: absolute; inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }
        .byf-reveal { opacity: 0; }
        .byf-reveal.show { animation: byf-reveal 700ms ${EASE} both; }
        @media (prefers-reduced-motion: reduce) {
          .byf-reveal, .byf-reveal.show { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* warm radial glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 30%, rgba(212,165,116,0.08), transparent 60%), radial-gradient(50% 40% at 85% 70%, rgba(168,133,86,0.06), transparent 60%)",
        }}
      />
      <div className="byf-grain absolute inset-0 -z-0" />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <div
              className={`byf-reveal ${revealed ? "show" : ""} text-[11px] uppercase mb-6`}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.18em",
                color: "#d4a574",
                animationDelay: "0ms",
              }}
            >
              client stories
            </div>
            <h2
              className={`byf-reveal ${revealed ? "show" : ""} font-light leading-[1.05]`}
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                color: "#f0f0f2",
                animationDelay: "100ms",
              }}
            >
              The work, in their <em style={{ color: "#d4a574", fontStyle: "italic" }}>own words</em>.
            </h2>
          </div>

          {/* Counter */}
          <div
            aria-live="polite"
            className="hidden md:flex items-center gap-1 text-sm tabular-nums"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#888890",
              letterSpacing: "0.1em",
            }}
          >
            <RollingNumber value={STORIES[active].id} />
            <span>/ {String(STORIES.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative group"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ touchAction: "pan-y" }}
        >
          <div className="overflow-hidden" style={{ marginRight: "-8%" }}>
            <div
              className="flex"
              style={{
                transform: `translateX(-${active * 92}%)`,
                transition: reduced ? "none" : `transform 800ms ${EASE}`,
              }}
            >
              {STORIES.map((s, i) => {
                const isActive = i === active;
                return (
                  <article
                    key={s.id}
                    className="shrink-0 w-[92%] pr-[4%]"
                    aria-hidden={!isActive}
                  >
                    <div
                      className="grid md:grid-cols-12 gap-8 md:gap-16 items-center"
                      style={{
                        transition: reduced ? "none" : `opacity 600ms ${EASE}, filter 600ms ${EASE}, transform 600ms ${EASE}`,
                        opacity: isActive ? 1 : 0.5,
                        filter: isActive ? "none" : "saturate(0.4) blur(2px)",
                        transform: isActive ? "scale(1)" : "scale(0.92)",
                      }}
                    >
                      {/* LEFT: video */}
                      <div className="md:col-span-5">
                        <div
                          className={`byf-reveal ${revealed && isActive ? "show" : ""} relative mx-auto`}
                          style={{
                            animationDelay: "400ms",
                            maxHeight: "75vh",
                            aspectRatio: "9 / 16",
                            maxWidth: "min(100%, 42vh)",
                          }}
                          onMouseEnter={() => handleVideoEnter(i)}
                          onMouseLeave={() => handleVideoLeave(i)}
                        >
                          <div
                            className="relative w-full h-full rounded-[2px] overflow-hidden"
                            style={{
                              boxShadow:
                                "0 30px 80px -20px rgba(212,165,116,0.18), 0 10px 30px -10px rgba(0,0,0,0.6)",
                              outline: "1px solid rgba(212,165,116,0.15)",
                              outlineOffset: "-1px",
                            }}
                          >
                            <video
                              ref={(el) => (videoRefs.current[i] = el)}
                              data-video-id={s.id}
                              src={s.videoSrc}
                              poster={s.poster}
                              muted
                              playsInline
                              loop
                              preload={isActive ? "metadata" : "none"}
                              onTimeUpdate={() => onTimeUpdate(i)}
                              aria-label={`${s.client}, ${s.business}: ${s.quote}`}
                              className="absolute inset-0 w-full h-full object-cover"
                              style={{
                                background:
                                  "radial-gradient(60% 50% at 50% 40%, rgba(212,165,116,0.18), #0a0a0b 70%)",
                              }}
                            />
                            {/* number chip */}
                            <div
                              className="absolute top-3 left-3 px-2 py-1 text-[10px]"
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                color: "#e8c89a",
                                background: "rgba(10,10,11,0.6)",
                                backdropFilter: "blur(6px)",
                                border: "1px solid rgba(212,165,116,0.2)",
                              }}
                            >
                              [{s.id}]
                            </div>

                            {/* unmute hint */}
                            {isActive && showHint && (
                              <div
                                className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 text-[10px] uppercase"
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  letterSpacing: "0.18em",
                                  color: "#f0f0f2",
                                  background: "rgba(10,10,11,0.6)",
                                  backdropFilter: "blur(6px)",
                                  border: "1px solid rgba(212,165,116,0.2)",
                                  transition: "opacity 400ms",
                                }}
                              >
                                hover to unmute
                              </div>
                            )}

                            {/* progress bar */}
                            {isActive && (
                              <div
                                className="absolute bottom-0 left-0 h-[2px]"
                                style={{
                                  width: `${progress}%`,
                                  background: "#d4a574",
                                  transition: "width 120ms linear",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: editorial content */}
                      <div className="md:col-span-7 max-w-[640px]">
                        <div
                          className={`byf-reveal ${revealed && isActive ? "show" : ""} text-[11px] uppercase mb-6`}
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: "0.18em",
                            color: "#d4a574",
                            animationDelay: "0ms",
                          }}
                        >
                          client story · no. {s.id}
                        </div>

                        <div
                          className={`byf-reveal ${revealed && isActive ? "show" : ""}`}
                          style={{ animationDelay: "100ms" }}
                        >
                          <div
                            style={{
                              fontFamily: "'Fraunces', Georgia, serif",
                              fontSize: "clamp(1.75rem, 2.6vw, 2.4rem)",
                              fontWeight: 300,
                              color: "#f0f0f2",
                              lineHeight: 1.1,
                            }}
                          >
                            {s.client}
                          </div>
                          <div
                            className="mt-2 text-sm"
                            style={{ color: "#888890" }}
                          >
                            {s.business}
                          </div>
                        </div>

                        <blockquote
                          className={`byf-reveal ${revealed && isActive ? "show" : ""} mt-8`}
                          style={{
                            fontFamily: "'Fraunces', Georgia, serif",
                            fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
                            fontWeight: 300,
                            lineHeight: 1.25,
                            color: "#f0f0f2",
                            fontStyle: "italic",
                            animationDelay: "200ms",
                          }}
                        >
                          “{s.quote}”
                        </blockquote>

                        <div
                          className="my-10 h-px w-full"
                          style={{ background: "rgba(212,165,116,0.15)" }}
                        />

                        <div
                          className={`byf-reveal ${revealed && isActive ? "show" : ""} grid gap-6`}
                          style={{
                            gridTemplateColumns: `repeat(${s.metrics.length}, minmax(0, 1fr))`,
                            animationDelay: "300ms",
                          }}
                        >
                          {s.metrics.map((m, mi) => (
                            <div
                              key={m.label}
                              className="byf-reveal show"
                              style={{ animationDelay: `${300 + mi * 80}ms` }}
                            >
                              <div
                                style={{
                                  fontFamily: "'Fraunces', Georgia, serif",
                                  fontSize: "clamp(1.5rem, 2.2vw, 1.85rem)",
                                  fontWeight: 300,
                                  color: "#e8c89a",
                                  lineHeight: 1,
                                }}
                              >
                                {m.value}
                              </div>
                              <div
                                className="mt-2 text-[10px] uppercase"
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  letterSpacing: "0.18em",
                                  color: "#888890",
                                }}
                              >
                                {m.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        <p
                          className="mt-10 max-w-[60ch] text-[15px] leading-relaxed"
                          style={{ color: "#b8b8be" }}
                        >
                          {s.description}
                        </p>

                        <a
                          href={s.href || "#"}
                          className="group/link mt-8 inline-flex items-center gap-2 text-sm"
                          style={{
                            color: "#d4a574",
                            fontFamily: "'Inter Tight', Inter, sans-serif",
                            letterSpacing: "0.02em",
                          }}
                        >
                          View full case study
                          <ArrowRight
                            className="h-4 w-4 transition-transform"
                            style={{ transition: `transform 300ms ${EASE}` }}
                          />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Prev / Next arrows */}
          {[
            { dir: "prev", onClick: () => { userInteracted.current = true; prev(); }, side: "left-4 md:left-2" },
            { dir: "next", onClick: () => { userInteracted.current = true; next(); }, side: "right-[10%] md:right-[9%]" },
          ].map((b) => (
            <button
              key={b.dir}
              onClick={b.onClick}
              aria-label={b.dir === "prev" ? "Previous story" : "Next story"}
              className={`absolute top-1/2 -translate-y-1/2 ${b.side} h-11 w-11 rounded-full grid place-items-center opacity-0 group-hover:opacity-100`}
              style={{
                border: "1px solid rgba(212,165,116,0.4)",
                background: "rgba(10,10,11,0.5)",
                backdropFilter: "blur(10px)",
                color: "#d4a574",
                transition: `opacity 400ms ${EASE}, transform 400ms ${EASE}`,
              }}
            >
              <ArrowRight
                className="h-4 w-4"
                style={{ transform: b.dir === "prev" ? "rotate(180deg)" : "none" }}
              />
            </button>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {STORIES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { userInteracted.current = true; goTo(i); }}
              aria-label={`Go to story ${s.id}`}
              className="h-px"
              style={{
                width: i === active ? 48 : 24,
                background: i === active ? "#d4a574" : "rgba(184,184,190,0.3)",
                transition: `width 600ms ${EASE}, background 600ms ${EASE}`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientStories;
