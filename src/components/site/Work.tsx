import { ArrowUpRight } from "lucide-react";
import midasTouchShot from "@/assets/work-midas-touch.jpg";
import midasTouchShotWebp from "@/assets/work-midas-touch.webp";

type Project = {
  title: string;
  tag: string;
  color: string;
  image?: string;
  href?: string;
};

const projects: Project[] = [
  {
    title: "Midas Touch Professional Services",
    tag: "Local Services · Booking",
    color: "from-accent/30 to-primary/20",
    image: midasTouchShot,
    href: "https://www.midastouchmiami.com",
  },
  { title: "Aspen Architecture Studio", tag: "Portfolio · Editorial", color: "from-primary/30 to-accent/10" },
  { title: "Riverside Wellness Clinic", tag: "Healthcare · Booking", color: "from-primary/20 to-accent/20" },
  { title: "Forge & Field Outfitters", tag: "Retail · Catalog", color: "from-accent/30 to-primary/10" },
];

export const Work = () => {
  return (
    <section id="work" className="py-32 relative">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Selected Work</div>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
              Footprints we've <span className="italic text-gradient-gold">made</span>.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            A small selection of recent client launches. Every project is custom. No templates, no shortcuts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p, i) => {
            const Wrapper = (props: { children: React.ReactNode; className: string }) =>
              p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className={props.className}
                  aria-label={`Visit ${p.title}`}
                >
                  {props.children}
                </a>
              ) : (
                <div className={props.className}>{props.children}</div>
              );

            return (
              <Wrapper
                key={p.title}
                className={`group relative aspect-[3/2] rounded-2xl overflow-hidden glass cursor-pointer block ${
                  i % 2 === 1 ? "md:translate-y-12" : ""
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color}`} />
                <div className="absolute inset-0 grain opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                {/* Mock browser */}
                <div className="absolute inset-8 rounded-xl glass overflow-hidden flex flex-col">
                  <div className="flex items-center gap-1.5 p-3 border-b border-border shrink-0">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                  </div>
                  {p.image ? (
                    <div className="flex-1 relative overflow-hidden bg-background">
                      <picture>
                        {p.image === midasTouchShot && (
                          <source srcSet={midasTouchShotWebp} type="image/webp" />
                        )}
                        <img
                          src={p.image}
                          alt={`${p.title} website preview`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      </picture>
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="font-display text-lg font-medium">{p.title}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {p.tag}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 grid place-items-center text-center p-6">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="font-display text-2xl font-medium mb-2">{p.title}</div>
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {p.tag}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute top-6 right-6 h-12 w-12 rounded-full glass grid place-items-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-500">
                  <ArrowUpRight className="h-5 w-5 text-accent" />
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
