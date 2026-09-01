import {
  buildInquiryEmailContent,
  type InquiryFormErrors,
  normalizeInquiryForm,
  validateInquiryForm,
} from "../../src/lib/inquiry-form";
import { company } from "../../src/lib/site-content";
import {
  checkRateLimit,
  type KvNamespaceLike,
} from "../_utils/rateLimit";
import { verifyTurnstile } from "../_utils/turnstile";

const MAX_REQUEST_BYTES = 20_000;
const SENDGRID_TIMEOUT_MS = 10_000;

interface Env {
  ENVIRONMENT?: string;
  SENDGRID_API_KEY?: string;
  SENDGRID_FROM_EMAIL?: string;
  SENDGRID_REGION?: string;
  SENDGRID_TO_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
  VERMILION_GATE_RATE_LIMIT?: KvNamespaceLike;
}

interface PagesContext {
  env: Env;
  request: Request;
}

type ErrorCode =
  | "configuration_error"
  | "delivery_failed"
  | "internal_error"
  | "invalid_request"
  | "rate_limited"
  | "validation_error"
  | "verification_failed"
  | "verification_required"
  | "verification_unavailable";

function getSendGridUrl(region?: string): string {
  return region === "global"
    ? "https://api.sendgrid.com/v3/mail/send"
    : "https://api.eu.sendgrid.com/v3/mail/send";
}

function logEvent(
  level: "error" | "info" | "warn",
  event: string,
  details: Record<string, unknown>,
) {
  console[level](JSON.stringify({ event, ...details }));
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  requestId: string,
) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Request-ID": requestId,
    },
  });
}

function errorResponse(
  code: ErrorCode,
  error: string,
  status: number,
  requestId: string,
  fieldErrors?: InquiryFormErrors,
) {
  return jsonResponse(
    {
      code,
      error,
      ...(fieldErrors ? { fieldErrors } : {}),
      requestId,
      success: false,
    },
    status,
    requestId,
  );
}

function firstErrorMessage(errors: InquiryFormErrors): string {
  return Object.values(errors)[0] ?? "Please review the form and try again.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getTurnstileToken(value: Record<string, unknown>): string {
  return typeof value.turnstileToken === "string"
    ? value.turnstileToken.trim()
    : "";
}

