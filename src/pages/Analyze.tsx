import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AnalyzerWidget } from "@/components/site/AnalyzerWidget";
import { AnalyzerLoading } from "@/components/analyzer/AnalyzerLoading";
import { ScoreGauge } from "@/components/analyzer/ScoreGauge";
import { CategoryCard } from "@/components/analyzer/CategoryCard";
import { IssuesList } from "@/components/analyzer/IssuesList";
import { ServiceMatch } from "@/components/analyzer/ServiceMatch";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Sparkles } from "lucide-react";

interface BaseResult {
  url: string;
  domain: string;
  overallScore: number;
  categories: {
    seo: { score: number; max: number; checks: any[] };
    aiVisibility: { score: number; max: number; checks: any[] };
    security: { score: number; max: number; checks: any[] };
  };
  issues: any[];
  passed: any[];
}

type SpeedState =
  | { status: "loading" }
  | { status: "ready"; score: number; max: number; checks: any[]; vitals: any }
  | { status: "unavailable"; reason: string };

const grade = (s: number) =>
  s >= 90 ? "Excellent" : s >= 70 ? "Good" : s >= 50 ? "Needs Work" : "Poor";
const summary = (s: number) =>
  s >= 90
    ? "Your website is in great shape, let's keep it that way."
    : s >= 70
      ? "Your website is decent but you're leaving money on the table."
      : s >= 50
        ? "Your website has real problems that are hurting your business."
        : "Your website is costing you customers every day.";

