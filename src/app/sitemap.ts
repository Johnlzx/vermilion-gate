import type { MetadataRoute } from "next";

import type { SitemapLock } from "@/lib/sitemap-lock";
import sitemapLockJson from "@/lib/sitemap.lock.json";
import { sitemapRoutes } from "@/lib/sitemap-routes";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const sitemapLock = sitemapLockJson as SitemapLock;

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.map(({ path: route, priority, changeFrequency }) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(`${sitemapLock[route].lastmod}T00:00:00.000Z`),
    changeFrequency,
    priority,
  }));
}
