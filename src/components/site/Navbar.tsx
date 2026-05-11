import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/analyze", label: "Free Audit", badge: true },
  { href: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();

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
        <a href="/" className="flex items-center gap-2 group">
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

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="gold"
            size="sm"
            asChild
            className="mr-2 shadow-glow ring-1 ring-primary/40 font-semibold tracking-wide"
          >
            <a href="/login">Client Login</a>
          </Button>
          {links.map((l) => (
            <Button
              key={l.href}
              variant="glass"
              size="sm"
              asChild
              className={l.badge ? "ring-1 ring-primary/40 text-primary" : ""}
            >
              <a href={l.href} className="inline-flex items-center gap-1.5">
                {l.label}
                {l.badge && (
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
                    Free
                  </span>
                )}
              </a>
            </Button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative h-9 w-9 grid place-items-center rounded-md glass hover:border-primary/40 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-gradient-gold text-accent-foreground text-[10px] font-semibold grid place-items-center">
                {count}
              </span>
            )}
          </button>
          <Button variant="hero" size="sm" asChild>
            <a href="/contact">Start a Project</a>
          </Button>
        </div>

        <button className="md:hidden text-foreground flex items-center gap-3" onClick={() => setOpen(!open)} aria-label="Menu">
          <span
            onClick={(e) => { e.stopPropagation(); openCart(); }}
            className="relative h-8 w-8 grid place-items-center rounded-md glass"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-gradient-gold text-accent-foreground text-[10px] font-semibold grid place-items-center">
                {count}
              </span>
            )}
          </span>
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
            <Button variant="gold" size="sm" asChild><a href="/login">Client Login</a></Button>
            <Button variant="hero" size="sm" asChild><a href="/contact">Start a Project</a></Button>
          </div>
        </div>
      )}
    </header>
  );
};
