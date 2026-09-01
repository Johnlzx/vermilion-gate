import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { company } from "@/lib/site-content";

import { onRequestPost } from "./contact";

const originalFetch = globalThis.fetch;
const originalConsole = {
  error: console.error,
  info: console.info,
  warn: console.warn,
};

type MockKv = {
  keys: string[];
  list: (options: {
    limit: number;
    prefix: string;
  }) => Promise<{ keys: { name: string }[] }>;
  put: (
    key: string,
    value: string,
    options: { expirationTtl: number },
  ) => Promise<void>;
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

function createContext(
  body: unknown,
  overrides?: {
    env?: Record<string, unknown>;
    headers?: Record<string, string>;
    ip?: string;
    kv?: MockKv;
  },
) {
  return {
    request: new Request("https://vermiliongate.test/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cf-connecting-ip": overrides?.ip ?? "203.0.113.10",
        ...overrides?.headers,
      },
      body: JSON.stringify(body),
    }),
    env: {
      ENVIRONMENT: "testing",
      SENDGRID_API_KEY: "test-sendgrid-key",
      SENDGRID_FROM_EMAIL: "noreply@vermiliongate.test",
      SENDGRID_REGION: "eu",
      SENDGRID_TO_EMAIL: "",
      TURNSTILE_SECRET_KEY: "turnstile-secret",
      VERMILION_GATE_RATE_LIMIT: overrides?.kv,
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
  turnstileToken: "turnstile-token",
};

function successfulProviderFetch(
  capture?: (input: RequestInfo | URL, init?: RequestInit) => void,
) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    capture?.(input, init);

    if (String(input).includes("siteverify")) {
      return Response.json({
        action: "contact_form",
        hostname: "vermiliongate.test",
        success: true,
      });
    }

    return new Response(null, {
      status: 202,
      headers: { "X-Message-Id": "sendgrid-message-id" },
    });
  };
}

