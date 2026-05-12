# Homepage color audit

The design system (`src/index.css`) defines a clear palette: dark green-black background, warm cream foreground, **emerald** primary (`158 64% 42%`), and **gold** accent (`42 78% 60%`). Most sections (Hero, Services, Process, Work, ClientPortal, Contact, Footer) follow it correctly via tokens like `bg-background`, `text-foreground`, `text-primary`, `text-accent`, `text-gradient-gold`.

Two sections break the system.

## Issues found

### 1. ClientStories.tsx uses a parallel hardcoded palette
Throughout the section (~20 occurrences) it hardcodes:
- `#0a0a0b` background (neutral black, not our green-tinted `--background`)
- `#f0f0f2` text (cool white, not our warm cream `--foreground`)
- `#d4a574` / `#e8c89a` gold (warmer/duller than the site's `--accent` gold)
- `#b8b8be`, `#888890` muted greys (cool, not our green-tinted muted)

Result: the entire stories section reads as a slightly different brand, cooler and more neutral than the rest of the page.

### 2. Pricing.tsx featured tier uses Tailwind teal
Lines 361 and 403 use `border-teal-400/70`, `bg-teal-500`, `text-white`, `shadow-teal-500/30` for the featured plan. Teal is close to but not the same as our emerald primary, and `text-white` bypasses `primary-foreground`.

## Fix plan

**ClientStories.tsx**
- Replace inline `style={{ background: "#0a0a0b" }}` on the section with `bg-background` (or remove and let parent show through).
- Swap hardcoded text colors for tokens:
  - `#f0f0f2` → `text-foreground` (or `hsl(var(--foreground))` where inline is required)
  - `#b8b8be`, `#888890` → `text-muted-foreground`
  - `#d4a574`, `#e8c89a` → `text-accent` / `hsl(var(--accent))`
- Update the radial gradient and accent dot/button backgrounds to use `hsl(var(--accent) / 0.18)` and `hsl(var(--accent))`.
- Prefer Tailwind classes; keep inline styles only where dynamic (animation delays, computed transforms).

**Pricing.tsx**
- Featured card border: `border-teal-400/70` → `border-primary/70`.
- Featured CTA: `bg-teal-500 text-white hover:bg-teal-600 border-transparent shadow-teal-500/30` → `bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-elegant` (or a new `premium` button variant if we want this reusable).

## Verification

- Visual check of the homepage at desktop and mobile widths after changes.
- Grep `rg "#[0-9a-fA-F]{3,6}|teal-|text-white|bg-white"` across `src/components/site/` to confirm no hardcoded colors remain on homepage components.

## Out of scope

- No changes to spacing, copy, layout, or non-homepage routes.
- No changes to the token values themselves in `index.css`.
