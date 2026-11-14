import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useApp } from "@/store/AppContext";
import {
  searchRivers,
  filterRiversBySystem,
  availableRiverSides,
  riverSideLabel,
  riverSystemLabel,
} from "@/data/travel/rivers";
import RiversAtlas from "./RiversAtlas";

export default function RiversPage() {
  const { t, pick, lang } = useApp();
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("all");
  const [side, setSide] = useState("all");

  const systemsList = ["brahmaputra", "barak"];
  const sideOptions = useMemo(() => availableRiverSides({ system }), [system]);

  // A bank filter that doesn't exist in the newly chosen system would leave
  // the catalogue empty with no obvious way back, so clear it.
  useEffect(() => {
    if (side !== "all" && !sideOptions.includes(side)) setSide("all");
  }, [side, sideOptions]);

  const base = useMemo(
    () => filterRiversBySystem(system === "all" ? undefined : system),
    [system]
  );
  const filtered = useMemo(() => {
    const searched = new Set(searchRivers(query).map((r) => r.id));
    return base.filter((r) => searched.has(r.id) && (side === "all" || r.side === side));
  }, [query, side, base]);
  const groups = useMemo(() => {
    const order = ["main", "north", "south", "valley"];
    const out = [];
    for (const s of order) {
      const rows = filtered.filter((r) => r.side === s);
      if (rows.length) out.push({ side: s, rows });
    }
    return out;
  }, [filtered]);
  const mapSystems = useMemo(
    () => [...new Set(filtered.map((r) => r.system))].sort(),
    [filtered]
  );
  const hasFilters = query !== "" || system !== "all" || side !== "all";

  const resetFilters = () => {
    setQuery("");
    setSystem("all");
    setSide("all");
  };

  return (
    <div className="rivers" id="top">
      <div className="rivers__hero">
        <img className="rivers__hero-bg" src="/images/rivers/brahmaputra-guwahati.jpg" alt="" aria-hidden="true" />
        <div className="rivers__veil" />
        <div className="rivers__hero-content">
          <p className="label">{t("rivers_hero_kicker")}</p>
          <h1 className="rivers__title">{t("rivers_title")}</h1>
          <p className="rh-sub">{t("rivers_intro")}</p>
        </div>
      </div>

      <div className="rivers__body">
        <p className="rivers__headline">{t("rivers_headline")}</p>

        <div className="rivers__row">
          <div className="rivers__tools">
            <div className="rivers__search-wrap">
              <label htmlFor="rivers-search" className="visually-hidden">{t("rivers_search_label")}</label>
              <Search className="rivers__search-icon" size={16} aria-hidden="true" />
              <input id="rivers-search" className="rivers__search" type="search" placeholder={t("rivers_search_placeholder")} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="rivers__filter-group">
              <p className="rivers__filter-label" id="rivers-system-label">{t("rivers_filter_system")}</p>
              <div className="rivers__filters" role="group" aria-labelledby="rivers-system-label">
                <button type="button" className="rivers__filter" aria-pressed={system === "all"} onClick={() => setSystem("all")}>{t("rivers_all_systems")}</button>
                {systemsList.map((s) => <button key={s} type="button" className="rivers__filter" aria-pressed={system === s} onClick={() => setSystem(s)}>{riverSystemLabel(s, lang)}</button>)}
              </div>
            </div>

            <div className="rivers__filter-group">
              <p className="rivers__filter-label" id="rivers-bank-label">{t("rivers_filter_bank")}</p>
              <div className="rivers__filters" role="group" aria-labelledby="rivers-bank-label">
                <button type="button" className="rivers__filter" aria-pressed={side === "all"} onClick={() => setSide("all")}>{t("rivers_all_banks")}</button>
                {sideOptions.map((s) => <button key={s} type="button" className="rivers__filter" aria-pressed={side === s} onClick={() => setSide(s)}>{riverSideLabel(s, lang)}</button>)}
              </div>
            </div>
          </div>

          <div className="rivers__cards">
            {hasFilters ? (
              <div className="rivers__result-bar">
                <p className="rivers__result-count" role="status" aria-live="polite">{t("rivers_results", { count: filtered.length })}</p>
                <button type="button" className="rivers__reset" onClick={resetFilters}>{t("rivers_reset")}</button>
              </div>
            ) : null}
            {groups.length === 0 ? <p className="rivers__empty">{t("rivers_empty")}</p> : null}
            {groups.map((g) => (
              <div key={g.side} className="rivers__group">
                <h2 className="rivers__group-title">{riverSideLabel(g.side, lang)}</h2>
                <div className="rivers__grid">
                  {g.rows.map((r) => {
                    const aliasEn = r.aliases?.en?.[0];
                    const aliasAs = r.aliases?.as?.[0];
                    return (
                      <article className="rh-card" key={r.id}>
                        <img className="rh-card-media" src={r.image} alt={pick(r.alt)} loading="lazy" decoding="async" />
                        <div className="rh-card-body">
                          <h3 className="rh-card-name">{pick(r.name)}</h3>
                          {aliasEn || aliasAs ? (
                            <p className="rh-card-aliases">{pick({ en: aliasEn || aliasAs, as: aliasAs || aliasEn })}</p>
                          ) : null}
                          <div className="rh-card-meta">
                            <span className="rh-card-badge">{riverSideLabel(r.side, lang)}</span>
                            <span className="rh-card-system">{riverSystemLabel(r.system, lang)}</span>
                          </div>
                          <a className="rh-card-link" href={`#/river/${r.id}`}>{t("rivers_view")} <ArrowRight size={14} aria-hidden="true" /></a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <section className="rivers__map-block" aria-labelledby="rivers-map-title">
            <h2 id="rivers-map-title" className="rivers__section-title">{t("rivers_atlas")}</h2>
            <div className="rivers__map">
              <RiversAtlas systems={mapSystems} label={t("rivers_atlas")} />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
