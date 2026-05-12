import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Globe,
  Hammer,
  Layers,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import {
  recommend,
  type Marketing,
  type WizardAnswers,
} from "./PlanFinderWizard.recommend";

interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const siteOptions: Option<NonNullable<WizardAnswers["site"]>>[] = [
  { value: "landing", label: "Single landing page", hint: "Fast, focused, one story", icon: Target },
  { value: "small", label: "Small business", hint: "3 to 5 polished pages", icon: Globe },
  { value: "content", label: "Content rich", hint: "6 to 12 pages or a blog", icon: Layers },
  { value: "ecom", label: "E-commerce or booking", hint: "Sell or schedule online", icon: ShoppingBag },
];

const goalOptions: Option<NonNullable<WizardAnswers["goal"]>>[] = [
  { value: "local", label: "Get found locally" },
  { value: "leads", label: "Generate leads" },
  { value: "sell", label: "Sell online" },
  { value: "credibility", label: "Build credibility" },
];

const brandOptions: Option<NonNullable<WizardAnswers["brand"]>>[] = [
  { value: "ready", label: "Logo and colors set" },
  { value: "logo-only", label: "Just a logo so far" },
  { value: "refresh", label: "Needs a refresh" },
  { value: "scratch", label: "Starting from scratch" },
];

const marketingOptions: Option<Marketing>[] = [
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social and ads" },
  { value: "content", label: "Content and photography" },
  { value: "none", label: "Just keep it running" },
];

const timelineOptions: Option<NonNullable<WizardAnswers["timeline"]>>[] = [
  { value: "asap", label: "ASAP, under 2 weeks" },
  { value: "2-4w", label: "2 to 4 weeks" },
  { value: "1-2m", label: "1 to 2 months" },
  { value: "flex", label: "Flexible" },
];

const budgetLabels = ["Lean", "Balanced", "Premium"];

type StepId = "site" | "goal" | "brand" | "marketing" | "plan";
const STEPS: { id: StepId; title: string; eyebrow: string }[] = [
  { id: "site", eyebrow: "Step 01", title: "What kind of site do you need?" },
  { id: "goal", eyebrow: "Step 02", title: "What is the main goal?" },
  { id: "brand", eyebrow: "Step 03", title: "Where is your brand today?" },
  { id: "marketing", eyebrow: "Step 04", title: "Need ongoing marketing help?" },
  { id: "plan", eyebrow: "Step 05", title: "Timeline and budget comfort" },
];

const initialAnswers: WizardAnswers = { marketing: [], budget: 1 };

