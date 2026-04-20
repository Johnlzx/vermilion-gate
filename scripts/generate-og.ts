/**
 * Generate the static site OG image.
 *
 * Run on demand whenever the homepage hero copy, brand logo, or site OG layout
 * changes. The PNG is committed to git and served from /og/site.png; routine
 * builds do not re-render it.
 *
 *   pnpm og:site
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderSiteOg } from "../src/lib/og/site";

async function main() {
  const out = path.join(process.cwd(), "public/og/site.png");
  await mkdir(path.dirname(out), { recursive: true });

  const response = await renderSiteOg();
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(out, buffer);

  const kb = (buffer.byteLength / 1024).toFixed(1);
  console.log(`✓ wrote ${path.relative(process.cwd(), out)} (${kb} KB)`);
}

main().catch((err) => {
  console.error("✗ failed to generate site OG image");
  console.error(err);
  process.exit(1);
});
