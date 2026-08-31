# Search index cleanup runbook

Use this checklist after deploying the legacy URL and metadata changes. The
repository can define path redirects, canonical tags, robots directives, and
the sitemap. Host-level canonicalization and Google Search Console submissions
remain deployment operations.

## 1. Canonicalize the production host in Cloudflare

Create a Cloudflare Single Redirect above other host/protocol redirects:

- Match: `http.host eq "vermiliongate.com"`
- Target expression: `concat("https://www.vermiliongate.com", http.request.uri.path)`
- Status: `301`
- Preserve query string: enabled

This must send both HTTP and HTTPS apex-domain requests directly to the HTTPS
`www` URL without an intermediate redirect.

## 2. Verify the deployment

Check all HTTP/HTTPS and apex/`www` variants. A migrated legacy route must
resolve through one permanent redirect to a `200` page whose HTML contains a
self-referencing canonical URL. Retired pages must remain crawlable and return
`404` or `410`; do not block them in `robots.txt`.

Confirm that:

- `/about-us`, `/about-us/team-members` -> `/about-us/overview`
- `/our-business` and `/our-business/service-focus` -> `/our-business/overview`
- `/our-business/industry-focus` and `/our-business/transactions` ->
  `/our-business/illustrative-themes`
- `/news-room` -> `/insights`
- `/contact-us` -> `/contact-us/our-office`
- `/our-partners` returns `410`
- the known 2017 News Room article and category URLs return `404`

Test both trailing-slash and non-trailing-slash variants where applicable.

## 3. Submit through Google Search Console

Use the verified Domain property for `vermiliongate.com`.

1. Submit `https://www.vermiliongate.com/sitemap.xml` in the Sitemaps report.
2. Request indexing with URL Inspection for `/`, `/about-us/overview`,
   `/our-business/overview`, `/our-business/illustrative-themes`, `/insights`,
   and `/contact-us/our-office`.
3. Use Temporary Removals only for URLs that have no replacement and already
   return `404` or `410`, including `/our-partners`,
   `/news-room/2017/03/07/chinese-firms-to-continue-manda-global-expansion`,
   and `/news-room/category/news-articles`. Check slash variants before
   submitting exact removals.
4. Do not submit removal requests for legacy URLs that now return `301`.

Monitor Page Indexing until moved URLs are reported as `Page with redirect`,
retired URLs as `Not found`, and the Google-selected canonical for every current
page matches its declared canonical.
