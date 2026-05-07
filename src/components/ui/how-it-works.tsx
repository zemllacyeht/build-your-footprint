import { cn } from "@/lib/utils";
import { Compass, PenTool, Code2, Lock, Rocket, Check, ArrowRight, Sparkles, Star, Footprints, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  /** tailwind class for the colored vertical tab and accent dot */
  tabClass: string;
  /** tailwind text color for tab label and underline */
  tabTextClass: string;
  details: {
    overview: string;
    deliverables: string[];
    timeline: string;
  };
}

interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {}

const steps: Step[] = [
  {
    icon: <Compass className="h-6 w-6" strokeWidth={1.5} />,
    title: "Discover",
    description:
      "Fill out the inquiry form and tell us about your business, including your vision, goals, audience, and inspiration. This is where we get to know you and your brand identity.",
    benefits: ["Strategy call and intake", "Goals and audience defined", "Scope and timeline mapped"],
    tabClass: "bg-accent/80",
    tabTextClass: "text-accent-foreground",
    details: {
      overview:
        "Every project starts with a focused discovery session. We dig into your business model, ideal customer, and the outcomes a website needs to drive. You leave with clarity on scope, budget, and timeline before a single pixel is designed.",
      deliverables: [
        "60 minute strategy call",
        "Brand and audience brief",
        "Sitemap and content plan",
        "Phased project timeline",
      ],
      timeline: "Week 1",
    },
  },
  {
    icon: <PenTool className="h-6 w-6" strokeWidth={1.5} />,
    title: "Design",
    description:
      "Custom mockups land in your private portal. Approve sections in real time as bespoke visual direction takes shape, page by page, with no templates and no guesswork.",
    benefits: ["Bespoke visual direction", "Inline feedback and revisions", "Approve sections as you go"],
    tabClass: "bg-primary/70",
    tabTextClass: "text-primary-foreground",
    details: {
      overview:
        "We design every page from scratch around your brand, never templates. Mockups land in your private portal where you can leave inline comments. We iterate until each section feels right, then lock it for build.",
      deliverables: [
        "Moodboard and visual direction",
        "Full page mockups, desktop and mobile",
        "Two rounds of revisions per page",
        "Final approved design system",
      ],
      timeline: "Weeks 1 to 2",
    },
  },
  {
    icon: <Code2 className="h-6 w-6" strokeWidth={1.5} />,
    title: "Build",
    description:
      "Approved designs become production code, hand built for performance. Semantic markup, accessible components, and integrations baked in so the site loads fast and ranks well.",
    benefits: ["Performance first code", "Responsive on every device", "SEO foundations baked in"],
    tabClass: "bg-secondary",
    tabTextClass: "text-secondary-foreground",
    details: {
      overview:
        "Approved designs become production code, hand built for performance. We ship semantic markup, accessible components, and a CMS or form integrations so you can update content without touching code.",
      deliverables: [
        "Hand coded responsive build",
        "On page SEO and metadata",
        "Analytics and form integrations",
        "Cross browser QA",
      ],
      timeline: "Weeks 2 to 4",
    },
  },
  {
    icon: <Lock className="h-6 w-6" strokeWidth={1.5} />,
    title: "Preview",
    description:
      "Your private hub is the single source of truth. Preview the live build, leave page level comments, approve milestones, and pay invoices behind a secure login we provision for you.",
    benefits: ["Live previews any time", "Comments and approvals", "Secure invoicing built in"],
    tabClass: "bg-accent/60",
    tabTextClass: "text-accent-foreground",
    details: {
      overview:
        "Your private hub is the single source of truth for the project. Preview the live build, leave page level comments, approve milestones, and pay invoices, all behind a secure login we provision for you.",
      deliverables: [
        "Password protected client portal",
        "Live preview environment",
        "Comment and approval workflow",
        "Secure invoicing and receipts",
      ],
      timeline: "Active throughout",
    },
  },
  {
    icon: <Rocket className="h-6 w-6" strokeWidth={1.5} />,
    title: "Launch",
    description:
      "Launch day is a non event because we plan it. We handle DNS, SSL, redirects, and post launch monitoring, then keep the site fast and updated as your business grows.",
    benefits: ["Smooth launch coordination", "Hosting and domain managed", "Ongoing care included"],
    tabClass: "bg-primary/90",
    tabTextClass: "text-primary-foreground",
    details: {
      overview:
        "Launch day is a non event because we plan it. We handle DNS, SSL, redirects, and post launch monitoring. From there, ongoing care keeps the site fast, secure, and updated as your business grows.",
      deliverables: [
        "DNS, SSL, and redirect setup",
        "Post launch performance audit",
        "Managed hosting and backups",
        "Monthly care and small edits",
      ],
      timeline: "Week 4 onward",
    },
  },
];

/** Symbols that follow the cursor inside the active panel. */
const trailIcons = [
  { Icon: Sparkles, color: "text-accent" },
  { Icon: Footprints, color: "text-primary" },
  { Icon: Star, color: "text-accent-glow" },
  { Icon: Zap, color: "text-primary-glow" },
];

interface TrailDot {
  id: number;
  x: number;
  y: number;
  iconIndex: number;
}

