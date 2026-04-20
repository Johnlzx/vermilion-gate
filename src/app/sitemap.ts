import { readFileSync } from "node:fs";
import path from "node:path";

import type { MetadataRoute } from "next";

import { hashRoute, sitemapRoutes } from "@/lib/sitemap-routes";
import { siteUrl } from "@/lib/site-url";

type LockEntry = { hash: string; lastmod: string };
type Lock = Record<string, LockEntry>;

export const dynamic = "force-static";

const LOCK_PATH = path.join(process.cwd(), "src/lib/sitemap.lock.json");

function loadLock(): Lock {
  try {
    return JSON.parse(readFileSync(LOCK_PATH, "utf8")) as Lock;
  } catch {
    return {};
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lock = loadLock();
  const today = new Date();

  return sitemapRoutes.map(({ path: route, priority, changeFrequency, deps }) => {
    const hash = hashRoute(deps);
    const entry = lock[route];
    const lastModified =
      entry && entry.hash === hash ? new Date(entry.lastmod) : today;

    return {
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });
}
