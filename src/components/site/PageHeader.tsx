import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  breadcrumb?: string;
}

export const PageHeader = ({ eyebrow, title, description, breadcrumb }: PageHeaderProps) => {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden grain">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-primary/10 blur-[140px] rounded-full" />
        <div className="absolute top-1/3 right-0 h-[300px] w-[300px] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="container">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8 animate-fade-in">
          <a href="/" className="hover:text-accent transition-colors">Home</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-accent">{breadcrumb ?? eyebrow}</span>
        </nav>

        <div className="max-w-4xl">
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-5 animate-fade-up">{eyebrow}</div>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.02] mb-6 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
