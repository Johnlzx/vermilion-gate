import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms of use",
  description: "Terms of use for the Vermilion Gate website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Terms of Use"
        backgroundImage="/assets/overview-banner.jpg"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Terms of Use" },
        ]}
      />

      <section className="classic-section">
        <div className="container legal-page">
          <h2>Use of content</h2>
          <p>
            The information on this website is provided for general background
            purposes only. It does not constitute investment, legal, tax, or
            other regulated professional advice.
          </p>

          <h2>No engagement created</h2>
          <p>
            Visiting the site or sending an inquiry does not by itself create an
            advisory, client, or fiduciary relationship.
          </p>

          <h2>Accuracy and availability</h2>
          <p>
            The website is maintained in good faith, but content may change over
            time and the site may occasionally be unavailable during maintenance
            or deployment.
          </p>

          <h2>External destinations</h2>
          <p>
            Links to external websites are provided for convenience only.
            Vermilion Gate is not responsible for the content or policies of
            third-party sites.
          </p>
        </div>
      </section>
    </main>
  );
}
