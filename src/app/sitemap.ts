import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

const routes = [
  "",
  "/about-us/overview",
  "/our-business/overview",
  "/our-business/illustrative-themes",
  "/insights",
  "/contact-us/our-office",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
  }));
}
