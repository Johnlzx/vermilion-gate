# Cloudflare Pages Functions

## Required Dashboard Configuration

All bindings and environment variables are configured in the Cloudflare Pages dashboard per project.

### Bindings (Settings → Functions)

| Type | Binding Name | Description |
|------|--------------|-------------|
| KV Namespace | `VERMILION_GATE_RATE_LIMIT` | Per-IP contact form rate limiting |

### Secrets (Settings → Environment variables → Encrypted)

| Variable | Description |
|----------|-------------|
| `SENDGRID_API_KEY` | SendGrid API key for sending inquiry emails |
| `SENDGRID_REGION` | `eu` (default) or `global` — matches your SendGrid account region |
| `SENDGRID_FROM_EMAIL` | Verified sender email address used by SendGrid |
| `SENDGRID_TO_EMAIL` | Recipient for inquiry form. Defaults to `info@vermiliongate.com` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key for bot protection |
| `ENVIRONMENT` | `development` / `testing` / `staging` / `production` |

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is not a Pages Function runtime secret. It must
be present while `next build` runs. The GitHub Actions workflow reads it from
the `TURNSTILE_SITE_KEY` repository variable and blocks deployment when it is
missing.

The contact endpoint returns a request reference and writes structured
`inquiry_delivery_started`, `inquiry_delivery_accepted`, or
`inquiry_delivery_failed` events without logging the enquiry contents. A
successful response confirms SendGrid acceptance, not final inbox delivery.

### Per-Environment Resources

| Environment | KV Namespace |
|-------------|--------------|
| Development | `VERMILION_GATE_RATE_LIMIT_DEV` |
| Testing | `VERMILION_GATE_RATE_LIMIT_TEST` |
| Staging | `VERMILION_GATE_RATE_LIMIT_STAG` |
| Production | `VERMILION_GATE_RATE_LIMIT` |
