import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getTurnstileRenderOptions } from "./turnstile-widget";

describe("getTurnstileRenderOptions", () => {
  it("renders an always-visible flexible widget", () => {
    const onTokenCalls: string[] = [];
    const options = getTurnstileRenderOptions("test-site-key", (token) => {
      onTokenCalls.push(token);
    });

    assert.equal(options.sitekey, "test-site-key");
    assert.equal(options.size, "flexible");
    assert.equal(options.appearance, "always");

    options.callback("turnstile-token");
    assert.deepEqual(onTokenCalls, ["turnstile-token"]);
  });
});
