import { BRAND } from "@/data/site/brand.js";
import { useApp } from "@/store/AppContext";
import { pick } from "@/lib/pick";

const LINKS = (t) => [
  { label: t("nav_heritage"), href: "#/heritage" },
  { label: t("nav_stays"), href: "#/stays" },
  { label: t("nav_cuisine"), href: "#/culture/experiences/cuisine" },
  { label: t("culture_fest_title"), href: "#/culture/festivals" },
  { label: t("nav_districts"), href: "#/districts" },
  { label: t("nav_guide"), href: "#/guide" },
  { label: t("nav_visit"), href: "#/visit" },
  { label: t("nav_journey"), href: "#/journey" },
  { label: t("nav_artists"), href: "#/artists" },
  { label: t("nav_wildlife"), href: "#/wildlife" },
];

/** Footer — route navigation and saved favourites. */
export default function Footer() {
  const { t, favourites, lang } = useApp();
  const NAV = LINKS(t);
  const go = (e, href) => {
    e.preventDefault();
    window.location.hash = href;
  };
  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer__top">
        <div>
          <p className="footer__logo">{pick(BRAND.name, lang)}</p>
          <p className="label footer__tag">{pick(BRAND.tagline, lang)}</p>
          <p className="footer__note">{t("footer_independent_note")}</p>
        </div>
        <div className="footer__cols">
          <nav className="footer__col" aria-label="Footer navigation">
            <h4 className="label">{t("foot_explore")}</h4>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} onClick={(e) => go(e, n.href)}>{n.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="footer__col">
            <h4 className="label">{t("favourites")} ({favourites.length})</h4>
            <ul>
              {favourites.length === 0 && <li><span style={{ opacity: 0.55 }}>—</span></li>}
              {favourites.slice(0, 5).map((s) => (
                <li key={s}><a href={`#/district/${s}`} style={{ textTransform: "capitalize" }}>{pick(s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), lang)}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h4 className="label">{t("foot_plan")}</h4>
            <ul>
              <li><a href="#/guide" onClick={(e) => go(e, "#/guide")}>{t("nav_guide")}</a></li>
              <li><a href="#/journey" onClick={(e) => go(e, "#/journey")}>{t("nav_journey")}</a></li>
              <li><a href="#/visit" onClick={(e) => go(e, "#/visit")}>{t("nav_visit")}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <span>{pick(BRAND.established, lang)}</span>
        <span>{t("foot_legal")}</span>
        <span><a href="#/credits">{t("foot_credits")}</a></span>
      </div>
    </footer>
  );
}
