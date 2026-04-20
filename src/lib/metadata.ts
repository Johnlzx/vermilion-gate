import type { Metadata } from "next";

import { company } from "./site-content";

const siteUrl = "https://www.vermiliongate.com";
const siteOgImage = "/og/site.png";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({
  title,
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
      title,
      description,
      url,
      siteName: company.name,
      locale: "en_SG",
      type: "website",
      images: [siteOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteOgImage],
    },
  };
}