const Analyze = () => {
  const [params, setParams] = useSearchParams();
  const initialUrl = params.get("url") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [base, setBase] = useState<BaseResult | null>(null);
  const [speed, setSpeed] = useState<SpeedState>({ status: "loading" });
  const [analyzingDomain, setAnalyzingDomain] = useState("");
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = "Free Website Analyzer | SEO & Performance Score";
    const meta =
      document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "Get an instant SEO, performance, AI visibility, and security score for any website. Free tool by Build Your Footprint Web Services.",
    );
    if (!meta.parentElement) document.head.appendChild(meta);

    const canonical =
      document.querySelector('link[rel="canonical"]') ||
      Object.assign(document.createElement("link"), { rel: "canonical" });
    canonical.setAttribute("href", "https://www.buildyourfootprint.com/analyze");
    if (!canonical.parentElement) document.head.appendChild(canonical);
  }, []);

  const runAnalysis = async (url: string) => {
    if (!url || lastUrlRef.current === url) return;
    lastUrlRef.current = url;
    setLoading(true);
    setError(null);
    setBase(null);
    setSpeed({ status: "loading" });
    try {
      const domain = url.replace(/^https?:\/\//, "").split("/")[0];
      setAnalyzingDomain(domain);

      // Kick off speed in parallel, do not await here
      supabase.functions
        .invoke("analyze-speed", { body: { url } })
        .then(({ data, error: speedErr }) => {
          if (speedErr || !data) {
            setSpeed({
              status: "unavailable",
              reason: "Speed data unavailable for this site right now. Try again in a moment.",
            });
            return;
          }
          if (data.unavailable) {
            setSpeed({ status: "unavailable", reason: data.reason || "Speed data unavailable" });
          } else {
            setSpeed({
              status: "ready",
              score: data.score,
              max: data.max,
              checks: data.checks,
              vitals: data.vitals,
            });
          }
        })
        .catch(() => {
          setSpeed({
            status: "unavailable",
            reason: "Speed data unavailable for this site right now. Try again in a moment.",
          });
        });

      const { data, error: invokeErr } = await supabase.functions.invoke("analyze-website", {
        body: { url },
      });
      if (invokeErr) {
        const msg = (invokeErr as any)?.context?.message || invokeErr.message;
        throw new Error(msg || "Analysis failed");
      }
      if (data?.error) throw new Error(data.message || "Analysis failed");
      setBase(data as BaseResult);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUrl) runAnalysis(initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  const reset = () => {
    setBase(null);
    setSpeed({ status: "loading" });
    setError(null);
    lastUrlRef.current = null;
    setParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Merge speed into overall score & issues when ready
  const mergedOverall = (() => {
    if (!base) return 0;
    if (speed.status === "ready") {
      const total =
        base.categories.seo.score +
        base.categories.aiVisibility.score +
        base.categories.security.score +
        speed.score;
      return total; // out of 100 (4 x 25)
    }
    return base.overallScore;
  })();

  const mergedIssues = (() => {
    if (!base) return [];
    if (speed.status === "ready") {
      return [...base.issues, ...speed.checks.filter((c) => !c.passed)];
    }
    return base.issues;
  })();

  const mergedPassed = (() => {
    if (!base) return [];
    if (speed.status === "ready") {
      return [...base.passed, ...speed.checks.filter((c) => c.passed)];
    }
    return base.passed;
  })();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 -left-40 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[140px] pointer-events-none" />

        <div className="container relative">
          {/* Hero */}
          <section className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 border border-accent/30 bg-accent/5">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                Free Website Audit
              </span>
            </div>
            <h1 className="font-display font-light leading-[1.05] mb-6" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}>
              See exactly what's{" "}
              <span className="italic font-normal text-gradient-gold">costing your website</span>{" "}
              customers.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 font-light">
              Enter your URL below for an instant breakdown of your SEO, performance, mobile
              experience, and security, with specific fixes for every issue we find.
            </p>

            <div className="max-w-xl mx-auto">
              <AnalyzerWidget variant="page" initialUrl={initialUrl} />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span>✦ Free & instant</span>
              <span>✦ No email required</span>
              <span>✦ No signup needed</span>
            </div>
          </section>

          {/* Loading (waiting on base) */}
          {loading && (
            <div className="max-w-2xl mx-auto">
              <AnalyzerLoading domain={analyzingDomain} />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="max-w-xl mx-auto rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-center">
              <h3 className="font-display text-xl mb-2">We hit a snag</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Results */}
          {base && !loading && (
            <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <section className="max-w-2xl mx-auto rounded-3xl border border-border bg-card/40 p-8 md:p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-full max-w-[280px] md:max-w-none">
                    <ScoreGauge score={mergedOverall} />
                  </div>
                </div>
                <div className="font-display mb-2" style={{ fontSize: "1.4rem" }}>{grade(mergedOverall)}</div>
                <p className="text-muted-foreground max-w-md mx-auto">{summary(mergedOverall)}</p>
                {speed.status === "loading" && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Score based on 3 of 4 categories{" "}
                    <span className="animate-pulse">(speed analysis in progress...)</span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground/70 mt-4">
                  Analyzed: <span className="text-foreground/70">{base.domain}</span>
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-6">
                <CategoryCard
                  icon="🔍"
                  title="Google Findability"
                  subtitle="Can customers find you on Google?"
                  score={base.categories.seo.score}
                  max={base.categories.seo.max}
                  checks={base.categories.seo.checks}
                />
                <CategoryCard
                  icon="⚡"
                  title="Website Speed"
                  subtitle="How fast does your site load for visitors?"
                  score={speed.status === "ready" ? speed.score : null}
                  max={25}
                  checks={speed.status === "ready" ? speed.checks : []}
                  vitals={speed.status === "ready" ? speed.vitals : undefined}
                  loading={speed.status === "loading"}
                  unavailable={speed.status === "unavailable"}
                  unavailableReason={speed.status === "unavailable" ? speed.reason : null}
                  unavailableCta={
                    speed.status === "unavailable"
                      ? {
                          label: "We test every site we build for speed before launch. Ask us about it",
                          href: "https://byf-vercel-depo.vercel.app/",
                        }
                      : undefined
                  }
                />
                <CategoryCard
                  icon="🤖"
                  title="AI & Social Visibility"
                  subtitle="Do AI tools and social media show you?"
                  score={base.categories.aiVisibility.score}
                  max={base.categories.aiVisibility.max}
                  checks={base.categories.aiVisibility.checks}
                />
                <CategoryCard
                  icon="🔒"
                  title="Trust & Security"
                  subtitle="Is your site safe for customers?"
                  score={base.categories.security.score}
                  max={base.categories.security.max}
                  checks={base.categories.security.checks}
                />
              </section>

              <section>
                <h2 className="font-display text-3xl md:text-4xl font-light mb-6">What we found</h2>
                <IssuesList issues={mergedIssues} passed={mergedPassed} />
              </section>

              <ServiceMatch
                scores={{
                  seo: base.categories.seo.score,
                  performance: speed.status === "ready" ? speed.score : null,
                  aiVisibility: base.categories.aiVisibility.score,
                  security: base.categories.security.score,
                }}
              />

              <section className="relative rounded-3xl p-[2px] bg-gradient-to-br from-accent via-primary to-accent bg-[length:200%_200%] animate-gradient-shift" style={{ marginBottom: "48px" }}>
                <div className="rounded-3xl bg-background py-20 px-6 sm:px-10 md:py-24 md:px-14 text-center">
                  <h2 className="font-display text-3xl md:text-5xl font-light mb-4">
                    Ready to <span className="italic text-gradient-gold">fix this</span>?
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-3 leading-relaxed">
                    We've helped dozens of small businesses go from a broken digital presence to one
                    that actually wins customers. Your score shows exactly where you're losing,
                    and we know exactly how to fix it.
                  </p>
                  <p className="mb-10" style={{ fontSize: "1.1rem" }}>
                    <span className="text-muted-foreground">Your site scored </span>
                    <span className="font-display font-medium" style={{ color: "#c9a84c" }}>
                      {mergedOverall}/100
                    </span>
                    <span className="text-muted-foreground">. Businesses we work with typically reach 85+ within 60 days.</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch sm:items-center">
                    <a
                      href="https://byf-vercel-depo.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 px-7 rounded-full bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:shadow-glow hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                    >
                      Start Your Project <ArrowRight className="h-4 w-4" />
                    </a>
                    <button
                      onClick={reset}
                      className="h-12 px-7 rounded-full border border-border bg-card/40 text-foreground font-medium hover:border-primary/40 transition w-full sm:w-auto"
                    >
                      Analyze Another Site
                    </button>
                  </div>
                  <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                    <span>✦ No long-term contracts</span>
                    <span>✦ Results in 30-60 days</span>
                    <span>✦ Starting at $800</span>
                    <span>✦ Based in Miami</span>
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground/80 max-w-xl mx-auto">
                    Join 100+ businesses that have improved their digital presence with Build Your Footprint.
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analyze;