const CursorTrail: React.FC<{ active: boolean }> = ({ active }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<TrailDot[]>([]);
  const idRef = useRef(0);
  const lastEmit = useRef(0);
  const iconCursor = useRef(0);

  useEffect(() => {
    if (!active) {
      setDots([]);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastEmit.current < 55) return;
      lastEmit.current = now;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++idRef.current;
      const iconIndex = iconCursor.current++ % trailIcons.length;
      setDots((prev) => [...prev.slice(-10), { id, x, y, iconIndex }]);
      window.setTimeout(() => {
        setDots((prev) => prev.filter((d) => d.id !== id));
      }, 900);
    };

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {dots.map((d) => {
        const { Icon, color } = trailIcons[d.iconIndex];
        return (
          <span
            key={d.id}
            className={cn("absolute -translate-x-1/2 -translate-y-1/2 animate-trail", color)}
            style={{ left: d.x, top: d.y }}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
        );
      })}
    </div>
  );
};

interface VerticalTabProps {
  step: Step;
  index: number;
  total: number;
  isActive: boolean;
  onActivate: () => void;
}

const VerticalTab: React.FC<VerticalTabProps> = ({ step, index, total, isActive, onActivate }) => (
  <button
    onMouseEnter={onActivate}
    onFocus={onActivate}
    onClick={onActivate}
    aria-label={`Step ${index + 1}: ${step.title}`}
    aria-pressed={isActive}
    className={cn(
      "group relative flex flex-col items-center justify-between py-6 w-12 md:w-16 shrink-0 border-r border-border/40 last:border-r-0 transition-all duration-500 outline-none",
      isActive ? step.tabClass : "bg-card/30 hover:bg-card/60"
    )}
  >
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
        isActive ? step.tabTextClass : "text-muted-foreground"
      )}
    >
      0{index + 1}
    </span>
    <span
      className={cn(
        "font-display text-lg md:text-xl tracking-wide [writing-mode:vertical-rl] rotate-180 transition-colors",
        isActive ? step.tabTextClass : "text-foreground/70 group-hover:text-foreground"
      )}
    >
      {step.title}
    </span>
    <ArrowRight
      className={cn(
        "h-4 w-4 -rotate-90 transition-all",
        isActive ? cn(step.tabTextClass, "translate-y-0 opacity-100") : "text-muted-foreground/50 opacity-60"
      )}
    />
  </button>
);

export const HowItWorks: React.FC<HowItWorksProps> = ({ className, ...props }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDetails, setOpenDetails] = useState(false);
  const active = steps[activeIndex];

  return (
    <section
      className={cn(
        "py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-background via-card/20 to-background",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container">
        {/* Progress rail */}
        <div className="mb-10 md:mb-14 max-w-4xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Step {String(activeIndex + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")}
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-accent">{active.title}</span>
          </div>
          <div className="relative h-px w-full bg-border overflow-hidden rounded-full">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/60 via-accent to-primary transition-[width] duration-700 ease-out"
              style={{
                width: `${steps.length <= 1 ? 100 : (activeIndex / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Tabbed panel */}
        <div className="relative rounded-2xl border border-border bg-card/30 backdrop-blur overflow-hidden shadow-elegant">
          <div className="flex min-h-[460px] md:min-h-[520px]">
            {/* Left tabs */}
            <div className="flex">
              {steps.slice(0, Math.ceil(steps.length / 2)).map((s, i) => (
                <VerticalTab
                  key={s.title}
                  step={s}
                  index={i}
                  total={steps.length}
                  isActive={activeIndex === i}
                  onActivate={() => setActiveIndex(i)}
                />
              ))}
            </div>

            {/* Center content */}
            <div className="relative flex-1 px-6 py-10 md:px-14 md:py-16">
              <CursorTrail active key={activeIndex} />

              <div className="relative max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl border border-accent/40 bg-accent/10 grid place-items-center text-accent">
                    {active.icon}
                  </div>
                  <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-mono">
                    {active.details.timeline}
                  </div>
                </div>

                <h3 className="font-display text-4xl md:text-6xl font-light leading-[1.05] mb-6">
                  {active.title}
                  <span className="text-accent">.</span>
                </h3>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                  {active.description}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {active.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 h-4 w-4 rounded-full bg-accent/15 grid place-items-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-accent" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/85">{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setOpenDetails(true)}
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-accent hover:gap-3 transition-all"
                >
                  View full details <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Decorative brand dots in the corners */}
              <span className="absolute top-8 right-10 h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="absolute top-20 right-24 h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="absolute bottom-12 right-16 h-2 w-2 rounded-full bg-accent-glow" />
            </div>

            {/* Right tabs */}
            <div className="flex">
              {steps.slice(Math.ceil(steps.length / 2)).map((s, i) => {
                const realIndex = i + Math.ceil(steps.length / 2);
                return (
                  <VerticalTab
                    key={s.title}
                    step={s}
                    index={realIndex}
                    total={steps.length}
                    isActive={activeIndex === realIndex}
                    onActivate={() => setActiveIndex(realIndex)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-xl border border-accent/40 bg-accent/10 grid place-items-center text-accent">
                {active.icon}
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-mono">
                  Step 0{activeIndex + 1} · {active.details.timeline}
                </div>
                <DialogTitle className="font-display text-2xl md:text-3xl font-light leading-tight">
                  {active.title}
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed pt-2">
              {active.details.overview}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-3">What you get</div>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {active.details.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2.5 text-sm rounded-lg border border-border/60 bg-card/40 px-3 py-2.5"
                >
                  <span className="mt-0.5 h-4 w-4 rounded-full bg-accent/15 grid place-items-center shrink-0">
                    <Check className="h-2.5 w-2.5 text-accent" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/85">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
