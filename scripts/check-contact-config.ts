const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

if (!siteKey) {
  console.error(
    "Contact form build blocked: NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing. " +
      "For GitHub Actions, set the TURNSTILE_SITE_KEY repository variable.",
  );
  process.exitCode = 1;
} else {
  console.log("Contact form build configuration is present.");
}
