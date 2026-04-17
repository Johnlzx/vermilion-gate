import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { insightsLinks } from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "Insights and posts",
  description:
    "LinkedIn field notes and Substack essays from Vermilion Gate and Loo Cheng Guan.",
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Insights"
        backgroundImage="/assets/news-room-banner.jpg"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Insights" },
        ]}
      />

      <section className="classic-section">
        <div className="container">
          <div className="section-heading">
            <p className="section-kicker">LinkedIn and Substack</p>
            <h2 className="classic-title classic-title--narrow">
              Current thinking lives in short-form field notes and long-form
              essays rather than a conventional in-site newsroom.
            </h2>
          </div>

          <div className="insight-grid">
            {insightsLinks.map((item) => (
              <a
                key={item.href}
                className="insight-card"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <p className="insight-card__label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
