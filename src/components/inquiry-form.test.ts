import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { getInquiryFormSubmitState, InquiryForm } from "./inquiry-form";

describe("getInquiryFormSubmitState", () => {
  it("disables submission while sending", () => {
    assert.deepEqual(
      getInquiryFormSubmitState({
        submitting: true,
        turnstileEnabled: false,
        turnstileRequired: false,
        turnstileToken: "",
      }),
      {
        disabled: true,
        verificationUnavailable: false,
        waitingForVerification: false,
      },
    );
  });

  it("requires a turnstile token when verification is enabled", () => {
    assert.deepEqual(
      getInquiryFormSubmitState({
        submitting: false,
        turnstileEnabled: true,
        turnstileRequired: true,
        turnstileToken: "",
      }),
      {
        disabled: true,
        verificationUnavailable: false,
        waitingForVerification: true,
      },
    );
  });

  it("enables submission once a token is present", () => {
    assert.deepEqual(
      getInquiryFormSubmitState({
        submitting: false,
        turnstileEnabled: true,
        turnstileRequired: true,
        turnstileToken: "turnstile-token",
      }),
      {
        disabled: false,
        verificationUnavailable: false,
        waitingForVerification: false,
      },
    );
  });

  it("fails closed when production verification is not configured", () => {
    assert.deepEqual(
      getInquiryFormSubmitState({
        submitting: false,
        turnstileEnabled: false,
        turnstileRequired: true,
        turnstileToken: "",
      }),
      {
        disabled: true,
        verificationUnavailable: true,
        waitingForVerification: false,
      },
    );
  });
});

describe("InquiryForm", () => {
  it("shows the simplified client-approved field set", () => {
    const markup = renderToStaticMarkup(createElement(InquiryForm));

    assert.match(markup, />Name\*<\/span>/);
    assert.match(markup, />Organisation<\/span>/);
    assert.match(markup, />Email\*<\/span>/);
    assert.match(markup, />What are you trying to achieve\?\*<\/span>/);
    assert.match(markup, />Start a conversation<\/span>/);
    assert.match(markup, /class="submit-button__icon"/);
    assert.match(markup, /d="M3 10H17M12 5L17 10L12 15"/);
    assert.doesNotMatch(markup, />Contact Number<\/span>/);
    assert.doesNotMatch(markup, />Subject \*<\/span>/);
  });
});
