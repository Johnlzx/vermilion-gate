import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import AboutOverviewPage from "@/app/about-us/overview/page";
import Home from "@/app/page";
import SelectedSituationsPage from "@/app/our-business/illustrative-themes/page";
import BusinessOverviewPage from "@/app/our-business/overview/page";

function assertSingleH1(markup: string, text: string) {
  const headings = markup.match(/<h1\b[^>]*>.*?<\/h1>/g) ?? [];

  assert.equal(headings.length, 1);
  assert.match(headings[0], new RegExp(`>${text}<\\/h1>`));
}

describe("primary page headings", () => {
  it("retains the homepage positioning statement as its visible heading", () => {
    const markup = renderToStaticMarkup(Home());

    assertSingleH1(
      markup,
      "We structure what others cannot yet fund\\.",
    );
  });

  it("names the about page in its visible heading", () => {
    const markup = renderToStaticMarkup(AboutOverviewPage());

    assertSingleH1(markup, "About Vermilion Gate");
  });

  it("states the purpose of the business page in its visible heading", () => {
    const markup = renderToStaticMarkup(BusinessOverviewPage());

    assertSingleH1(markup, "What We Do");
  });

  it("uses the client-approved title for the situations page", () => {
    const markup = renderToStaticMarkup(SelectedSituationsPage());

    assertSingleH1(markup, "Selected Situations");
  });
});
