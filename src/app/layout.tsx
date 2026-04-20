import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company } from "@/lib/site-content";


import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vermiliongate.com"),
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: company.name,
  legalName: company.legalName,
  url: "https://www.vermiliongate.com",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(organizationSchema)}
        </Script>
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
