// Build Your Footprint - Website Speed (PSI) analyzer
// Runs Google PageSpeed Insights with desktop-first, fallback to default.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Check = {
  id: string;
  name: string;
  category: "performance";
  points: number;
  earned: number;
  passed: boolean;
  priority: "critical" | "important" | "minor";
  whyItMatters: string;
  found: string;
  howToFix: string;
};

function normalizeUrl(input: string): string {
  let u = (input || "").trim();
  if (!u) throw new Error("EMPTY_URL");
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  const parsed = new URL(u);
  if (!parsed.hostname.includes(".")) throw new Error("INVALID_URL");
  return parsed.toString();
}

async function fetchPsi(url: string, apiKey: string): Promise<any | null> {
  // Try desktop first (faster than mobile by 3-4x)
  const desktopUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&category=performance&key=${apiKey}`;
  console.error("[psi] attempting desktop:", desktopUrl.replace(apiKey, "***"));
  try {
    const r = await fetch(desktopUrl, { signal: AbortSignal.timeout(30000) });
    console.error("[psi] desktop status:", r.status);
    if (r.ok) return await r.json();
    const body = await r.text().catch(() => "");
    console.error("[psi] desktop failed body:", body.slice(0, 300));
  } catch (e) {
    console.error("[psi] desktop error:", String(e));
  }

  // Fallback: simpler request, no category filter
  const fallbackUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`;
  console.error("[psi] attempting fallback:", fallbackUrl.replace(apiKey, "***"));
  try {
    const r = await fetch(fallbackUrl, { signal: AbortSignal.timeout(20000) });
    console.error("[psi] fallback status:", r.status);
    if (r.ok) return await r.json();
    const body = await r.text().catch(() => "");
    console.error("[psi] fallback failed body:", body.slice(0, 300));
  } catch (e) {
    console.error("[psi] fallback error:", String(e));
  }

  return null;
}

function buildPerfChecks(psi: any): { checks: Check[]; vitals: Record<string, any>; score: number } {
  const lh = psi.lighthouseResult || {};
  const audits = lh.audits || {};
  const score = Math.round((lh.categories?.performance?.score ?? 0) * 100);
  const fcp = audits["first-contentful-paint"]?.numericValue ?? null;
  const lcp = audits["largest-contentful-paint"]?.numericValue ?? null;
  const tbt = audits["total-blocking-time"]?.numericValue ?? null;
  const si = audits["speed-index"]?.numericValue ?? null;

  const psiPts = score >= 90 ? 10 : score >= 70 ? 7 : score >= 50 ? 4 : 1;

  const checks: Check[] = [
    {
      id: "perf-psi",
      name: "Your website is too slow",
      category: "performance",
      points: 10,
      earned: psiPts,
      passed: score >= 70,
      priority: score < 50 ? "critical" : "important",
      whyItMatters:
        "More than half of visitors leave a website that takes over 3 seconds to load. Every second of delay costs you customers.",
      found: `Your site scored ${score}/100 for speed`,
      howToFix: "Optimize images, clean up code, and upgrade hosting to cut your load time in half.",
    },
    {
      id: "perf-fcp",
      name: "Customers wait too long to see anything",
      category: "performance",
      points: 5,
      earned: fcp !== null && fcp < 1800 ? 5 : 0,
      passed: fcp !== null && fcp < 1800,
      priority: "important",
      whyItMatters:
        "The longer someone stares at a blank screen, the more likely they are to leave. First impressions happen in milliseconds.",
      found: fcp !== null ? `Your site takes ${(fcp / 1000).toFixed(2)}s to show the first content (ideal: under 1.8s)` : "Speed data unavailable",
      howToFix: "Optimize your above-the-fold content to load first before everything else.",
    },
    {
      id: "perf-lcp",
      name: "Your main content loads too slowly",
      category: "performance",
      points: 5,
      earned: lcp !== null && lcp < 2500 ? 5 : 0,
      passed: lcp !== null && lcp < 2500,
      priority: "critical",
      whyItMatters:
        "Google measures how long it takes for your biggest element, usually your hero image or headline, to appear. Slow here means lower ranking.",
      found: lcp !== null ? `Your main content takes ${(lcp / 1000).toFixed(2)}s to load (ideal: under 2.5s)` : "Speed data unavailable",
      howToFix: "Compress large images and remove render-blocking code from your pages.",
    },
    {
      id: "perf-tbt",
      name: "Something is freezing your website",
      category: "performance",
      points: 5,
      earned: tbt !== null && tbt < 200 ? 5 : 0,
      passed: tbt !== null && tbt < 200,
      priority: "important",
      whyItMatters:
        "When a page freezes and won't respond to taps or clicks, customers think it's broken and leave immediately.",
      found: tbt !== null ? `Your site freezes for ${Math.round(tbt)}ms (ideal: under 200ms)` : "Speed data unavailable",
      howToFix: "Remove or defer heavy JavaScript that runs before your page is ready.",
    },
  ];

  return {
    checks,
    score: checks.reduce((s, c) => s + c.earned, 0),
    vitals: {
      pagespeedScore: score,
      fcp: fcp !== null ? +(fcp / 1000).toFixed(2) : null,
      lcp: lcp !== null ? +(lcp / 1000).toFixed(2) : null,
      tbt: tbt !== null ? Math.round(tbt) : null,
      speedIndex: si !== null ? +(si / 1000).toFixed(2) : null,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl = typeof body?.url === "string" ? body.url : "";
    let url: string;
    try {
      url = normalizeUrl(rawUrl);
    } catch {
      return new Response(
        JSON.stringify({ unavailable: true, reason: "Invalid URL" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("PAGESPEED_API_KEY");
    console.error("[psi] API key present:", !!apiKey);
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          unavailable: true,
          reason: "Performance API key not configured, contact site admin",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const psi = await fetchPsi(url, apiKey);
    if (!psi) {
      return new Response(
        JSON.stringify({
          unavailable: true,
          reason: "Speed data unavailable for this site right now. Try again in a moment.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const perf = buildPerfChecks(psi);
    return new Response(
      JSON.stringify({
        unavailable: false,
        score: perf.score,
        max: 25,
        checks: perf.checks,
        vitals: perf.vitals,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("[psi] unhandled:", String(e));
    return new Response(
      JSON.stringify({
        unavailable: true,
        reason: "Speed data unavailable for this site right now. Try again in a moment.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
