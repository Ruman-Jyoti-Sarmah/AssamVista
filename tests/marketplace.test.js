import test from "node:test";
import assert from "node:assert/strict";

import { PRODUCTS, PRODUCT_BY_SLUG } from "../src/data/marketplace/products.js";
import {
  CATEGORIES,
  CATEGORY_BY_ID,
  CATEGORY_BY_SLUG,
} from "../src/data/marketplace/categories.js";
import ASSAM_COMMUNITIES from "../src/data/culture/assam/communities.js";
import {
  PRODUCT_COMMUNITIES,
  SHIPPING,
  browseProducts,
  calculateShipping,
  categoryCount,
  categoryProducts,
  featuredProducts,
  filterProducts,
  formatPrice,
  getCategory,
  getProduct,
  relatedProducts,
  sortProducts,
  verificationOf,
} from "../src/data/marketplace/catalogue.js";

const COMMUNITY_IDS = new Set(ASSAM_COMMUNITIES.map((community) => community.id));
const VERIFICATIONS = new Set(["verified", "needs-review", "unverified"]);

test("marketplace catalogue: 34 unique, complete product records", () => {
  assert.equal(PRODUCTS.length, 34);

  const slugs = PRODUCTS.map((product) => product.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slugs must be unique");

  const required = [
    "slug",
    "name",
    "category",
    "subcategory",
    "type",
    "image",
    "shortDescription",
    "description",
    "origin",
    "materials",
    "price",
    "specs",
    "sources",
    "verification",
    "making",
    "lastUpdated",
  ];

  for (const product of PRODUCTS) {
    for (const field of required) {
      const value = product[field];
      assert.ok(
        value != null && value !== "" && (!Array.isArray(value) || value.length),
        `${product.slug}: missing ${field}`
      );
    }
    assert.ok(Array.isArray(product.description), `${product.slug}: description array`);
    assert.ok(Array.isArray(product.specs), `${product.slug}: specs array`);
    assert.ok(Array.isArray(product.sources), `${product.slug}: sources array`);
    assert.ok(product.price > 0, `${product.slug}: positive price`);
  }
});

test("marketplace categories: 8 unique categories and a closed product mapping", () => {
  assert.equal(CATEGORIES.length, 8);

  const ids = CATEGORIES.map((category) => category.id);
  const slugs = CATEGORIES.map((category) => category.slug);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const category of CATEGORIES) {
    assert.ok(category.name.en && category.name.as, `${category.id}: bilingual name`);
    assert.ok(
      category.description.en && category.description.as,
      `${category.id}: bilingual description`
    );
    assert.ok(category.image, `${category.id}: image`);
    assert.equal(CATEGORY_BY_ID.get(category.id), category);
    assert.equal(CATEGORY_BY_SLUG.get(category.slug), category);
  }

  for (const product of PRODUCTS) {
    assert.ok(
      CATEGORY_BY_ID.has(product.category),
      `${product.slug}: unknown category ${product.category}`
    );
  }

  const counted = CATEGORIES.reduce(
    (sum, category) => sum + categoryCount(category.id),
    0
  );
  assert.equal(counted, PRODUCTS.length, "category counts must cover every product");
});

test("marketplace honesty: verified links only and no invented seller identities", () => {
  for (const product of PRODUCTS) {
    assert.ok(
      VERIFICATIONS.has(product.verification),
      `${product.slug}: unexpected verification ${product.verification}`
    );

    for (const communityId of product.communities || []) {
      assert.ok(
        COMMUNITY_IDS.has(communityId),
        `${product.slug}: community ${communityId} is not in the Communities catalogue`
      );
    }

    // The catalogue must not present a seller or artisan identity as fact.
    assert.equal(product.seller?.status, "unverified", `${product.slug}: seller status`);
    assert.equal(product.seller?.name, undefined, `${product.slug}: no seller name`);
    assert.ok(product.seller?.note, `${product.slug}: seller note`);

    // Every record carries at least one source and an indicative-price note.
    assert.ok(product.sources.length >= 1, `${product.slug}: source`);
    assert.match(product.priceNote, /indicative/i, `${product.slug}: price note`);
  }

  const linked = PRODUCTS.filter((product) => (product.communities || []).length);
  assert.ok(linked.length > 0, "some products carry documented community links");
  assert.ok(linked.length < PRODUCTS.length, "community links are not blanket-assigned");
});

