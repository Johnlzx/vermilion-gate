import Link from "next/link";

import { siteUrl } from "@/lib/site-url";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type PageHeroProps = {
  title: string;
  backgroundImage: string;
  breadcrumbs: BreadcrumbItem[];
};

export function PageHero({
  title,
  backgroundImage,
  breadcrumbs,
}: PageHeroProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => {
      const entry: Record<string, unknown> = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      if (item.href) entry.item = new URL(item.href, siteUrl).toString();
      return entry;
    }),
  };

  return (
    <section
      className="page-hero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="page-hero__shade" aria-hidden="true" />
      <div className="container page-hero__inner">
        <h1 className="page-hero__title">{title}</h1>
        <nav className="page-hero__crumbs" aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </section>
  );
}
