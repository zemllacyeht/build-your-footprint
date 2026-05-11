import { useState } from "react";
import { ChevronDown, Check, X, Loader2, ArrowRight } from "lucide-react";

export interface CheckItem {
  id: string;
  name: string;
  category: string;
  points: number;
  earned: number;
  passed: boolean;
  found: string;
}

interface Props {
  icon: string;
  title: string;
  subtitle?: string;
  score: number | null;
  max: number;
  checks: CheckItem[];
  vitals?: Record<string, any>;
  unavailable?: boolean;
  unavailableReason?: string | null;
}

const summary = (score: number | null, max: number, unavailable?: boolean, reason?: string | null) => {
  if (unavailable) return reason || "Performance data temporarily unavailable.";
  if (score === null) return "";
  const pct = score / max;
  if (pct >= 0.9) return "Excellent, almost nothing to fix here.";
  if (pct >= 0.7) return "Good, a few small wins available.";
  if (pct >= 0.5) return "Needs work, several gaps to close.";
  return "Critical gaps holding this site back.";
};

const colorTokens = (score: number | null, max: number) => {
  if (score === null) return { bar: "bg-border", glow: "transparent", text: "hsl(var(--muted-foreground))" };
  const pct = score / max;
  if (pct >= 0.9) return { bar: "bg-primary", glow: "hsl(var(--primary) / 0.55)", text: "hsl(var(--primary))" };
  if (pct >= 0.7) return { bar: "bg-accent", glow: "hsl(var(--accent) / 0.55)", text: "hsl(var(--accent))" };
  if (pct >= 0.5) return { bar: "bg-orange-500", glow: "hsl(25 90% 55% / 0.55)", text: "hsl(25 90% 55%)" };
  return { bar: "bg-destructive", glow: "hsl(var(--destructive) / 0.55)", text: "hsl(var(--destructive))" };
};

export const CategoryCard = ({ icon, title, subtitle, score, max, checks, vitals, unavailable, unavailableReason }: Props) => {
  const [open, setOpen] = useState(false);
  const pct = score !== null ? (score / max) * 100 : 0;
  const tokens = colorTokens(score, max);
  const hasVitals = vitals && Object.values(vitals).some((v) => v != null);

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-7 md:p-8 transition hover:border-primary/30">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-2xl shrink-0" aria-hidden>{icon}</div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-medium leading-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              {unavailable ? (unavailableReason || "Speed data temporarily unavailable") : (subtitle || summary(score, max, unavailable, unavailableReason))}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div
            className="font-display font-medium tabular-nums leading-none"
            style={{ fontSize: "2.25rem", color: tokens.text }}
          >
            {unavailable ? "—" : score}
            <span className="text-base text-muted-foreground font-normal">/{max}</span>
          </div>
        </div>
      </div>

      <div className="h-2 rounded-full bg-border/60 overflow-hidden mb-5">
        <div
          className={`h-full ${tokens.bar} transition-all duration-700 rounded-full`}
          style={{
            width: `${pct}%`,
            boxShadow: !unavailable ? `0 0 12px ${tokens.glow}` : undefined,
          }}
        />
      </div>

      {unavailable && hasVitals && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          {vitals!.fcp != null && <Vital label="FCP" value={`${vitals!.fcp}s`} />}
          {vitals!.lcp != null && <Vital label="LCP" value={`${vitals!.lcp}s`} />}
          {vitals!.tbt != null && <Vital label="TBT" value={`${vitals!.tbt}ms`} />}
          {vitals!.speedIndex != null && <Vital label="Speed Index" value={`${vitals!.speedIndex}s`} />}
        </div>
      )}

      {!unavailable && (
        <button
          onClick={() => setOpen(!open)}
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition"
        >
          {open ? "Hide details" : "View details"}
          <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} />
        </button>
      )}

      {open && !unavailable && (
        <div className="mt-4 space-y-2 animate-fade-in">
          {hasVitals && (
            <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-border">
              {vitals!.fcp != null && <Vital label="FCP" value={`${vitals!.fcp}s`} />}
              {vitals!.lcp != null && <Vital label="LCP" value={`${vitals!.lcp}s`} />}
              {vitals!.tbt != null && <Vital label="TBT" value={`${vitals!.tbt}ms`} />}
              {vitals!.speedIndex != null && <Vital label="Speed Index" value={`${vitals!.speedIndex}s`} />}
            </div>
          )}
          {checks.map((c) => (
            <div key={c.id} className="flex items-start gap-2 text-sm py-1">
              {c.passed ? (
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              ) : (
                <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="text-foreground/90">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.found}</div>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {c.earned}/{c.points}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Vital = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    <div className="font-display text-base">{value}</div>
  </div>
);
