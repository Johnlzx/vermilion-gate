import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { company } from "@/lib/site-content";

import { onRequestPost } from "./contact";

const originalFetch = globalThis.fetch;

type MockKv = {
  keys: string[];
  list: (options: { prefix: string; limit: number }) => Promise<{ keys: { name: string }[] }>;
  put: (key: string, value: string, options: { expirationTtl: number }) => Promise<void>;
};

function createMockKv(): MockKv {
  const keys: string[] = [];

  return {
    keys,
    async list({ prefix, limit }) {
      return {
        keys: keys
          .filter((key) => key.startsWith(prefix))
          .slice(0, limit)
          .map((name) => ({ name })),
      };
    },
    async put(key) {
      keys.push(key);
    },
  };
}

function createContext(body: unknown, overrides?: {
  ip?: string;
  kv?: MockKv;
  env?: Record<string, unknown>;
}) {
  return {
    request: new Request("https://vermiliongate.test/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cf-connecting-ip": overrides?.ip ?? "203.0.113.10",
      },
      body: JSON.stringify(body),
    }),
    env: {
      SENDGRID_API_KEY: "test-sendgrid-key",
      SENDGRID_FROM_EMAIL: "noreply@vermiliongate.test",
      SENDGRID_REGION: "eu",
      SENDGRID_TO_EMAIL: "",
      RATE_LIMIT: overrides?.kv,
      ENVIRONMENT: "testing",
      ...overrides?.env,
    },
  };
}

const validPayload = {
  name: "Jane Doe",
  email: "jane@example.com",
  contactNumber: "+65 1234 5678",
  subject: "Strategic mandate",
  message: "We need help thinking through a cross-border ownership transition.",
  turnstileToken: "",
};

describe("functions/api/contact", () => {
  beforeEach(() => {
    globalThis.fetch = originalFetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await onRequestPost(
      createContext({ ...validPayload, message: "" }) as never,
    );

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: "Missing required fields",
    });
  });

  it("sends a SendGrid request when the payload is valid", async () => {
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;

    globalThis.fetch = async (input, init) => {
      capturedUrl = String(input);
      capturedInit = init;
      return new Response(null, { status: 202 });
    };

    const response = await onRequestPost(createContext(validPayload) as never);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(capturedUrl, "https://api.eu.sendgrid.com/v3/mail/send");
    assert.ok(capturedInit);

    const payload = JSON.parse(String(capturedInit.body));
    assert.equal(payload.personalizations[0].to[0].email, company.email);
    assert.equal(payload.reply_to.email, validPayload.email);
  });

  it("returns 400 when Turnstile is configured but no token is provided", async () => {
    const response = await onRequestPost(
      createContext(validPayload, {
        env: {
          TURNSTILE_SECRET_KEY: "turnstile-secret",
        },
      }) as never,
    );

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: "Please complete the verification challenge.",
    });
  });

  it("returns 403 when Turnstile verification fails", async () => {
    let verificationCalls = 0;
    globalThis.fetch = async () => {
      verificationCalls += 1;
      return Response.json({ success: false }, { status: 200 });
    };

    const response = await onRequestPost(
      createContext(
        { ...validPayload, turnstileToken: "turnstile-token" },
        {
          env: {
            TURNSTILE_SECRET_KEY: "turnstile-secret",
          },
        },
      ) as never,
    );

    assert.equal(verificationCalls, 1);
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), {
      error: "Please wait a moment and try again.",
    });
  });

  it("verifies Turnstile before sending email when a token is provided", async () => {
    const urls: string[] = [];

    globalThis.fetch = async (input, init) => {
      urls.push(String(input));

      if (String(input).includes("siteverify")) {
        return Response.json({ success: true }, { status: 200 });
      }

      assert.ok(init);
      return new Response(null, { status: 202 });
    };

    const response = await onRequestPost(
      createContext(
        { ...validPayload, turnstileToken: "turnstile-token" },
        {
          env: {
            TURNSTILE_SECRET_KEY: "turnstile-secret",
          },
        },
      ) as never,
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(urls.length, 2);
    assert.match(urls[0], /siteverify/);
    assert.equal(urls[1], "https://api.eu.sendgrid.com/v3/mail/send");
  });

  it("returns 429 when the same IP submits over the limit", async () => {
    const kv = createMockKv();
    globalThis.fetch = async () => new Response(null, { status: 202 });

    const firstResponse = await onRequestPost(
      createContext(validPayload, { ip: "198.51.100.2", kv }) as never,
    );
    const secondResponse = await onRequestPost(
      createContext(validPayload, { ip: "198.51.100.2", kv }) as never,
    );
    const thirdResponse = await onRequestPost(
      createContext(validPayload, { ip: "198.51.100.2", kv }) as never,
    );
    const fourthResponse = await onRequestPost(
      createContext(validPayload, { ip: "198.51.100.2", kv }) as never,
    );

    assert.equal(firstResponse.status, 200);
    assert.equal(secondResponse.status, 200);
    assert.equal(thirdResponse.status, 200);
    assert.equal(fourthResponse.status, 429);
    assert.deepEqual(await fourthResponse.json(), {
      error: "You've submitted several times recently. Please try again in a few minutes.",
    });
  });
});