export const onRequestPost = async (context: PagesContext) => {
  const requestId = crypto.randomUUID();
  const environment = context.env.ENVIRONMENT ?? "unknown";

  try {
    const contentLength = Number(
      context.request.headers.get("Content-Length") ?? "0",
    );

    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return errorResponse(
        "invalid_request",
        "The form submission is too large.",
        413,
        requestId,
      );
    }

    let rawBody: unknown;

    try {
      rawBody = await context.request.json();
    } catch {
      return errorResponse(
        "invalid_request",
        "The form submission is not valid.",
        400,
        requestId,
      );
    }

    if (!isRecord(rawBody)) {
      return errorResponse(
        "invalid_request",
        "The form submission is not valid.",
        400,
        requestId,
      );
    }

    const form = normalizeInquiryForm(rawBody);
    const validationErrors = validateInquiryForm(form);

    if (Object.keys(validationErrors).length > 0) {
      return errorResponse(
        "validation_error",
        firstErrorMessage(validationErrors),
        400,
        requestId,
        validationErrors,
      );
    }

    if (!context.env.TURNSTILE_SECRET_KEY) {
      logEvent("error", "inquiry_verification_configuration_error", {
        environment,
        requestId,
      });
      return errorResponse(
        "verification_unavailable",
        "Online verification is unavailable.",
        503,
        requestId,
      );
    }

    const turnstileToken = getTurnstileToken(rawBody);

    if (!turnstileToken) {
      return errorResponse(
        "verification_required",
        "Please complete the verification challenge.",
        400,
        requestId,
      );
    }

    const ip = context.request.headers.get("CF-Connecting-IP") ?? undefined;
    const verification = await verifyTurnstile(
      turnstileToken,
      context.env.TURNSTILE_SECRET_KEY,
      ip,
      environment === "testing" ? "" : "contact_form",
    );

    if (verification.status === "unavailable") {
      logEvent("error", "inquiry_verification_unavailable", {
        environment,
        reason: verification.reason,
        requestId,
      });
      return errorResponse(
        "verification_unavailable",
        "Verification could not be confirmed. Please wait a moment and try again.",
        503,
        requestId,
      );
    }

    if (verification.status === "invalid") {
      logEvent("warn", "inquiry_verification_rejected", {
        environment,
        errorCodes: verification.errorCodes,
        requestId,
      });
      return errorResponse(
        "verification_failed",
        "Verification expired or was unsuccessful. Please try again.",
        403,
        requestId,
      );
    }

    if (context.env.VERMILION_GATE_RATE_LIMIT) {
      const rateLimitIp = ip ?? "unknown";
      const allowed = await checkRateLimit({
        kv: context.env.VERMILION_GATE_RATE_LIMIT,
        key: `rate:${rateLimitIp}:/api/contact`,
        limit: 3,
        windowSeconds: 600,
      });

      if (!allowed) {
        logEvent("warn", "inquiry_rate_limited", {
          environment,
          requestId,
        });
        return errorResponse(
          "rate_limited",
          "You've submitted several times recently. Please try again in a few minutes.",
          429,
          requestId,
        );
      }
    } else {
      logEvent("warn", "inquiry_rate_limit_binding_missing", {
        environment,
        requestId,
      });
    }

    if (!context.env.SENDGRID_API_KEY || !context.env.SENDGRID_FROM_EMAIL) {
      logEvent("error", "inquiry_delivery_configuration_error", {
        environment,
        missingApiKey: !context.env.SENDGRID_API_KEY,
        missingFromAddress: !context.env.SENDGRID_FROM_EMAIL,
        requestId,
      });
      return errorResponse(
        "configuration_error",
        "The enquiry service is unavailable.",
        503,
        requestId,
      );
    }

    const recipient = context.env.SENDGRID_TO_EMAIL?.trim() || company.email;
    const { subject, plainText, html } = buildInquiryEmailContent(form);
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      SENDGRID_TIMEOUT_MS,
    );

    logEvent("info", "inquiry_delivery_started", {
      environment,
      recipient,
      requestId,
    });

    let sendGridResponse: Response;

    try {
      sendGridResponse = await fetch(
        getSendGridUrl(context.env.SENDGRID_REGION),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${context.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: recipient }],
              },
            ],
            from: {
              email: context.env.SENDGRID_FROM_EMAIL,
              name: company.name,
            },
            reply_to: {
              email: form.email,
              name: form.name,
            },
            subject,
            content: [
              { type: "text/plain", value: plainText },
              { type: "text/html", value: html },
            ],
          }),
          signal: controller.signal,
        },
      );
    } catch (error) {
      const timedOut =
        error instanceof DOMException && error.name === "AbortError";

      logEvent("error", "inquiry_delivery_failed", {
        environment,
        reason: timedOut ? "timeout" : "network_error",
        recipient,
        requestId,
      });
      return errorResponse(
        "delivery_failed",
        "We could not confirm delivery. Your message has not been marked as sent.",
        502,
        requestId,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!sendGridResponse.ok) {
      logEvent("error", "inquiry_delivery_failed", {
        environment,
        providerStatus: sendGridResponse.status,
        recipient,
        requestId,
      });
      return errorResponse(
        "delivery_failed",
        "We could not confirm delivery. Your message has not been marked as sent.",
        502,
        requestId,
      );
    }

    const providerMessageId = sendGridResponse.headers.get("X-Message-Id");

    logEvent("info", "inquiry_delivery_accepted", {
      environment,
      providerMessageId,
      recipient,
      requestId,
    });

    return jsonResponse(
      {
        requestId,
        success: true,
      },
      202,
      requestId,
    );
  } catch (error) {
    logEvent("error", "inquiry_submission_failed", {
      environment,
      error: error instanceof Error ? error.message : "Unknown error",
      requestId,
    });
    return errorResponse(
      "internal_error",
      "We could not process the enquiry. Please try again.",
      500,
      requestId,
    );
  }
};
