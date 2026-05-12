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
    videoSrc: "/videos/byf-01.mp4",
    poster: "/testimonial-01.jpg",
    client: "David & Linh Park",
    business: "Co-founders, Marrow Coffee Roasters",
    quote:
      "We knew exactly what we wanted, we just didn't know how to get there. Isaiah figured it out before our second call.",
    metrics: [
      { value: "+213%", label: "online orders" },
      { value: "2.4×", label: "avg cart size" },
      { value: "4", label: "wholesale accounts added" },
    ],
    description:
      "A husband-and-wife coffee roastery serving four cafés around the city. We rebuilt their site around the rituals of their craft, and turned casual browsers into committed accounts.",
  },
  {
    id: "02",
    videoSrc: "/videos/byf-02.mp4",
    poster: "/testimonial-02.jpg",
    client: "Marcus Reid",
    business: "CEO, Reid & Sons Construction",
    quote:
      "My phone hasn't stopped ringing. We had to hire two more guys just to keep up with the new leads.",
    metrics: [
      { value: "312%", label: "lead volume" },
      { value: "2×", label: "avg project size" },
      { value: "~$84k", label: "mo. recurring" },
    ],
    description:
      "Two generations of builders, finally with a site that looks like the work. We rebranded the family business for the way clients actually find contractors in 2026.",
  },
  {
    id: "03",
    videoSrc: "/videos/byf-03.mp4",
    poster: "/testimonial-03.jpg",
    client: "Aisha Okonkwo",
    business: "Founder, Aisha Okonkwo Studio",
    quote: "I feel like the exact idea i had in my head was transferred to my site.",
    metrics: [
      { value: "3.8×", label: "inquiry value" },
      { value: "14", label: "international clients this yr" },
      { value: "$12k", label: "avg commission" },
    ],
    description:
      "A textile artist whose website had been quietly contradicting her work for years. We rebuilt around her actual practice and the right collectors started finding her.",
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
  const [reducedData, setReducedData] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [cardHover, setCardHover] = useState(false);
  const [optedIn, setOptedIn] = useState<Record<number, boolean>>({});
  const [magnet, setMagnet] = useState<{ prev: { x: number; y: number }; next: { x: number; y: number } }>({
    prev: { x: 0, y: 0 },
    next: { x: 0, y: 0 },
  });
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);
  const dragStart = useRef<number | null>(null);
  const userInteracted = useRef(false);
  const volumeFadeRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  // reduced motion + reduced data
  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqData = window.matchMedia("(prefers-reduced-data: reduce)");
    const updMotion = () => setReduced(mqMotion.matches);
    const updData = () => setReducedData(mqData.matches);
    updMotion();
    updData();
    mqMotion.addEventListener("change", updMotion);
    mqData.addEventListener?.("change", updData);
    return () => {
      mqMotion.removeEventListener("change", updMotion);
      mqData.removeEventListener?.("change", updData);
    };
  }, []);

  // reveal once + visibility tracking
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const revealObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          el.classList.add("byf-fired");
          revealObs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    revealObs.observe(el);

    const visObs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.05 }
    );
    visObs.observe(el);
    return () => {
      revealObs.disconnect();
      visObs.disconnect();
    };
  }, []);

  const goTo = useCallback((i: number) => {
    clearAdvanceTimer();
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
  }, [clearAdvanceTimer]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // play / pause active video based on visibility & opt-in
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i !== active) {
        v.pause();
        try { v.currentTime = 0; } catch {}
      }
    });
    const v = videoRefs.current[active];
    if (!v) return;
    if (!inView) { v.pause(); return; }
    if (reducedData && !optedIn[active]) return;
    v.muted = true;
    v.play().catch(() => {});
    setProgress(0);
  }, [active, inView, reducedData, optedIn]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === "ArrowRight") { userInteracted.current = true; next(); }
      else if (e.key === "ArrowLeft") { userInteracted.current = true; prev(); }
      else if (e.code === "Space") {
        const v = videoRefs.current[active];
        if (v) {
          e.preventDefault();
          v.paused ? v.play().catch(() => {}) : v.pause();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, active]);

  const onSectionLeave = () => {
    setHovering(false);
    userInteracted.current = false;
    setMagnet({ prev: { x: 0, y: 0 }, next: { x: 0, y: 0 } });
  };

  const fadeVolume = (v: HTMLVideoElement, target: number) => {
    if (volumeFadeRef.current) window.clearInterval(volumeFadeRef.current);
    v.muted = false;
    const start = v.volume;
    const startTime = performance.now();
    const dur = 200;
    volumeFadeRef.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - startTime) / dur);
      v.volume = start + (target - start) * t;
      if (t >= 1) {
        if (volumeFadeRef.current) window.clearInterval(volumeFadeRef.current);
        if (target === 0) v.muted = true;
      }
    }, 16) as unknown as number;
  };

  const handleVideoEnter = (i: number) => {
    if (i !== active) return;
    setShowHint(false);
    const v = videoRefs.current[i];
    if (v) fadeVolume(v, 1);
  };
  const handleVideoLeave = (i: number) => {
    const v = videoRefs.current[i];
    if (v) fadeVolume(v, 0);
  };

  const onTimeUpdate = (i: number) => {
    if (i !== active) return;
    const v = videoRefs.current[i];
    if (v && v.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  const onVideoEnded = (i: number) => {
    if (i !== active) return;
    setProgress(100);
    if (reduced || cardHover) return;
    clearAdvanceTimer();
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      next();
    }, 1500);
  };

  // pause auto-advance while hovering active card
  useEffect(() => {
    if (cardHover) clearAdvanceTimer();
  }, [cardHover, clearAdvanceTimer]);

  // cleanup on unmount
  useEffect(() => clearAdvanceTimer, [clearAdvanceTimer]);

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

  // magnetic buttons
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const calc = (btn: HTMLButtonElement | null) => {
        if (!btn) return { x: 0, y: 0 };
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > 80) return { x: 0, y: 0 };
        const f = (1 - dist / 80) * 6;
        const ang = Math.atan2(dy, dx);
        return { x: Math.cos(ang) * f, y: Math.sin(ang) * f };
      };
      setMagnet({ prev: calc(prevBtnRef.current), next: calc(nextBtnRef.current) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  const adjacent = (i: number) =>
    i === active || i === (active + 1) % STORIES.length || i === (active - 1 + STORIES.length) % STORIES.length;

  return (
    <section
      ref={sectionRef}
      id="client-stories"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onSectionLeave}
      className="relative overflow-hidden py-12 md:py-[72px]"
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
        @keyframes byf-video-in {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
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
        .byf-video-reveal { opacity: 0; }
        .byf-video-reveal.show { animation: byf-video-in 800ms ${EASE} both; }
        .byf-focus:focus-visible {
          outline: 2px solid #d4a574;
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .byf-reveal, .byf-reveal.show, .byf-video-reveal, .byf-video-reveal.show {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
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
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-3xl">
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
                fontSize: "clamp(2.25rem, 4.2vw, 3rem)",
                color: "#f0f0f2",
                animationDelay: "200ms",
              }}
            >
              Three businesses, three <em style={{ color: "#d4a574", fontStyle: "italic" }}>transformations</em>.
            </h2>
            <p
              className={`byf-reveal ${revealed ? "show" : ""} mt-5 text-[16px] leading-relaxed`}
              style={{ color: "#b8b8be", animationDelay: "200ms", maxWidth: "62ch" }}
            >
              Each one began with a conversation. Each one ended somewhere the founders couldn't have predicted alone.
            </p>
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

        {/* Brass hairline */}
        <div
          className={`byf-reveal ${revealed ? "show" : ""} h-px w-full mb-16 md:mb-20`}
          style={{ background: "rgba(212,165,116,0.25)", animationDelay: "100ms" }}
        />

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
                const isAdj = adjacent(i);
                const preload = isActive ? "auto" : isAdj ? "metadata" : "none";
                const needsOptIn = reducedData && !optedIn[i];
                return (
                  <article
                    key={s.id}
                    className="shrink-0 w-[92%] pr-[4%]"
                    aria-hidden={!isActive}
                  >
                    <div
                      className="grid md:grid-cols-12 gap-8 md:gap-16 items-center"
                      style={{
                        transition: reduced
                          ? "none"
                          : `opacity 600ms ${EASE}, filter 600ms ${EASE}, transform 600ms ${EASE}`,
                        ["--byf-tint-opacity" as any]: isActive ? 1 : 0.5,
                        ["--byf-tint-saturate" as any]: isActive ? 1 : 0.4,
                        ["--byf-tint-blur" as any]: isActive ? "0px" : "1.5px",
                        ["--byf-tint-scale" as any]: isActive ? 1 : 0.92,
                        opacity: "var(--byf-tint-opacity)" as any,
                        filter: "saturate(var(--byf-tint-saturate)) blur(var(--byf-tint-blur))" as any,
                        transform: "scale(var(--byf-tint-scale))" as any,
                      }}
                    >
                      {/* LEFT: video */}
                      <div className="md:col-span-5">
                        <div
                          className={`byf-video-reveal ${revealed && isActive ? "show" : ""} relative mx-auto`}
                          style={{
                            animationDelay: "400ms",
                            maxHeight: "75vh",
                            aspectRatio: "9 / 16",
                            maxWidth: "min(100%, 42vh)",
                          }}
                          onMouseEnter={() => {
                            handleVideoEnter(i);
                            if (i === active) setCardHover(true);
                          }}
                          onMouseLeave={() => {
                            handleVideoLeave(i);
                            if (i === active) setCardHover(false);
                          }}
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
                              preload={preload}
                              onTimeUpdate={() => onTimeUpdate(i)}
                              onEnded={() => onVideoEnded(i)}
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

                            {/* reduced-data play overlay */}
                            {isActive && needsOptIn && (
                              <button
                                onClick={() => setOptedIn((o) => ({ ...o, [i]: true }))}
                                className="byf-focus absolute inset-0 grid place-items-center"
                                style={{ background: "rgba(10,10,11,0.35)", color: "#f0f0f2" }}
                                aria-label={`Play video for ${s.client}`}
                              >
                                <span
                                  className="px-4 py-2 text-[10px] uppercase"
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    letterSpacing: "0.18em",
                                    background: "rgba(10,10,11,0.7)",
                                    border: "1px solid rgba(212,165,116,0.4)",
                                    color: "#d4a574",
                                  }}
                                >
                                  ▶ tap to play
                                </span>
                              </button>
                            )}

                            {/* unmute hint */}
                            {isActive && showHint && !needsOptIn && (
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

                            {/* brass progress bar */}
                            {isActive && (
                              <div
                                className="absolute bottom-0 left-0"
                                style={{
                                  height: "1.5px",
                                  width: `${progress}%`,
                                  background: "#d4a574",
                                  opacity: hovering ? 1 : 0.6,
                                  transition: "width 120ms linear, opacity 300ms",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: editorial content */}
                      <div className="md:col-span-7 max-w-[640px]">
                        <div
                          className={`byf-reveal ${revealed && isActive ? "show" : ""}`}
                          style={{ animationDelay: "240ms" }}
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
                          <div className="mt-2 text-sm" style={{ color: "#888890" }}>
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
                            animationDelay: "280ms",
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
                            animationDelay: "320ms",
                          }}
                        >
                          {s.metrics.map((m, mi) => (
                            <div
                              key={m.label}
                              className="byf-reveal show"
                              style={{ animationDelay: `${320 + mi * 80}ms` }}
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
                          className={`byf-reveal ${revealed && isActive ? "show" : ""} mt-10 max-w-[60ch] text-[15px] leading-relaxed`}
                          style={{ color: "#b8b8be", animationDelay: "360ms" }}
                        >
                          {s.description}
                        </p>

                        {s.href && (
                          <a
                            href={s.href}
                            className="byf-focus group/link mt-8 inline-flex items-center gap-2 text-sm"
                            style={{
                              color: "#d4a574",
                              fontFamily: "'Inter Tight', Inter, sans-serif",
                              letterSpacing: "0.02em",
                            }}
                          >
                            View full case study
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Prev / Next arrows */}
          <button
            ref={prevBtnRef}
            onClick={() => { userInteracted.current = true; prev(); }}
            aria-label="Previous story"
            className="byf-focus absolute top-1/2 -translate-y-1/2 left-4 md:left-2 h-11 w-11 rounded-full grid place-items-center opacity-0 group-hover:opacity-100"
            style={{
              border: "1px solid rgba(212,165,116,0.4)",
              background: "rgba(10,10,11,0.5)",
              backdropFilter: "blur(10px)",
              color: "#d4a574",
              transform: `translate(${magnet.prev.x}px, calc(-50% + ${magnet.prev.y}px))`,
              transition: reduced
                ? "opacity 400ms"
                : `opacity 400ms ${EASE}, transform 300ms ${EASE}`,
            }}
          >
            <ArrowRight className="h-4 w-4" style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            ref={nextBtnRef}
            onClick={() => { userInteracted.current = true; next(); }}
            aria-label="Next story"
            className="byf-focus absolute top-1/2 -translate-y-1/2 right-[10%] md:right-[9%] h-11 w-11 rounded-full grid place-items-center opacity-0 group-hover:opacity-100"
            style={{
              border: "1px solid rgba(212,165,116,0.4)",
              background: "rgba(10,10,11,0.5)",
              backdropFilter: "blur(10px)",
              color: "#d4a574",
              transform: `translate(${magnet.next.x}px, calc(-50% + ${magnet.next.y}px))`,
              transition: reduced
                ? "opacity 400ms"
                : `opacity 400ms ${EASE}, transform 300ms ${EASE}`,
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Pagination with progress fill */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {STORIES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                onClick={() => { userInteracted.current = true; goTo(i); }}
                aria-label={`Go to story ${s.id}`}
                className="byf-focus relative"
                style={{
                  height: "1px",
                  width: isActive ? 48 : 24,
                  background: "rgba(184,184,190,0.3)",
                  transition: `width 600ms ${EASE}`,
                }}
              >
                {isActive && (
                  <span
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${progress}%`,
                      background: "#d4a574",
                      transition: "width 120ms linear",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientStories;
