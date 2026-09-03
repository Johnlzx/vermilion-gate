const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 8_000;

interface TurnstilePayload {
  action?: string;
  "error-codes"?: string[];
  hostname?: string;
  success?: boolean;
}

export type TurnstileVerificationResult =
  | {
      action?: string;
      hostname?: string;
      status: "valid";
    }
  | {
      errorCodes: string[];
      status: "invalid";
    }
  | {
      reason: "http_error" | "invalid_response" | "network_error" | "timeout";
      status: "unavailable";
    };

function isTurnstilePayload(value: unknown): value is TurnstilePayload {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string,
  expectedAction = "contact_form",
): Promise<TurnstileVerificationResult> {
  const body: Record<string, string> = {
    secret,
    response: token,
  };

  if (ip) {
    body.remoteip = ip;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { reason: "http_error", status: "unavailable" };
    }

    const payload: unknown = await response.json();

    if (!isTurnstilePayload(payload) || typeof payload.success !== "boolean") {
      return { reason: "invalid_response", status: "unavailable" };
    }

    if (!payload.success) {
      return {
        errorCodes: Array.isArray(payload["error-codes"])
          ? payload["error-codes"]
          : [],
        status: "invalid",
      };
    }

    if (expectedAction && payload.action !== expectedAction) {
      return { errorCodes: ["action-mismatch"], status: "invalid" };
    }

    return {
      action: payload.action,
      hostname: payload.hostname,
      status: "valid",
    };
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "AbortError";

    return {
      reason: timedOut ? "timeout" : "network_error",
      status: "unavailable",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
