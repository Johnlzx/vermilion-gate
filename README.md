# Vermilion Gate

A static-first Next.js rebuild of the Vermilion Gate website, designed to replace a hard-to-maintain legacy CMS.

## Stack

- Next.js 16 App Router
- TypeScript
- Native CSS with shared design tokens and semantic section classes
- Typed content modules instead of CMS-bound page editing

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

Legacy CMS routes are redirected in `next.config.ts` so old links do not break.

## Why this rebuild is easier to maintain

- The site is content-driven rather than template-driven.
- Shared layout primitives replace one-off CMS blocks.
- SEO concerns are handled in code: metadata, sitemap, robots, Open Graph image, and branded 404.
- The contact page works without server-side form infrastructure by opening a prefilled email draft locally.

## Deployment

The project is ready for Vercel or any Next.js-compatible host.

Recommended environment:

1. Connect the repository to Vercel.
2. Set the production domain.
3. Review office details and legal copy in `src/lib/site-content.ts`.
4. Run `pnpm build` in CI before every deployment.
