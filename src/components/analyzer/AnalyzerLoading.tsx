import { useEffect, useState } from "react";

const messages = [
  "Checking SEO fundamentals...",
  "Analyzing page structure...",
  "Running performance tests...",
  "Testing mobile experience...",
  "Auditing security headers...",
  "Checking AI visibility signals...",
  "Calculating your score...",
];

export const AnalyzerLoading = ({ domain }: { domain: string }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % messages.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-8 md:p-12 text-center animate-fade-in">
      {domain && (
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
            alt=""
            className="h-4 w-4 rounded"
          />
          {domain}
        </div>
      )}

      <div className="relative h-1.5 w-full max-w-md mx-auto rounded-full bg-border overflow-hidden mb-6">
        <div className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-primary animate-[scan_1.6s_ease-in-out_infinite]" />
      </div>

      <div className="font-display text-2xl md:text-3xl mb-2">
        {messages[i]}
      </div>
      <p className="text-sm text-muted-foreground">
        This usually takes 10 to 15 seconds.
      </p>

      <style>{`
        @keyframes scan {
          0% { left: -33%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};
