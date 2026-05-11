import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

interface Props {
  variant?: "hero" | "page";
  initialUrl?: string;
}

export const AnalyzerWidget = ({ variant = "hero", initialUrl = "" }: Props) => {
  const [url, setUrl] = useState(initialUrl);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    navigate(`/analyze?url=${encodeURIComponent(trimmed)}`);
  };

  const isPage = variant === "page";

  return (
    <div
      className={
        isPage
          ? "w-full"
          : "mt-10 pt-10 border-t border-border/50 max-w-2xl animate-fade-up"
      }
      style={!isPage ? { animationDelay: "0.35s" } : undefined}
    >
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 border border-accent/30 bg-accent/5">
        <Sparkles className="h-3 w-3 text-accent" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
          Free Website Audit
        </span>
      </div>

      {!isPage && (
        <p className="text-sm md:text-base text-muted-foreground mb-5 max-w-xl">
          See how your website scores in 10 seconds, free, instant, no email required.
        </p>
      )}

      <div
        className={
          isPage
            ? ""
            : "rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-6 md:p-7"
        }
      >
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourbusiness.com"
            className="flex-1 h-12 rounded-full bg-background/60 border border-border px-5 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
            aria-label="Website URL"
          />
          <button
            type="submit"
            className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-medium text-sm md:text-base hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Analyze My Site <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        {!isPage && (
          <p className="mt-4 text-xs text-muted-foreground/70">
            Used by 100+ businesses in Miami and beyond.
          </p>
        )}
      </div>
    </div>
  );
};
