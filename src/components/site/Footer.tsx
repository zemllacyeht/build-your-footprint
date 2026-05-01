export const Footer = () => {
  return (
    <footer className="border-t border-border py-12 mt-20">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
              <span className="font-display font-bold text-primary-foreground text-sm">F</span>
            </div>
            <div className="text-sm">
              <span className="font-display font-semibold">Build Your Footprint</span>
              <span className="text-muted-foreground"> · Web Services</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Build Your Footprint. Designed with intention.
          </div>
        </div>
      </div>
    </footer>
  );
};
