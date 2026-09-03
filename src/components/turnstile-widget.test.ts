import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getTurnstileRenderOptions } from "./turnstile-widget";

describe("getTurnstileRenderOptions", () => {
  it("renders an interaction-only flexible widget", () => {
    const onTokenCalls: string[] = [];
    const lifecycleCalls: string[] = [];
    const options = getTurnstileRenderOptions("test-site-key", {
      onError: () => lifecycleCalls.push("error"),
      onExpired: () => lifecycleCalls.push("expired"),
      onSuccess: (token) => onTokenCalls.push(token),
    });

    assert.equal(options.sitekey, "test-site-key");
    assert.equal(options.action, "contact_form");
    assert.equal(options.size, "flexible");
    assert.equal(options.appearance, "interaction-only");

    options.callback("turnstile-token");
    options["expired-callback"]();
    options["error-callback"]();
    assert.deepEqual(onTokenCalls, ["turnstile-token"]);
    assert.deepEqual(lifecycleCalls, ["expired", "error"]);
  });
});
