import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { businessSidebar, whatWeDoSections } from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "Our business overview",
  description:
    "Situation-defined mandates across strategic transactions, capital alignment, capital allocation strategy, and special situations.",
  path: "/our-business/overview",
});

export default function BusinessOverviewPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Overview"
        backgroundImage="/assets/our-business-banner.jpg"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/our-business/overview", label: "Our Business" },
          { label: "Overview" },
        ]}
      />

      <section className="classic-section">
        <div className="container inner-page-grid">
          <article className="content-article">
            <section className="content-section">
              <h2 className="content-section__title">What We Do for You</h2>
              <div className="content-section__copy">
                <p>
                  Vermilion Gate is useful where the structure, ownership logic,
                  or capital fit needs to be clarified before capital or process
                  can do useful work.
                </p>
                <p>
                  The work is situation-defined rather than sector-defined. We
                  focus on strategic transactions, capital alignment, capital
                  allocation strategy, and special situations where something is
                  stuck and needs a structural reset.
                </p>
              </div>
            </section>

            {whatWeDoSections.map((item) => (
              <section key={item.id} id={item.id} className="content-section">
                <h2 className="content-section__title">{item.title}</h2>
                <div className="content-section__copy">
                  <p>{item.summary}</p>
                </div>
                <ul className="detail-list">
                  {item.details.map((detail) => (
                    <li key={detail} className="detail-list__item">
                      <p>{detail}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </article>

          <aside className="page-aside">
            <nav className="page-aside__nav" aria-label="Business page sections">
              {businessSidebar.map((item) => (
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
