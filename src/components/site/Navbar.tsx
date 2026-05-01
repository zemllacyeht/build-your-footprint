import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#work", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3 backdrop-blur-xl bg-background/70 border-b border-border" : "py-5"
      }`}
    >
      <nav className="container flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <span className="font-display font-bold text-primary-foreground text-lg">F</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-tight">
              Build Your <span className="text-gradient-gold">Footprint</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Web Services</div>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-gold transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="glass" size="sm" asChild>
            <a href="/login">Client Login</a>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <a href="#contact">Start a Project</a>
          </Button>
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
            <Button variant="glass" size="sm" asChild><a href="/login">Client Login</a></Button>
            <Button variant="hero" size="sm" asChild><a href="#contact">Start a Project</a></Button>
          </div>
        </div>
      )}
    </header>
  );
};
