import Image from "next/image";

import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";
import {
  aboutNarrative,
  aboutSidebar,
  founder,
  founderExperience,
  founderFocusAreas,
} from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "About us overview",
  description:
    "Singapore-based founder-led advisory platform led by Loo Cheng Guan.",
  path: "/about-us/overview",
});

export default function AboutOverviewPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Overview"
        backgroundImage="/assets/overview-banner.jpg"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/about-us/overview", label: "About Us" },
          { label: "Overview" },
        ]}
      />

      <section className="classic-section">
        <div className="container inner-page-grid">
          <article className="content-article">
            <section id="overview" className="content-section">
              <h2 className="content-section__title">
                Vermilion Gate is a founder-led advisory platform built for
                situations where something important no longer fits.
              </h2>
              <div className="content-section__copy">
                {aboutNarrative.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="founder" className="content-section">
              <div className="spotlight-grid spotlight-grid--page">
                <div className="spotlight-image spotlight-image--portrait">
                  <Image
                    src="/assets/loo-cheng-guan.jpg"
                    alt="Loo Cheng Guan"
                    width={533}
                    height={600}
                  />
                </div>
                <div className="spotlight-copy">
                  <p className="section-kicker">Founder</p>
                  <h2 className="content-section__title">Led by {founder.name}</h2>
                  <p>{founder.summary}</p>
                  <blockquote className="founder-quote">“{founder.quote}”</blockquote>
                </div>
              </div>

              <div className="mini-grid mini-grid--two">
                {founderExperience.map((item) => (
                  <article key={item.title} className="mini-card">
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="focus" className="content-section">
              <p className="section-kicker">Current focus</p>
              <h2 className="content-section__title">
                Current work sits where capital, control, and strategic
                direction need to be brought back into alignment.
              </h2>
              <div className="mini-grid mini-grid--two">
                {founderFocusAreas.map((item) => (
                  <article key={item.title} className="mini-card">
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          </article>

          <aside className="page-aside">
            <nav className="page-aside__nav" aria-label="About page sections">
              {aboutSidebar.map((item) => (
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
