import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const SRC = join(process.cwd(), "src");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "test" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(full);
  }
  return out;
}

describe("/work route is fully removed", () => {
  const files = walk(SRC);

  it("has no internal links pointing to /work", () => {
    const offenders: string[] = [];
    // Match href="/work" or to="/work" (with optional trailing path segments excluded)
    const pattern = /(?:href|to)\s*=\s*["'`]\/work(?:[/?#"'`]|$)/;
    for (const f of files) {
      const content = readFileSync(f, "utf8");
      if (pattern.test(content)) offenders.push(f);
    }
    expect(offenders, `Found /work links in:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("does not register a /work route", () => {
    const offenders: string[] = [];
    const pattern = /<Route[^>]*path\s*=\s*["'`]\/work["'`]/;
    for (const f of files) {
      const content = readFileSync(f, "utf8");
      if (pattern.test(content)) offenders.push(f);
    }
    expect(offenders, `/work route still registered in:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("does not import a WorkPage component", () => {
    const offenders: string[] = [];
    const pattern = /from\s+["'`][^"'`]*WorkPage[^"'`]*["'`]/;
    for (const f of files) {
      const content = readFileSync(f, "utf8");
      if (pattern.test(content)) offenders.push(f);
    }
    expect(offenders, `WorkPage imported in:\n${offenders.join("\n")}`).toEqual([]);
  });
});
