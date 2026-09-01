import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildInquiryEmailContent,
  initialInquiryFormState,
  inquiryFieldLimits,
  normalizeInquiryForm,
  validateInquiryForm,
} from "./inquiry-form";

const validForm = {
  ...initialInquiryFormState,
  name: "Jane Doe",
  email: "jane@example.com",
  contactNumber: "+65 1234 5678",
  subject: "Strategic mandate",
  message: "We need help thinking through a cross-border ownership transition.",
};

describe("validateInquiryForm", () => {
  it("returns the expected required-field errors", () => {
    assert.deepEqual(validateInquiryForm(initialInquiryFormState), {
      name: "Please share your name.",
      email: "Please share your email address.",
      subject: "Please add a short subject line.",
      message: "Please add a short description of your brief.",
    });
  });

  it("rejects invalid email addresses", () => {
    assert.deepEqual(validateInquiryForm({ ...validForm, email: "invalid-email" }), {
      email: "Please enter a valid email address.",
    });
  });

  it("accepts a complete valid form", () => {
    assert.deepEqual(validateInquiryForm(validForm), {});
  });

  it("rejects values beyond the transport limits", () => {
    assert.deepEqual(
      validateInquiryForm({
        ...validForm,
        name: "x".repeat(inquiryFieldLimits.name + 1),
        message: "x".repeat(inquiryFieldLimits.message + 1),
      }),
      {
        name: "Please keep your name under 120 characters.",
        message: "Please keep your message under 5,000 characters.",
      },
    );
  });
});

describe("normalizeInquiryForm", () => {
  it("trims strings and safely ignores non-string input", () => {
    assert.deepEqual(
      normalizeInquiryForm({
        name: "  Jane Doe  ",
        email: 42,
        subject: "  Brief  ",
      }),
      {
        ...initialInquiryFormState,
        name: "Jane Doe",
        subject: "Brief",
      },
    );
    assert.deepEqual(normalizeInquiryForm(null), initialInquiryFormState);
  });
});

describe("buildInquiryEmailContent", () => {
  it("builds escaped html and plain text email bodies", () => {
    const content = buildInquiryEmailContent({
      ...validForm,
      name: 'Jane <Doe>',
      message: 'Need a review of "special situations" <soon>.',
    });

    assert.equal(
      content.subject,
      "Strategic mandate — website inquiry from Jane <Doe>",
    );
    assert.match(content.plainText, /Contact Number: \+65 1234 5678/);
    assert.match(content.plainText, /Need a review of "special situations" <soon>\./);
    assert.match(content.html, /Jane &lt;Doe&gt;/);
    assert.match(content.html, /&quot;special situations&quot; &lt;soon&gt;/);
  });
});
