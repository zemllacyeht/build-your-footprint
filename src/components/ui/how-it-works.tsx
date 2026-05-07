import { cn } from "@/lib/utils";
import { Compass, PenTool, Code2, Lock, Rocket, Check, ArrowRight } from "lucide-react";
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
    description: "We learn your brand, customers, and the impression you want to leave.",
    benefits: ["Strategy call and intake", "Goals and audience defined", "Scope and timeline mapped"],
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
    description: "Custom mockups in your private portal. Review and approve in real time.",
    benefits: ["Bespoke visual direction", "Inline feedback and revisions", "Approve sections as you go"],
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
    description: "Engineered for speed, SEO, and conversions on modern infrastructure.",
    benefits: ["Performance first code", "Responsive on every device", "SEO foundations baked in"],
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
    title: "Preview Hub",
    description: "Password-protected portal to preview, comment, and pay invoices.",
    benefits: ["Live previews any time", "Comments and approvals", "Secure invoicing built in"],
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
    title: "Launch and Grow",
    description: "We handle hosting, domains, and ongoing care so you focus on customers.",
    benefits: ["Smooth launch coordination", "Hosting and domain managed", "Ongoing care included"],
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

interface StepCardProps {
  step: Step;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onOpen: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, isActive, onActivate, onOpen, cardRef }) => (
  <div
    ref={cardRef}
    onMouseEnter={onActivate}
    onFocus={onActivate}
    onClick={onOpen}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen();
      }
    }}
    className={cn(
      "group relative flex flex-col h-full rounded-2xl border bg-card/40 backdrop-blur p-8 cursor-pointer transition-all duration-500 outline-none",
      "hover:-translate-y-1 focus-visible:-translate-y-1",
      isActive
        ? "border-accent/60 bg-card/70 shadow-elegant ring-1 ring-accent/20"
        : "border-border hover:border-accent/40"
    )}
  >
    <div className="absolute top-6 right-6 text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-mono">
      0{index}
    </div>
    <div
      className={cn(
        "h-14 w-14 rounded-xl border grid place-items-center mb-6 transition-all duration-500",
        isActive ? "border-accent/60 bg-accent/10 scale-110" : "border-accent/30 bg-accent/5"
      )}
    >
      <div className="text-accent">{step.icon}</div>
    </div>
    <h3 className="font-display text-2xl font-light mb-3 leading-tight">{step.title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.description}</p>
    <ul className="space-y-2.5 pt-6 border-t border-border/50">
      {step.benefits.map((b) => (
        <li key={b} className="flex items-start gap-2.5 text-sm">
          <span className="mt-0.5 h-4 w-4 rounded-full bg-accent/15 grid place-items-center shrink-0">
            <Check className="h-2.5 w-2.5 text-accent" strokeWidth={3} />
          </span>
          <span className="text-foreground/80">{b}</span>
        </li>
      ))}
    </ul>
    <div
      className={cn(
        "mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] transition-colors",
        isActive ? "text-accent" : "text-muted-foreground/60 group-hover:text-accent"
      )}
    >
      View details <ArrowRight className="h-3 w-3" />
    </div>
  </div>
);

export const HowItWorks: React.FC<HowItWorksProps> = ({ className, ...props }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState(0);

  // Animate progress as the active step changes
  useEffect(() => {
    const target = steps.length <= 1 ? 1 : activeIndex / (steps.length - 1);
    setProgress(target);
  }, [activeIndex]);

  // Auto-activate based on scroll position on small screens (mobile single column)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            setActiveIndex(i);
          }
        },
        { threshold: [0.55] }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const active = openIndex !== null ? steps[openIndex] : null;

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
        {/* Step indicator rail */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Step {String(activeIndex + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")}
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-accent">
              {steps[activeIndex].title}
            </span>
          </div>
          <div className="relative h-px w-full bg-border overflow-hidden rounded-full">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/60 via-accent to-accent/60 transition-[width] duration-700 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="relative mt-3 flex justify-between">
            {steps.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => setActiveIndex(i)}
                aria-label={`Go to step ${i + 1}: ${s.title}`}
                className={cn(
                  "relative h-2.5 w-2.5 rounded-full transition-all duration-300",
                  i <= activeIndex ? "bg-accent scale-110" : "bg-border hover:bg-accent/40"
                )}
              >
                {i === activeIndex && (
                  <span className="absolute inset-0 -m-1.5 rounded-full bg-accent/30 animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div ref={containerRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <StepCard
              key={s.title}
              step={s}
              index={i + 1}
              isActive={i === activeIndex}
              onActivate={() => setActiveIndex(i)}
              onOpen={() => setOpenIndex(i)}
              cardRef={(el) => (cardRefs.current[i] = el)}
            />
          ))}
        </div>
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent className="max-w-2xl">
          {active && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-12 w-12 rounded-xl border border-accent/40 bg-accent/10 grid place-items-center text-accent">
                    {active.icon}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-mono">
                      Step 0{(openIndex ?? 0) + 1} · {active.details.timeline}
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
                <div className="text-xs uppercase tracking-[0.25em] text-accent mb-3">
                  What you get
                </div>
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
