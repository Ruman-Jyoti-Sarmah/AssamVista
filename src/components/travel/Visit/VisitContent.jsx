import { MapPin, CalendarCheck, Leaf } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { FINALE } from "@/data/culture/site/experiences.js";

/**
 * STANDALONE PAGE (#/visit) — Plan Your Visit.
 * Hero + general travel guidance and links to the trip-planning tools.
 */
export default function Visit() {
  const { t } = useApp();
  return (
    <section className="visit" id="top" aria-label={t("book_title")}>
      {/* page hero */}
      <div className="visit__hero" data-reveal>
        <div
          className="visit__bg"
          style={{ backgroundImage: `url(${FINALE.image})` }}
          role="img"
          aria-label={FINALE.alt}
        />
        <div className="visit__veil" />
        <div className="visit__hero-content">
          <a className="label visit__back" href="#top">{t("visit_back")}</a>
          <span className="label">{t("visit_kicker", t("nav_visit"))}</span>
          <h1 className="visit__title">
            <span className="tr-line"><span className="tr-inner">{t("visit_l1")}</span></span>
            <span className="tr-line"><span className="tr-inner"><em>{t("visit_l2")}</em></span></span>
          </h1>
          <p className="visit__tag">{t("visit_intro")}</p>
        </div>
      </div>

      {/* travel info cards */}
      <div className="visit__info" data-reveal>
        <div className="visit__card visit__card--feature">
          <MapPin size={18} aria-hidden="true" />
          <h3>{t("visit_reach")}</h3>
          <ul>
            <li><span className="label">{t("visit_air_title")}</span><span>{t("visit_air_body")}</span></li>
            <li><span className="label">{t("visit_rail_title")}</span><span>{t("visit_rail_body")}</span></li>
          </ul>
          <a className="btn btn--ghost visit__cardbtn" href="https://assamtourism.gov.in/" target="_blank" rel="noopener noreferrer">
            {t("visit_official_tourism")}
          </a>
        </div>
        <div className="visit__card visit__card--feature">
          <CalendarCheck size={18} aria-hidden="true" />
          <h3>{t("visit_season")}</h3>
          <p className="visit__season">{t("visit_season_body")}</p>
          <ul className="visit__ticks">
            {t("visit_festivals").map((f) => <li key={f}><i />{f}</li>)}
          </ul>
        </div>
        <div className="visit__card visit__card--feature">
          <Leaf size={18} aria-hidden="true" />
          <h3>{t("visit_know")}</h3>
          <p className="visit__season">{t("visit_check_body")}</p>
          <ul className="visit__ticks">
            <li><i />{t("visit_check_access")}</li>
            <li><i />{t("visit_check_transport")}</li>
            <li><i />{t("visit_check_weather")}</li>
          </ul>
        </div>
      </div>

      {/* planning links */}
      <div className="visit__contact" data-reveal>
        <a className="btn btn--ghost" href="#/districts">{t("visit_districts")}</a>
        <a className="btn btn--solid" href="#/journey">{t("visit_plan_trip")}</a>
      </div>
    </section>
  );
}
