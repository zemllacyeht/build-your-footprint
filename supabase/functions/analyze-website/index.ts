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

const CHECK_NAMES: Record<string, { passed: string; failed: string }> = {
  "seo-title-exists": { passed: "Your page has a strong Google headline", failed: "Your page has no headline for Google" },
  "seo-title-length": { passed: "Your Google headline is the perfect length", failed: "Your Google headline is getting cut off" },
  "seo-meta-desc": { passed: "Your Google search description is set", failed: "Missing description in Google search" },
  "seo-meta-desc-len": { passed: "Your Google description is the right length", failed: "Your Google description is the wrong length" },
  "seo-h1": { passed: "Your page has one clear main heading", failed: "Your page is missing a clear main heading" },
  "seo-img-alt": { passed: "Your photos are visible to Google", failed: "Your photos are invisible to Google" },
  "seo-canonical": { passed: "Google sees one clean version of your site", failed: "Google may be seeing duplicate versions of your site" },
  "seo-robots": { passed: "Search engines can find your pages easily", failed: "Search engines may have trouble finding your pages" },
  "perf-score": { passed: "Your website loads at a good speed", failed: "Your website is too slow" },
  "perf-psi": { passed: "Your website loads at a good speed", failed: "Your website is too slow" },
  "perf-fcp": { passed: "Customers see your content quickly", failed: "Customers wait too long to see anything" },
  "perf-lcp": { passed: "Your main content loads fast", failed: "Your main content loads too slowly" },
  "perf-tbt": { passed: "Your website responds to clicks instantly", failed: "Something is freezing your website" },
  "ai-og-title": { passed: "Your links look great when shared on social", failed: "Your links look broken when shared on social media" },
  "ai-og-desc": { passed: "Your links show a description when shared", failed: "No description when your link is shared" },
  "ai-og-image": { passed: "Your links show an image when shared", failed: "No image when your link is shared" },
  "ai-schema": { passed: "AI tools can understand your business", failed: "AI tools can't understand your business" },
  "ai-faq": { passed: "You have FAQ content for Google and AI", failed: "You're missing easy Google ranking opportunities" },
  "ai-location": { passed: "Google knows where your business is located", failed: "Google doesn't know where you're located" },
  "ai-bots-allowed": { passed: "AI assistants can find and recommend you", failed: "AI assistants may not be able to recommend your business" },
  "sec-https": { passed: "Your website has a secure connection", failed: "Your website connection is not secure" },
  "sec-hsts": { passed: "Your HTTPS connection is fully enforced", failed: "Your HTTPS can be bypassed" },
  "sec-xframe": { passed: "Your website is protected from hijacking", failed: "Your website can be hijacked by other sites" },
  "sec-xcto": { passed: "Your site is protected from file type attacks", failed: "Your site is vulnerable to file type attacks" },
  "sec-referrer": { passed: "Your visitors' data stays private", failed: "Your visitors' data is being shared without their knowledge" },
  "sec-csp": { passed: "Your site is defended against hacker injections", failed: "Your site has no defense against hacker injections" },
  "sec-permissions": { passed: "Visitor device permissions are locked down", failed: "Your visitors' camera and location could be accessed without permission" },
};

