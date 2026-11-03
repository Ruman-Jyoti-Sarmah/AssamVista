import { useApp } from "@/store/AppContext";
import AssamCommunitiesSection from "./AssamCommunitiesSection";

export default function AssamCommunitiesPage() {
  const { t } = useApp();

  return (
    <section className="page" id="top">
      <div className="page__hero">
        <picture className="communities-page__hero-media">
          <source
            media="(max-width: 600px)"
            srcSet="/AssamCommunities-page-hero-mobile.png"
          />
          <img src="/AssamCommunities-page-hero.png" alt="" />
        </picture>
        <div className="page__veil" />
        <div className="page__hero-content">
          <span className="label">{t("page_communities")}</span>
          <h1 className="page__title">{t("page_communities_title")}</h1>
          <p className="page__tagline">{t("page_communities_intro")}</p>
        </div>
      </div>

      <div className="page__body page__body--wide">
        <AssamCommunitiesSection />
      </div>
    </section>
  );
}
