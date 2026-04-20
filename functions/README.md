# Cloudflare Pages Functions

## Required Dashboard Configuration

All bindings and environment variables are configured in the Cloudflare Pages dashboard per project.

### Bindings (Settings → Functions)

| Type | Binding Name | Description |
|------|--------------|-------------|
| KV Namespace | `RATE_LIMIT` | Per-IP contact form rate limiting |

### Secrets (Settings → Environment variables → Encrypted)

| Variable | Description |
|----------|-------------|
| `SENDGRID_API_KEY` | SendGrid API key for sending inquiry emails |
| `SENDGRID_REGION` | `eu` (default) or `global` — matches your SendGrid account region |
| `SENDGRID_FROM_EMAIL` | Verified sender email address used by SendGrid |
| `SENDGRID_TO_EMAIL` | Recipient for inquiry form. Defaults to `info@vermiliongate.com` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key for bot protection |
| `ENVIRONMENT` | `development` / `testing` / `staging` / `production` |

### Per-Environment Resources

| Environment | KV Namespace |
|-------------|--------------|
| Development | `RATE_LIMIT_DEV` |
| Testing | `RATE_LIMIT_TEST` |
| Staging | `RATE_LIMIT_STAG` |
| Production | `RATE_LIMIT` |
