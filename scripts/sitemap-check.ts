import path from "node:path";

import {
  assertCurrentSitemapLock,
  readSitemapLock,
} from "../src/lib/sitemap-lock";

const lockPath = path.join(process.cwd(), "src/lib/sitemap.lock.json");
const lock = readSitemapLock(lockPath);

assertCurrentSitemapLock(lock);
console.log("✓ sitemap.lock.json — all content hashes and dates are current");
