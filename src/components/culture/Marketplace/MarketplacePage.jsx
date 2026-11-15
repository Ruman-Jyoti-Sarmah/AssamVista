import { useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import {
  CATEGORIES,
  categoryCount,
  featuredProducts,
  filterProducts,
  productDistricts,
  PRODUCT_COMMUNITIES,
} from "@/data/marketplace/catalogue";
import { EmptyState, ProductGrid, ShopLinks } from "./MarketplaceUI";

const HERO_IMAGE = "/images/culture/sualkuchi-handloom.jpg";

export default function MarketplacePage() {
  const { t, pick } = useApp();
  const [query, setQuery] = useState("");
  const featured = useMemo(() => featuredProducts(), []);
  const results = useMemo(
    () => (query.trim() ? filterProducts({ query }) : []),
    [query]
  );
  const districts = useMemo(() => productDistricts(), []);
  const searched = query.trim().length > 0;

  const scrollToCategories = () => {
    document.getElementById("mkt-categories")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="mkt">
      <section className="mkt-hero">
        <img className="mkt-hero__img" src={HERO_IMAGE} alt="" />
        <div className="mkt-hero__veil" />
        <div className="mkt-hero__inner">
          <ShopLinks />
          <span className="label">{t("mkt_kicker")}</span>
          <h1 className="mkt-hero__title">{t("mkt_title")}</h1>
          <p className="mkt-hero__sub">{t("mkt_subtitle")}</p>

          <form
            className="mkt-hero__search"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <Search size={18} aria-hidden="true" />
            <label className="visually-hidden" htmlFor="mkt-hero-search">
              {t("mkt_search_label")}
            </label>
            <input
              id="mkt-hero-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("mkt_search_placeholder")}
              autoComplete="off"
            />
            {query ? (
              <button type="button" className="mkt-hero__clear" onClick={() => setQuery("")}>
                {t("mkt_clear")}
              </button>
            ) : null}
          </form>

          <div className="mkt-hero__actions">
            <button type="button" className="mkt-btn mkt-btn--solid" onClick={scrollToCategories}>
              <Compass size={17} aria-hidden="true" />
              {t("mkt_explore_categories")}
            </button>
            <a className="mkt-btn mkt-btn--ghost" href="#/communities">
              <Users size={17} aria-hidden="true" />
              {t("mkt_explore_communities")}
            </a>
          </div>
        </div>
      </section>

      <div className="mkt-wrap">
        <p className="mkt-demo-note">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>{t("mkt_demo_banner")}</span>
        </p>

        {searched ? (
          <section className="mkt-section" aria-live="polite">
            <div className="mkt-section__head">
              <div>
                <span className="label">{t("mkt_search_results")}</span>
                <h2>
                  {t("mkt_results_for", results.length, query.trim())}
                </h2>
              </div>
              <button type="button" className="mkt-link-btn" onClick={() => setQuery("")}>
                {t("mkt_clear_search")}
              </button>
            </div>
            {results.length ? (
              <ProductGrid products={results} label={t("mkt_search_results")} />
            ) : (
              <EmptyState
                icon={Search}
                title={t("mkt_no_results")}
                body={t("mkt_no_results_hint")}
                action={
                  <a className="mkt-btn mkt-btn--solid" href="#/culture/marketplace/category/all">
                    {t("mkt_browse_all")}
                  </a>
                }
              />
            )}
          </section>
        ) : (
          <>
            <section className="mkt-section" id="mkt-categories">
              <div className="mkt-section__head">
                <div>
                  <span className="label">{t("mkt_categories_kicker")}</span>
                  <h2>{t("mkt_categories_title")}</h2>
                  <p>{t("mkt_categories_sub")}</p>
                </div>
              </div>
              <ul className="mkt-cats">
                {CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <a
                      className="mkt-cat"
                      href={`#/culture/marketplace/category/${category.slug}`}
                    >
                      <span className="mkt-cat__media">
                        <img
                          src={category.image}
                          alt={category.imageAlt || pick(category.name)}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="mkt-cat__body">
                        <span className="mkt-cat__count">
                          {t("mkt_product_count", categoryCount(category.id))}
                        </span>
                        <span className="mkt-cat__name">{pick(category.name)}</span>
                        <span className="mkt-cat__desc">{pick(category.description)}</span>
                        <span className="mkt-cat__cta">
                          {t("mkt_browse_category")}
                          <ArrowRight size={15} aria-hidden="true" />
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mkt-section">
              <div className="mkt-section__head">
                <div>
                  <span className="label">{t("mkt_featured_kicker")}</span>
                  <h2>{t("mkt_featured_title")}</h2>
                  <p>{t("mkt_featured_sub")}</p>
                </div>
                <a className="mkt-link-btn" href="#/culture/marketplace/category/all">
                  {t("mkt_view_all")}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
              <ProductGrid products={featured} label={t("mkt_featured_title")} />
            </section>

            <section className="mkt-section mkt-discover">
              <div className="mkt-discover__col">
                <span className="label">{t("mkt_community_kicker")}</span>
                <h2>{t("mkt_community_title")}</h2>
                <p>{t("mkt_community_sub")}</p>
                <ul className="mkt-chips">
                  {PRODUCT_COMMUNITIES.map((community) => (
                    <li key={community.id}>
                      <a
                        href={`#/culture/marketplace/category/all?community=${community.id}`}
                      >
                        {community.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <a className="mkt-inline-link" href="#/communities">
                  {t("mkt_community_page")}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>

              <div className="mkt-discover__col">
                <span className="label">{t("mkt_district_kicker")}</span>
                <h2>{t("mkt_district_title")}</h2>
                <p>{t("mkt_district_sub")}</p>
                <ul className="mkt-chips">
                  {districts.map((district) => (
                    <li key={district}>
                      <a
                        href={`#/culture/marketplace/category/all?district=${encodeURIComponent(district)}`}
                      >
                        <MapPin size={13} aria-hidden="true" />
                        {district}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#/culture/marketplace/category/all">
                      <Store size={13} aria-hidden="true" />
                      {t("mkt_origin_statewide")}
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mkt-section mkt-about">
              <div>
                <span className="label">{t("mkt_about_kicker")}</span>
                <h2>{t("mkt_about_title")}</h2>
              </div>
              <div className="mkt-about__body">
                <p>{t("mkt_about_p1")}</p>
                <p>{t("mkt_about_p2")}</p>
                <p className="mkt-about__note">
                  <Sparkles size={15} aria-hidden="true" />
                  {t("mkt_about_note")}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
