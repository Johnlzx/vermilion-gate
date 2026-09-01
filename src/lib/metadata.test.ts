import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";

import { metadata as aboutMetadata } from "@/app/about-us/overview/page";
import { metadata as businessMetadata } from "@/app/our-business/overview/page";
import { metadata as homeMetadata } from "@/app/page";

import { buildMetadata, siteSocialImage } from "./metadata";

describe("site metadata", () => {
  it("uses a brand-led homepage title while keeping the social title natural", () => {
    assert.equal(
      homeMetadata.title,
      "Vermilion Gate | Strategic Transactions & Capital Alignment",
    );
    assert.equal(
      homeMetadata.openGraph?.title,
      "Vermilion Gate — Strategic Transactions & Capital Alignment",
    );
    assert.equal(
      homeMetadata.twitter?.title,
      "Vermilion Gate — Strategic Transactions & Capital Alignment",
    );
  });

  it("aligns the overview page titles with their positioning", () => {
    assert.deepEqual(aboutMetadata.title, {
      absolute: "About Vermilion Gate | Strategic Advisory",
    });
    assert.equal(
      aboutMetadata.openGraph?.title,
      "About Vermilion Gate | Strategic Advisory",
    );
    assert.equal(businessMetadata.title, "Strategic Advisory Services");
    assert.equal(
      businessMetadata.openGraph?.title,
      "What We Do — Strategic Transactions & Capital Alignment",
    );
    assert.equal(
      businessMetadata.twitter?.title,
      "What We Do — Strategic Transactions & Capital Alignment",
    );
  });

  it("describes the shared social image for rich previews", () => {
    assert.deepEqual(siteSocialImage, {
      url: "/og/site.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Vermilion Gate — Singapore-based strategic advisory. We structure what others cannot yet fund.",
    });
  });

  it("keeps the social image file within the declared preview contract", () => {
    const image = readFileSync(
      path.join(process.cwd(), "public", siteSocialImage.url),
    );

    assert.equal(image.subarray(1, 4).toString("ascii"), "PNG");
    assert.equal(image.readUInt32BE(16), siteSocialImage.width);
    assert.equal(image.readUInt32BE(20), siteSocialImage.height);
    assert.ok(image.byteLength < 5 * 1024 * 1024);
  });

  it("falls back to the page title when no separate social title is provided", () => {
    const metadata = buildMetadata({
      title: "Illustrative themes",
      description: "Example description",
      path: "/our-business/illustrative-themes",
    });

    assert.equal(metadata.openGraph?.title, "Illustrative themes");
    assert.equal(metadata.twitter?.title, "Illustrative themes");
    assert.equal(
      metadata.alternates?.canonical,
      "https://www.vermiliongate.com/our-business/illustrative-themes",
    );
  });
});
