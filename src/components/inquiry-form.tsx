"use client";

import { useState } from "react";

import {
  resetTurnstile,
  type TurnstileState,
  TurnstileWidget,
  turnstileEnabled,
  turnstileRequired,
} from "@/components/turnstile-widget";
import {
  initialInquiryFormState,
  type InquiryFormErrors,
  type InquiryFormState,
  inquiryFieldLimits,
  normalizeInquiryForm,
  validateInquiryForm,
} from "@/lib/inquiry-form";
import { company } from "@/lib/site-content";

const SUBMISSION_TIMEOUT_MS = 20_000;

interface InquiryFormSubmitStateOptions {
  submitting: boolean;
  turnstileEnabled: boolean;
  turnstileRequired: boolean;
  turnstileToken: string;
}

interface ContactApiResponse {
  error?: string;
  fieldErrors?: InquiryFormErrors;
  requestId?: string;
  success?: boolean;
}

export function getInquiryFormSubmitState({
  submitting,
  turnstileEnabled,
  turnstileRequired,
  turnstileToken,
}: InquiryFormSubmitStateOptions) {
  const verificationUnavailable = turnstileRequired && !turnstileEnabled;
  const waitingForVerification = turnstileEnabled && !turnstileToken;

  return {
    disabled:
      submitting || verificationUnavailable || waitingForVerification,
    verificationUnavailable,
    waitingForVerification,
  };
}

function getVerificationHint(
  state: TurnstileState,
  waitingForVerification: boolean,
) {
  if (!waitingForVerification) {
    return "We review every enquiry directly and reply as soon as possible.";
  }

  switch (state) {
    case "error":
      return "Verification could not load. Reload the page or email us directly.";
    case "expired":
      return "Verification expired. Please complete the challenge again.";
    case "loading":
      return "Loading secure verification…";
    default:
      return "Complete the verification challenge below to enable submission.";
  }
}

function focusFirstInvalidField(
  formElement: HTMLFormElement,
  errors: InquiryFormErrors,
) {
  const firstField = Object.keys(errors)[0] as keyof InquiryFormState | undefined;
  const control = firstField
    ? formElement.elements.namedItem(firstField)
    : null;

  if (control instanceof HTMLElement) {
    control.focus();
  }
}

