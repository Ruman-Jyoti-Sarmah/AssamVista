import test from "node:test";
import assert from "node:assert/strict";
import ASSAM_COMMUNITIES from "../src/data/culture/assam/communities.js";

test("Assam communities catalogue has complete, unique cards", () => {
  const customImages = {
    bodo: "https://i.pinimg.com/736x/90/75/bf/9075bf9db334e6fdf561b8cae35bf9a6.jpg",
    karbi: "https://miro.medium.com/1*CmEHVYY9O_6pdq35LQvROg.jpeg",
    rabha: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj3kj7LyVhYAN2Or-01YD4Jf_3Flej8LK-I0ZV0WO84sBAQpApyZx2GXRb&s=10",
    dimasa: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Barman_Dimasa_Girl.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    "sonowal-kachari": "https://i0.wp.com/mahabahu.com/wp-content/uploads/2024/01/sonowal-kacharis.jpg?resize=800%2C530&ssl=1",
    deori: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAoR4roinG86PqkW9W8ec4-nTVHCHZEtgFA6OojhVwDEcV0ijw2_WOfOgs&s=10",
    tiwa: "https://upload.wikimedia.org/wikipedia/commons/8/85/Tiwa_people.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    garo: "https://highlandpost.com/wp-content/uploads/2024/02/images-7.jpeg",
    mech: "https://media.assettype.com/sentinelassam-english/2024-07/63abc7b1-9ce2-4287-846b-c0be2be88183/6035572bd61c392f2a30888_WVBYLQxxqdRjheea6aVKsBG66oepdKoso96lQtwjuF7M__YItW-mbE6Xzdd7GWX6ANPKzKjjuTZ0BeWcA6Y0-4lXP1c_JjhtjQMeRtdA8VAncVvVEgHoGIyOK1Z7pyWVAiSEp5gI.jpeg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true",
    naga: "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/wp/current-affairs/2024/09/mao_nagas.webp?v=2",
    khamti: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiYG9urvsdlCnoqGveKFmX8XdOVHr0Ykg3s-z1YNRr0MZEk5b99tg74ZKAySrmQduxkt5K1tiPQjGTKQaBfLQUTbeieFMbLBrYqrGwjlOOxMsnXVwbZ7xEdkbq6URwYFlYGRVzPVXmygQA/s1600/13bihu5.jpg",
  };
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
  ];
  assert.deepEqual(ASSAM_COMMUNITIES.map((community) => community.id), expectedIds);

  const ids = ASSAM_COMMUNITIES.map((community) => community.id);
  assert.equal(new Set(ids).size, ids.length);

  for (const community of ASSAM_COMMUNITIES) {
    assert.ok(community.name);
    assert.ok(community.region);
    assert.ok(community.craft);
    if (customImages[community.id]) {
      assert.equal(
        community.imageUrl,
        customImages[community.id],
      );
    } else {
      assert.ok(community.imageUrl.startsWith("https://commons.wikimedia.org/"));
    }
    assert.ok(community.imageSearchUrl.startsWith("https://www.google.com/search?tbm=isch"));
    assert.ok(community.summary);
    assert.ok(community.story);
    assert.ok(community.foods.length > 0);
    assert.ok(community.languages.length > 0);
    assert.ok(community.traditions.length > 0);
    assert.ok(community.places.length > 0);
  }
});
