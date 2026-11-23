import { Suspense, useEffect, useRef, useState } from "react";
import { getDistrict } from "@/data/travel/districtDetails";
import { AppProvider, useApp } from "@/store/AppContext";
import { TripProvider } from "@/store/TripContext";
import { CartProvider } from "@/store/CartContext";
import { AuthProvider } from "@/store/AuthContext";
import { AuthFlowProvider } from "@/store/AuthFlowContext";
import CultureHeader from "@/components/common/CultureHeader";
import SectionDock from "@/components/common/SectionDock";
import Footer from "@/components/common/Footer";
import AssamVistaIntro from "@/components/common/AssamVistaIntro";
import { useRevealRoot } from "@/lib/useReveal";
import { startCoverflow } from "@/lib/coverflow";
import { getSection } from "@/lib/section";
import { getRoute } from "@/app/routes";

const RIVER_TITLE_KEYS = {
  brahmaputra: "title_rivers_brahmaputra",
  barak: "title_rivers_barak",
  subansiri: "title_rivers_subansiri",
  "jia-bharali": "title_rivers_jia-bharali",
  manas: "title_rivers_manas",
  kopili: "title_rivers_kopili",
  kulsi: "title_rivers_kulsi",
  dikhow: "title_rivers_dikhow",
  beki: "title_rivers_beki",
  "burhi-dihing": "title_rivers_burhi-dihing",
  dhansiri: "title_rivers_dhansiri",
  longai: "title_rivers_longai",
};

function scrollToTopInstant() {
  // `scroll-behavior: smooth` is set globally, so the plain `scrollTo(0, 0)`
  // form can be swallowed by a running smooth scroll animation. The object
  // form with an explicit `instant` behaviour always applies immediately.
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (window.scrollY === 0) return;
  } catch {
    // Older engines may not understand the `instant` keyword.
  }

  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
}

/**
 * Scrolls a freshly opened route to the very top.
 *
 * A hash route change re-renders the whole page: the old (tall) page is
 * replaced by the lazily loaded one, so the document briefly collapses and
 * grows again while the browser keeps its previous scroll offset. Repeating
 * the instant jump over the next few frames guarantees the new page really
 * starts at the top instead of showing its footer.
 */
function scrollToTopForRoute() {
  scrollToTopInstant();
  requestAnimationFrame(scrollToTopInstant);
  setTimeout(scrollToTopInstant, 90);
}

function useCurrentHash() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      const next = window.location.hash;
      // The link that triggered the navigation should not stay focused: the
      // browser would scroll it back into view. Only that link is blurred, so
      // focus stays untouched in every other case.
      const active = document.activeElement;
      if (active && active.getAttribute?.("href") === next) active.blur();
      // Open every route page at the very top, even when the previous page
      // was scrolled all the way down to the footer.
      if (!next || next.startsWith("#/")) scrollToTopForRoute();
      setHash(next);
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return hash;
}

