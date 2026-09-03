export type InquiryFormState = {
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
};

export type InquiryFormErrors = Partial<Record<keyof InquiryFormState, string>>;

export const initialInquiryFormState: InquiryFormState = {
  name: "",
  email: "",
  contactNumber: "",
  subject: "",
  message: "",
};

export const inquiryFieldLimits = {
  name: 120,
  email: 254,
  contactNumber: 160,
  subject: 200,
  message: 5_000,
} as const satisfies Record<keyof InquiryFormState, number>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function normalizeInquiryForm(
  value: unknown,
): InquiryFormState {
  const record = asRecord(value);

  return {
    name: trimField(record.name),
    email: trimField(record.email),
    contactNumber: trimField(record.contactNumber),
    subject: trimField(record.subject),
    message: trimField(record.message),
  };
}

export function validateInquiryForm(
  nextForm: InquiryFormState,
): InquiryFormErrors {
  const nextErrors: InquiryFormErrors = {};

  if (!nextForm.name) {
    nextErrors.name = "Please share your name.";
  } else if (nextForm.name.length > inquiryFieldLimits.name) {
    nextErrors.name = `Please keep your name under ${inquiryFieldLimits.name} characters.`;
  }

  if (!nextForm.email) {
    nextErrors.email = "Please share your email address.";
  } else if (!emailPattern.test(nextForm.email)) {
    nextErrors.email = "Please enter a valid email address.";
  } else if (nextForm.email.length > inquiryFieldLimits.email) {
    nextErrors.email = "Please enter a shorter email address.";
  }

  if (nextForm.contactNumber.length > inquiryFieldLimits.contactNumber) {
    nextErrors.contactNumber = `Please keep your organisation under ${inquiryFieldLimits.contactNumber} characters.`;
  }

  if (!nextForm.subject) {
    nextErrors.subject = "Please add a short subject line.";
  } else if (nextForm.subject.length > inquiryFieldLimits.subject) {
    nextErrors.subject = `Please keep the subject under ${inquiryFieldLimits.subject} characters.`;
  }

  if (!nextForm.message) {
    nextErrors.message = "Please add a short description of your brief.";
  } else if (nextForm.message.length > inquiryFieldLimits.message) {
    nextErrors.message = `Please keep your message under ${inquiryFieldLimits.message.toLocaleString("en")} characters.`;
  }

  return nextErrors;
}

export function buildInquiryEmailContent(form: InquiryFormState) {
  const organisation = form.contactNumber || "Not provided";
  const subject = `${form.subject} — website inquiry from ${form.name}`;
  const plainText = [
    `Name: ${form.name}`,
    `Email Address: ${form.email}`,
    `Organisation: ${organisation}`,
    "",
    form.message,
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #1f2933; line-height: 1.7;">
      <p style="margin: 0 0 12px;"><strong>Name:</strong> ${escapeHtml(form.name)}</p>
      <p style="margin: 0 0 12px;"><strong>Email Address:</strong> <a href="mailto:${escapeHtml(form.email)}">${escapeHtml(form.email)}</a></p>
      <p style="margin: 0 0 24px;"><strong>Organisation:</strong> ${escapeHtml(organisation)}</p>
      <p style="margin: 0;"><strong>Message</strong></p>
      <div style="margin-top: 12px; padding: 16px; background: #f7f3ee; border: 1px solid #d8cec1; white-space: pre-wrap;">${escapeHtml(form.message)}</div>
    </div>
  `.trim();

  return { subject, plainText, html };
}
