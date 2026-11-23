/**
 * Coverflow — the shared 3D treatment for every horizontal carousel.
 *
 * Each rail keeps its existing markup, snapping, drag and keyboard behaviour;
 * this module only reads the layout and tilts the cards: the card in the middle
 * of the rail sits forward and flat, its neighbours rotate away, recede and dim.
 * Cards swap smoothly as the rail scrolls, so every carousel (culture home
 * rails, spiritual rail, districts/destinations rails, …) shares one look.
 *
 * Two strengths:
 *   • a rail that scrolls horizontally gets the full coverflow, and
 *   • a card row that already fits the viewport gets a restrained fan, so the
 *     same look is there on a wide screen without tilting rows that are not
 *     card carousels (story rows, two-up editorial splits stay flat).
 *
 * The enhancer is mounted once from App.jsx. A MutationObserver picks up rails
 * that arrive later (lazy routes, filter re-renders), so no component needs to
 * know about it.
 */

/** Rails that become a carousel on at least one breakpoint. */
const RAIL_SELECTORS = [
  // culture home
  ".chome__strip",
  ".chome__split",
  ".chome__band",
  ".chome__trio",
  ".chome__rows",
  ".chub__srail-track",
  ".chub__people-grid",
  // travel
  ".tdist-rail",
  ".ddest-rail",
  ".drail__track",
  ".trail__track",
  ".attr__track",
  ".hexp__cards",
  ".communities__grid",
];

/**
 * Card grids that also get the 3D fan when the whole row already fits the
 * viewport. Story rows and two-up editorial splits are deliberately excluded.
 */
const SOFT_SELECTORS = [
  ".chome__strip",
  ".chome__band",
  ".chome__trio",
  ".chub__people-grid",
  ".tdist-rail",
  ".ddest-rail",
  ".drail__track",
  ".trail__track",
  ".attr__track",
  ".hexp__cards",
  ".communities__grid",
];

const SELECTOR = RAIL_SELECTORS.join(",");

const MAX_ROTATE = 18; // degrees at the edge of a scrolling rail
const MAX_DEPTH = 170; // px a card recedes behind the front one
const MAX_RISE = 16; // px a card lifts as it goes back (vanishing point)
const MAX_SHRINK = 0.24; // scale lost at the edge
const MAX_DIM = 0.16; // opacity lost at the edge

// the same look, restrained, for a row that is fully visible
const SOFT_ROTATE = 10;
const SOFT_DEPTH = 60;
const SOFT_RISE = 8;
const SOFT_SHRINK = 0.08;
const SOFT_DIM = 0.08;

/** How many card-widths away a card has to be to sit fully at the back. */
const STRIDE_SPAN = 2.4;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function paint(rail) {
  if (!rail.isConnected) return;

  const items = [...rail.children].filter((el) => el.nodeType === 1);
  const overflow = rail.scrollWidth - rail.clientWidth;
  const scrollable = overflow > 8;
  const soft = !scrollable && rail.dataset.cfSoft === "true";

  rail.classList.toggle("cf--on", scrollable);

  if (!scrollable && !soft) {
    items.forEach((el) => {
      el.style.transform = "";
      el.style.opacity = "";
    });
    return;
  }

  // Read every position first, then write the transforms, so the rail is laid
  // out once per update instead of once per card.
  const middle = (scrollable ? rail.scrollLeft : 0) + rail.clientWidth / 2;
  // Distance is measured in card strides, not viewport halves, so the fan looks
  // the same on a phone rail (one card per view) and on a wide desktop rail.
  const first = items[0];
  const last = items[items.length - 1];
  const stride =
    items.length > 1 ? (last.offsetLeft - first.offsetLeft) / (items.length - 1) : rail.clientWidth;
  const span = Math.max(stride * STRIDE_SPAN, 1);
  const rotate = soft ? SOFT_ROTATE : MAX_ROTATE;
  const depth = soft ? SOFT_DEPTH : MAX_DEPTH;
  const rise = soft ? SOFT_RISE : MAX_RISE;
  const shrink = soft ? SOFT_SHRINK : MAX_SHRINK;
  const dim = soft ? SOFT_DIM : MAX_DIM;

  const placements = items.map((el) => {
    const ratio = clamp((el.offsetLeft + el.offsetWidth / 2 - middle) / span, -1.4, 1.4);
    return { el, ratio, distance: Math.min(Math.abs(ratio), 1) };
  });

  placements.forEach(({ el, ratio, distance }) => {
    // The card facing the viewer stays flat and full size; every other card
    // recedes behind it (translateZ), lifts slightly toward the vanishing
    // point and turns away, so the row reads as one stack in depth.
    el.style.transform =
      `translate3d(0, ${(-distance * rise).toFixed(1)}px, ${(-distance * depth).toFixed(1)}px) ` +
      `rotateY(${(-ratio * rotate).toFixed(2)}deg) ` +
      `scale(${(1 - distance * shrink).toFixed(3)})`;
    el.style.opacity = String(1 - distance * dim);
  });
}

function initRail(rail) {
  rail.dataset.cfReady = "true";
  rail.dataset.cfSoft = SOFT_SELECTORS.some((sel) => rail.matches(sel)) ? "true" : "false";
  rail.classList.add("cf");
  [...rail.children].forEach((el) => {
    if (el.nodeType === 1) el.classList.add("cf__item");
  });

  const schedule = () => paint(rail);
  rail.addEventListener("scroll", schedule, { passive: true });

  // Card lists change with filters and language switches: mark new children and
  // repaint instead of re-initialising the rail.
  const mutations = new MutationObserver(() => {
    [...rail.children].forEach((el) => {
      if (el.nodeType === 1) el.classList.add("cf__item");
    });
    schedule();
  });
  mutations.observe(rail, { childList: true });

  let resizeObserver = null;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(rail);
    [...rail.children].forEach((el) => {
      if (el.nodeType === 1) resizeObserver.observe(el);
    });
  }

  schedule();

  return () => {
    rail.removeEventListener("scroll", schedule);
    mutations.disconnect();
    resizeObserver?.disconnect();
    rail.classList.remove("cf", "cf--on");
    [...rail.children].forEach((el) => {
      if (el.nodeType === 1) {
        el.classList.remove("cf__item");
        el.style.transform = "";
        el.style.opacity = "";
      }
    });
    delete rail.dataset.cfReady;
  };
}

/**
 * Mount the coverflow treatment for the whole app.
 * @returns {() => void} cleanup for the observer, listeners and every rail.
 */
export function startCoverflow(root = document) {
  const rails = new Set();
  const cleanups = [];

  const paintAll = () => rails.forEach(paint);

  const attach = () => {
    root.querySelectorAll(SELECTOR).forEach((rail) => {
      if (rail.dataset.cfReady === "true") return;
      const stop = initRail(rail);
      rails.add(rail);
      cleanups.push(() => {
        rails.delete(rail);
        stop();
      });
    });
    paintAll();
  };

  attach();

  // A lazy-loaded page and its images settle after the first paint, so repaint
  // on load, once the webfonts are ready and again shortly after mount.
  const timers = [300, 1200].map((delay) => window.setTimeout(paintAll, delay));
  window.addEventListener("resize", paintAll);
  window.addEventListener("load", paintAll);
  document.fonts?.ready.then(paintAll).catch(() => {});

  let timer = 0;
  const observer = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(attach, 150);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    window.clearTimeout(timer);
    timers.forEach((id) => window.clearTimeout(id));
    window.removeEventListener("resize", paintAll);
    window.removeEventListener("load", paintAll);
    cleanups.forEach((stop) => stop());
    rails.clear();
  };
}