function applyNames(checks: Check[]): Check[] {
  return checks.map((c) => {
    const n = CHECK_NAMES[c.id];
    if (!n) return c;
    return { ...c, name: c.passed ? n.passed : n.failed };
  });
}

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
      name: "Your page has no headline for Google",
      category: "seo",
      points: 4,
      earned: seo.title ? 4 : 0,
      passed: !!seo.title,
      priority: "critical",
      whyItMatters:
        "Google uses your page title as the headline in search results. Without one, your business looks unprofessional and gets skipped.",
      found: seo.title ? `Title found: "${seo.title.slice(0, 80)}"` : "No page title found",
      howToFix: "Add a clear title that describes your business and what you do in under 60 characters.",
    },
    {
      id: "seo-title-length",
      name: "Your Google headline is getting cut off",
      category: "seo",
      points: 3,
      earned: seo.titleLen >= 30 && seo.titleLen <= 65 ? 3 : 0,
      passed: seo.titleLen >= 30 && seo.titleLen <= 65,
      priority: "important",
      whyItMatters:
        "When your title is too long, Google cuts it off mid-sentence. Customers see '...' and move on to your competitor.",
      found: `Your title is ${seo.titleLen} characters (ideal: 50-60)`,
      howToFix: "Shorten your title to under 60 characters while keeping your most important keywords.",
    },
    {
      id: "seo-meta-desc",
      name: "Missing description in Google search",
      category: "seo",
      points: 4,
      earned: seo.metaDesc ? 4 : 0,
      passed: !!seo.metaDesc,
      priority: "critical",
      whyItMatters:
        "That small paragraph under your business name in Google? That's your meta description. Without it, Google writes one for you, usually badly, and fewer people click through.",
      found: seo.metaDesc ? `Description found (${seo.metaDescLen} chars)` : "No meta description found",
      howToFix: "Write a 1 to 2 sentence description of your business that makes people want to click.",
    },
    {
      id: "seo-meta-desc-len",
      name: "Your Google description is the wrong length",
      category: "seo",
      points: 3,
      earned: seo.metaDescLen >= 120 && seo.metaDescLen <= 165 ? 3 : 0,
      passed: seo.metaDescLen >= 120 && seo.metaDescLen <= 165,
      priority: "important",
      whyItMatters:
        "Too short and you waste valuable space. Too long and it gets cut off. Either way, fewer customers click through to your site.",
      found: `Your description is ${seo.metaDescLen} characters (ideal: 120-160)`,
      howToFix: "Rewrite your description to be between 120 and 160 characters.",
    },
    {
      id: "seo-h1",
      name: "Your page is missing a clear main heading",
      category: "seo",
      points: 4,
      earned: seo.h1Count === 1 ? 4 : 0,
      passed: seo.h1Count === 1,
      priority: "important",
      whyItMatters:
        "Google looks for one clear main heading to understand what your page is about. Without it, your page ranks lower than competitors who have one.",
      found: `${seo.h1Count} main heading(s) found on the page`,
      howToFix: "Add one clear heading at the top of your page that describes exactly what you offer.",
    },
    {
      id: "seo-img-alt",
      name: "Your photos are invisible to Google",
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
      whyItMatters:
        "Google can't see images, it reads descriptions of them. Without these, your photos don't help your search ranking and visually impaired visitors can't understand your content.",
      found: `${Math.max(seo.imgCount - seo.imgsWithAltCount, 0)} images found with no description (out of ${seo.imgCount} total)`,
      howToFix: "Add a short description to every image explaining what it shows.",
    },
    {
      id: "seo-canonical",
      name: "Google may be seeing duplicate versions of your site",
      category: "seo",
      points: 2,
      earned: seo.canonical ? 2 : 0,
      passed: !!seo.canonical,
      priority: "minor",
      whyItMatters:
        "Without this tag, Google might index both http and https versions of your site separately, splitting your ranking power in half.",
      found: seo.canonical ? `Canonical tag found: ${seo.canonical}` : "No canonical tag found",
      howToFix: "Add a canonical tag pointing to your preferred URL.",
    },
    {
      id: "seo-robots",
      name: "Search engines may have trouble finding your pages",
      category: "seo",
      points: 2,
      earned: 0,
      passed: false,
      priority: "minor",
      whyItMatters:
        "The robots file tells Google which pages to visit on your site. Without it, Google guesses, and might miss important pages.",
      found: "Pending",
      howToFix: "Create a robots.txt file that guides search engines through your site.",
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
      name: "Your links look broken when shared on social media",
      category: "aiVisibility",
      points: 4,
      earned: seo.ogTitle ? 4 : 0,
      passed: !!seo.ogTitle,
      priority: "important",
      whyItMatters:
        "When someone shares your website on Facebook, Instagram, or iMessage, it should show a clean preview with your business name. Without this, it shows nothing, or random text.",
      found: seo.ogTitle ? "Social preview title found" : "No social preview title found",
      howToFix: "Add an Open Graph title so your links always look professional when shared.",
    },
    {
      id: "ai-og-desc",
      name: "No description when your link is shared",
      category: "aiVisibility",
      points: 4,
      earned: seo.ogDesc ? 4 : 0,
      passed: !!seo.ogDesc,
      priority: "important",
      whyItMatters:
        "A good link preview shows a title, image, and description. Missing the description means people see an incomplete preview and are less likely to click.",
      found: seo.ogDesc ? "Social preview description found" : "No social preview description found",
      howToFix: "Add a short description that appears whenever your link is shared online.",
    },
    {
      id: "ai-og-image",
      name: "No image when your link is shared",
      category: "aiVisibility",
      points: 3,
      earned: seo.ogImage ? 3 : 0,
      passed: !!seo.ogImage,
      priority: "minor",
      whyItMatters:
        "Posts with images get 3x more clicks than those without. When your link has no image, it gets ignored in social feeds.",
      found: seo.ogImage ? "Social preview image found" : "No social preview image found",
      howToFix: "Add a branded image (1200x630px) that appears whenever your link is shared.",
    },
    {
      id: "ai-schema",
      name: "AI tools can't understand your business",
      category: "aiVisibility",
      points: 5,
      earned: seo.hasSchema ? 5 : 0,
      passed: seo.hasSchema,
      priority: "critical",
      whyItMatters:
        "ChatGPT, Perplexity, and Google's AI use special code to understand what your business does and where you're located. Without it, you're invisible to AI-powered search, the fastest growing way people find local businesses.",
      found: seo.hasSchema ? "Business information code detected" : "No business information code found",
      howToFix: "Add structured data with your business name, address, phone, hours, and services.",
    },
    {
      id: "ai-faq",
      name: "You're missing easy Google ranking opportunities",
      category: "aiVisibility",
      points: 3,
      earned: seo.hasFaq ? 3 : 0,
      passed: seo.hasFaq,
      priority: "minor",
      whyItMatters:
        "FAQ sections help you appear in Google's 'People Also Ask' boxes, free visibility at the top of search results. AI tools also pull from FAQ content to answer customer questions.",
      found: seo.hasFaq ? "FAQ section detected" : "No FAQ section detected",
      howToFix: "Add a FAQ section answering the 5 most common questions your customers ask.",
    },
    {
      id: "ai-location",
      name: "Google doesn't know where you're located",
      category: "aiVisibility",
      points: 3,
      earned: cityMentioned ? 3 : 0,
      passed: cityMentioned,
      priority: "minor",
      whyItMatters:
        "When someone searches 'salon near me' or 'web designer in Miami,' Google looks for location signals on your site. Without them, local customers can't find you.",
      found: cityMentioned ? "Location information found on page" : "No location information found on page",
      howToFix: "Mention your city and neighborhood naturally in your homepage text, footer, and About page.",
    },
    {
      id: "ai-bots-allowed",
      name: "AI assistants may not be able to recommend your business",
      category: "aiVisibility",
      points: 3,
      earned: !blockedAi ? 3 : 0,
      passed: !blockedAi,
      priority: "important",
      whyItMatters:
        "If your website blocks AI crawlers, tools like ChatGPT can't learn about your business and won't mention you when customers ask for recommendations.",
      found: blockedAi ? "AI tools are blocked from reading your site" : "AI tools can read your site",
      howToFix: "Update your robots.txt file to allow AI tools to read your website.",
    },
  ];
}

