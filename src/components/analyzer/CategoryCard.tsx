import { useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";

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
  score: number | null;
  max: number;
  checks: CheckItem[];
  vitals?: Record<string, any>;
  unavailable?: boolean;
}

const summary = (score: number | null, max: number, unavailable?: boolean) => {
  if (unavailable) return "Performance data temporarily unavailable.";
  if (score === null) return "";
  const pct = score / max;
  if (pct >= 0.9) return "Excellent, almost nothing to fix here.";
  if (pct >= 0.7) return "Good, a few small wins available.";
  if (pct >= 0.5) return "Needs work, several gaps to close.";
  return "Critical gaps holding this site back.";
};

const barColor = (score: number | null, max: number) => {
  if (score === null) return "bg-border";
  const pct = score / max;
  if (pct >= 0.9) return "bg-primary";
  if (pct >= 0.7) return "bg-accent";
  if (pct >= 0.5) return "bg-orange-500";
  return "bg-destructive";
};

export const CategoryCard = ({ icon, title, score, max, checks, vitals, unavailable }: Props) => {
  const [open, setOpen] = useState(false);
  const pct = score !== null ? (score / max) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 transition hover:border-primary/30">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl" aria-hidden>{icon}</div>
          <div>
            <h3 className="font-display text-lg font-medium leading-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {summary(score, max, unavailable)}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-2xl font-medium">
            {unavailable ? "—" : score}
            <span className="text-sm text-muted-foreground font-normal">/{max}</span>
          </div>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-border overflow-hidden mb-4">
        <div
          className={`h-full ${barColor(score, max)} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>

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
          {vitals && Object.keys(vitals).length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-border">
              {vitals.fcp != null && <Vital label="FCP" value={`${vitals.fcp}s`} />}
              {vitals.lcp != null && <Vital label="LCP" value={`${vitals.lcp}s`} />}
              {vitals.tbt != null && <Vital label="TBT" value={`${vitals.tbt}ms`} />}
              {vitals.speedIndex != null && <Vital label="Speed Index" value={`${vitals.speedIndex}s`} />}
            </div>
          )}
          {checks.map((c) => (
            <div key={c.id} className="flex items-start gap-2 text-sm">
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