describe("functions/api/contact", () => {
  beforeEach(() => {
    globalThis.fetch = originalFetch;
    console.error = () => undefined;
    console.info = () => undefined;
    console.warn = () => undefined;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
  });

  it("returns field errors without calling external services", async () => {
    let fetchCalls = 0;
    globalThis.fetch = async () => {
      fetchCalls += 1;
      throw new Error("unexpected fetch");
    };

    const response = await onRequestPost(
      createContext({ ...validPayload, message: "" }) as never,
    );
    const payload = (await response.json()) as Record<string, unknown>;

    assert.equal(fetchCalls, 0);
    assert.equal(response.status, 400);
    assert.equal(payload.success, false);
    assert.equal(payload.code, "validation_error");
    assert.deepEqual(payload.fieldErrors, {
      message: "Please add a short description of your brief.",
    });
    assert.equal(response.headers.get("X-Request-ID"), payload.requestId);
  });

  it("rejects a non-object JSON payload", async () => {
    const response = await onRequestPost(createContext(null) as never);

    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, "invalid_request");
  });

  it("rejects malformed JSON as a client error", async () => {
    const context = createContext(validPayload);
    context.request = new Request("https://vermiliongate.test/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not-json",
    });

    const response = await onRequestPost(context as never);

    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, "invalid_request");
  });

  it("fails closed when the Turnstile secret is missing", async () => {
    const response = await onRequestPost(
      createContext(validPayload, {
        env: { TURNSTILE_SECRET_KEY: "" },
      }) as never,
    );

    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "verification_unavailable");
  });

  it("returns 400 when no Turnstile token is provided", async () => {
    const response = await onRequestPost(
      createContext({ ...validPayload, turnstileToken: "" }) as never,
    );

    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, "verification_required");
  });

  it("returns 403 when Turnstile verification fails", async () => {
    globalThis.fetch = async () =>
      Response.json({
        "error-codes": ["invalid-input-response"],
        success: false,
      });

    const response = await onRequestPost(
      createContext(validPayload, {
        env: { ENVIRONMENT: "production" },
      }) as never,
    );

    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, "verification_failed");
  });

  it("rejects a valid token issued for another action", async () => {
    globalThis.fetch = async () =>
      Response.json({ action: "login", success: true });

    const response = await onRequestPost(
      createContext(validPayload, {
        env: { ENVIRONMENT: "production" },
      }) as never,
    );

    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, "verification_failed");
  });

  it("returns 503 when Turnstile cannot be reached", async () => {
    globalThis.fetch = async () => new Response(null, { status: 500 });

    const response = await onRequestPost(
      createContext(validPayload) as never,
    );

    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "verification_unavailable");
  });

  it("sends to the public company address and returns a request reference", async () => {
    const requests: Array<{ init?: RequestInit; url: string }> = [];
    globalThis.fetch = successfulProviderFetch((input, init) => {
      requests.push({ init, url: String(input) });
    });

    const response = await onRequestPost(
      createContext(validPayload) as never,
    );
    const responsePayload = (await response.json()) as {
      requestId: string;
      success: boolean;
    };

    assert.equal(response.status, 202);
    assert.equal(responsePayload.success, true);
    assert.match(responsePayload.requestId, /^[0-9a-f-]{36}$/);
    assert.equal(
      response.headers.get("X-Request-ID"),
      responsePayload.requestId,
    );
    assert.equal(requests[0]?.url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(requests[1]?.url, "https://api.eu.sendgrid.com/v3/mail/send");

    const sendGridPayload = JSON.parse(String(requests[1]?.init?.body));
    assert.equal(
      sendGridPayload.personalizations[0].to[0].email,
      company.email,
    );
    assert.equal(sendGridPayload.reply_to.email, validPayload.email);
  });

  it("honours an explicitly configured recipient", async () => {
    let configuredRecipient = "";
    globalThis.fetch = successfulProviderFetch((input, init) => {
      if (!String(input).includes("siteverify")) {
        const payload = JSON.parse(String(init?.body)) as {
          personalizations: Array<{ to: Array<{ email: string }> }>;
        };
        configuredRecipient = payload.personalizations[0].to[0].email;
      }
    });

    const response = await onRequestPost(
      createContext(validPayload, {
        env: { SENDGRID_TO_EMAIL: "inquiries@example.com" },
      }) as never,
    );

    assert.equal(response.status, 202);
    assert.equal(configuredRecipient, "inquiries@example.com");
  });

  it("returns 429 when the same IP submits over the limit", async () => {
    const kv = createMockKv();
    globalThis.fetch = successfulProviderFetch();

    const responses = [];
    for (let index = 0; index < 4; index += 1) {
      responses.push(
        await onRequestPost(
          createContext(validPayload, { ip: "198.51.100.2", kv }) as never,
        ),
      );
    }

    assert.deepEqual(
      responses.map((response) => response.status),
      [202, 202, 202, 429],
    );
    assert.equal((await responses[3].json()).code, "rate_limited");
  });

  it("does not report success when SendGrid rejects the message", async () => {
    globalThis.fetch = async (input) => {
      if (String(input).includes("siteverify")) {
        return Response.json({ action: "contact_form", success: true });
      }

      return Response.json({ errors: [{ message: "rejected" }] }, { status: 500 });
    };

    const response = await onRequestPost(
      createContext(validPayload) as never,
    );
    const payload = await response.json();

    assert.equal(response.status, 502);
    assert.equal(payload.success, false);
    assert.equal(payload.code, "delivery_failed");
    assert.match(payload.requestId, /^[0-9a-f-]{36}$/);
  });

  it("fails closed when SendGrid credentials are incomplete", async () => {
    globalThis.fetch = successfulProviderFetch();

    const response = await onRequestPost(
      createContext(validPayload, {
        env: { SENDGRID_FROM_EMAIL: "" },
      }) as never,
    );

    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "configuration_error");
  });
});
