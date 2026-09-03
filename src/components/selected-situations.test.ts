import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import SelectedSituationsPage from "@/app/our-business/illustrative-themes/page";

describe("selected situations page", () => {
  it("presents three evidence-led situations", () => {
    const markup = renderToStaticMarkup(SelectedSituationsPage());

    assert.equal((markup.match(/class="content-section situation"/g) ?? []).length, 3);
    assert.equal((markup.match(/>Initial constraint<\/dt>/g) ?? []).length, 3);
    assert.equal((markup.match(/>Work performed<\/dt>/g) ?? []).length, 3);
    assert.equal((markup.match(/>Resulting decision<\/dt>/g) ?? []).length, 3);
  });

  it("keeps the institutional proof point concise and ahead of the situations", () => {
    const markup = renderToStaticMarkup(SelectedSituationsPage());
    const proofPoint = "Current roles include CEO of RidgeField Capital";
    const firstSituation = "Designing the business before combining the companies";

    assert.match(markup, new RegExp(proofPoint));
    assert.ok(markup.indexOf(proofPoint) < markup.indexOf(firstSituation));
  });

  it("states anonymisation and incomplete-outcome boundaries", () => {
    const markup = renderToStaticMarkup(SelectedSituationsPage());

    assert.match(
      markup,
      /Company names, jurisdictions, transaction figures and counterparties have been omitted\./,
    );
    assert.match(markup, /combination was not ultimately completed\./);
    assert.match(markup, /paused before capital was committed\./);
    assert.match(markup, /fundraising remained in progress/);
  });
});
