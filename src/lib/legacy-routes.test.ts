import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";

type RedirectRule = {
  source: string;
  destination: string;
  status: number;
};

const redirectsPath = path.join(process.cwd(), "public/_redirects");

function loadRedirects(): RedirectRule[] {
  return readFileSync(redirectsPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [source, destination, status] = line.split(/\s+/);
      return { source, destination, status: Number(status) };
    });
}

describe("legacy route contract", () => {
  it("permanently redirects every equivalent route and trailing-slash variant", () => {
    assert.deepEqual(loadRedirects(), [
      {
        source: "/about-us/team-members",
        destination: "/about-us/overview#founder",
        status: 301,
      },
      {
        source: "/about-us/team-members/",
        destination: "/about-us/overview#founder",
        status: 301,
      },
      {
        source: "/our-business/service-focus",
        destination: "/our-business/overview",
        status: 301,
      },
      {
        source: "/our-business/service-focus/",
        destination: "/our-business/overview",
        status: 301,
      },
      {
        source: "/our-business/transactions",
        destination: "/our-business/illustrative-themes",
        status: 301,
      },
      {
        source: "/our-business/transactions/",
        destination: "/our-business/illustrative-themes",
        status: 301,
      },
      { source: "/news-room", destination: "/insights", status: 301 },
      { source: "/news-room/", destination: "/insights", status: 301 },
      { source: "/privacy-policy", destination: "/privacy", status: 301 },
      { source: "/privacy-policy/", destination: "/privacy", status: 301 },
      { source: "/terms-of-use", destination: "/terms", status: 301 },
      { source: "/terms-of-use/", destination: "/terms", status: 301 },
      {
        source: "/contact-us",
        destination: "/contact-us/our-office",
        status: 301,
      },
      {
        source: "/contact-us/",
        destination: "/contact-us/our-office",
        status: 301,
      },
    ]);
  });

  it("does not redirect deliberately retired content", () => {
    const sources = new Set(loadRedirects().map((rule) => rule.source));

    assert.equal(sources.has("/our-business/industry-focus"), false);
    assert.equal(sources.has("/our-business/industry-focus/"), false);
    assert.equal(sources.has("/our-partners"), false);
    assert.equal(sources.has("/our-partners/"), false);
  });
});
