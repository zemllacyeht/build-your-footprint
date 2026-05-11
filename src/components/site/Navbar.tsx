import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/analyze", label: "Free Audit" },
  { href: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
        scrolled ? "py-3 backdrop-blur-xl bg-background/70 border-b border-border" : "py-5"
      }`}
    >
      <nav className="container flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div
            className="h-9 w-9 rounded-lg grid place-items-center"
            style={{ background: "#d4a574" }}
          >
            <span className="font-display font-bold text-white text-lg">F</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-tight">
              Build Your <span className="text-gradient-gold">Footprint</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Web Services</div>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <Button key={l.href} variant="glass" size="sm" asChild>
              <a href={l.href}>{l.label}</a>
            </Button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-4 h-9 text-sm font-medium rounded-md transition-colors"
            style={{
              background: "transparent",
              border: "1px solid rgba(212,165,116,0.6)",
              color: "#d4a574",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,165,116,0.10)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Start a Project
          </a>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden container mt-4 glass rounded-xl p-6 space-y-4 animate-fade-up">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-foreground/80 hover:text-primary">
              {l.label}
            </a>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-4 h-9 text-sm font-medium rounded-md"
              style={{ border: "1px solid rgba(212,165,116,0.6)", color: "#d4a574" }}
            >
              Start a Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
