"use client";

import { useState } from "react";

import { company } from "@/lib/site-content";

type FormState = {
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  contactNumber: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InquiryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validate(nextForm: FormState): FormErrors {
    const nextErrors: FormErrors = {};

    if (!nextForm.name.trim()) {
      nextErrors.name = "Please share your name.";
    }

    if (!nextForm.email.trim()) {
      nextErrors.email = "Please share your email address.";
    } else if (!emailPattern.test(nextForm.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!nextForm.subject.trim()) {
      nextErrors.subject = "Please add a short subject line.";
    }

    if (!nextForm.message.trim()) {
      nextErrors.message = "Please add a short description of your brief.";
    }

    return nextErrors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    const subject = encodeURIComponent(
      `${form.subject} — website inquiry from ${form.name}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email Address: ${form.email}`,
        `Contact Number: ${form.contactNumber || "Not provided"}`,
        "",
        form.message,
      ].join("\n"),
    );

    setStatus("ready");
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
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
        <button className="submit-button" type="submit">
          Submit Form
        </button>
        <p className="field-hint">
          This opens your default email client with the inquiry prefilled.
        </p>
      </div>

      {status === "ready" ? (
        <p className="form-success">
          Your email client should open now. If it does not, write directly to{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>.
        </p>
      ) : null}
    </form>
  );
}
