import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vermilion Gate",
    template: "%s | Vermilion Gate",
  },
  description: company.description,
  applicationName: company.name,
  keywords: [
    "Vermilion Gate",
    "strategic transactions",
    "capital alignment",
    "capital allocation strategy",
    "special situations",
    "Singapore advisory",
  ],
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  category: "Business",
  openGraph: {
    siteName: company.name,
    locale: "en_SG",
    type: "website",
    images: ["/og/site.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/site.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f1",
  colorScheme: "light",
};

const organizationId = `${siteUrl}#organization`;
const websiteId = `${siteUrl}#website`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": organizationId,
      name: company.name,
      legalName: company.legalName,
      url: siteUrl,
      email: company.email,
      telephone: company.phone,
      description: company.description,
      sameAs: [company.linkedIn],
      address: {
        "@type": "PostalAddress",
        streetAddress: `${company.addressLines[0]}, ${company.addressLines[1]}`,
        addressLocality: "Singapore",
        postalCode: "049712",
        addressCountry: "SG",
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: company.name,
      description: company.description,
      inLanguage: "en-SG",
      publisher: { "@id": organizationId },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-SG" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