function buildSecurityChecks(url: string, headers: Headers): Check[] {
  const isHttps = url.startsWith("https://");
  const has = (h: string) => !!headers.get(h);
  return [
    {
      id: "sec-https",
      name: "Your website connection is not secure",
      category: "security",
      points: 5,
      earned: isHttps ? 5 : 0,
      passed: isHttps,
      priority: "critical",
      whyItMatters:
        "Browsers show a 'Not Secure' warning on sites without HTTPS. This scares customers away immediately, especially on checkout or contact pages.",
      found: isHttps ? "Secure HTTPS connection in use" : "Site served over insecure HTTP",
      howToFix: "Install an SSL certificate and redirect all traffic to https://",
    },
    {
      id: "sec-hsts",
      name: "Your HTTPS can be bypassed",
      category: "security",
      points: 4,
      earned: has("strict-transport-security") ? 4 : 0,
      passed: has("strict-transport-security"),
      priority: "important",
      whyItMatters:
        "Without this protection, someone on the same WiFi network could intercept your visitors' connection and steal their data. Customers on public WiFi are at risk.",
      found: has("strict-transport-security") ? "HSTS protection enabled" : "HSTS header missing",
      howToFix: "Enable HTTP Strict Transport Security so browsers always use your secure connection.",
    },
    {
      id: "sec-xframe",
      name: "Your website can be hijacked by other sites",
      category: "security",
      points: 4,
      earned: has("x-frame-options") ? 4 : 0,
      passed: has("x-frame-options"),
      priority: "important",
      whyItMatters:
        "Without this protection, scammers can embed your website inside their own to trick your customers into thinking they're on your site.",
      found: has("x-frame-options") ? "Clickjacking protection enabled" : "Clickjacking protection missing",
      howToFix: "Add a header that prevents your site from being embedded on other websites.",
    },
    {
      id: "sec-xcto",
      name: "Your site is vulnerable to file type attacks",
      category: "security",
      points: 4,
      earned: has("x-content-type-options") ? 4 : 0,
      passed: has("x-content-type-options"),
      priority: "important",
      whyItMatters:
        "Hackers can upload disguised files to trick browsers into running malicious code on your visitors' devices.",
      found: has("x-content-type-options") ? "File type protection enabled" : "File type protection missing",
      howToFix: "Add a header that forces browsers to handle files as declared, blocking this attack.",
    },
    {
      id: "sec-referrer",
      name: "Your visitors' data is being shared without their knowledge",
      category: "security",
      points: 3,
      earned: has("referrer-policy") ? 3 : 0,
      passed: has("referrer-policy"),
      priority: "minor",
      whyItMatters:
        "When visitors click links on your site, their browsing data can be sent to third parties. This is a privacy risk and can hurt trust.",
      found: has("referrer-policy") ? "Privacy referrer policy set" : "Privacy referrer header missing",
      howToFix: "Set a referrer policy to control what information browsers share when visitors leave your site.",
    },
    {
      id: "sec-csp",
      name: "Your site has no defense against hacker injections",
      category: "security",
      points: 3,
      earned: has("content-security-policy") ? 3 : 0,
      passed: has("content-security-policy"),
      priority: "important",
      whyItMatters:
        "CSP is your site's strongest defense against hackers injecting malicious code that steals customer data or redirects visitors to fake sites.",
      found: has("content-security-policy") ? "Security policy active" : "Security policy header missing",
      howToFix: "Define a content security policy that controls what code is allowed to run on your website.",
    },
    {
      id: "sec-permissions",
      name: "Your visitors' camera and location could be accessed without permission",
      category: "security",
      points: 2,
      earned: has("permissions-policy") ? 2 : 0,
      passed: has("permissions-policy"),
      priority: "minor",
      whyItMatters:
        "Without this protection, third party scripts on your site could request access to visitors' cameras, microphones, or location without their knowledge.",
      found: has("permissions-policy") ? "Permissions policy set" : "Permissions policy header missing",
      howToFix: "Add a permissions policy that locks down what browser features your site can access.",
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

    const [htmlRes, robots] = await Promise.all([htmlPromise, robotsPromise]);

    if (!htmlRes.ok) {
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

    const robotsCheck = seoChecks.find((c) => c.id === "seo-robots")!;
    robotsCheck.passed = robots.ok;
    robotsCheck.earned = robots.ok ? 2 : 0;
    robotsCheck.found = robots.ok ? "Robots file found and accessible" : "No robots file found at your site root";

    const aiChecks = applyNames(buildAiChecks(seo, robots));
    const securityChecks = applyNames(buildSecurityChecks(htmlRes.finalUrl || url, htmlRes.headers));
    const seoChecksNamed = applyNames(seoChecks);

    const sumEarned = (cs: Check[]) => cs.reduce((s, c) => s + c.earned, 0);
    const seoScore = sumEarned(seoChecks);
    const aiScore = sumEarned(aiChecks);
    const secScore = sumEarned(securityChecks);

    // Overall scaled to 100 from the 3 instant categories. Speed merges in client-side.
    const overall = Math.round(((seoScore + aiScore + secScore) / 75) * 100);

    const allChecks = [...seoChecks, ...aiChecks, ...securityChecks];
    const issues = allChecks.filter((c) => !c.passed);
    const passed = allChecks.filter((c) => c.passed);

    return new Response(
      JSON.stringify({
        url,
        domain: new URL(url).hostname,
        overallScore: overall,
        categories: {
          seo: { score: seoScore, max: 25, checks: seoChecks },
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
