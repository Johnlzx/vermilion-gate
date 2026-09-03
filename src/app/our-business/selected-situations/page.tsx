import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { selectedSituations, situationsSidebar } from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "Selected Situations",
  description:
    "Selected anonymised situations showing Vermilion Gate's judgment-led transaction and strategic advisory work.",
  path: "/our-business/selected-situations",
});

export default function SelectedSituationsPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Selected Situations"
        backgroundImage="/assets/imagery/our-business-banner-curved-metallic-facade.jpg"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/our-business/overview", label: "Our Business" },
          { label: "Selected Situations" },
        ]}
      />

      <section className="classic-section">
        <div className="container inner-page-grid">
          <article className="content-article">
            <section className="content-section situations-intro">
              <h2 className="content-section__title">
                The work is best understood through the decisions it changed.
              </h2>
              <div className="content-section__copy">
                <p>
                  These three situations are drawn from engagements undertaken
                  through Vermilion Gate. Each begins with the constraint, then
                  sets out the work performed and the resulting decision or
                  structural change.
                </p>
                <p className="situations-disclosure">
                  The examples are anonymised. Company names, jurisdictions,
                  transaction figures and counterparties are omitted, and no
                  merger, financing or project is described as completed where
                  it was not.
                </p>
              </div>
            </section>

            {selectedSituations.map((item, index) => (
              <section
                key={item.id}
                id={item.id}
                className="content-section situation"
              >
                <header>
                  <p className="section-kicker situation__number">
                    Situation {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="content-section__title">{item.title}</h2>
                </header>
                <div className="content-section__copy situation__setting">
                  <p>{item.setting}</p>
                </div>
                <dl className="detail-list situation__sequence">
                  <div className="detail-list__item situation__step">
                    <dt>Initial constraint</dt>
                    <dd>{item.constraint}</dd>
                  </div>
                  <div className="detail-list__item situation__step">
                    <dt>Work performed</dt>
                    <dd>{item.work}</dd>
                  </div>
                  <div className="detail-list__item situation__step">
                    <dt>Resulting decision</dt>
                    <dd>{item.result}</dd>
                  </div>
                </dl>
              </section>
            ))}
          </article>

          <aside className="page-aside">
            <nav
              className="page-aside__nav"
              aria-label="Selected situations page sections"
            >
              {situationsSidebar.map((item) => (
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
