import Image from "next/image";
import Link from "next/link";

import { TypographicArrow } from "@/components/typographic-arrow";
import {
  homeFocusBlocks,
  homeFounderLed,
  homeInsights,
  homeWhatThisMeans,
  homeWhatWeAreNot,
  howWeWork,
} from "@/lib/site-content";

export function HomeEditorial() {
  return (
    <>
      <section className="ed-hero">
        <div className="container ed-hero__inner">
          <div className="ed-hero__lede">
            <h1 className="ed-hero__title">
              We structure what others cannot yet fund.
            </h1>
          </div>
          <div className="ed-hero__aside">
            <p className="ed-hero__intro">
              Vermilion Gate is a principal-led advisory firm focused on
              strategic transactions, capital alignment, capital allocation
              strategy, and special situations where structure, ownership, or
              market positioning no longer fit reality.
            </p>
            <p className="ed-hero__selectivity">
              We do not take on all mandates. We engage where structural
              judgment is required before action.
            </p>
            <div className="ed-hero__actions">
              <Link className="ed-button" href="/contact-us/our-office">
                <span>Start a conversation</span>
                <span className="ed-button__icon" aria-hidden="true">
                  <TypographicArrow direction="right" />
                </span>
              </Link>
              <Link className="ed-link" href="/insights">
                Read our insights
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ed-plate" aria-hidden="true">
        <div className="container">
          <div className="ed-plate__frame">
            <Image
              src="/assets/imagery/our-business-banner-curved-louvers.jpg"
              alt=""
              width={2400}
              height={3600}
              sizes="(max-width: 920px) 100vw, 1180px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="ed-section">
        <div className="container">
          <header className="ed-section__head">
            <h2 className="ed-display">{homeWhatThisMeans.heading}</h2>
          </header>
          <div className="ed-section__body ed-note">
            {homeWhatThisMeans.copy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-section ed-section--focus">
        <div className="container">
          <header className="ed-section__head">
            <h2 className="ed-display">Our focus.</h2>
          </header>
          <ol className="ed-index">
            {homeFocusBlocks.map((card, index) => (
              <li key={card.title} className="ed-index__row">
                <Link
                  className="ed-index__link"
                  href={card.href ?? "/our-business/overview"}
                >
                  <span className="ed-index__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ed-index__title">{card.title}</span>
                  <span className="ed-index__summary">{card.summary}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ed-section">
        <div className="container">
          <header className="ed-section__head">
            <h2 className="ed-display">How we work.</h2>
          </header>
          <div className="ed-strip">
            {howWeWork.map((item, index) => (
              <article key={item.title} className="ed-strip__cell">
                <span className="ed-strip__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="ed-strip__title">{item.title}</h3>
                <p className="ed-strip__summary">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-section ed-section--muted">
        <div className="container">
          <header className="ed-section__head">
            <h2 className="ed-display">{homeFounderLed.heading}</h2>
          </header>
          <div className="ed-section__body ed-prose ed-prose--statement">
            <p>{homeFounderLed.copy}</p>
            <Link
              className="ed-founder-jump"
              href="/our-business/selected-situations"
              aria-label="Explore selected situations"
            >
              <span className="ed-founder-jump__label">
                Explore selected situations
              </span>
              <span className="ed-founder-jump__icon" aria-hidden="true">
                <TypographicArrow />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="ed-section ed-section--muted">
        <div className="container">
          <header className="ed-section__head">
            <p className="ed-kicker">{homeInsights.heading}</p>
          </header>
          <div className="ed-section__body">
            <p className="ed-prose ed-prose--wide">{homeInsights.copy}</p>
            <ul className="ed-channels">
              {homeInsights.links.map((link) => (
                <li key={link.href} className="ed-channels__item">
                  <a
                    className="ed-channels__link"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                    <span className="ed-channels__arrow" aria-hidden="true">
                      <TypographicArrow />
                    </span>
                  </a>
                  <p className="ed-channels__description">
                    {link.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="ed-section ed-section--muted ed-section--boundary">
        <div className="container">
          <header className="ed-section__head">
            <h2 className="ed-display">{homeWhatWeAreNot.heading}</h2>
          </header>
          <div className="ed-section__body ed-prose ed-prose--statement">
            <p>{homeWhatWeAreNot.copy}</p>
          </div>
        </div>
      </section>
    </>
  );
}