export function InquiryForm() {
  const [form, setForm] = useState<InquiryFormState>(initialInquiryFormState);
  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestId, setRequestId] = useState("");
  const [submittedReference, setSubmittedReference] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileState, setTurnstileState] = useState<TurnstileState>(
    turnstileEnabled ? "loading" : "error",
  );
  const submitState = getInquiryFormSubmitState({
    submitting,
    turnstileEnabled,
    turnstileRequired,
    turnstileToken,
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (submittedReference) {
      setSubmittedReference("");
    }

    if (errors[name as keyof InquiryFormErrors]) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[name as keyof InquiryFormErrors];
        return nextErrors;
      });
    }

    if (submitError) {
      setSubmitError("");
      setRequestId("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const normalizedForm = normalizeInquiryForm({
      ...form,
      subject: "Website enquiry",
    });
    const nextErrors = validateInquiryForm(normalizedForm);

    setErrors(nextErrors);
    setSubmittedReference("");

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError("Please review the highlighted fields and try again.");
      setRequestId("");
      focusFirstInvalidField(formElement, nextErrors);
      return;
    }

    if (submitState.verificationUnavailable) {
      setSubmitError(
        "Online verification is unavailable.",
      );
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setSubmitError("Please complete the verification challenge.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setRequestId("");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      SUBMISSION_TIMEOUT_MS,
    );

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...normalizedForm,
          turnstileToken,
        }),
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => ({}))) as ContactApiResponse;

      if (response.ok && payload.success && payload.requestId) {
        setForm(initialInquiryFormState);
        setErrors({});
        setTurnstileToken("");
        setSubmittedReference(payload.requestId);
        return;
      }

      if (payload.fieldErrors) {
        setErrors(payload.fieldErrors);
        focusFirstInvalidField(formElement, payload.fieldErrors);
      }

      setSubmitError(
        payload.error ||
          "We could not confirm delivery. Please try again.",
      );
      setRequestId(payload.requestId ?? "");
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";

      setSubmitError(
        timedOut
          ? "Delivery confirmation timed out. Your form has been kept; please try again."
          : "A network error prevented delivery confirmation. Your form has been kept; please try again.",
      );
      setRequestId("");
    } finally {
      window.clearTimeout(timeoutId);
      setSubmitting(false);

      if (turnstileEnabled) {
        resetTurnstile();
        setTurnstileToken("");
        setTurnstileState("ready");
      }
    }
  }

  return (
    <form
      aria-busy={submitting}
      className="inquiry-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="field">
        <span className="field__label">Name*</span>
        <input
          aria-describedby={errors.name ? "error-name" : undefined}
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          disabled={submitting}
          maxLength={inquiryFieldLimits.name}
          name="name"
          onChange={handleChange}
          required
          type="text"
          value={form.name}
        />
        {errors.name ? (
          <small className="field-error" id="error-name">
            {errors.name}
          </small>
        ) : null}
      </label>

      <label className="field">
        <span className="field__label">Organisation</span>
        <input
          aria-describedby={errors.contactNumber ? "error-organisation" : undefined}
          aria-invalid={Boolean(errors.contactNumber)}
          autoComplete="organization"
          disabled={submitting}
          maxLength={inquiryFieldLimits.contactNumber}
          name="contactNumber"
          onChange={handleChange}
          type="text"
          value={form.contactNumber}
        />
        {errors.contactNumber ? (
          <small className="field-error" id="error-organisation">
            {errors.contactNumber}
          </small>
        ) : null}
      </label>

      <label className="field">
        <span className="field__label">Email*</span>
        <input
          aria-describedby={errors.email ? "error-email" : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          disabled={submitting}
          maxLength={inquiryFieldLimits.email}
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={form.email}
        />
        {errors.email ? (
          <small className="field-error" id="error-email">
            {errors.email}
          </small>
        ) : null}
      </label>

      <label className="field">
        <span className="field__label">What are you trying to achieve?*</span>
        <textarea
          aria-describedby={errors.message ? "error-message" : undefined}
          aria-invalid={Boolean(errors.message)}
          disabled={submitting}
          maxLength={inquiryFieldLimits.message}
          name="message"
          onChange={handleChange}
          required
          rows={9}
          value={form.message}
        />
        {errors.message ? (
          <small className="field-error" id="error-message">
            {errors.message}
          </small>
        ) : null}
      </label>

      <TurnstileWidget
        onStateChange={setTurnstileState}
        onToken={setTurnstileToken}
      />

      <div className="form-actions">
        <button
          className="submit-button"
          disabled={submitState.disabled}
          type="submit"
        >
          {submitting ? "Sending securely…" : "Start a conversation →"}
        </button>
        <p className="field-hint">
          {getVerificationHint(
            turnstileState,
            submitState.waitingForVerification,
          )}
        </p>
      </div>

      <div aria-atomic="true" aria-live="polite" className="form-status-region">
        {submitState.verificationUnavailable ? (
          <p className="form-status form-status--error" role="alert">
            Online verification is unavailable, so this form cannot safely send
            your enquiry. Please write directly to{" "}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        ) : null}

        {submitError ? (
          <p className="form-status form-status--error" role="alert">
            {submitError} You can also write directly to{" "}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
            {requestId ? (
              <span className="form-reference">Reference: {requestId}</span>
            ) : null}
          </p>
        ) : null}

        {submittedReference ? (
          <p className="form-status form-status--success" role="status">
            Thank you. Your enquiry has been accepted for delivery to Vermilion
            Gate.
            <span className="form-reference">
              Reference: {submittedReference}
            </span>
          </p>
        ) : null}
      </div>
    </form>
  );
}
