"use client";

import { useState } from "react";

import { company } from "@/lib/site-content";
import {
  resetTurnstile,
  TurnstileWidget,
  turnstileEnabled,
} from "@/components/turnstile-widget";
import {
  initialInquiryFormState,
  type InquiryFormErrors,
  type InquiryFormState,
  normalizeInquiryForm,
  validateInquiryForm,
} from "@/lib/inquiry-form";

export function InquiryForm() {
  const [form, setForm] = useState<InquiryFormState>(initialInquiryFormState);
  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (submitted) {
      setSubmitted(false);
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
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedForm = normalizeInquiryForm(form);
    const nextErrors = validateInquiryForm(normalizedForm);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setSubmitted(false);
      setSubmitError("Please complete the verification challenge.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

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
      });
      const payload = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (response.ok && payload.success) {
        setForm(initialInquiryFormState);
        setErrors({});
        setTurnstileToken("");
        setSubmitted(true);
        return;
      }

      setSubmitted(false);
      setSubmitError(
        payload.error || "Something went wrong. Please try again shortly.",
      );
    } catch {
      setSubmitted(false);
      setSubmitError("Network error. Please try again shortly.");
    } finally {
      setSubmitting(false);
      if (turnstileEnabled) {
        resetTurnstile();
        setTurnstileToken("");
      }
    }
  }

  return (
    <form className="inquiry-form" noValidate onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">Name *</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "error-name" : undefined}
        />
        {errors.name ? (
          <small className="field-error" id="error-name">
            {errors.name}
          </small>
        ) : null}
      </label>

      <label className="field">
        <span className="field__label">Email Address *</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "error-email" : undefined}
        />
        {errors.email ? (
          <small className="field-error" id="error-email">
            {errors.email}
          </small>
        ) : null}
      </label>

      <label className="field">
        <span className="field__label">Contact Number</span>
        <input
          name="contactNumber"
          type="tel"
          autoComplete="tel"
          value={form.contactNumber}
          onChange={handleChange}
        />
      </label>

      <label className="field">
        <span className="field__label">Subject *</span>
        <input
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "error-subject" : undefined}
        />
        {errors.subject ? (
          <small className="field-error" id="error-subject">
            {errors.subject}
          </small>
        ) : null}
      </label>

      <label className="field">
        <span className="field__label">Message *</span>
        <textarea
          name="message"
          rows={9}
          value={form.message}
          onChange={handleChange}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "error-message" : undefined}
        />
        {errors.message ? (
          <small className="field-error" id="error-message">
            {errors.message}
          </small>
        ) : null}
      </label>

      <div className="form-actions">
        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Submit Form"}
        </button>
        <p className="field-hint">
          We review every inquiry directly and reply as soon as possible.
        </p>
      </div>

      <TurnstileWidget onToken={setTurnstileToken} />

      {submitError ? <p className="field-error">{submitError}</p> : null}

      {submitted ? (
        <p className="form-success">
          Your inquiry has been sent. If you need to follow up, write directly to{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>.
        </p>
      ) : null}
    </form>
  );
}
