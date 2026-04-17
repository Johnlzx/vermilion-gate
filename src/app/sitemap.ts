import type { MetadataRoute } from "next";

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
    url: `https://www.vermiliongate.com${route}`,
    lastModified,
  }));
}
