import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { onRequest } from "./_middleware";

describe("functions/api/_middleware", () => {
  it("answers same-origin preflight requests without invoking the endpoint", async () => {
    let nextCalled = false;
    const response = await onRequest({
      request: new Request("https://www.vermiliongate.com/api/contact", {
        method: "OPTIONS",
        headers: { Origin: "https://www.vermiliongate.com" },
      }),
      async next() {
        nextCalled = true;
        return new Response();
      },
    });

    assert.equal(nextCalled, false);
    assert.equal(response.status, 204);
    assert.equal(
      response.headers.get("Access-Control-Allow-Origin"),
      "https://www.vermiliongate.com",
    );
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  });

  it("rejects cross-origin preflight requests", async () => {
    const response = await onRequest({
      request: new Request("https://www.vermiliongate.com/api/contact", {
        method: "OPTIONS",
        headers: { Origin: "https://example.com" },
      }),
      async next() {
        throw new Error("next should not be called");
      },
    });

    assert.equal(response.status, 403);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
  });

  it("adds no-store and security headers to API responses", async () => {
    const response = await onRequest({
      request: new Request("https://www.vermiliongate.com/api/contact", {
        method: "POST",
        headers: { Origin: "https://www.vermiliongate.com" },
      }),
      async next() {
        return Response.json({ success: true });
      },
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  });
});
