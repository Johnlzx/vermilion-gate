import { readFileSync } from "node:fs";

import { hashRoute } from "./sitemap-hash";
import { sitemapRoutes } from "./sitemap-routes";

export type SitemapLockEntry = {
  hash: string;
  lastmod: string;
};

export type SitemapLock = Record<string, SitemapLockEntry>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function readSitemapLock(lockPath: string): SitemapLock {
  const parsed: unknown = JSON.parse(readFileSync(lockPath, "utf8"));

  if (!isRecord(parsed)) {
    throw new Error("sitemap.lock.json must contain a JSON object");
  }

  return parsed as SitemapLock;
}

export function getSitemapLockIssues(lock: SitemapLock): string[] {
  const issues: string[] = [];
  const expectedRoutes = new Set(sitemapRoutes.map(({ path: route }) => route));

  for (const { path: route, deps } of sitemapRoutes) {
    const label = route || "/";
    const entry: unknown = lock[route];

    if (!isRecord(entry)) {
      issues.push(`${label}: missing lock entry`);
      continue;
    }

    if (typeof entry.hash !== "string" || entry.hash !== hashRoute(deps)) {
      issues.push(`${label}: content hash is stale`);
    }

    if (typeof entry.lastmod !== "string" || !isValidDate(entry.lastmod)) {
      issues.push(`${label}: lastmod must be a real YYYY-MM-DD date`);
    }
  }

  for (const route of Object.keys(lock)) {
    if (!expectedRoutes.has(route)) {
      issues.push(`${route || "/"}: unexpected lock entry`);
    }
  }

  return issues;
}

export function assertCurrentSitemapLock(lock: SitemapLock): void {
  const issues = getSitemapLockIssues(lock);

  if (issues.length > 0) {
    throw new Error(
      [
        "sitemap.lock.json is out of date.",
        ...issues.map((issue) => `- ${issue}`),
        "Run `pnpm sitemap:lock` alongside intentional content changes, then review the dates before committing.",
      ].join("\n"),
    );
  }
}
