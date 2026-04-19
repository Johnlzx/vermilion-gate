import Image from "next/image";

import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { company, officeNotes } from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "Contact us",
  description:
    "Contact Vermilion Gate if you are dealing with a situation where capital, ownership, structure, or strategic direction no longer fit cleanly.",
  path: "/contact-us/our-office",
});

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Our Office"
        backgroundImage="/assets/imagery/contact-us-banner-horizontal-louvers.jpg"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/contact-us/our-office", label: "Contact Us" },
          { label: "Our Office" },
        ]}
      />

      <section className="classic-section">
        <div className="container contact-layout">
          <article className="contact-panel">
            <p className="section-kicker">Get in Touch</p>
            <h2 className="content-section__title">
              If capital, ownership, structure, or strategic direction no
              longer fit cleanly, we may be able to help.
            </h2>
            <div className="content-section__copy">
              <p>
                For more information about our services, please use the form
                below and we will respond as soon as possible.
              </p>
            </div>
            <InquiryForm />
          </article>

          <aside className="contact-info">
            <p className="section-kicker">Contact Information</p>
            <ul className="contact-info__list">
              <li>
                <strong>Phone</strong>
                <a href={`tel:${company.phone.replace(/\s+/g, "")}`}>{company.phone}</a>
              </li>
              <li>
                <strong>Email</strong>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              <li>
                <strong>Office</strong>
                <span>{company.addressLines[0]}</span>
                <span>{company.addressLines[1]}</span>
                <span>{company.addressLines[2]}</span>
              </li>
            </ul>

            <div className="contact-note-list">
              {officeNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>

            <div className="contact-map">
              <Image
                src="/assets/map.jpg"
                alt="Map of Robinson Point in Singapore"
                width={1097}
                height={679}
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
