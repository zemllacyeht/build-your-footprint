export type SiteType = "landing" | "small" | "content" | "ecom";
export type Goal = "local" | "leads" | "sell" | "credibility";
export type BrandState = "ready" | "logo-only" | "refresh" | "scratch";
export type Marketing = "seo" | "social" | "content" | "none";
export type Timeline = "asap" | "2-4w" | "1-2m" | "flex";

export interface WizardAnswers {
  site?: SiteType;
  goal?: Goal;
  brand?: BrandState;
  marketing: Marketing[];
  timeline?: Timeline;
  budget: number; // 0 lean, 1 mid, 2 premium
}

export interface CartLine {
  id: string;
  name: string;
  price: string;
  category: "Build package" | "Care plan" | "Add-on";
  rationale: string;
}

export interface Recommendation {
  build: CartLine;
  care: CartLine;
  addons: CartLine[];
  summary: string;
}

const BUILDS: Record<string, Omit<CartLine, "rationale">> = {
  core: { id: "build-core", name: "Core", price: "$499 one-time", category: "Build package" },
  launch: { id: "build-launch", name: "Launch", price: "$999 one-time", category: "Build package" },
  signature: { id: "build-signature", name: "Signature", price: "$1,499 one-time", category: "Build package" },
  enterprise: { id: "build-enterprise", name: "Enterprise", price: "Custom one-time", category: "Build package" },
};

const CARES: Record<string, Omit<CartLine, "rationale">> = {
  essential: { id: "care-essential", name: "Essential Care", price: "$19/mo", category: "Care plan" },
  growth: { id: "care-growth", name: "Growth Care", price: "$59/mo", category: "Care plan" },
  white: { id: "care-white-glove", name: "White-Glove Care", price: "Custom/mo", category: "Care plan" },
};

const ADDONS: Record<string, Omit<CartLine, "rationale">> = {
  local: { id: "addon-local-service-boost", name: "Local Service Boost", price: "From $549/mo", category: "Add-on" },
  social: { id: "addon-social-presence", name: "Social Presence", price: "From $699/mo", category: "Add-on" },
  conversion: { id: "addon-conversion-focus", name: "Conversion Focus", price: "From $749 one-time", category: "Add-on" },
  workspace: { id: "addon-business-workspace", name: "Business Workspace", price: "By application", category: "Add-on" },
};

export function recommend(a: WizardAnswers): Recommendation {
  // Build tier scoring
  let buildKey: keyof typeof BUILDS = "launch";
  if (a.site === "ecom" || (a.brand === "refresh" && a.goal === "sell")) buildKey = "enterprise";
  else if (a.site === "content" || a.goal === "credibility" || a.brand === "scratch") buildKey = "signature";
  else if (a.site === "small" || a.goal === "leads") buildKey = "launch";
  else if (a.site === "landing" || (a.timeline === "asap" && a.goal === "local")) buildKey = "core";

  // Budget nudges down a tier if user picked lean
  if (a.budget === 0 && buildKey === "signature") buildKey = "launch";
  if (a.budget === 0 && buildKey === "launch" && a.site === "landing") buildKey = "core";

  const careKey: keyof typeof CARES =
    buildKey === "enterprise" ? "white" : buildKey === "signature" ? "growth" : "essential";

  const addonKeys: (keyof typeof ADDONS)[] = [];
  if (a.marketing.includes("seo") || a.goal === "local") addonKeys.push("local");
  if (a.marketing.includes("social") || a.marketing.includes("content")) addonKeys.push("social");
  if (a.site === "landing" || (a.goal === "leads" && a.timeline === "asap")) addonKeys.push("conversion");
  if (a.site === "ecom" || buildKey === "enterprise") addonKeys.push("workspace");

  const buildRationale = (() => {
    switch (buildKey) {
      case "core":
        return "A focused single page launch fits a fast timeline and a get found locally goal.";
      case "launch":
        return "A polished 3 to 5 page site is the sweet spot for generating leads with room to grow.";
      case "signature":
        return "Up to 12 custom pages plus brand basics give you the depth credibility and content require.";
      case "enterprise":
        return "E-commerce, bookings, and custom integrations call for a tailored scope and dedicated PM.";
    }
  })();

  const careRationale = (() => {
    switch (careKey) {
      case "essential":
        return "Keeps hosting, SSL, and weekly backups handled without overpaying.";
      case "growth":
        return "Adds daily backups, CMS updates, and 30 minutes of monthly edits to match a richer build.";
      case "white":
        return "A dedicated account manager and SLA to match a high stakes site.";
    }
  })();

  const addonRationale: Record<keyof typeof ADDONS, string> = {
    local: "You want to be found locally, so ongoing SEO and Google Business optimization gets you in front of nearby customers.",
    social: "Staying visible takes consistent content, so monthly posts and emails keep your brand showing up where customers spend time.",
    conversion: "A focused landing page built to convert turns ad spend or a campaign into actual leads and sales.",
    workspace: "Bookings, customers, and payments add up fast, so a custom back-end keeps operations in one place instead of seven tools.",
  };

  const summary =
    a.timeline === "asap"
      ? "Built around a fast timeline so you can launch and iterate."
      : a.timeline === "flex"
      ? "Paced to let design and content breathe without rushing decisions."
      : "Balanced for a healthy timeline with clear milestones.";

  return {
    build: { ...BUILDS[buildKey], rationale: buildRationale },
    care: { ...CARES[careKey], rationale: careRationale },
    addons: addonKeys.map((k) => ({ ...ADDONS[k], rationale: addonRationale[k] })),
    summary,
  };
}
