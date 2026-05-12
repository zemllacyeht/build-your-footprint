import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Home } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

const sections = [
  { href: "/services", label: "Services", desc: "What we design, build, and care for." },
  { href: "/process", label: "Process", desc: "How we run a project from kickoff to launch." },
  { href: "/pricing", label: "Pricing", desc: "Transparent packages and care plans." },
  { href: "/analyze", label: "Free Audit", desc: "Get an instant report on your current site." },
  { href: "/contact", label: "Contact", desc: "Tell us about your project." },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Page not found · Build Your Footprint";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Error 404</div>
            <h1 className="font-display text-5xl md:text-7xl font-light leading-tight mb-6">
              This page left no <span className="italic text-gradient-gold">footprint</span>.
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-2">
              We couldn't find <code className="px-1.5 py-0.5 rounded bg-muted text-foreground/80">{location.pathname}</code>.
            </p>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              It may have moved, been renamed, or never existed. Try one of the sections below.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/"><Home className="h-4 w-4" /> Back to home</Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/contact">Talk to us <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="glass rounded-xl p-6 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display text-lg">{s.label}</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
