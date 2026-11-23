import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { useApp } from "@/store/AppContext";

/**
 * ScrollHint — the visible "this row slides sideways" control under a carousel.
 *
 * It renders a short hint plus real previous/next buttons whenever the rail
 * actually overflows, at every breakpoint: the culture home rails only become
 * scrollers on phones, while the spiritual, artists and travel rails scroll on
 * desktop too. When nothing overflows (a grid that fits) it renders nothing,
 * so the hint can never be a misleading instruction.
 *
 * `targetRef` must point at the scrolling rail element.
 */
export default function ScrollHint({ targetRef, label }) {
  const { t } = useApp();
  const [state, setState] = useState({ scrollable: false, prev: false, next: false });
  const frame = useRef(0);

  useEffect(() => {
    const rail = targetRef?.current;
    if (!rail) return undefined;

    const measure = () => {
      frame.current = 0;
      const overflow = rail.scrollWidth - rail.clientWidth;
      setState({
        scrollable: overflow > 8,
        prev: rail.scrollLeft > 4,
        next: rail.scrollLeft < overflow - 4,
      });
    };
    // Layout reads from a scroll handler are coalesced to one per frame, with a
    // timeout fallback for throttled (background) tabs.
    const refresh = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(measure);
      window.setTimeout(() => {
        if (frame.current) {
          window.cancelAnimationFrame(frame.current);
          measure();
        }
      }, 120);
    };

    measure();
    window.addEventListener("resize", refresh);
    rail.addEventListener("scroll", refresh, { passive: true });
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    observer?.observe(rail);
    if (rail.firstElementChild) observer.observe(rail.firstElementChild);

    return () => {
      window.removeEventListener("resize", refresh);
      rail.removeEventListener("scroll", refresh);
      observer?.disconnect();
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [targetRef]);

  const step = useCallback(
    (direction) => {
      const rail = targetRef?.current;
      if (!rail) return;
      const card = rail.firstElementChild;
      const gap = parseFloat(getComputedStyle(rail).columnGap || "0") || 16;
      const amount = (card?.getBoundingClientRect().width || rail.clientWidth * 0.8) + gap;
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      rail.scrollBy({
        left: direction * amount,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [targetRef]
  );

  if (!state.scrollable) return null;

  return (
    <div className="rail-hint">
      <p className="rail-hint__text">
        <MoveHorizontal size={14} aria-hidden="true" />
        {t("culture_scroll_hint")}
        <ArrowRight size={13} aria-hidden="true" className="rail-hint__nudge" />
      </p>
      <div className="rail-hint__nav">
        <button
          type="button"
          className="rail-hint__btn"
          onClick={() => step(-1)}
          disabled={!state.prev}
          aria-label={`${label || t("culture_scroll_hint")} — previous cards`}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rail-hint__btn"
          onClick={() => step(1)}
          disabled={!state.next}
          aria-label={`${label || t("culture_scroll_hint")} — next cards`}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