test("marketplace lookups: valid records resolve and invalid slugs return null", () => {
  const first = PRODUCTS[0];
  assert.equal(getProduct(first.slug), PRODUCT_BY_SLUG.get(first.slug));
  assert.equal(getProduct("not-a-real-product"), null);

  assert.equal(getCategory(CATEGORIES[0].slug), CATEGORIES[0]);
  assert.equal(getCategory("not-a-real-category"), null);
});

test("marketplace filters: category, community, district, material and food compose", () => {
  const clothing = filterProducts({ category: "clothing" });
  assert.equal(clothing.length, categoryCount("clothing"));
  assert.ok(clothing.every((product) => product.category === "clothing"));

  const bodo = filterProducts({ communities: "bodo" });
  assert.ok(bodo.length > 0);
  assert.ok(bodo.every((product) => product.communities.includes("bodo")));

  const district = PRODUCTS.find((product) => product.origin?.district)?.origin.district;
  const inDistrict = filterProducts({ district });
  assert.ok(inDistrict.length > 0);
  assert.ok(inDistrict.every((product) => product.origin?.district === district));

  const material = PRODUCTS[0].materials[0];
  const withMaterial = filterProducts({ material });
  assert.ok(withMaterial.length > 0);
  assert.ok(withMaterial.every((product) => product.materials.includes(material)));

  const food = filterProducts({ food: "food" });
  assert.ok(food.length > 0);
  assert.ok(food.every((product) => product.food));
  const nonFood = filterProducts({ food: "non-food" });
  assert.ok(nonFood.every((product) => !product.food));
  assert.equal(food.length + nonFood.length, PRODUCTS.length);

  const impossible = filterProducts({ category: "clothing", district: "__missing__" });
  assert.deepEqual(impossible, []);
});

test("marketplace search: matches names, districts, materials and community labels", () => {
  const byName = filterProducts({ query: PRODUCTS[0].name });
  assert.ok(byName.some((product) => product.slug === PRODUCTS[0].slug));

  const bodoLabel = PRODUCT_COMMUNITIES.find((item) => item.id === "bodo")?.label;
  assert.ok(bodoLabel, "bodo label resolves from the Communities catalogue");
  const byCommunity = filterProducts({ query: bodoLabel });
  assert.ok(byCommunity.length > 0);
  assert.ok(byCommunity.every((product) => product.communities.includes("bodo")));

  assert.deepEqual(filterProducts({ query: "no-such-product-anywhere" }), []);
});

test("marketplace sorting: price, name and featured order are deterministic", () => {
  const asc = sortProducts(PRODUCTS, "price-asc");
  assert.ok(asc.every((product, index) => index === 0 || asc[index - 1].price <= product.price));

  const desc = sortProducts(PRODUCTS, "price-desc");
  assert.ok(desc.every((product, index) => index === 0 || desc[index - 1].price >= product.price));

  const byName = sortProducts(PRODUCTS, "name");
  assert.ok(
    byName.every(
      (product, index) =>
        index === 0 || byName[index - 1].name.localeCompare(product.name, "en") <= 0
    )
  );

  const filtered = browseProducts({ category: "food", sort: "price-asc" });
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((product) => product.category === "food"));

  const featured = featuredProducts();
  assert.ok(featured.length > 0);
  assert.ok(featured.every((product) => product.featured));
});

test("marketplace demo shipping: flat below the threshold, free at and above it", () => {
  assert.equal(calculateShipping(0), 0);
  assert.equal(calculateShipping(SHIPPING.freeAbove - 1), SHIPPING.flat);
  assert.equal(calculateShipping(SHIPPING.freeAbove), 0);
  assert.equal(calculateShipping(SHIPPING.freeAbove + 500), 0);
  assert.equal(formatPrice(18500), "₹18,500");
});

test("marketplace verification labels and related products stay coherent", () => {
  assert.equal(verificationOf({ verification: "verified" }).label, "Verified information");
  assert.equal(verificationOf({ verification: "needs-review" }).label, "Needs review");
  assert.equal(verificationOf({ verification: "unknown" }).label, "Unverified");
  assert.equal(verificationOf(null).label, "Unverified");

  const product = PRODUCTS[0];
  const related = relatedProducts(product, 4);
  assert.ok(related.length <= 4);
  assert.ok(related.every((item) => item.slug !== product.slug));
  assert.equal(relatedProducts(null).length, 0);

  assert.deepEqual(
    categoryProducts(product.category).map((item) => item.slug),
    PRODUCTS.filter((item) => item.category === product.category).map((item) => item.slug)
  );
});
