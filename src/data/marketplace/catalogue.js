/**
 * Marketplace selectors and helpers.
 *
 * Everything the marketplace UI needs to search, filter, sort and format the
 * catalogue lives here so the components stay presentation-only. Products and
 * categories remain plain data files that can grow without touching this
 * module.
 */
import ASSAM_COMMUNITIES from "../culture/assam/communities.js";
import { CATEGORIES, CATEGORY_BY_ID, CATEGORY_BY_SLUG } from "./categories.js";
import { PRODUCTS, PRODUCT_BY_SLUG } from "./products.js";

export { CATEGORIES, CATEGORY_BY_ID, CATEGORY_BY_SLUG, PRODUCTS, PRODUCT_BY_SLUG };

export const getProduct = (slug) => PRODUCT_BY_SLUG.get(slug) || null;
export const getCategory = (slug) => CATEGORY_BY_SLUG.get(slug) || null;

/** Flat demo shipping rule — clearly labelled as a demo in the checkout UI. */
export const SHIPPING = {
  flat: 120,
  freeAbove: 2500,
};

export const calculateShipping = (subtotal) =>
  subtotal <= 0 || subtotal >= SHIPPING.freeAbove ? 0 : SHIPPING.flat;

export const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const VERIFICATION = {
  verified: {
    label: "Verified information",
    tone: "verified",
    note: "Product facts in this record are drawn from the sources listed on the page.",
  },
  "needs-review": {
    label: "Needs review",
    tone: "review",
    note: "Some details are still being checked. Only supported information is shown.",
  },
  unverified: {
    label: "Unverified",
    tone: "unverified",
    note: "This record has not yet been checked against a source.",
  },
};

export const verificationOf = (product) =>
  VERIFICATION[product?.verification] || VERIFICATION.unverified;

const uniqueSorted = (values) =>
  [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "en")
  );

/** Community ids used by at least one product, with readable labels. */
export const PRODUCT_COMMUNITIES = uniqueSorted(
  PRODUCTS.flatMap((product) => product.communities || [])
).map((id) => {
  const community = ASSAM_COMMUNITIES.find((item) => item.id === id);
  return {
    id,
    label: community
      ? community.name.replace(/\s*community$/i, "")
      : id.replace(/-/g, " "),
  };
});

export const COMMUNITY_LABEL_BY_ID = new Map(
  PRODUCT_COMMUNITIES.map((item) => [item.id, item.label])
);

export const productDistricts = () =>
  uniqueSorted(PRODUCTS.map((product) => product.origin?.district));

export const productRegions = () =>
  uniqueSorted(PRODUCTS.map((product) => product.origin?.region));

export const productMaterials = () =>
  uniqueSorted(PRODUCTS.flatMap((product) => product.materials || []));

export const productSubcategories = (categoryId) => {
  const fromProducts = PRODUCTS.filter(
    (product) => !categoryId || product.category === categoryId
  ).map((product) => product.subcategory);

  if (categoryId) {
    const category = CATEGORY_BY_ID.get(categoryId);
    return uniqueSorted([...(category?.subcategories || []), ...fromProducts]);
  }

  return uniqueSorted([
    ...CATEGORIES.flatMap((category) => category.subcategories),
    ...fromProducts,
  ]);
};

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** One text blob per product so every documented field is searchable. */
export const productHaystack = (product) =>
  normalize(
    [
      product.name,
      product.localName,
      product.category,
      product.subcategory,
      product.type,
      product.shortDescription,
      ...(product.description || []),
      product.origin?.locality,
      product.origin?.district,
      product.origin?.region,
      ...(product.materials || []),
      ...(product.communities || []).map(
        (id) => COMMUNITY_LABEL_BY_ID.get(id) || id
      ),
      ...(product.specs || []).map((spec) => `${spec.label} ${spec.value}`),
      ...(product.sources || []).map((source) => source.title),
    ]
      .filter(Boolean)
      .join(" ")
  );

const matchesText = (product, term) =>
  !term || productHaystack(product).includes(normalize(term));

/**
 * Filter the catalogue. Every option is optional; an empty filter is ignored.
 * Products with no district (for example state-wide handmade items) are not
 * attributed to a district just to fill a filter.
 */
export function filterProducts(filters = {}) {
  const {
    query,
    category,
    subcategory,
    communities = [],
    district,
    region,
    material,
    food,
    availability,
    maxPrice,
  } = filters;

  const communityList = Array.isArray(communities)
    ? communities
    : communities
      ? [communities]
      : [];

  return PRODUCTS.filter((product) => {
    if (category && product.category !== category) return false;
    if (subcategory && product.subcategory !== subcategory) return false;
    if (
      communityList.length &&
      !communityList.some((id) => (product.communities || []).includes(id))
    )
      return false;
    if (district && product.origin?.district !== district) return false;
    if (region && product.origin?.region !== region) return false;
    if (material && !(product.materials || []).includes(material)) return false;
    if (food === "food" && !product.food) return false;
    if (food === "non-food" && product.food) return false;
    if (availability && product.availability !== availability) return false;
    if (maxPrice && product.price > Number(maxPrice)) return false;
    return matchesText(product, query);
  });
}

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "name", label: "Alphabetical" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest additions" },
];

export function sortProducts(products, sort = "featured") {
  const list = [...products];

  switch (sort) {
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name, "en"));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => {
        const byDate = String(b.lastUpdated || "").localeCompare(
          String(a.lastUpdated || "")
        );
        if (byDate !== 0) return byDate;
        return PRODUCTS.indexOf(b) - PRODUCTS.indexOf(a);
      });
    default:
      return list.sort((a, b) => {
        if (Boolean(b.featured) !== Boolean(a.featured))
          return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        return PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b);
      });
  }
}

export const browseProducts = (filters = {}) =>
  sortProducts(filterProducts(filters), filters.sort);

export const categoryProducts = (categoryId) =>
  PRODUCTS.filter((product) => product.category === categoryId);

export const featuredProducts = () =>
  PRODUCTS.filter((product) => product.featured);

export function relatedProducts(product, limit = 4) {
  if (!product) return [];
  const sameCategory = PRODUCTS.filter(
    (item) => item.slug !== product.slug && item.category === product.category
  );
  const sharedCommunity = PRODUCTS.filter(
    (item) =>
      item.slug !== product.slug &&
      item.category !== product.category &&
      (item.communities || []).some((id) =>
        (product.communities || []).includes(id)
      )
  );
  return [...sameCategory, ...sharedCommunity].slice(0, limit);
}

/** Only counts products that actually exist in this catalogue. */
export const categoryCount = (categoryId) =>
  categoryProducts(categoryId).length;
