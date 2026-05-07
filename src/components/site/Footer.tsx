import { Mail, Linkedin, Twitter, Instagram, LogIn } from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border pt-16 pb-8 mt-20 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Company */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
                <span className="font-display font-bold text-primary-foreground text-base">F</span>
              </div>
              <div className="leading-tight">
                <div className="font-display text-sm font-semibold">
                  Build Your <span className="text-gradient-gold">Footprint</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Web Services</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              Crafting intentional digital footprints for businesses that value design and longevity.
            </p>
            <a
              href="mailto:hello@buildyourfootprint.com"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              hello@buildyourfootprint.com
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Web Design</a></li>
              <li><a href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Development</a></li>
              <li><a href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Hosting & Care</a></li>
              <li><a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="/work" className="text-muted-foreground hover:text-foreground transition-colors">Our Work</a></li>
            </ul>
          </div>

          {/* Client Area */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Client Area</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Client Login
                </a>
              </li>
              <li><a href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Project Portal</a></li>
              <li><a href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Billing & Invoices</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Social / Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Connect</h4>
            <div className="flex items-center gap-2 mb-5">
              <span
                aria-label="LinkedIn (coming soon)"
                title="Coming soon"
                className="h-9 w-9 rounded-lg glass grid place-items-center text-muted-foreground/50 cursor-not-allowed"
              >
                <Linkedin className="h-4 w-4" />
              </span>
              <span
                aria-label="Twitter (coming soon)"
                title="Coming soon"
                className="h-9 w-9 rounded-lg glass grid place-items-center text-muted-foreground/50 cursor-not-allowed"
              >
                <Twitter className="h-4 w-4" />
              </span>
              <span
                aria-label="Instagram (coming soon)"
                title="Coming soon"
                className="h-9 w-9 rounded-lg glass grid place-items-center text-muted-foreground/50 cursor-not-allowed"
              >
                <Instagram className="h-4 w-4" />
              </span>
            </div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><span title="Coming soon" className="text-muted-foreground/50 cursor-not-allowed">Terms of Service</span></li>
              <li><span title="Coming soon" className="text-muted-foreground/50 cursor-not-allowed">Cookie Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            © {year} Build Your Footprint. Designed with intention.
          </div>
          <div className="text-xs text-muted-foreground">
            Built remotely · Serving clients worldwide
          </div>
        </div>
      </div>
    </footer>
  );
};
