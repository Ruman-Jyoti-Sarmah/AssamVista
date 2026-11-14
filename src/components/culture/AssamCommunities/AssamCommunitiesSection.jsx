import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Languages,
  MapPin,
  Music2,
  Search,
  Shirt,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import ASSAM_COMMUNITIES, {
  COMMUNITY_CATEGORY_ORDER,
  VERIFICATION_LABEL,
} from "@/data/culture/assam/communities";
import { useApp } from "@/store/AppContext";

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const translateValue = (value, t) =>
  value === VERIFICATION_LABEL ? t("community_verification") : value;

function CommunityImage({ community, className = "", t }) {
  const [src, setSrc] = useState(community.imageUrl);
  const [unavailable, setUnavailable] = useState(false);

  const handleError = () => {
    if (community.fallbackImage && src !== community.fallbackImage) {
      setSrc(community.fallbackImage);
      return;
    }
    setUnavailable(true);
  };

  if (unavailable || !src) {
    return (
      <div className={`${className} community-card__image-placeholder`}>
        <p>{t("community_image_unavailable")}</p>
        <a href={community.imageSearchUrl} target="_blank" rel="noopener noreferrer">
          {t("community_google_images")} <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={community.photoAlt || community.name}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
}

function DetailList({ icon: Icon, title, items }) {
  if (!items?.length) return null;
  return (
    <div className="community-card__detail-group">
      <h3>
        {Icon ? <Icon size={16} aria-hidden="true" /> : null}
        {title}
      </h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function DanceDetails({ community, t }) {
  if (!community.dances.length) return null;

  return (
    <section className="community-card__dance-block" aria-label={t("community_dance")}>
      <h3>
        <Music2 size={18} aria-hidden="true" />
        {t("community_dance")}
      </h3>
      {community.dances.map((dance, index) => {
        const underVerification = dance.status === "verification";
        const name = underVerification ? t("community_verification") : dance.name;

        return (
          <article
            className={`community-dance ${underVerification ? "is-unverified" : ""}`}
            key={`${dance.name}-${index}`}
          >
            <div className="community-dance__head">
              <h4>
                {underVerification ? <Info size={15} aria-hidden="true" /> : null}
                {name}
              </h4>
              {dance.alternateNames?.length ? (
                <p className="community-dance__also">
                  {t("community_dance_also_called")}: {dance.alternateNames.join(", ")}
                </p>
              ) : null}
            </div>
            <p className="community-dance__description">{dance.description}</p>
            <dl className="community-dance__facts">
              <div>
                <dt>
                  <BookOpen size={14} aria-hidden="true" />
                  {t("community_dance_significance")}
                </dt>
                <dd>{translateValue(dance.significance, t)}</dd>
              </div>
              <div>
                <dt>
                  <CalendarDays size={14} aria-hidden="true" />
                  {t("community_dance_occasion")}
                </dt>
                <dd>{translateValue(dance.occasion, t)}</dd>
              </div>
              <div>
                <dt>
                  <Shirt size={14} aria-hidden="true" />
                  {t("community_dance_clothing")}
                </dt>
                <dd>{translateValue(dance.clothing, t)}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </section>
  );
}

export default function AssamCommunitiesSection({ compact = false }) {
  const { t } = useApp();
  const isCarousel = compact;
  const [expandedCommunityId, setExpandedCommunityId] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const trackRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

  useEffect(() => {
    setExpandedCommunityId(null);
  }, [query, category]);

  const filtered = useMemo(() => {
    const term = normalize(query);

    return ASSAM_COMMUNITIES.filter((community) => {
      if (category !== "all" && community.category !== category) return false;
      if (!term) return true;

      const haystack = [
        community.name,
        ...community.altNames,
        community.region,
        community.craft,
        community.summary,
        community.story,
        ...community.foods,
        ...community.languages,
        ...community.traditions,
        ...community.places,
        ...community.dances.flatMap((dance) => [
          dance.name,
          ...(dance.alternateNames || []),
          dance.description,
          dance.significance,
          dance.occasion,
          dance.clothing,
        ]),
      ]
        .map(normalize)
        .join(" ");

      return haystack.includes(term);
    });
  }, [query, category]);

  // Culture homepage shows only 3 communities; the full list lives on the
  // dedicated communities page.
  const communities = compact ? ASSAM_COMMUNITIES.slice(0, 3) : filtered;
  const hasFilters = query.trim().length > 0 || category !== "all";

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
  };

  const updateSliderButtons = useCallback(() => {
    if (!isCarousel) return;

    const track = trackRef.current;
    if (!track) return;

    setCanGoBack(track.scrollLeft > 4);
    setCanGoForward(track.scrollLeft < track.scrollWidth - track.clientWidth - 4);
  }, [isCarousel]);

  useEffect(() => {
    if (!isCarousel) return undefined;

    const track = trackRef.current;
    if (!track) return undefined;

    updateSliderButtons();
    track.addEventListener("scroll", updateSliderButtons, { passive: true });
    window.addEventListener("resize", updateSliderButtons);

    return () => {
      track.removeEventListener("scroll", updateSliderButtons);
      window.removeEventListener("resize", updateSliderButtons);
    };
  }, [isCarousel, updateSliderButtons]);

  const moveSlider = (direction) => {
    if (!isCarousel) return;

    const track = trackRef.current;
    const firstCard = track?.querySelector(".community-card");
    if (!track || !firstCard) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const cardsToMove = window.matchMedia("(max-width: 600px)").matches ? 1 : 3;

    track.scrollBy({
      left: direction * (cardWidth * cardsToMove + gap * (cardsToMove - 1)),
      behavior: "smooth",
    });
  };

  const toggleDetails = (communityId) => {
    setExpandedCommunityId((currentId) =>
      currentId === communityId ? null : communityId
    );
  };

  return (
    <section className={`communities${compact ? " communities--compact" : ""}`} id="assam-communities">
      {/* The dedicated page already introduces the catalogue in its hero;
          repeating the same title/intro above the grid is redundant. */}
      {compact ? (
        <div className="communities__head">
          <span className="label">{t("culture_communities_kicker")}</span>
          <h2 className="communities__title">{t("culture_communities_title")}</h2>
          <p className="communities__intro">{t("culture_communities_sub")}</p>
        </div>
      ) : (
        /* Keep the heading hierarchy (h1 → h2 → card h3s) intact without
           repeating the hero title visually. */
        <h2 className="visually-hidden">{t("culture_communities_title")}</h2>
      )}

      {!compact ? (
        <div className="communities__toolbar">
          <div className="communities__toolbar-row">
            <label className="communities__search">
              <span className="visually-hidden">{t("community_search_label")}</span>
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("community_search_placeholder")}
                autoComplete="off"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t("community_clear")}
                >
                  <X size={15} aria-hidden="true" />
                </button>
              ) : null}
            </label>

            <div
              className="communities__filters"
              role="group"
              aria-label={t("community_filter_label")}
            >
              <button
                type="button"
                className={`communities__filter ${category === "all" ? "is-active" : ""}`}
                onClick={() => setCategory("all")}
                aria-pressed={category === "all"}
              >
                {t("community_all")}
              </button>
              {COMMUNITY_CATEGORY_ORDER.map((key) => (
                <button
                  type="button"
                  key={key}
                  className={`communities__filter ${category === key ? "is-active" : ""}`}
                  onClick={() => setCategory(key)}
                  aria-pressed={category === key}
                >
                  {t(`community_cat_${key}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="communities__status">
            <p role="status" aria-live="polite">
              {t("community_count", filtered.length, ASSAM_COMMUNITIES.length)}
            </p>
            {hasFilters ? (
              <button type="button" className="communities__clear" onClick={clearFilters}>
                {t("community_clear")}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {isCarousel ? (
        <div className="communities__controls" aria-label="Community carousel controls">
          <button
            type="button"
            className="communities__control"
            onClick={() => moveSlider(-1)}
            disabled={!canGoBack}
            aria-label="Previous communities"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="communities__control"
            onClick={() => moveSlider(1)}
            disabled={!canGoForward}
            aria-label="Next communities"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {!compact && filtered.length === 0 ? (
        <div className="communities__empty">
          <Search size={26} aria-hidden="true" />
          <h3>{t("community_empty")}</h3>
          <p>{t("community_empty_hint")}</p>
          <button type="button" className="btn btn--ghost" onClick={clearFilters}>
            {t("community_clear")}
          </button>
        </div>
      ) : (
        <div
          ref={trackRef}
          className={`communities__grid ${
            isCarousel ? "communities__grid--carousel" : "communities__grid--stacked"
          }`}
          role="region"
          aria-label={isCarousel ? "Communities of Assam carousel" : "Communities of Assam list"}
          tabIndex={isCarousel ? 0 : undefined}
        >
          {communities.map((community) => {
            const expanded = expandedCommunityId === community.id;
            const detailsId = `community-details-${community.id}`;

            return (
              <article
                className={`community-card ${expanded ? "is-expanded" : ""}`}
                key={community.id}
              >
                <div className="community-card__image-wrap">
                  <CommunityImage community={community} className="community-card__image" t={t} />
                  <span className="community-card__badge">
                    {t(`community_cat_${community.category}`)}
                  </span>
                </div>
                <div className="community-card__body">
                  <span className="page__culture-kind community-card__region">
                    <MapPin size={12} aria-hidden="true" />
                    {community.region}
                  </span>
                  <h3>{community.name}</h3>
                  <p>{community.summary}</p>

                  <div className="community-card__dance-tags">
                    {community.dances.slice(0, 2).map((dance) => (
                      <span
                        key={dance.name}
                        className={`community-card__dance-tag ${
                          dance.status === "verification" ? "is-unverified" : ""
                        }`}
                      >
                        {dance.status === "verification" ? (
                          <Info size={12} aria-hidden="true" />
                        ) : (
                          <Music2 size={12} aria-hidden="true" />
                        )}
                        {dance.status === "verification"
                          ? t("community_verification")
                          : dance.name}
                      </span>
                    ))}
                    {community.dances.length > 2 ? (
                      <span className="community-card__dance-tag community-card__dance-tag--more">
                        +{community.dances.length - 2}
                      </span>
                    ) : null}
                  </div>

                  <p className="community-card__craft">{community.craft}</p>

                  {compact ? (
                    <a className="btn btn--ghost community-card__button" href="#/communities">
                      {t("community_explore")} <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      className="btn btn--ghost community-card__button"
                      type="button"
                      onClick={() => toggleDetails(community.id)}
                      aria-expanded={expanded}
                      aria-controls={detailsId}
                    >
                      {expanded ? t("community_less") : t("community_more")}
                      <ChevronDown size={15} aria-hidden="true" />
                    </button>
                  )}

                  {!compact && expanded ? (
                    <div className="community-card__details" id={detailsId}>
                      <div className="community-card__detail-hero">
                        <div className="community-card__detail-image-wrap">
                          <CommunityImage
                            community={community}
                            className="community-card__detail-image"
                            t={t}
                          />
                        </div>
                        <div>
                          <span className="page__culture-kind">{t("community_history")}</span>
                          <p className="community-card__story">{community.story}</p>
                          <div className="community-card__meta-row">
                            <span>
                              {t("community_scope")}:{" "}
                              <strong>
                                {t(
                                  `community_scope_${
                                    community.scope === "Umbrella identity"
                                      ? "umbrella"
                                      : community.scope === "Linguistic community"
                                      ? "linguistic"
                                      : "community"
                                  }`
                                )}
                              </strong>
                            </span>
                            {!community.danceVerified ? (
                              <span className="community-card__verify-chip">
                                <Info size={12} aria-hidden="true" />
                                {t("community_verification")}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <DanceDetails community={community} t={t} />

                      <div className="community-card__detail-columns">
                        <DetailList
                          icon={Utensils}
                          title={t("community_foods")}
                          items={community.foods}
                        />
                        <DetailList
                          icon={Languages}
                          title={t("community_languages")}
                          items={community.languages}
                        />
                        <DetailList
                          icon={Sparkles}
                          title={t("community_traditions")}
                          items={community.traditions}
                        />
                      </div>

                      <DetailList
                        icon={MapPin}
                        title={t("community_places")}
                        items={community.places}
                      />

                      {community.references.length ? (
                        <div className="community-card__references">
                          <h3>{t("community_references")}</h3>
                          <ul>
                            {community.references.map((reference) => (
                              <li key={reference.url}>
                                <a
                                  href={reference.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {reference.label}{" "}
                                  <ExternalLink size={12} aria-hidden="true" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <a
                        className="community-card__source"
                        href={community.imageSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("community_google_images")}{" "}
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!compact ? (
        <footer className="communities__foot">
          <Info size={16} aria-hidden="true" />
          <p>{t("community_source_note")}</p>
        </footer>
      ) : null}
    </section>
  );
}