function getDistrictSlug(hash) {
  return (hash || "").match(/^#\/district\/([a-z0-9-]+)/)?.[1] || null;
}

function getRiverTitleKey(route) {
  return route.id ? RIVER_TITLE_KEYS[route.id] || null : null;
}

function getPageTitle({ route, districtSlug, riverTitleKey, t, pick }) {
  const district = districtSlug ? getDistrict(districtSlug) : null;

  if (district) {
    return `${pick(district.name)} ${t("title_district_suffix")}`;
  }

  if (riverTitleKey) return t(riverTitleKey);
  if (route.titleKey) return t(route.titleKey);
  return t("title_home");
}

function scrollAfterRouteChange(hash, routeName) {
  const isPageAnchor = hash && !hash.startsWith("#/");

  if (isPageAnchor) {
    try {
      document.querySelector(hash)?.scrollIntoView();
      return;
    } catch {
      // Invalid CSS selectors should not break route changes.
    }
  }

  if (routeName !== "unknown" || hash === "#top" || !hash) {
    scrollToTopInstant();
  }
}

function useRouteEffects({ hash, route, districtSlug, riverTitleKey, t, lang, pick }) {
  useEffect(() => {
    document.title = getPageTitle({ route, districtSlug, riverTitleKey, t, pick });

    const isRouteHash = !hash || hash.startsWith("#/");

    if (isRouteHash) {
      // Route pages always open at the very top, never at the footer.
      scrollToTopForRoute();
      return undefined;
    }

    scrollAfterRouteChange(hash, route.name);
    const timeoutId = setTimeout(() => scrollAfterRouteChange(hash, route.name), 80);
    return () => clearTimeout(timeoutId);
  }, [hash, route.name, route.titleKey, districtSlug, riverTitleKey, t, lang, pick]);
}

/**
 * Rendered inside <Suspense>, so it mounts together with the lazily loaded
 * page. That guarantees the new page is scrolled to the top even when its
 * chunk finished loading after the hash change.
 */
function RouteScrollTop({ hash }) {
  useEffect(() => {
    if (hash && !hash.startsWith("#/")) return undefined;
    // The lazily loaded page mounts here, so this is the moment the document
    // grows back to its real height — scroll to the top again for that layout.
    scrollToTopForRoute();
    return undefined;
  }, [hash]);

  return null;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const page = document.documentElement;
      const scrollableHeight = page.scrollHeight - page.clientHeight;
      const nextProgress = scrollableHeight > 0
        ? page.scrollTop / scrollableHeight
        : 0;

      setProgress(nextProgress);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return progress;
}

function Shell() {
  const { t, lang, pick } = useApp();
  const hash = useCurrentHash();
  const route = getRoute(hash);
  // Only the district route carries a district slug. Other dynamic routes
  // (marketplace category/product) also expose `slug`, but treating those as
  // districts would freeze the page reveal key and stop query-only deep links
  // (for example ?community=bodo) from remounting with their filters applied.
  const districtSlug =
    route.name === "district-detail" ? route.slug : getDistrictSlug(hash);
  const section = getSection(hash);
  const riverTitleKey = getRiverTitleKey(route);
  const progress = useScrollProgress();

  useRouteEffects({ hash, route, districtSlug, riverTitleKey, t, lang, pick });

  // One shared 3D coverflow treatment for every horizontal carousel.
  useEffect(() => startCoverflow(), []);

  // Change this value on every route so newly mounted reveal sections are observed.
  const revealKey = districtSlug ? `district:${districtSlug}` : hash || "home";
  const revealRef = useRevealRoot(revealKey);
  const { Component: Page, ...pageProps } = route;

  return (
    <main ref={revealRef} data-section={section}>
      <a className="skip-link" href="#home-content">Skip to content</a>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <CultureHeader section={section} isCultureHome={route.name === "culture-home"} />
      <Suspense
        fallback={
          <div className="route-loading" role="status" aria-live="polite">
            <span className="route-loading__spinner" aria-hidden="true" />
            <span className="route-loading__label">Loading page…</span>
          </div>
        }
      >
        <RouteScrollTop hash={hash} />
        <Page {...pageProps} key={revealKey} />
      </Suspense>
      {route.name !== "login" && route.name !== "signup" && (
        <SectionDock section={section} />
      )}
      <Footer />
    </main>
  );
}

export default function App() {
  /* The startup intro plays on the very first load and on every page
     reload. Because the app uses hash-based routing inside a single
     page, this state persists while the user navigates between internal
     routes, so the intro never replays on navigation. It only plays
     again after a full refresh, which resets component state.
     The page shell is rendered behind the intro overlay while the intro
     plays, so route code, fonts and images are ready by the time it ends. */
  const [showIntro, setShowIntro] = useState(true);
  const shellRef = useRef(null);

  useEffect(() => {
    if (shellRef.current) shellRef.current.inert = showIntro;
  }, [showIntro]);

  return (
    <AppProvider>
      <AuthProvider>
        <AuthFlowProvider>
          <TripProvider>
            <CartProvider>
              <div ref={shellRef} className="app-shell">
                <Shell />
              </div>
              {showIntro && (
                <AssamVistaIntro onFinish={() => setShowIntro(false)} />
              )}
            </CartProvider>
          </TripProvider>
        </AuthFlowProvider>
      </AuthProvider>
    </AppProvider>
  );
}