export const PlanFinderWizard = () => {
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(initialAnswers);
  const [showResult, setShowResult] = useState(false);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const canAdvance = useMemo(() => {
    switch (step.id) {
      case "site":
        return !!answers.site;
      case "goal":
        return !!answers.goal;
      case "brand":
        return !!answers.brand;
      case "marketing":
        return answers.marketing.length > 0;
      case "plan":
        return !!answers.timeline;
    }
  }, [step.id, answers]);

  const recommendation = useMemo(() => recommend(answers), [answers]);

  const progress = ((stepIndex + (showResult ? 1 : 0)) / STEPS.length) * 100;

  const reset = () => {
    setAnswers(initialAnswers);
    setStepIndex(0);
    setShowResult(false);
  };

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLast) {
      setShowResult(true);
    } else {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const toggleMarketing = (v: Marketing) => {
    setAnswers((a) => {
      // "none" is exclusive
      if (v === "none") return { ...a, marketing: a.marketing.includes("none") ? [] : ["none"] };
      const without = a.marketing.filter((m) => m !== "none");
      return {
        ...a,
        marketing: without.includes(v) ? without.filter((m) => m !== v) : [...without, v],
      };
    });
  };

  const startWithPlan = () => {
    const lines = [recommendation.build, recommendation.care, ...recommendation.addons];
    const existingIds = new Set(items.map((i) => i.id));
    lines.forEach((l) => {
      if (!existingIds.has(l.id)) {
        addItem({ id: l.id, name: l.name, price: l.price, category: l.category });
      }
    });
    toast({
      title: "Plan added to your request",
      description: `${recommendation.build.name} build, ${recommendation.care.name}, and ${recommendation.addons.length} add-on${recommendation.addons.length === 1 ? "" : "s"}.`,
    });
    window.location.href = "/contact";
  };

  return (
    <section className="relative pt-4 pb-24 md:pt-6 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[820px] bg-primary/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[280px] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Progress rail */}
          <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Wand2 className="h-3.5 w-3.5 text-accent" />
              {showResult ? "Recommendation" : step.eyebrow}
            </span>
            <span className="text-accent">
              {showResult ? "Ready" : `${stepIndex + 1} / ${STEPS.length}`}
            </span>
          </div>
          <div className="relative h-px w-full bg-border overflow-hidden rounded-full mb-6">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-accent to-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Wizard card */}
          <div className="relative rounded-2xl border border-border bg-card/40 backdrop-blur shadow-elegant overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            <AnimatePresence mode="wait" initial={false}>
              {!showResult ? (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 md:p-10"
                >
                  <h2 className="font-display text-2xl md:text-4xl font-light leading-tight mb-6">
                    {step.title}
                    <span className="text-accent">.</span>
                  </h2>
                  {step.id === "marketing" && (
                    <p className="text-sm text-muted-foreground -mt-3 mb-6">
                      Select any that apply.
                    </p>
                  )}

                  {/* Step body */}
                  {step.id === "site" && (
                    <OptionGrid
                      options={siteOptions}
                      value={answers.site}
                      onChange={(v) => setAnswers((a) => ({ ...a, site: v }))}
                    />
                  )}
                  {step.id === "goal" && (
                    <OptionGrid
                      options={goalOptions}
                      value={answers.goal}
                      onChange={(v) => setAnswers((a) => ({ ...a, goal: v }))}
                    />
                  )}
                  {step.id === "brand" && (
                    <OptionGrid
                      options={brandOptions}
                      value={answers.brand}
                      onChange={(v) => setAnswers((a) => ({ ...a, brand: v }))}
                    />
                  )}
                  {step.id === "marketing" && (
                    <OptionGrid
                      options={marketingOptions}
                      value={undefined}
                      multiSelected={answers.marketing}
                      onChange={(v) => toggleMarketing(v as Marketing)}
                    />
                  )}
                  {step.id === "plan" && (
                    <div className="space-y-8">
                      <OptionGrid
                        options={timelineOptions}
                        value={answers.timeline}
                        onChange={(v) => setAnswers((a) => ({ ...a, timeline: v }))}
                      />
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Monthly comfort
                          </span>
                          <span className="text-xs text-accent uppercase tracking-[0.2em]">
                            {budgetLabels[answers.budget]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={2}
                          step={1}
                          value={answers.budget}
                          onChange={(e) =>
                            setAnswers((a) => ({ ...a, budget: Number(e.target.value) }))
                          }
                          className="w-full accent-[hsl(var(--accent))]"
                          aria-label="Monthly budget comfort"
                        />
                        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                          <span>$19</span>
                          <span>$59</span>
                          <span>Custom</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 md:p-10"
                >
                  <div className="flex items-start gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center shadow-glow shrink-0">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-accent mb-1">
                        Your tailored plan
                      </div>
                      <h2 className="font-display text-2xl md:text-4xl font-light leading-tight">
                        {recommendation.build.name} build with {recommendation.care.name}
                        <span className="text-accent">.</span>
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">{recommendation.summary}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <RecCard
                      eyebrow="Part 1 · Build"
                      icon={<Hammer className="h-4 w-4 text-primary" />}
                      title={recommendation.build.name}
                      price={recommendation.build.price}
                      rationale={recommendation.build.rationale}
                      tone="primary"
                    />
                    <RecCard
                      eyebrow="Part 2 · Care"
                      icon={<Compass className="h-4 w-4 text-accent" />}
                      title={recommendation.care.name}
                      price={recommendation.care.price}
                      rationale={recommendation.care.rationale}
                      tone="accent"
                    />
                  </div>

                  {recommendation.addons.length > 0 && (
                    <div className="mb-8">
                      <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                        Recommended add-ons
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {recommendation.addons.map((a) => (
                          <li
                            key={a.id}
                            className="rounded-xl border border-border/70 bg-card/50 p-4"
                          >
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                              <span className="font-display text-base">{a.name}</span>
                              <span className="text-xs text-accent font-mono">{a.price}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {a.rationale}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="hero" size="lg" onClick={startWithPlan} className="flex-1">
                      Start a project with this plan <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="lg" onClick={reset}>
                      <RotateCcw className="h-4 w-4" />
                      Start over
                    </Button>
                  </div>

                  <div className="mt-6 text-xs text-muted-foreground">
                    Need something different?{" "}
                    <Link to="/contact" className="text-accent underline-offset-4 hover:underline">
                      Request a custom quote
                    </Link>
                    .
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer nav */}
            {!showResult && (
              <div className="flex items-center justify-between gap-3 border-t border-border/60 px-6 md:px-10 py-4 bg-background/40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="hidden sm:flex items-center gap-1.5">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.id}
                      className={cn(
                        "h-1.5 w-6 rounded-full transition-colors",
                        i < stepIndex
                          ? "bg-accent"
                          : i === stepIndex
                          ? "bg-accent/70"
                          : "bg-border"
                      )}
                    />
                  ))}
                </div>
                <Button variant="hero" size="sm" onClick={handleNext} disabled={!canAdvance}>
                  {isLast ? "See my plan" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            {showResult && (
              <div className="flex items-center justify-between gap-3 border-t border-border/60 px-6 md:px-10 py-4 bg-background/40">
                <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Tweak answers
                </Button>
                <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground hidden sm:block">
                  Plan ready
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

interface OptionGridProps<T extends string> {
  options: Option<T>[];
  value?: T;
  multiSelected?: T[];
  onChange: (v: T) => void;
}

function OptionGrid<T extends string>({ options, value, multiSelected, onChange }: OptionGridProps<T>) {
  const isMulti = !!multiSelected;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {options.map((o) => {
        const Icon = o.icon;
        const selected = isMulti ? multiSelected!.includes(o.value) : value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "group relative text-left rounded-xl border p-4 md:p-5 transition-all duration-300 outline-none overflow-hidden",
              "hover:-translate-y-0.5",
              selected
                ? "border-accent/70 bg-accent/10 ring-1 ring-accent/40 shadow-gold"
                : "border-border bg-card/40 hover:border-accent/40 hover:bg-card/60"
            )}
            aria-pressed={selected}
          >
            <div className="flex items-start gap-3">
              {Icon && (
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg grid place-items-center shrink-0 border transition-colors",
                    selected
                      ? "border-accent/60 bg-accent/15 text-accent"
                      : "border-border bg-background/60 text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <div className="flex-1">
                <div className="font-display text-base md:text-lg leading-tight">{o.label}</div>
                {o.hint && (
                  <div className="text-xs text-muted-foreground mt-1">{o.hint}</div>
                )}
              </div>
              <span
                className={cn(
                  "h-5 w-5 rounded-full grid place-items-center shrink-0 border transition-all",
                  selected
                    ? "border-accent bg-accent text-accent-foreground scale-100"
                    : "border-border bg-transparent scale-90 opacity-60"
                )}
              >
                {selected && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface RecCardProps {
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  price: string;
  rationale: string;
  tone: "primary" | "accent";
}

const RecCard = ({ eyebrow, icon, title, price, rationale, tone }: RecCardProps) => (
  <div
    className={cn(
      "rounded-xl border p-5 bg-card/50",
      tone === "primary" ? "border-primary/30" : "border-accent/40"
    )}
  >
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {icon}
        {eyebrow}
      </div>
      <span className="text-xs font-mono text-accent">{price}</span>
    </div>
    <div className="font-display text-2xl font-light mb-2">{title}</div>
    <p className="text-sm text-muted-foreground leading-relaxed">{rationale}</p>
  </div>
);
