import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { onRequest as industryFocusGone } from "../our-business/industry-focus";
import { onRequest as partnersGone } from "../our-partners";
import { respondGone } from "./gone";

describe("respondGone", () => {
  it("reuses the branded not-found response with an explicit 410 status", async () => {
    const response = await respondGone({
      next: async () =>
        new Response('<meta name="robots" content="noindex">Page not found', {
          status: 404,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        }),
    });

    assert.equal(response.status, 410);
    assert.equal(response.statusText, "Gone");
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("X-Robots-Tag"), "noindex");
    assert.equal(response.headers.get("Content-Type"), "text/html; charset=utf-8");
    assert.match(await response.text(), /Page not found/);
  });

  it("is wired to each deliberately retired route", () => {
    assert.equal(industryFocusGone, respondGone);
    assert.equal(partnersGone, respondGone);
  });
});
