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

interface AnalysisResult {
  url: string;
  domain: string;
  overallScore: number;
  categories: {
    seo: { score: number; max: number; checks: any[] };
    performance: {
      score: number | null;
      max: number;
      checks: any[];
      vitals: any;
      unavailable: boolean;
      unavailableReason?: string | null;
    };
    aiVisibility: { score: number; max: number; checks: any[] };
    security: { score: number; max: number; checks: any[] };
  };
  issues: any[];
  passed: any[];
}

const grade = (s: number) =>
  s >= 90 ? "Excellent" : s >= 70 ? "Good" : s >= 50 ? "Needs Work" : "Poor";
const summary = (s: number) =>
  s >= 90
    ? "Your website is performing well, minor improvements possible."
    : s >= 70
      ? "Your website is decent but leaving money on the table."
      : s >= 50
        ? "Your website has serious gaps holding it back."
        : "Your website is actively losing you customers.";

const Analyze = () => {
  const [params, setParams] = useSearchParams();
  const initialUrl = params.get("url") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
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
    setResult(null);
    try {
      const domain = url.replace(/^https?:\/\//, "").split("/")[0];
      setAnalyzingDomain(domain);
      const { data, error: invokeErr } = await supabase.functions.invoke("analyze-website", {
        body: { url },
      });
      if (invokeErr) {
        const msg = (invokeErr as any)?.context?.message || invokeErr.message;
        throw new Error(msg || "Analysis failed");
      }
      if (data?.error) throw new Error(data.message || "Analysis failed");
      setResult(data as AnalysisResult);
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
    setResult(null);
    setError(null);
    lastUrlRef.current = null;
    setParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

          {/* Loading */}
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
          {result && !loading && (
            <div className="space-y-12 animate-fade-up">
              {/* Overall Score */}
              <section className="max-w-2xl mx-auto rounded-3xl border border-border bg-card/40 p-8 md:p-12 text-center">
                <div className="flex justify-center mb-6">
                  <ScoreGauge score={result.overallScore} />
                </div>
                <div className="font-display text-3xl md:text-4xl mb-2">{grade(result.overallScore)}</div>
                <p className="text-muted-foreground max-w-md mx-auto">{summary(result.overallScore)}</p>
                <p className="text-xs text-muted-foreground/70 mt-4">
                  Analyzed: <span className="text-foreground/70">{result.domain}</span>
                </p>
              </section>

              {/* Category Cards */}
              <section className="grid md:grid-cols-2 gap-4">
                <CategoryCard
                  icon="🔍"
                  title="SEO Basics"
                  score={result.categories.seo.score}
                  max={result.categories.seo.max}
                  checks={result.categories.seo.checks}
                />
                <CategoryCard
                  icon="⚡"
                  title="Performance"
                  score={result.categories.performance.score}
                  max={result.categories.performance.max}
                  checks={result.categories.performance.checks}
                  vitals={result.categories.performance.vitals}
                  unavailable={result.categories.performance.unavailable}
                />
                <CategoryCard
                  icon="🤖"
                  title="AI Visibility"
                  score={result.categories.aiVisibility.score}
                  max={result.categories.aiVisibility.max}
                  checks={result.categories.aiVisibility.checks}
                />
                <CategoryCard
                  icon="🔒"
                  title="Security"
                  score={result.categories.security.score}
                  max={result.categories.security.max}
                  checks={result.categories.security.checks}
                />
              </section>

              {/* Issues */}
              <section>
                <h2 className="font-display text-3xl md:text-4xl font-light mb-6">What we found</h2>
                <IssuesList issues={result.issues} passed={result.passed} />
              </section>

              {/* Service Match */}
              <ServiceMatch
                scores={{
                  seo: result.categories.seo.score,
                  performance: result.categories.performance.score,
                  aiVisibility: result.categories.aiVisibility.score,
                  security: result.categories.security.score,
                }}
              />

              {/* Conversion CTA */}
              <section className="relative rounded-3xl p-[2px] bg-gradient-to-br from-accent via-primary to-accent">
                <div className="rounded-3xl bg-background p-8 md:p-12 text-center">
                  <h2 className="font-display text-3xl md:text-5xl font-light mb-4">
                    Ready to <span className="italic text-gradient-gold">fix this</span>?
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-2 leading-relaxed">
                    We've helped dozens of small businesses go from a broken digital presence to one
                    that actually wins customers. Your score shows exactly where you're losing,
                    and we know exactly how to fix it.
                  </p>
                  <p className="text-sm text-muted-foreground mb-8">
                    Your site scored{" "}
                    <span className="text-foreground font-medium">{result.overallScore}/100</span>.
                    Businesses we work with typically reach 85+ within 60 days.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="https://byf-vercel-depo.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 px-7 rounded-full bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:shadow-glow hover:-translate-y-0.5 transition-all"
                    >
                      Start Your Project <ArrowRight className="h-4 w-4" />
                    </a>
                    <button
                      onClick={reset}
                      className="h-12 px-7 rounded-full border border-border bg-card/40 text-foreground font-medium hover:border-primary/40 transition"
                    >
                      Analyze Another Site
                    </button>
                  </div>
                  <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                    <span>✦ No long-term contracts</span>
                    <span>✦ Results in 30-60 days</span>
                    <span>✦ Starting at $800</span>
                    <span>✦ Based in Miami</span>
                  </div>
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
