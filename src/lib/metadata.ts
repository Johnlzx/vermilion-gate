import type { Metadata } from "next";

import { company } from "./site-content";
import { siteUrl } from "./site-url";

export const siteSocialImage = {
  url: "/og/site.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${company.name} — Singapore-based strategic advisory. We structure what others cannot yet fund.`,
};

type MetadataInput = {
  title: string;
  socialTitle?: string;
  description: string;
  path: string;
};

export function buildMetadata({
  title,
  socialTitle = title,
  description,
  path,
}: MetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: company.name,
      locale: "en_SG",
      type: "website",
      images: [siteSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [siteSocialImage],
    },
  };
}
