import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import Home from "@/app/page";
import ContactPage from "@/app/contact-us/our-office/page";
import BusinessOverviewPage from "@/app/our-business/overview/page";
import SelectedSituationsPage from "@/app/our-business/selected-situations/page";

describe("selected situations page", () => {
  it("presents three evidence-led situations", () => {
    const markup = renderToStaticMarkup(SelectedSituationsPage());

    assert.equal((markup.match(/class="content-section situation"/g) ?? []).length, 3);
    assert.equal((markup.match(/>Initial constraint<\/dt>/g) ?? []).length, 3);
    assert.equal((markup.match(/>Work performed<\/dt>/g) ?? []).length, 3);
    assert.equal((markup.match(/>Resulting decision<\/dt>/g) ?? []).length, 3);
  });

  it("integrates the institutional proof point into the founder-led narrative", () => {
    const homeMarkup = renderToStaticMarkup(Home());
    const situationsMarkup = renderToStaticMarkup(SelectedSituationsPage());
    const proofPoint = "CEO of RidgeField Capital and a board member of CastleReach";
    const jumpLabel = "Explore selected situations";

    assert.match(homeMarkup, new RegExp(proofPoint));
    assert.ok(homeMarkup.indexOf("Founder-led") < homeMarkup.indexOf(proofPoint));
    assert.ok(homeMarkup.indexOf(proofPoint) < homeMarkup.indexOf(jumpLabel));
    assert.match(
      homeMarkup,
      /class="ed-founder-jump"[^>]*href="\/our-business\/selected-situations"/,
    );
    assert.match(homeMarkup, /aria-label="Explore selected situations"/);
    assert.doesNotMatch(situationsMarkup, new RegExp(proofPoint));
  });

  it("applies the final homepage positioning and copy reductions", () => {
    const markup = renderToStaticMarkup(Home());

    assert.match(markup, /principal-led advisory firm/);
    assert.match(markup, /For more than a decade, his work through Vermilion Gate has focused/);
    assert.match(markup, /Start a conversation/);
    assert.doesNotMatch(markup, /mandate-led advisory platform/);
    assert.doesNotMatch(markup, /Not a general corporate finance shop/);
    assert.doesNotMatch(markup, /Not a broad project-finance adviser/);
    assert.doesNotMatch(markup, /↗/);
  });

  it("uses the client-approved contact introduction", () => {
    const markup = renderToStaticMarkup(ContactPage());

    assert.match(
      markup,
      /Tell us briefly what you are trying to achieve and where the situation is stuck\. We review each enquiry directly\./,
    );
  });

  it("introduces the situations from their parent business page", () => {
    const markup = renderToStaticMarkup(BusinessOverviewPage());
    const parentSection = "Special situations and strategic realignment";
    const bridge = "The work in practice";

    assert.ok(markup.indexOf(parentSection) < markup.indexOf(bridge));
    assert.match(
      markup,
      /href="\/our-business\/selected-situations">/,
    );
  });

  it("states anonymisation and incomplete-outcome boundaries", () => {
    const markup = renderToStaticMarkup(SelectedSituationsPage());

    assert.match(markup, /The work in practice/);
    assert.match(
      markup,
      /These three anonymised situations show the constraint, the work undertaken and the resulting decision or structural change\./,
    );
    assert.match(
      markup,
      /Company names, jurisdictions, transaction figures and counterparties are omitted/,
    );
    assert.match(
      markup,
      /No transaction or financing is described as completed where it was not\./,
    );
    assert.match(markup, /combination was not ultimately completed\./);
    assert.match(markup, /paused before capital was committed\./);
    assert.match(markup, /fundraising remained in progress/);
  });
});
