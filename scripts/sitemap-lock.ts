/**
 * Freeze sitemap lastmod values.
 *
 * Run after editing site content. For each route, recomputes a content hash
 * and bumps the locked lastmod date if the hash changed. The resulting
 * `src/lib/sitemap.lock.json` is committed to git so subsequent builds
 * reproduce the same dates regardless of when they run.
 *
 *   pnpm sitemap:lock
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { hashRoute, sitemapRoutes } from "../src/lib/sitemap-routes";

type LockEntry = { hash: string; lastmod: string };
type Lock = Record<string, LockEntry>;

const LOCK_PATH = path.join(process.cwd(), "src/lib/sitemap.lock.json");

function loadLock(): Lock {
  try {
    return JSON.parse(readFileSync(LOCK_PATH, "utf8")) as Lock;
  } catch {
    return {};
  }
}

function main() {
  const lock = loadLock();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const next: Lock = {};
  const changes: string[] = [];

  for (const { path: route, deps } of sitemapRoutes) {
    const hash = hashRoute(deps);
    const prev = lock[route];

    if (prev && prev.hash === hash) {
      next[route] = prev;
    } else {
      next[route] = { hash, lastmod: today };
      changes.push(route || "/");
    }
  }

  writeFileSync(LOCK_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");

  if (changes.length === 0) {
    console.log("✓ sitemap.lock.json — no content changes detected");
  } else {
    console.log(
      `✓ sitemap.lock.json — bumped lastmod=${today} for ${changes.length} route(s):`,
    );
    for (const route of changes) console.log(`  - ${route}`);
    console.log("Commit the lock file alongside your content changes.");
  }
}

main();
