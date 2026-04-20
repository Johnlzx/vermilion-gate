/**
 * Resolved at build time. Override in CI / `.env` via NEXT_PUBLIC_SITE_URL
 * (e.g. NEXT_PUBLIC_SITE_URL=https://staging.example.com pnpm build).
 *
 * Order:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override
 *  2. Vercel production / preview URLs — auto-injected on Vercel deploys
 *  3. Local default — used by `pnpm dev` and any environment without overrides
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return `https://${vercelProd}`;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "https://www.vermiliongate.com";
}

export const siteUrl = resolve();
