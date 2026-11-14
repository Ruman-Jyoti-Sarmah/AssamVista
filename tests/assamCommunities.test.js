import test from "node:test";
import assert from "node:assert/strict";
import ASSAM_COMMUNITIES, {
  COMMUNITY_CATEGORY_ORDER,
} from "../src/data/culture/assam/communities.js";

const expectedIds = [
  "bodo",
  "mising",
  "karbi",
  "rabha",
  "dimasa",
  "sonowal-kachari",
  "deori",
  "tiwa",
  "garo",
  "hajong",
  "hmar",
  "khasi",
  "chakma",
  "mech",
  "kuki",
  "naga",
  "singpho",
  "khamti",
  "thengal-kachari",
  "hojai",
  "chutia",
  "tai-ahom",
  "moran",
  "matak",
  "koch-rajbongshi",
  "jaintia",
  "tea-tribes",
  "santhal",
  "munda",
  "oraon",
  "kharia",
  "ho",
  "bhumij",
  "bengali",
  "nepali",
  "manipuri",
  "tai-phake",
  "tai-aiton",
  "tai-turung",
  "tai-khamyang",
];

test("Assam communities catalogue is one complete, unique 40-card list", () => {
  assert.deepEqual(
    ASSAM_COMMUNITIES.map((community) => community.id),
    expectedIds
  );

  const ids = ASSAM_COMMUNITIES.map((community) => community.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ASSAM_COMMUNITIES.length, 40);
});

test("every community card carries image, story, food, language and dance details", () => {
  for (const community of ASSAM_COMMUNITIES) {
    assert.ok(community.name, `${community.id} has a name`);
    assert.ok(community.region, `${community.id} has a region`);
    assert.ok(community.craft, `${community.id} has a craft line`);
    assert.ok(
      community.imageUrl.startsWith("https://") ||
        community.imageUrl.startsWith("/"),
      `${community.id} has an image URL`
    );
    assert.ok(
      community.imageSearchUrl.startsWith(
        "https://www.google.com/search?tbm=isch"
      ),
      `${community.id} has an image search link`
    );
    assert.ok(community.summary, `${community.id} has a summary`);
    assert.ok(community.story, `${community.id} has a history/story`);
    assert.ok(community.foods.length > 0, `${community.id} lists foods`);
    assert.ok(
      community.languages.length > 0,
      `${community.id} lists languages`
    );
    assert.ok(
      community.traditions.length > 0,
      `${community.id} lists traditions`
    );
    assert.ok(community.places.length > 0, `${community.id} lists places`);
    assert.ok(community.dances.length > 0, `${community.id} lists a dance`);
    assert.ok(community.clothing, `${community.id} describes clothing`);
    assert.ok(
      COMMUNITY_CATEGORY_ORDER.includes(community.category),
      `${community.id} uses a known category`
    );
    assert.ok(
      ["Community", "Umbrella identity", "Linguistic community"].includes(
        community.scope
      ),
      `${community.id} uses a known identity scope`
    );
    assert.ok(
      Array.isArray(community.references),
      `${community.id} has a references array`
    );

    for (const dance of community.dances) {
      assert.ok(dance.name, `${community.id} dance has a name`);
      assert.ok(dance.description, `${community.id} dance has a description`);
      assert.ok(dance.significance, `${community.id} dance has significance`);
      assert.ok(dance.occasion, `${community.id} dance has an occasion`);
      assert.ok(dance.clothing, `${community.id} dance has clothing`);
      assert.ok(
        ["verified", "verification"].includes(dance.status),
        `${community.id} dance has a known status`
      );
    }
  }
});

test("dance records are merged into the communities that share their identity", () => {
  const bodo = ASSAM_COMMUNITIES.find((community) => community.id === "bodo");
  assert.ok(bodo.dances.some((dance) => dance.name === "Bagurumba"));

  // Tai Khamti dance data is stored under its own record id and mapped onto
  // the existing Khamti community card.
  const khamti = ASSAM_COMMUNITIES.find((community) => community.id === "khamti");
  assert.ok(khamti.dances.some((dance) => dance.name === "Kaa Kong Tou Kai"));

  // Unverified records keep the explicit verification status instead of
  // inventing a dance name.
  const mech = ASSAM_COMMUNITIES.find((community) => community.id === "mech");
  assert.equal(mech.danceVerified, false);
  assert.equal(mech.dances[0].status, "verification");
  assert.equal(mech.dances[0].name, "Information under verification");

  const teaTribes = ASSAM_COMMUNITIES.find(
    (community) => community.id === "tea-tribes"
  );
  assert.equal(teaTribes.scope, "Umbrella identity");
  assert.ok(teaTribes.dances.some((dance) => dance.name === "Jhumur"));
});
