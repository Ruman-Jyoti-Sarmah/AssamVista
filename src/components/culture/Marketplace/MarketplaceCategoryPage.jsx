import { useMemo, useState } from "react";
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import {
  PRODUCTS,
  browseProducts,
  categoryCount,
  getCategory,
  productDistricts,
  productMaterials,
  productRegions,
  productSubcategories,
  PRODUCT_COMMUNITIES,
  SORT_OPTIONS,
  formatPrice,
} from "@/data/marketplace/catalogue";
import {
  Breadcrumbs,
  EmptyState,
  ProductGrid,
  ShopLinks,
} from "./MarketplaceUI";

const PRICE_CEILING =
  Math.ceil(Math.max(...PRODUCTS.map((product) => product.price)) / 500) * 500;

const ALL_BANNER = "/images/culture/sualkuchi-handloom.jpg";

const readParam = (key) => {
  try {
    const query = window.location.hash.split("?")[1] || "";
    return new URLSearchParams(query).get(key) || "";
  } catch {
    return "";
  }
};

export default function MarketplaceCategoryPage({ slug = "all" }) {
  const { t, pick } = useApp();
  const category = slug === "all" ? null : getCategory(slug);

  const [query, setQuery] = useState(() => readParam("q"));
  const [subcategory, setSubcategory] = useState("");
  const [community, setCommunity] = useState(() => readParam("community"));
  const [district, setDistrict] = useState(() => readParam("district"));
  const [region, setRegion] = useState("");
  const [material, setMaterial] = useState("");
  const [food, setFood] = useState("");
  const [availability, setAvailability] = useState("");
  const [maxPrice, setMaxPrice] = useState(PRICE_CEILING);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const subcategories = useMemo(
    () => productSubcategories(category?.id),
    [category?.id]
  );
  const districts = useMemo(() => productDistricts(), []);
  const regions = useMemo(() => productRegions(), []);
  const materials = useMemo(() => productMaterials(), []);

  const products = useMemo(
    () =>
      browseProducts({
        query,
        category: category?.id,
        subcategory,
        communities: community,
        district,
        region,
        material,
        food,
        availability,
        maxPrice: maxPrice < PRICE_CEILING ? maxPrice : "",
        sort,
      }),
    [
      query,
      category?.id,
      subcategory,
      community,
      district,
      region,
      material,
      food,
      availability,
      maxPrice,
      sort,
    ]
  );

  if (slug !== "all" && !category) {
    return (
      <div className="mkt mkt-wrap">
        <ShopLinks />
        <EmptyState
          title={t("mkt_category_missing")}
          body={t("mkt_category_missing_hint")}
          action={
            <a className="mkt-btn mkt-btn--solid" href="#/culture/marketplace">
              {t("mkt_back_marketplace")}
            </a>
          }
        />
      </div>
    );
  }

  const heading = category ? pick(category.name) : t("mkt_all_products");
  const intro = category
    ? pick(category.description)
    : t("mkt_all_products_sub");
  const banner = category?.image || ALL_BANNER;
  const total = category ? categoryCount(category.id) : PRODUCTS.length;

  const activeFilters = [
    subcategory && { key: "sub", label: subcategory, clear: () => setSubcategory("") },
    community && {
      key: "community",
      label:
        PRODUCT_COMMUNITIES.find((item) => item.id === community)?.label ||
        community,
      clear: () => setCommunity(""),
    },
    district && { key: "district", label: district, clear: () => setDistrict("") },
    region && { key: "region", label: region, clear: () => setRegion("") },
    material && { key: "material", label: material, clear: () => setMaterial("") },
    food && {
      key: "food",
      label: food === "food" ? t("mkt_filter_food") : t("mkt_filter_non_food"),
      clear: () => setFood(""),
    },
    availability && {
      key: "availability",
      label: availability,
      clear: () => setAvailability(""),
    },
    maxPrice < PRICE_CEILING && {
      key: "price",
      label: t("mkt_up_to", formatPrice(maxPrice)),
      clear: () => setMaxPrice(PRICE_CEILING),
    },
  ].filter(Boolean);

  const clearAll = () => {
    setQuery("");
    setSubcategory("");
    setCommunity("");
    setDistrict("");
    setRegion("");
    setMaterial("");
    setFood("");
    setAvailability("");
    setMaxPrice(PRICE_CEILING);
  };

  return (
    <div className="mkt">
      <section className="mkt-page-hero">
        <img className="mkt-page-hero__img" src={banner} alt="" />
        <div className="mkt-page-hero__veil" />
        <div className="mkt-page-hero__inner">
          <ShopLinks />
          <Breadcrumbs
            items={[
              { label: t("mkt_breadcrumb"), href: "#/culture/marketplace" },
              { label: heading },
            ]}
          />
          <span className="label">{t("mkt_category_label")}</span>
          <h1>{heading}</h1>
          <p>{intro}</p>
          <span className="mkt-page-hero__count">
            {t("mkt_product_count", total)}
          </span>
        </div>
      </section>

      <div className="mkt-wrap">
        <div className="mkt-cat-toolbar">
          <label className="mkt-search">
            <span className="visually-hidden">{t("mkt_search_label")}</span>
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("mkt_search_in_category")}
              autoComplete="off"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label={t("mkt_clear")}>
                <X size={15} aria-hidden="true" />
              </button>
            ) : null}
          </label>

          <div className="mkt-cat-toolbar__right">
            <button
              type="button"
              className="mkt-filter-toggle"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
            >
              <Filter size={16} aria-hidden="true" />
              {t("mkt_filters")}
              {activeFilters.length ? <em>{activeFilters.length}</em> : null}
            </button>
            <label className="mkt-sort">
              <SlidersHorizontal size={15} aria-hidden="true" />
              <span className="visually-hidden">{t("mkt_sort_label")}</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {t(`mkt_sort_${option.id.replace(/-/g, "_")}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mkt-layout">
          <aside className={`mkt-filters${filtersOpen ? " is-open" : ""}`}>
            <div className="mkt-filters__head">
              <h2>
                <Filter size={16} aria-hidden="true" />
                {t("mkt_filters")}
              </h2>
              <button type="button" onClick={clearAll}>
                {t("mkt_clear_all")}
              </button>
            </div>

            <div className="mkt-filter-group">
              <span className="mkt-filter-group__title">{t("mkt_filter_subcategory")}</span>
              <div className="mkt-filter-chips">
                <button
                  type="button"
                  className={subcategory === "" ? "is-active" : ""}
                  onClick={() => setSubcategory("")}
                >
                  {t("mkt_filter_all")}
                </button>
                {subcategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={subcategory === item ? "is-active" : ""}
                    onClick={() => setSubcategory(subcategory === item ? "" : item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <label className="mkt-filter-group">
              <span className="mkt-filter-group__title">{t("mkt_filter_community")}</span>
              <select value={community} onChange={(event) => setCommunity(event.target.value)}>
                <option value="">{t("mkt_filter_any")}</option>
                {PRODUCT_COMMUNITIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="mkt-filter-group">
              <span className="mkt-filter-group__title">{t("mkt_filter_district")}</span>
              <select value={district} onChange={(event) => setDistrict(event.target.value)}>
                <option value="">{t("mkt_filter_any")}</option>
                {districts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="mkt-filter-group">
              <span className="mkt-filter-group__title">{t("mkt_filter_region")}</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="">{t("mkt_filter_any")}</option>
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="mkt-filter-group">
              <span className="mkt-filter-group__title">{t("mkt_filter_material")}</span>
              <select value={material} onChange={(event) => setMaterial(event.target.value)}>
                <option value="">{t("mkt_filter_any")}</option>
                {materials.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="mkt-filter-group">
              <span className="mkt-filter-group__title">{t("mkt_filter_type")}</span>
              <select value={food} onChange={(event) => setFood(event.target.value)}>
                <option value="">{t("mkt_filter_any")}</option>
                <option value="food">{t("mkt_filter_food")}</option>
                <option value="non-food">{t("mkt_filter_non_food")}</option>
              </select>
            </label>

            <label className="mkt-filter-group">
              <span className="mkt-filter-group__title">{t("mkt_filter_availability")}</span>
              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
              >
                <option value="">{t("mkt_filter_any")}</option>
                <option value="made-to-order">{t("mkt_avail_made_to_order")}</option>
              </select>
            </label>

            <div className="mkt-filter-group">
              <span className="mkt-filter-group__title">{t("mkt_filter_price")}</span>
              <input
                className="mkt-range"
                type="range"
                min="0"
                max={PRICE_CEILING}
                step="100"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                aria-label={t("mkt_filter_price")}
              />
              <span className="mkt-filter-price">
                {t("mkt_up_to", formatPrice(maxPrice))}
              </span>
            </div>
          </aside>

          <div className="mkt-results">
            <div className="mkt-results__bar">
              <p aria-live="polite">
                {t("mkt_results_count", products.length, total)}
              </p>
              {activeFilters.length ? (
                <ul className="mkt-active-filters">
                  {activeFilters.map((item) => (
                    <li key={item.key}>
                      <button type="button" onClick={item.clear}>
                        {item.label}
                        <X size={12} aria-hidden="true" />
                        <span className="visually-hidden">{t("mkt_remove_filter")}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button type="button" className="mkt-active-filters__clear" onClick={clearAll}>
                      {t("mkt_clear_all")}
                    </button>
                  </li>
                </ul>
              ) : null}
            </div>

            {products.length ? (
              <ProductGrid products={products} label={heading} />
            ) : (
              <EmptyState
                icon={Search}
                title={t("mkt_no_results")}
                body={t("mkt_no_results_hint")}
                action={
                  <button type="button" className="mkt-btn mkt-btn--solid" onClick={clearAll}>
                    {t("mkt_clear_all")}
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
