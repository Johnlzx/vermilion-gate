import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";
import {
  institutionalContext,
  selectedSituations,
  situationsSidebar,
} from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "Selected Situations",
  description:
    "Selected anonymised situations showing Vermilion Gate's judgment-led transaction and strategic advisory work.",
  path: "/our-business/illustrative-themes",
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
          <article className="content-article situations-page">
            <section
              id="institutional-context"
              className="institutional-proof"
              aria-labelledby="institutional-context-title"
            >
              <p className="section-kicker">Institutional context</p>
              <h2
                id="institutional-context-title"
                className="institutional-proof__title"
              >
                Experience behind the advice
              </h2>
              <p className="institutional-proof__copy">{institutionalContext}</p>
            </section>

            <section className="content-section situations-intro">
              <h2 className="content-section__title">
                Judgment is most useful when it changes the decision, not merely
                the process.
              </h2>
              <div className="content-section__copy">
                <p>
                  These situations are drawn from work undertaken through
                  Vermilion Gate. They show how an initial constraint was
                  tested, how the structure was changed, and what decision
                  followed.
                </p>
              </div>
              <aside className="anonymisation-note" aria-label="Anonymisation note">
                <span className="anonymisation-note__label">Confidentiality</span>
                <p>
                  Company names, jurisdictions, transaction figures and
                  counterparties have been omitted. No situation is presented
                  as completed where the underlying merger, financing or
                  project did not complete.
                </p>
              </aside>
            </section>

            {selectedSituations.map((item, index) => (
              <section
                key={item.id}
                id={item.id}
                className="content-section situation"
              >
                <header className="situation__header">
                  <p className="situation__number">
                    Situation {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="content-section__title">{item.title}</h2>
                  <p className="situation__setting">{item.setting}</p>
                </header>
                <dl className="situation__sequence">
                  <div className="situation__step">
                    <dt>Initial constraint</dt>
                    <dd>{item.constraint}</dd>
                  </div>
                  <div className="situation__step">
                    <dt>Work performed</dt>
                    <dd>{item.work}</dd>
                  </div>
                  <div className="situation__step">
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
