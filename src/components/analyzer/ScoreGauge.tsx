import { useEffect, useState } from "react";

interface Props {
  score: number;
  size?: number;
}

export const ScoreGauge = ({ score, size = 220 }: Props) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const color =
    score >= 90
      ? "hsl(var(--primary))"
      : score >= 70
        ? "hsl(42 90% 55%)"
        : score >= 50
          ? "hsl(25 90% 55%)"
          : "hsl(var(--destructive))";

  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - display / 100);

  return (
    <div
      className="relative w-full"
      style={{ maxWidth: size, aspectRatio: "1 / 1" }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-5xl md:text-6xl font-medium" style={{ color }}>
          {display}
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
          out of 100
        </div>
      </div>
    </div>
  );
};
