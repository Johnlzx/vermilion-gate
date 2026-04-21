import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getInquiryFormSubmitState } from "./inquiry-form";

describe("getInquiryFormSubmitState", () => {
  it("disables submission while sending", () => {
    assert.deepEqual(
      getInquiryFormSubmitState({
        submitting: true,
        turnstileEnabled: false,
        turnstileToken: "",
      }),
      {
        disabled: true,
        waitingForVerification: false,
      },
    );
  });

  it("requires a turnstile token when verification is enabled", () => {
    assert.deepEqual(
      getInquiryFormSubmitState({
        submitting: false,
        turnstileEnabled: true,
        turnstileToken: "",
      }),
      {
        disabled: true,
        waitingForVerification: true,
      },
    );
  });

  it("enables submission once a token is present", () => {
    assert.deepEqual(
      getInquiryFormSubmitState({
        submitting: false,
        turnstileEnabled: true,
        turnstileToken: "turnstile-token",
      }),
      {
        disabled: false,
        waitingForVerification: false,
      },
    );
  });
});
