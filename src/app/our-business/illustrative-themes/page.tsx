import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { illustrativeThemes, themesSidebar } from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "Illustrative themes",
  description:
    "Illustrative themes instead of a legacy transaction list: capital misalignment, listed company realignment, cross-border ownership transitions, and special situations.",
  path: "/our-business/illustrative-themes",
});

export default function IllustrativeThemesPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Illustrative Themes"
        backgroundImage="/assets/imagery/our-business-banner-curved-metallic-facade.jpg"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/our-business/overview", label: "Our Business" },
          { label: "Illustrative Themes" },
        ]}
      />

      <section className="classic-section">
        <div className="container inner-page-grid">
          <article className="content-article">
            <section className="content-section">
              <h2 className="content-section__title">
                We focus on situations where structure matters more than story,
                and where the allocator&apos;s question is as important as the
                promoter&apos;s narrative.
              </h2>
              <div className="content-section__copy">
                <p>
                  The themes below describe the kinds of situations Vermilion
                  Gate works on, without relying on a legacy transaction list
                  or tombstone format.
                </p>
              </div>
            </section>

            {illustrativeThemes.map((item) => (
              <section key={item.id} id={item.id} className="content-section">
                <h2 className="content-section__title">{item.title}</h2>
                <div className="content-section__copy">
                  <p>{item.summary}</p>
                </div>
                <ul className="detail-list">
                  {item.examples.map((example) => (
                    <li key={example} className="detail-list__item">
                      <p>{example}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </article>

          <aside className="page-aside">
            <nav className="page-aside__nav" aria-label="Theme page sections">
              {themesSidebar.map((item) => (
                <a key={item.href} className="page-aside__link" href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </section>
    </main>
  );
}
