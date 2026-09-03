import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import Home from "@/app/page";
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

    assert.match(homeMarkup, new RegExp(proofPoint));
    assert.ok(homeMarkup.indexOf("Founder-led") < homeMarkup.indexOf(proofPoint));
    assert.doesNotMatch(situationsMarkup, new RegExp(proofPoint));
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

    assert.match(
      markup,
      /Company names, jurisdictions, transaction figures and counterparties are omitted/,
    );
    assert.match(markup, /combination was not ultimately completed\./);
    assert.match(markup, /paused before capital was committed\./);
    assert.match(markup, /fundraising remained in progress/);
  });
});
