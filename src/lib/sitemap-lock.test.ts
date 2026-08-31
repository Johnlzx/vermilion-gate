import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertCurrentSitemapLock,
  getSitemapLockIssues,
  type SitemapLock,
} from "./sitemap-lock";
import { hashRoute } from "./sitemap-hash";
import { sitemapRoutes } from "./sitemap-routes";

function makeCurrentLock(): SitemapLock {
  return Object.fromEntries(
    sitemapRoutes.map(({ path: route, deps }) => [
      route,
      { hash: hashRoute(deps), lastmod: "2026-08-31" },
    ]),
  );
}

describe("sitemap lock validation", () => {
  it("accepts a complete lock with current hashes and valid dates", () => {
    const lock = makeCurrentLock();

    assert.deepEqual(getSitemapLockIssues(lock), []);
    assert.doesNotThrow(() => assertCurrentSitemapLock(lock));
  });

  it("reports stale, invalid, missing, and unexpected entries", () => {
    const lock = makeCurrentLock();
    lock[""].hash = "stale";
    lock["/about-us/overview"].lastmod = "2026-02-30";
    delete lock["/our-business/overview"];
    lock["/retired"] = { hash: "unused", lastmod: "2026-08-31" };

    assert.deepEqual(getSitemapLockIssues(lock), [
      "/: content hash is stale",
      "/about-us/overview: lastmod must be a real YYYY-MM-DD date",
      "/our-business/overview: missing lock entry",
      "/retired: unexpected lock entry",
    ]);
    assert.throws(
      () => assertCurrentSitemapLock(lock),
      /sitemap\.lock\.json is out of date/,
    );
  });
});
