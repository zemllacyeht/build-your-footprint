// Build Your Footprint - Website Analyzer
// Runs SEO, performance (PageSpeed), AI visibility, and security checks.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Check = {
  id: string;
  name: string;
  category: "seo" | "performance" | "aiVisibility" | "security";
  points: number;
  earned: number;
  passed: boolean;
  priority: "critical" | "important" | "minor";
  whyItMatters: string;
  found: string;
  howToFix: string;
};

const FETCH_TIMEOUT_MS = 14000;

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeout = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BYFAnalyzer/1.0; +https://www.buildyourfootprint.com)",
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(t);
  }
}

function normalizeUrl(input: string): string {
  let u = (input || "").trim();
  if (!u) throw new Error("EMPTY_URL");
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  const parsed = new URL(u);
  if (!parsed.hostname.includes(".")) throw new Error("INVALID_URL");
  return parsed.toString();
}

function pickAttr(html: string, regex: RegExp): string | null {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

function parseSeo(html: string, url: string) {
  const lower = html.toLowerCase();
  const title = pickAttr(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDesc = pickAttr(
    html,
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
  ) || pickAttr(
    html,
    /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i,
  );
  const h1Matches = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || [];
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const imgsWithAlt = imgs.filter((t) => /\salt\s*=\s*["'][^"']*["']/i.test(t));
  const canonical = pickAttr(
    html,
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i,
  );

  const ogTitle = pickAttr(html, /<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
  const ogDesc = pickAttr(html, /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  const ogImage = pickAttr(html, /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
  const hasSchema = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
  const hasFaq = /faq|frequently asked/i.test(lower);

  return {
    title,
    titleLen: title ? title.length : 0,
    metaDesc,
    metaDescLen: metaDesc ? metaDesc.length : 0,
    h1Count: h1Matches.length,
    imgCount: imgs.length,
    imgsWithAltCount: imgsWithAlt.length,
    canonical,
    ogTitle,
    ogDesc,
    ogImage,
    hasSchema,
    hasFaq,
    bodyText: html.replace(/<[^>]+>/g, " ").slice(0, 5000),
    url,
  };
}

function buildSeoChecks(seo: ReturnType<typeof parseSeo>): Check[] {
  return [
    {
      id: "seo-title-exists",
      name: "Page title tag",
      category: "seo",
      points: 4,
      earned: seo.title ? 4 : 0,
      passed: !!seo.title,
      priority: "critical",
      whyItMatters:
        "The title tag is the single most important on-page SEO signal and what users see in search results.",
      found: seo.title ? `Title: "${seo.title.slice(0, 80)}"` : "No <title> tag found",
      howToFix: "Add a unique, descriptive <title> tag inside <head>.",
    },
    {
      id: "seo-title-length",
      name: "Title length 50-60 characters",
      category: "seo",
      points: 3,
      earned: seo.titleLen >= 30 && seo.titleLen <= 65 ? 3 : 0,
      passed: seo.titleLen >= 30 && seo.titleLen <= 65,
      priority: "important",
      whyItMatters: "Titles outside 50-60 characters get truncated or look thin in Google results.",
      found: `Your title is ${seo.titleLen} characters`,
      howToFix: "Rewrite the title to fit between 50 and 60 characters with your primary keyword.",
    },
    {
      id: "seo-meta-desc",
      name: "Meta description present",
      category: "seo",
      points: 4,
      earned: seo.metaDesc ? 4 : 0,
      passed: !!seo.metaDesc,
      priority: "critical",
      whyItMatters:
        "Search engines use this as your ad copy. Without it Google writes one for you, usually poorly.",
      found: seo.metaDesc ? `${seo.metaDescLen} chars` : "No meta description",
      howToFix:
        'Add <meta name="description" content="..."> with a compelling 120-160 character summary.',
    },
    {
      id: "seo-meta-desc-len",
      name: "Meta description 120-160 chars",
      category: "seo",
      points: 3,
      earned: seo.metaDescLen >= 120 && seo.metaDescLen <= 165 ? 3 : 0,
      passed: seo.metaDescLen >= 120 && seo.metaDescLen <= 165,
      priority: "important",
      whyItMatters: "Descriptions outside this range get cut off or look incomplete in search results.",
      found: `Description is ${seo.metaDescLen} characters`,
      howToFix: "Tighten the description to 120-160 characters with a clear call to action.",
    },
    {
      id: "seo-h1",
      name: "Single unique H1",
      category: "seo",
      points: 4,
      earned: seo.h1Count === 1 ? 4 : 0,
      passed: seo.h1Count === 1,
      priority: "important",
      whyItMatters: "One clear H1 tells search engines what the page is about.",
      found: `${seo.h1Count} H1 tag(s) found`,
      howToFix: "Use exactly one <h1> per page that matches the page intent.",
    },
    {
      id: "seo-img-alt",
      name: "Images have alt text",
      category: "seo",
      points: 3,
      earned:
        seo.imgCount === 0
          ? 3
          : seo.imgsWithAltCount / Math.max(seo.imgCount, 1) >= 0.8
            ? 3
            : 0,
      passed:
        seo.imgCount === 0 ||
        seo.imgsWithAltCount / Math.max(seo.imgCount, 1) >= 0.8,
      priority: "important",
      whyItMatters: "Alt text helps Google Images, accessibility, and AI crawlers understand visuals.",
      found: `${seo.imgsWithAltCount} of ${seo.imgCount} images have alt text`,
      howToFix: "Add descriptive alt attributes to every meaningful image.",
    },
    {
      id: "seo-canonical",
      name: "Canonical tag",
      category: "seo",
      points: 2,
      earned: seo.canonical ? 2 : 0,
      passed: !!seo.canonical,
      priority: "minor",
      whyItMatters: "Canonical tags prevent duplicate content issues across URL variations.",
      found: seo.canonical ? `Canonical: ${seo.canonical}` : "No canonical tag",
      howToFix: 'Add <link rel="canonical" href="..."> in <head>.',
    },
    {
      id: "seo-robots",
      name: "robots.txt accessible",
      category: "seo",
      points: 2,
      earned: 0,
      passed: false,
      priority: "minor",
      whyItMatters: "Search crawlers look for robots.txt to know what they can index.",
      found: "Pending",
      howToFix: "Create a robots.txt at the site root.",
    },
  ];
}

function buildAiChecks(seo: ReturnType<typeof parseSeo>, robots: { ok: boolean; text: string }): Check[] {
  const lowerBody = seo.bodyText.toLowerCase();
  const cityMentioned = /\b(miami|new york|los angeles|chicago|houston|austin|orlando|tampa|brooklyn|atlanta|dallas|denver|seattle|boston|phoenix|portland)\b/i.test(
    lowerBody,
  );
  const blockedAi = /(GPTBot|PerplexityBot|ClaudeBot|Google-Extended)[\s\S]*?disallow:\s*\//i.test(
    robots.text,
  );

  return [
    {
      id: "ai-og-title",
      name: "Open Graph title",
      category: "aiVisibility",
      points: 4,
      earned: seo.ogTitle ? 4 : 0,
      passed: !!seo.ogTitle,
      priority: "important",
      whyItMatters: "AI tools and social platforms use OG tags to understand and preview your page.",
      found: seo.ogTitle ? "og:title present" : "Missing og:title",
      howToFix: 'Add <meta property="og:title" content="..."> in <head>.',
    },
    {
      id: "ai-og-desc",
      name: "Open Graph description",
      category: "aiVisibility",
      points: 4,
      earned: seo.ogDesc ? 4 : 0,
      passed: !!seo.ogDesc,
      priority: "important",
      whyItMatters: "Without an OG description, AI summaries and social shares look broken.",
      found: seo.ogDesc ? "og:description present" : "Missing og:description",
      howToFix: 'Add <meta property="og:description" content="...">.',
    },
    {
      id: "ai-og-image",
      name: "Open Graph image",
      category: "aiVisibility",
      points: 3,
      earned: seo.ogImage ? 3 : 0,
      passed: !!seo.ogImage,
      priority: "minor",
      whyItMatters: "An OG image dramatically increases click-through from social and AI previews.",
      found: seo.ogImage ? "og:image present" : "Missing og:image",
      howToFix: 'Add <meta property="og:image" content="https://..."> with a 1200x630 image.',
    },
    {
      id: "ai-schema",
      name: "Schema / structured data",
      category: "aiVisibility",
      points: 5,
      earned: seo.hasSchema ? 5 : 0,
      passed: seo.hasSchema,
      priority: "critical",
      whyItMatters:
        "Structured data helps AI tools like ChatGPT understand and recommend your business.",
      found: seo.hasSchema ? "JSON-LD detected" : "No schema markup detected",
      howToFix: "Add JSON-LD structured data (Organization, LocalBusiness, FAQPage).",
    },
    {
      id: "ai-faq",
      name: "FAQ content detected",
      category: "aiVisibility",
      points: 3,
      earned: seo.hasFaq ? 3 : 0,
      passed: seo.hasFaq,
      priority: "minor",
      whyItMatters: "FAQ content matches the way people ask AI assistants questions.",
      found: seo.hasFaq ? "FAQ keywords present" : "No FAQ content found",
      howToFix: "Add a FAQ section answering common customer questions.",
    },
    {
      id: "ai-location",
      name: "Location mentioned in content",
      category: "aiVisibility",
      points: 3,
      earned: cityMentioned ? 3 : 0,
      passed: cityMentioned,
      priority: "minor",
      whyItMatters: "Local mentions help AI tools recommend your business for location-based queries.",
      found: cityMentioned ? "City mentioned in content" : "No city mentions detected",
      howToFix: "Mention the city or region you serve in your hero, footer, and key pages.",
    },
    {
      id: "ai-bots-allowed",
      name: "AI crawlers not blocked",
      category: "aiVisibility",
      points: 3,
      earned: !blockedAi ? 3 : 0,
      passed: !blockedAi,
      priority: "important",
      whyItMatters:
        "If you block GPTBot or PerplexityBot you become invisible to ChatGPT and Perplexity.",
      found: blockedAi ? "AI bots blocked in robots.txt" : "AI bots allowed",
      howToFix: "Remove disallow rules for GPTBot, PerplexityBot, ClaudeBot, Google-Extended.",
    },
  ];
}

function buildSecurityChecks(url: string, headers: Headers): Check[] {
  const isHttps = url.startsWith("https://");
  const has = (h: string) => !!headers.get(h);
  return [
    {
      id: "sec-https",
      name: "HTTPS in use",
      category: "security",
      points: 5,
      earned: isHttps ? 5 : 0,
      passed: isHttps,
      priority: "critical",
      whyItMatters: "Without HTTPS, browsers warn visitors and Google demotes your rankings.",
      found: isHttps ? "HTTPS enabled" : "Site served over HTTP",
      howToFix: "Install an SSL certificate and force HTTPS on every page.",
    },
    {
      id: "sec-hsts",
      name: "Strict-Transport-Security",
      category: "security",
      points: 4,
      earned: has("strict-transport-security") ? 4 : 0,
      passed: has("strict-transport-security"),
      priority: "important",
      whyItMatters:
        "Without HSTS, browsers do not enforce HTTPS, leaving users vulnerable to downgrade attacks.",
      found: has("strict-transport-security") ? "Header present" : "Header missing",
      howToFix: "Send: Strict-Transport-Security: max-age=63072000; includeSubDomains; preload",
    },
    {
      id: "sec-xframe",
      name: "X-Frame-Options",
      category: "security",
      points: 4,
      earned: has("x-frame-options") ? 4 : 0,
      passed: has("x-frame-options"),
      priority: "important",
      whyItMatters: "Prevents clickjacking attacks where attackers embed your site in invisible frames.",
      found: has("x-frame-options") ? "Header present" : "Header missing",
      howToFix: "Send: X-Frame-Options: DENY",
    },
    {
      id: "sec-xcto",
      name: "X-Content-Type-Options",
      category: "security",
      points: 4,
      earned: has("x-content-type-options") ? 4 : 0,
      passed: has("x-content-type-options"),
      priority: "important",
      whyItMatters: "Stops browsers from MIME-sniffing files into executable content.",
      found: has("x-content-type-options") ? "Header present" : "Header missing",
      howToFix: "Send: X-Content-Type-Options: nosniff",
    },
    {
      id: "sec-referrer",
      name: "Referrer-Policy",
      category: "security",
      points: 3,
      earned: has("referrer-policy") ? 3 : 0,
      passed: has("referrer-policy"),
      priority: "minor",
      whyItMatters: "Controls how much URL data leaks to other sites your visitors click to.",
      found: has("referrer-policy") ? "Header present" : "Header missing",
      howToFix: "Send: Referrer-Policy: strict-origin-when-cross-origin",
    },
    {
      id: "sec-csp",
      name: "Content-Security-Policy",
      category: "security",
      points: 3,
      earned: has("content-security-policy") ? 3 : 0,
      passed: has("content-security-policy"),
      priority: "important",
      whyItMatters: "CSP is the most effective defense against XSS and script injection attacks.",
      found: has("content-security-policy") ? "Header present" : "Header missing",
      howToFix: "Define a CSP header restricting script, style, and frame sources.",
    },
    {
      id: "sec-permissions",
      name: "Permissions-Policy",
      category: "security",
      points: 2,
      earned: has("permissions-policy") ? 2 : 0,
      passed: has("permissions-policy"),
      priority: "minor",
      whyItMatters: "Locks down browser features (camera, mic, geolocation) you do not use.",
      found: has("permissions-policy") ? "Header present" : "Header missing",
      howToFix: "Send: Permissions-Policy: camera=(), microphone=(), geolocation=()",
    },
  ];
}

function buildPerfChecks(psi: any): { checks: Check[]; vitals: Record<string, any> } {
  if (!psi) {
    return { checks: [], vitals: {} };
  }
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
      name: `PageSpeed score ${score}/100`,
      category: "performance",
      points: 10,
      earned: psiPts,
      passed: score >= 70,
      priority: score < 50 ? "critical" : "important",
      whyItMatters: "PageSpeed score predicts how fast real users perceive your site.",
      found: `Mobile PageSpeed: ${score}/100`,
      howToFix: "Optimize images, reduce JavaScript, and enable caching to lift this score.",
    },
    {
      id: "perf-fcp",
      name: "First Contentful Paint < 1.8s",
      category: "performance",
      points: 5,
      earned: fcp !== null && fcp < 1800 ? 5 : 0,
      passed: fcp !== null && fcp < 1800,
      priority: "important",
      whyItMatters: "FCP is when visitors see the first hint your site is loading.",
      found: fcp !== null ? `FCP: ${(fcp / 1000).toFixed(2)}s` : "FCP unavailable",
      howToFix: "Inline critical CSS and defer non-essential scripts.",
    },
    {
      id: "perf-lcp",
      name: "Largest Contentful Paint < 2.5s",
      category: "performance",
      points: 5,
      earned: lcp !== null && lcp < 2500 ? 5 : 0,
      passed: lcp !== null && lcp < 2500,
      priority: "critical",
      whyItMatters: "53% of mobile visitors leave if a page takes over 3 seconds to load.",
      found: lcp !== null ? `LCP: ${(lcp / 1000).toFixed(2)}s` : "LCP unavailable",
      howToFix: "Optimize the hero image, preload key assets, upgrade hosting.",
    },
    {
      id: "perf-tbt",
      name: "Total Blocking Time < 200ms",
      category: "performance",
      points: 5,
      earned: tbt !== null && tbt < 200 ? 5 : 0,
      passed: tbt !== null && tbt < 200,
      priority: "important",
      whyItMatters: "TBT measures how long the page is unresponsive to taps and clicks.",
      found: tbt !== null ? `TBT: ${Math.round(tbt)}ms` : "TBT unavailable",
      howToFix: "Split heavy JavaScript bundles and remove unused third-party scripts.",
    },
  ];

  return {
    checks,
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
        JSON.stringify({
          error: "INVALID_URL",
          message: "Please enter a valid URL like https://yourbusiness.com",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("PAGESPEED_API_KEY");
    const origin = new URL(url).origin;

    const htmlPromise = fetchWithTimeout(url).then(async (r) => ({
      ok: r.ok,
      status: r.status,
      headers: r.headers,
      finalUrl: r.url,
      text: await r.text(),
    })).catch((e) => ({ ok: false, status: 0, headers: new Headers(), finalUrl: url, text: "", error: String(e) } as any));

    const robotsPromise = fetchWithTimeout(`${origin}/robots.txt`).then(async (r) => ({
      ok: r.ok,
      text: r.ok ? await r.text() : "",
    })).catch(() => ({ ok: false, text: "" }));

    let perfUnavailableReason: string | null = null;
    if (!apiKey) {
      perfUnavailableReason = "Performance data unavailable, API key not configured";
      console.error("[analyze-website] PAGESPEED_API_KEY missing");
    }

    const psiPromise: Promise<any> = apiKey
      ? fetchWithTimeout(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
            url,
          )}&strategy=mobile&category=performance&key=${apiKey}`,
        )
          .then(async (r) => {
            if (r.ok) return await r.json();
            const body = await r.text().catch(() => "");
            console.error("[analyze-website] PSI HTTP", r.status, body.slice(0, 500));
            perfUnavailableReason = `Performance data unavailable, PageSpeed API returned ${r.status}`;
            return null;
          })
          .catch((e) => {
            console.error("[analyze-website] PSI fetch failed", String(e));
            perfUnavailableReason = "Performance data unavailable, PageSpeed request failed";
            return null;
          })
      : Promise.resolve(null);

    const [htmlRes, robots, psi] = await Promise.all([htmlPromise, robotsPromise, psiPromise]);

    if (!htmlRes.ok && !psi) {
      return new Response(
        JSON.stringify({
          error: "UNREACHABLE",
          message:
            "We couldn't reach that website. Double-check the URL and make sure the site is live.",
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const html = htmlRes.text || "";
    const seo = parseSeo(html, url);
    const seoChecks = buildSeoChecks(seo);

    // robots.txt check fill in
    const robotsCheck = seoChecks.find((c) => c.id === "seo-robots")!;
    robotsCheck.passed = robots.ok;
    robotsCheck.earned = robots.ok ? 2 : 0;
    robotsCheck.found = robots.ok ? "robots.txt found" : "robots.txt not accessible";

    const aiChecks = buildAiChecks(seo, robots);
    const securityChecks = buildSecurityChecks(htmlRes.finalUrl || url, htmlRes.headers);
    const perf = buildPerfChecks(psi);

    const sumEarned = (cs: Check[]) => cs.reduce((s, c) => s + c.earned, 0);

    const seoScore = sumEarned(seoChecks);
    const aiScore = sumEarned(aiChecks);
    const secScore = sumEarned(securityChecks);
    const perfScore = perf.checks.length ? sumEarned(perf.checks) : null;

    const overall = perfScore !== null
      ? seoScore + aiScore + secScore + perfScore
      : Math.round(((seoScore + aiScore + secScore) / 75) * 100);

    const allChecks = [...seoChecks, ...aiChecks, ...securityChecks, ...perf.checks];
    const issues = allChecks.filter((c) => !c.passed);
    const passed = allChecks.filter((c) => c.passed);

    return new Response(
      JSON.stringify({
        url,
        domain: new URL(url).hostname,
        overallScore: overall,
        categories: {
          seo: { score: seoScore, max: 25, checks: seoChecks },
          performance: {
            score: perfScore,
            max: 25,
            checks: perf.checks,
            vitals: perf.vitals,
            unavailable: perfScore === null,
          },
          aiVisibility: { score: aiScore, max: 25, checks: aiChecks },
          security: { score: secScore, max: 25, checks: securityChecks },
        },
        issues,
        passed,
        htmlFetched: htmlRes.ok,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = String((e as Error).message || e);
    if (msg.includes("aborted") || msg.includes("timeout")) {
      return new Response(
        JSON.stringify({
          error: "TIMEOUT",
          message: "The analysis timed out, this sometimes happens with slower sites. Try again in a moment.",
        }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify({ error: "UNKNOWN", message: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
