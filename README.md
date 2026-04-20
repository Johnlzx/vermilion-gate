# Vermilion Gate

A static-first Next.js rebuild of the Vermilion Gate website, designed to replace a hard-to-maintain legacy CMS.

## Stack

- Next.js 16 App Router with static export
- TypeScript
- Native CSS with shared design tokens and semantic section classes
- Typed content modules instead of CMS-bound page editing
- Cloudflare Pages with Pages Functions
- SendGrid for inquiry delivery
- Cloudflare KV for rate limiting

## Local development

```bash
pnpm dev
pnpm lint
pnpm build
```

## Project structure

- `src/app`: routes, metadata, sitemap, robots, Open Graph image
- `src/components`: shared header, footer, page hero, section nav, inquiry form
- `src/lib/site-content.ts`: central content model for navigation, homepage sections, founder positioning, illustrative themes, insights links, and contact details
- `src/lib/metadata.ts`: shared page metadata builder
- `functions`: Cloudflare Pages Functions for inquiry delivery

## Editing content

Most website copy lives in `src/lib/site-content.ts`.

That file controls:

- primary navigation
- homepage hero, focus blocks, and positioning statements
- about page narrative and founder section
- what we do and illustrative themes content
- insights links
- office details and FAQ content

This keeps future updates reviewable and avoids pushing routine text changes through component files.

## Current information architecture

- `/`: homepage with refreshed positioning
- `/about-us/overview`: founder-led platform and Loo Cheng Guan profile
- `/our-business/overview`: what we do
- `/our-business/illustrative-themes`: theme-led replacement for legacy transaction pages
- `/insights`: external links to LinkedIn and Substack
- `/contact-us/our-office`: contact page

Legacy CMS routes are redirected in `public/_redirects` so old links do not break.

## Why this rebuild is easier to maintain

- The site is content-driven rather than template-driven.
- Shared layout primitives replace one-off CMS blocks.
- SEO concerns are handled in code: metadata, sitemap, robots, Open Graph image, and branded 404.
- The contact page submits to a Cloudflare Pages Function which validates the form, rate-limits repeated submissions via KV, and forwards the inquiry by email through SendGrid.

## Inquiry form environment

Set these Cloudflare Pages environment variables before deploying the contact form:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key exposed at build time
- `SENDGRID_API_KEY`: required SendGrid API key
- `SENDGRID_FROM_EMAIL`: verified sender email used by SendGrid
- `SENDGRID_TO_EMAIL`: optional override for the inquiry recipient, defaults to `info@vermiliongate.com`
- `SENDGRID_REGION`: optional `eu` or `global`, defaults to `eu`
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret for server-side verification
- `ENVIRONMENT`: optional environment label for dashboard separation

Cloudflare bindings:

- `RATE_LIMIT`: KV namespace for per-IP submission throttling

See `functions/README.md` for the Pages dashboard setup.

## Deployment

The project is configured for Cloudflare Pages:

1. Run `pnpm build` to generate the static export into `out/`.
2. Deploy `out/` to Cloudflare Pages.
3. Keep the `functions/` directory in the repository root so Pages Functions are bundled automatically.
4. Configure the required secrets and `RATE_LIMIT` binding in Cloudflare Pages.

Environment-specific GitHub Actions workflows are included:

| Environment | Trigger | Pages project |
|-------------|---------|---------------|
| Development | `workflow_dispatch` | `vermilion-gate-dev` |
| Testing | `workflow_dispatch` from `main` | `vermilion-gate-test` |
| Staging | GitHub pre-release | `vermilion-gate-stag` |
| Production | GitHub release | `vermilion-gate` |
