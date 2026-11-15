import { ArrowRight, Store, Users } from "lucide-react";
import { useApp } from "@/store/AppContext";

/**
 * Culture homepage gateway.
 *
 * This replaces the old three-card community carousel in the same page
 * position. It is deliberately only two cards: one leads to the existing
 * Communities page, the other to the Heritage Marketplace. The rest of the
 * Culture homepage is untouched.
 */
export default function CultureGateway() {
  const { t } = useApp();

  return (
    <section className="chub__gateway" aria-labelledby="culture-gateway-title">
      <div className="chub__gateway-head">
        <span className="label">{t("culture_gateway_kicker")}</span>
        <h2 id="culture-gateway-title">{t("culture_gateway_title")}</h2>
        <p>{t("culture_gateway_sub")}</p>
      </div>

      <div className="chub__gateway-grid">
        <article className="chub__gateway-card">
          <div className="chub__gateway-media">
            <img
              src="/images/culture/bihu-dance.jpg"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="chub__gateway-body">
            <span className="chub__gateway-icon" aria-hidden="true">
              <Users size={19} />
            </span>
            <h3>{t("culture_gateway_communities_title")}</h3>
            <p>{t("culture_gateway_communities_text")}</p>
            <a className="chub__gateway-cta" href="#/communities">
              {t("culture_gateway_communities_cta")}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </article>

        <article className="chub__gateway-card chub__gateway-card--shop">
          <div className="chub__gateway-media">
            <img
              src="/images/culture/sualkuchi-handloom.jpg"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="chub__gateway-body">
            <span className="chub__gateway-icon" aria-hidden="true">
              <Store size={19} />
            </span>
            <h3>{t("culture_gateway_shop_title")}</h3>
            <p>{t("culture_gateway_shop_text")}</p>
            <a
              className="chub__gateway-cta chub__gateway-cta--solid"
              href="#/culture/marketplace"
            >
              {t("culture_gateway_shop_cta")}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
