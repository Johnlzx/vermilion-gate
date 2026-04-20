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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimField(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function normalizeInquiryForm(
  value: Partial<InquiryFormState> | null | undefined,
): InquiryFormState {
  return {
    name: trimField(value?.name),
    email: trimField(value?.email),
    contactNumber: trimField(value?.contactNumber),
    subject: trimField(value?.subject),
    message: trimField(value?.message),
  };
}

export function validateInquiryForm(
  nextForm: InquiryFormState,
): InquiryFormErrors {
  const nextErrors: InquiryFormErrors = {};

  if (!nextForm.name) {
    nextErrors.name = "Please share your name.";
  }

  if (!nextForm.email) {
    nextErrors.email = "Please share your email address.";
  } else if (!emailPattern.test(nextForm.email)) {
    nextErrors.email = "Please enter a valid email address.";
  }

  if (!nextForm.subject) {
    nextErrors.subject = "Please add a short subject line.";
  }

  if (!nextForm.message) {
    nextErrors.message = "Please add a short description of your brief.";
  }

  return nextErrors;
}

export function buildInquiryEmailContent(form: InquiryFormState) {
  const contactNumber = form.contactNumber || "Not provided";
  const subject = `${form.subject} — website inquiry from ${form.name}`;
  const plainText = [
    `Name: ${form.name}`,
    `Email Address: ${form.email}`,
    `Contact Number: ${contactNumber}`,
    "",
    form.message,
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #1f2933; line-height: 1.7;">
      <p style="margin: 0 0 12px;"><strong>Name:</strong> ${escapeHtml(form.name)}</p>
      <p style="margin: 0 0 12px;"><strong>Email Address:</strong> <a href="mailto:${escapeHtml(form.email)}">${escapeHtml(form.email)}</a></p>
      <p style="margin: 0 0 24px;"><strong>Contact Number:</strong> ${escapeHtml(contactNumber)}</p>
      <p style="margin: 0;"><strong>Message</strong></p>
      <div style="margin-top: 12px; padding: 16px; background: #f7f3ee; border: 1px solid #d8cec1; white-space: pre-wrap;">${escapeHtml(form.message)}</div>
    </div>
  `.trim();

  return { subject, plainText, html };
}
