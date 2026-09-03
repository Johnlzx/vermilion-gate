import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

export function hashRoute(deps: string[]): string {
  const hash = createHash("sha256");

  for (const rel of deps) {
    const abs = path.join(process.cwd(), rel);
    const content = readFileSync(abs);
    hash.update(`${rel}::`).update(content).update("\n");
  }

  return hash.digest("hex").slice(0, 16);
}
