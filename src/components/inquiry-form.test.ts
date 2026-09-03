import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getInquiryFormSubmitState } from "./inquiry-form";

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
