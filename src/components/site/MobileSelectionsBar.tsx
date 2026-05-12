import { useEffect, useState } from "react";
import { ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

export const MobileSelectionsBar = () => {
  const { items, removeItem } = useCart();
  const [hidden, setHidden] = useState(false);

  const selections = items.filter(
    (i) =>
      i.category === "Build package" ||
      i.category === "Care plan" ||
      i.category === "Add-on",
  );

  // Hide bar when the Contact section is in view (so it doesn't double up
  // with the in-form "Your selections" panel).
  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (selections.length === 0 || hidden) return null;

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.href = "/contact#contact";
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-[90] pointer-events-none">
      <div className="pointer-events-auto mx-3 mb-3 rounded-2xl border border-accent/40 bg-background/85 backdrop-blur-xl shadow-elegant p-3 animate-fade-up">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-accent font-mono">
            Your selections ({selections.length})
          </span>
          <Button
            size="sm"
            variant="hero"
            onClick={scrollToContact}
            className="h-8 px-3 text-xs"
          >
            Review & send
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-thin">
          {selections.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-accent/40 bg-background/60 px-2.5 py-1 text-[11px]"
            >
              <span className="text-foreground/90 whitespace-nowrap">{s.name}</span>
              <button
                type="button"
                aria-label={`Remove ${s.name}`}
                onClick={() => removeItem(s.id)}
                className="text-muted-foreground hover:text-destructive transition"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
