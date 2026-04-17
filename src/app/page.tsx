import Image from "next/image";
import Link from "next/link";

import { buildMetadata } from "@/lib/metadata";
import {
  aboutNarrative,
  company,
  homeFeatureCards,
  howWeWork,
  whatWeAreNot,
} from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "We structure what others cannot yet fund",
  description: company.description,
  path: "/",
});

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero">
        <div className="home-hero__media" aria-hidden="true">
          <div className="home-hero__slide home-hero__slide--1">
            <Image
              src="/assets/slideshow-01.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="home-hero__slide home-hero__slide--2">
            <Image
              src="/assets/slideshow-02.jpg"
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="home-hero__slide home-hero__slide--3">
            <Image
              src="/assets/slideshow-03.jpg"
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="home-hero__shade" aria-hidden="true" />

        <div className="container home-hero__inner">
          <div className="home-hero__copy">
            <h1 className="home-hero__title">
              We structure what others cannot yet fund
            </h1>
            <p className="home-hero__intro">
              Vermilion Gate is a mandate-led advisory platform focused on
              strategic transactions, capital alignment, capital allocation
              strategy, and special situations where structure, ownership, or
              market positioning no longer fit reality.
            </p>
            <div className="hero-button-row">
              <Link className="hero-button" href="/contact-us/our-office">
                Talk to Us
              </Link>
              <Link className="hero-button hero-button--ghost" href="/insights">
                Read Our Insights
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="classic-section">
        <div className="container intro-grid intro-grid--home">
          <div>
            <p className="section-kicker">Vermilion Gate Pte Ltd</p>
            <h2 className="classic-title home-intro-title">
              We work where capital, control, and strategic intent have fallen
              out of alignment and where sound judgment is required before
              capital is committed.
            </h2>
          </div>

          <div className="classic-copy">
            <p>{aboutNarrative[0]}</p>
            <p>
              Vermilion Gate operates where strategic intent meets execution.
              Recognizing that the primary barrier to success is often
              misalignment rather than scarcity, we vet each prospect through an
              allocator lens and focus only on high-conviction situations that
              fit the mandate.
            </p>
          </div>
        </div>
      </section>

      <section className="classic-section classic-section--tight">
        <div className="container">
          <div className="home-card-grid">
            {homeFeatureCards.map((card) => (
              <article key={card.title} className="home-card">
                <div className="home-card__media">
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <div className="home-card__body">
                  <h3 className="home-card__title">{card.title}</h3>
                  <p>{card.summary}</p>
                  <Link className="outline-button" href={card.href}>
                    Learn More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="feature-band"
        style={{ backgroundImage: "url(/assets/feature-section-bg.jpg)" }}
      >
        <div className="feature-band__shade" aria-hidden="true" />

        <div className="feature-band__image">
          <Image
            src="/assets/feature-section-fg.jpg"
            alt="Handshake representing strategic alignment"
            fill
            sizes="(max-width: 920px) 100vw, 60vw"
          />
        </div>

        <div className="feature-band__inner">
          <div className="feature-band__panel">
            <h2>What We Do for You</h2>
            <p>
              We focus on situations where structure matters more than story.
              The work is situation-defined rather than sector-defined, and the
              first need is often clarity rather than process.
            </p>
            <p>
              We only take on mandates where judgment, structural fit, and
              capital discipline materially shape the outcome.
            </p>
            <Link
              className="outline-button outline-button--dark"
              href="/contact-us/our-office"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>

      <section className="classic-section">
        <div className="container">
          <div className="spotlight-copy">
            <p className="section-kicker">How We Work</p>
            <h2 className="classic-title classic-title--narrow">
              A selective platform built for structural judgment.
            </h2>
            <div className="mini-grid mini-grid--four">
              {howWeWork.map((item) => (
                <article key={item.title} className="mini-card">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="classic-section classic-section--light">
        <div className="container">
          <div className="section-heading">
            <p className="section-kicker">What We Are Not</p>
            <h2 className="classic-title classic-title--narrow">
              The platform is deliberately narrower than a generic corporate
              finance offering.
            </h2>
          </div>
          <div className="mini-grid mini-grid--three">
            {whatWeAreNot.map((item) => (
              <article key={item.title} className="mini-card">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
