import {
  buildInquiryEmailContent,
  normalizeInquiryForm,
  validateInquiryForm,
} from "../../src/lib/inquiry-form";
import { company } from "../../src/lib/site-content";
import {
  checkRateLimit,
  type KvNamespaceLike,
} from "../_utils/rateLimit";
import { verifyTurnstile } from "../_utils/turnstile";

interface Env {
  SENDGRID_API_KEY: string;
  SENDGRID_REGION?: string;
  SENDGRID_FROM_EMAIL?: string;
  SENDGRID_TO_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT?: KvNamespaceLike;
  ENVIRONMENT?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

function getSendGridUrl(region?: string): string {
  return region === "global"
    ? "https://api.sendgrid.com/v3/mail/send"
    : "https://api.eu.sendgrid.com/v3/mail/send";
}

export const onRequestPost = async (context: PagesContext) => {
  try {
    const rawBody = (await context.request.json()) as Record<string, string>;
    const form = normalizeInquiryForm(rawBody);
    const turnstileToken = rawBody.turnstileToken?.trim() ?? "";

    if (!form.name || !form.email || !form.subject || !form.message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validationErrors = validateInquiryForm(form);
    if (validationErrors.email) {
      return Response.json(
        { error: validationErrors.email },
        { status: 400 },
      );
    }

    if (context.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return Response.json(
          { error: "Please complete the verification challenge." },
          { status: 400 },
        );
      }

      const ip = context.request.headers.get("CF-Connecting-IP") ?? undefined;
      const valid = await verifyTurnstile(
        turnstileToken,
        context.env.TURNSTILE_SECRET_KEY,
        ip,
      );

      if (!valid) {
        return Response.json(
          { error: "Please wait a moment and try again." },
          { status: 403 },
        );
      }
    }

    if (context.env.RATE_LIMIT) {
      const ip = context.request.headers.get("CF-Connecting-IP") ?? "unknown";
      const allowed = await checkRateLimit({
        kv: context.env.RATE_LIMIT,
        key: `rate:${ip}:/api/contact`,
        limit: 3,
        windowSeconds: 600,
      });

      if (!allowed) {
        return Response.json(
          {
            error:
              "You've submitted several times recently. Please try again in a few minutes.",
          },
          { status: 429 },
        );
      }
    }

    if (!context.env.SENDGRID_API_KEY) {
      console.error("Missing SENDGRID_API_KEY for inquiry form.");
      return Response.json(
        { error: "Inquiry form is not configured right now." },
        { status: 500 },
      );
    }

    const { subject, plainText, html } = buildInquiryEmailContent(form);
    const sendGridResponse = await fetch(
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
              to: [
                {
                  email: context.env.SENDGRID_TO_EMAIL || company.email,
                },
              ],
            },
          ],
          from: {
            email: context.env.SENDGRID_FROM_EMAIL || company.email,
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
      },
    );

    if (!sendGridResponse.ok) {
      console.error(
        "SendGrid inquiry submission failed:",
        sendGridResponse.status,
        await sendGridResponse.text(),
      );
      return Response.json({ error: "Failed to send inquiry" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Inquiry form submission failed:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
