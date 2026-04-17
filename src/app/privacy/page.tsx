import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { company } from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "Privacy policy for the Vermilion Gate website and contact interactions.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Privacy Policy"
        backgroundImage="/assets/overview-banner.jpg"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Privacy Policy" },
        ]}
      />

      <section className="classic-section">
        <div className="container legal-page">
          <h2>What this site collects</h2>
          <p>
            The site is primarily informational. If you use the contact form,
            the details you enter are used only to prepare an email draft in your
            local email client. The website does not store that message on a
            server.
          </p>

          <h2>Analytics and technical data</h2>
          <p>
            Standard hosting logs may record technical information such as IP
            address, browser type, and requested pages for security and
            performance monitoring. These records are handled by the hosting
            provider.
          </p>

          <h2>Third-party links</h2>
          <p>
            This site may link to third-party destinations such as LinkedIn.
            Those services manage their own privacy practices.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy-related questions, write to{" "}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
