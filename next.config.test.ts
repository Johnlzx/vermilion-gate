import assert from "node:assert/strict";
import { describe, it } from "node:test";

import nextConfig from "./next.config";

describe("next.config", () => {
  it("uses static export friendly settings", () => {
    assert.equal(nextConfig.output, "export");
    assert.deepEqual(nextConfig.images, { unoptimized: true });
  });
});
