import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import type { MetadataRoute } from "next";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

export type RouteSpec = {
  path: string;
  deps: string[];
  priority: number;
  changeFrequency: ChangeFrequency;
};

/**
 * Each route declares the files whose contents define its visible output.
 * Touch any of them and `pnpm sitemap:lock` will bump that route's lastmod.
 */
export const sitemapRoutes: RouteSpec[] = [
  {
    path: "",
    deps: [
      "src/app/page.tsx",
      "src/components/home/HomeEditorial.tsx",
      "src/lib/site-content.ts",
    ],
    priority: 1.0,
    changeFrequency: "monthly",
  },
  {
    path: "/about-us/overview",
    deps: [
      "src/app/about-us/overview/page.tsx",
      "src/lib/site-content.ts",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/our-business/overview",
    deps: [
      "src/app/our-business/overview/page.tsx",
      "src/lib/site-content.ts",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/our-business/illustrative-themes",
    deps: [
      "src/app/our-business/illustrative-themes/page.tsx",
      "src/lib/site-content.ts",
    ],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/insights",
    deps: ["src/app/insights/page.tsx", "src/lib/site-content.ts"],
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    path: "/contact-us/our-office",
    deps: [
      "src/app/contact-us/our-office/page.tsx",
      "src/components/inquiry-form.tsx",
      "src/lib/site-content.ts",
    ],
    priority: 0.6,
    changeFrequency: "yearly",
  },
  {
    path: "/privacy",
    deps: ["src/app/privacy/page.tsx"],
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/terms",
    deps: ["src/app/terms/page.tsx"],
    priority: 0.3,
    changeFrequency: "yearly",
  },
];

export function hashRoute(deps: string[]): string {
  const hash = createHash("sha256");
  for (const rel of deps) {
    const abs = path.join(process.cwd(), rel);
    const content = readFileSync(abs);
    hash.update(`${rel}::`).update(content).update("\n");
  }
  return hash.digest("hex").slice(0, 16);
}
