import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Heart,
  MapPin,
  Plus,
  Trash2,
  Users,
  X,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useLocalStorage } from "@/lib/storage";
import { FESTIVAL_CATEGORIES, FESTIVALS, getFestivalById } from "@/data/culture/festivals";

const HERO_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Bihu-Dance-assam.jpg?width=1600";
const HERO_FALLBACK = "/images/culture/bihu-dance.jpg";

function toDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}
function fmtISO(d) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(date, n) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + n);
  return d;
}
function daysBetween(a, b) {
  if (!a || !b) return 0;
  return Math.round((b - a) / 86400000) + 1;
}
function monthName(m) {
  return new Date(2026, m - 1, 1).toLocaleString("en-US", { month: "long" });
}
function uid() {
  return `fplan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function pickPrimaryLocation(f) {
  if (!f) return "Assam";
  const locs = (f.locations || []).filter((l) => l && l.toLowerCase() !== "across assam");
  return locs[0] || f.locations?.[0] || "Assam";
}
function sameWindow(festival, arrival, departure) {
  if (!festival || !arrival || !departure) return { ok: true, note: "" };
  const months = new Set();
  const cur = new Date(arrival.getTime());
  while (cur <= departure) {
    months.add(cur.getMonth() + 1);
    cur.setDate(cur.getDate() + 1);
  }
  const hints = festival.monthHint || [];
  const overlap = hints.some((m) => months.has(m));
  if (overlap) {
    const label = festival.dateVariability === "fixed" ? "matches the festival date window" : "overlaps the likely celebration period";
    return { ok: true, note: `${festival.name}: your dates ${label} (${festival.celebrationPeriod}).` };
  }
  return {
    ok: false,
    note: `${festival.name} is usually celebrated in ${festival.celebrationPeriod}. Your selected dates may not align; verify the exact ${festival.dateVariability === "variable" ? "annual" : "local"} dates before travel.`,
  };
}

function buildItinerary(selectedFestivals, arrivalStr, departureStr) {
  const arrival = toDate(arrivalStr);
  const departure = toDate(departureStr);
  if (!selectedFestivals.length || !arrival || !departure || departure < arrival) return null;

  const totalDays = daysBetween(arrival, departure);
  const nights = Math.max(0, totalDays - 1);
  const byMonth = new Map();
  selectedFestivals.forEach((f) => {
    const key = (f.monthHint && f.monthHint[0]) || 0;
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(f);
  });
  const groups = [...byMonth.entries()].sort((a, b) => a[0] - b[0]).map(([, fs]) => fs);
  const warnings = [];

  selectedFestivals.forEach((f) => {
    const c = sameWindow(f, arrival, departure);
    if (!c.ok) warnings.push({ type: "compat", message: c.note, festivalId: f.id });
    else if (f.dateVariability !== "fixed") warnings.push({ type: "info", message: `${f.name} has ${f.dateVariability} dates (${f.celebrationPeriod}). Confirm the exact schedule for your travel year.`, festivalId: f.id });
  });

  if (groups.length > 1) {
    warnings.unshift({
      type: "separate",
      message: `Selected festivals fall in different periods (${groups.map((g) => g.map((f) => f.name).join(", ")).join(" vs ")}). Combining them into one continuous trip may be unrealistic. Consider separate trips for each period.`,
    });
  }

  const primaryGroup = groups[0] || selectedFestivals;
  const extraGroups = groups.slice(1);
  const days = [];
  const usedFestivalDays = new Set();

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(arrival, i);
    const dayNum = i + 1;
    const isFirst = i === 0;
    const isLast = i === totalDays - 1;
    let title = "Explore Assam";
    let location = pickPrimaryLocation(primaryGroup[0]);
    let activities = [];
    let notes = [];
    let festivalFocus = null;

    if (isFirst) {
      title = "Arrival in Assam";
      location = "Guwahati / arrival point";
      activities = [
        "Arrive and transfer to your stay (Guwahati is the main gateway for most routes).",
        "Check in, rest and take an orientation walk in the local area.",
        primaryGroup[0] ? `Prepare for ${primaryGroup[0].name}: review venue/timing guidance and local transport.` : "Plan local sightseeing based on your interests.",
      ];
      notes.push("Keep buffer time for arrival delays; confirm local festival schedules on arrival.");
    } else if (isLast && totalDays > 1) {
      title = "Departure";
      location = "Return to departure point";
      activities = [
        "Breakfast and last-minute local shopping for crafts or festive foods where appropriate.",
        "Transfer to airport/railway station with buffer time.",
        "Depart Assam with your festival travel memories.",
      ];
      notes.push("Allow extra travel time during major festival crowds.");
    } else {
      const available = primaryGroup.filter((f) => !usedFestivalDays.has(f.id));
      const focus = available[0] || primaryGroup[(i - 1) % primaryGroup.length];
      if (focus) {
        festivalFocus = focus.id;
        usedFestivalDays.add(focus.id);
        location = pickPrimaryLocation(focus);
        title = `Festival experience: ${focus.name}`;
        activities = [
          `Attend/observe ${focus.name} in ${location} (${focus.celebrationPeriod}).`,
          `Experience key traditions: ${(focus.rituals || []).slice(0, 2).join("; ") || "local customs and community gatherings"}.`,
          `Cultural highlights: ${focus.musicDance || focus.touristExperience}`,
          "Explore nearby local markets, heritage spots or riverfront areas as time permits.",
        ];
        notes.push(`Recommended duration for this festival: ${focus.recommendedDuration}. ${focus.dateVariability !== "fixed" ? "Verify exact date/timing for the selected year." : "Date is generally fixed, but confirm local program schedules."}`);
      } else {
        activities = ["Local sightseeing, cuisine experiences and cultural exploration.", "Rest and flexible time for travel between districts."];
      }
    }

    if (!isFirst && !isLast && primaryGroup.length > 1) {
      notes.push("Travel sequence tip: group nearby districts together to reduce road time between festival locations.");
    }

    days.push({
      day: dayNum,
      date: fmtISO(date),
      dateLabel: date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
      title,
      location,
      district: location,
      activities,
      notes,
      festivalFocus,
      suggestedDuration: isFirst || isLast ? "Half day + travel" : "Full day",
    });
  }

  if (extraGroups.length) {
    extraGroups.forEach((group, idx) => {
      warnings.push({
        type: "suggestion",
        message: `Suggested separate trip ${idx + 2}: plan ${group.map((f) => f.name).join(", ")} in ${group[0].monthHint?.[0] ? monthName(group[0].monthHint[0]) : "their usual period"} with dates aligned to ${group.map((f) => f.celebrationPeriod).join("; ")}.`,
      });
    });
  }

  const byDistrict = [...new Set(days.map((d) => d.location).filter(Boolean))];

  return {
    generatedAt: new Date().toISOString(),
    arrivalDate: arrivalStr,
    departureDate: departureStr,
    totalDays,
    nights,
    selectedFestivalIds: selectedFestivals.map((f) => f.id),
    days,
    warnings,
    summary: {
      festivals: selectedFestivals.map((f) => ({ id: f.id, name: f.name, period: f.celebrationPeriod, location: pickPrimaryLocation(f) })),
      districts: byDistrict,
      sequence: days.map((d) => ({ day: d.day, location: d.location, title: d.title })),
    },
  };
}

function FestivalCard({ festival, selected, onToggle, onView }) {
  const [img, setImg] = useState(festival.image);
  return (
    <article className="fest-card" data-reveal>
      <div className="fest-card__media">
        <img src={img} alt={festival.name} loading="lazy" decoding="async" onError={() => setImg(festival.fallbackImage || HERO_FALLBACK)} />
        <span className="fest-card__badge">{festival.categoryLabel}</span>
      </div>
      <div className="fest-card__body">
        <h3>{festival.name}</h3>
        <p className="fest-card__meta"><Users size={14} /> {festival.community}</p>
        <p className="fest-card__meta"><CalendarDays size={14} /> {festival.celebrationPeriod}</p>
        <p className="fest-card__meta"><MapPin size={14} /> {festival.locations.slice(0, 3).join(", ")}{festival.locations.length > 3 ? "…" : ""}</p>
        <p className="fest-card__desc">{festival.description}</p>
        <div className="fest-card__actions">
          <button type="button" className="fest-btn fest-btn--ghost" onClick={() => onView(festival)}>View Details</button>
          <button type="button" className={`fest-btn ${selected ? "fest-btn--saved" : "fest-btn--solid"}`} onClick={() => onToggle(festival)}>
            {selected ? <><CheckCircle2 size={15} /> Saved</> : <><Plus size={15} /> Save to My Trip</>}
          </button>
        </div>
      </div>
    </article>
  );
}

export function AssamCultureAndFestivalsContent() {
  const { t } = useApp();
  const plannerRef = useRef(null);
  const [heroImg, setHeroImg] = useState(HERO_IMAGE);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [selectedIds, setSelectedIds] = useLocalStorage("assamvista:festivalTrip:selected", []);
  const [savedPlans, setSavedPlans] = useLocalStorage("assamvista:festivalTrip:plans", []);
  const [draft, setDraft] = useState({ arrivalDate: "", departureDate: "", travelYear: String(new Date().getFullYear()) });
  const [generated, setGenerated] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [notice, setNotice] = useState("");

  const selectedFestivals = useMemo(() => selectedIds.map(getFestivalById).filter(Boolean), [selectedIds]);
  const filtered = useMemo(() => (filter === "all" ? FESTIVALS : FESTIVALS.filter((f) => f.category === filter)), [filter]);

  useEffect(() => {
    if (!notice) return;
    const tmo = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(tmo);
  }, [notice]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setDetail(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleFestival = (festival) => {
    setSelectedIds((prev) => {
      if (prev.includes(festival.id)) return prev.filter((id) => id !== festival.id);
      return [...prev, festival.id];
    });
  };
  const removeSelected = (id) => setSelectedIds((prev) => prev.filter((x) => x !== id));

  const arrival = toDate(draft.arrivalDate);
  const departure = toDate(draft.departureDate);
  const totalDays = arrival && departure && departure >= arrival ? daysBetween(arrival, departure) : 0;
  const nights = Math.max(0, totalDays - 1);
  const compatibility = useMemo(() => {
    if (!arrival || !departure || departure < arrival) return [];
    return selectedFestivals.map((f) => sameWindow(f, arrival, departure));
  }, [selectedFestivals, draft.arrivalDate, draft.departureDate]);

  const onGenerate = () => {
    if (!selectedFestivals.length) { setNotice("Select at least one festival to generate your travel plan."); return; }
    if (!draft.arrivalDate || !draft.departureDate) { setNotice("Choose arrival and departure dates to generate your itinerary."); return; }
    if (departure < arrival) { setNotice("Departure date must be on or after arrival date."); return; }
    const plan = buildItinerary(selectedFestivals, draft.arrivalDate, draft.departureDate);
    setGenerated(plan);
    setNotice("Your festival travel plan has been generated.");
    setTimeout(() => plannerRef.current?.querySelector(".fest-itinerary")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const onSavePlan = () => {
    if (!generated) { setNotice("Generate a travel plan before saving."); return; }
    const name = selectedFestivals.map((f) => f.name).slice(0, 2).join(" + ") + (selectedFestivals.length > 2 ? ` +${selectedFestivals.length - 2}` : "");
    const planRecord = {
      id: editingPlanId || uid(),
      name: name || "Festival Trip Plan",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      draft: { ...draft },
      selectedIds: [...selectedIds],
      itinerary: generated,
    };
    setSavedPlans((prev) => {
      const exists = prev.some((p) => p.id === planRecord.id);
      if (exists) return prev.map((p) => (p.id === planRecord.id ? { ...planRecord, createdAt: p.createdAt } : p));
      return [planRecord, ...prev];
    });
    setEditingPlanId(planRecord.id);
    setNotice(editingPlanId ? "Plan updated." : "Plan saved.");
  };

  const openPlan = (plan) => {
    setSelectedIds(plan.selectedIds || []);
    setDraft(plan.draft || { arrivalDate: "", departureDate: "", travelYear: String(new Date().getFullYear()) });
    setGenerated(plan.itinerary || null);
    setEditingPlanId(plan.id);
    setNotice("Saved plan loaded. You can edit and save changes.");
    plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const deletePlan = (id) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
    if (editingPlanId === id) setEditingPlanId(null);
    setNotice("Saved plan deleted.");
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="page fest-page" id="top">
      <div className="fest-hero">
        <img src={heroImg} alt="Festival celebration in Assam" onError={() => setHeroImg(HERO_FALLBACK)} />
        <div className="fest-hero__veil" />
        <div className="fest-hero__content">
          <span className="label fest-hero__kicker">{t("page_culture") || "Culture"}</span>
          <h1 className="fest-hero__title">Celebrate the Spirit of Assam</h1>
          <p className="fest-hero__tagline">From the rhythmic beats of Bihu to the spiritual celebrations of Ambubachi, discover the festivals that make Assam extraordinary.</p>
          <div className="fest-hero__actions">
            <button type="button" className="fest-btn fest-btn--solid fest-btn--hero" onClick={() => scrollTo("festival-directory")}>Explore Festivals <ArrowRight size={16} /></button>
            <button type="button" className="fest-btn fest-btn--ghost fest-btn--hero" onClick={() => scrollTo("festival-planner")}>Plan Your Festival Journey <CalendarDays size={16} /></button>
          </div>
        </div>
      </div>

      <div className="fest-body">
        {notice && <div className="fest-notice" role="status">{notice}</div>}

        <section className="fest-section" id="festival-directory">
          <div className="fest-section__head">
            <span className="fest-kicker">Festival directory</span>
            <h2>Discover Assam's living celebrations</h2>
            <p>Explore major festivals across communities, seasons and traditions. View cultural details and save festivals to build your own trip plan.</p>
          </div>
          <div className="fest-filters" role="tablist" aria-label="Festival categories">
            {FESTIVAL_CATEGORIES.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={filter === c.id} className={`fest-chip ${filter === c.id ? "is-active" : ""}`} onClick={() => setFilter(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="fest-grid">
            {filtered.map((festival) => (
              <FestivalCard key={festival.id} festival={festival} selected={selectedIds.includes(festival.id)} onToggle={toggleFestival} onView={setDetail} />
            ))}
          </div>
          {!filtered.length && <p className="fest-empty">No festivals found in this category.</p>}
        </section>

        <section className="fest-section fest-planner" id="festival-planner" ref={plannerRef}>
          <div className="fest-section__head">
            <span className="fest-kicker">Festival trip planner</span>
            <h2>Build your festival journey</h2>
            <p>Select festivals, choose your travel dates, check compatibility and generate a realistic day-by-day itinerary. Plans are saved in this browser for demo use.</p>
          </div>

          <div className="fest-planner__layout">
            <div className="fest-panel">
              <h3><Heart size={18} /> Selected festivals <span className="fest-count">{selectedFestivals.length}</span></h3>
              {selectedFestivals.length === 0 ? (
                <p className="fest-muted">No festivals selected yet. Use “Save to My Trip” on festival cards to add them here.</p>
              ) : (
                <ul className="fest-selected">
                  {selectedFestivals.map((f) => (
                    <li key={f.id}>
                      <div>
                        <strong>{f.name}</strong>
                        <span>{f.celebrationPeriod} · {pickPrimaryLocation(f)}</span>
                      </div>
                      <div className="fest-selected__actions">
                        <button type="button" className="fest-icon-btn" onClick={() => setDetail(f)} aria-label={`View ${f.name}`}>View</button>
                        <button type="button" className="fest-icon-btn fest-icon-btn--danger" onClick={() => removeSelected(f.id)} aria-label={`Remove ${f.name}`}><Trash2 size={14} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="fest-form-grid">
                <label className="fest-field">
                  <span>Travel year</span>
                  <input type="number" min="2024" max="2035" value={draft.travelYear} onChange={(e) => setDraft((d) => ({ ...d, travelYear: e.target.value }))} />
                </label>
                <label className="fest-field">
                  <span>Arrival date</span>
                  <input type="date" value={draft.arrivalDate} onChange={(e) => setDraft((d) => ({ ...d, arrivalDate: e.target.value }))} />
                </label>
                <label className="fest-field">
                  <span>Departure date</span>
                  <input type="date" min={draft.arrivalDate || undefined} value={draft.departureDate} onChange={(e) => setDraft((d) => ({ ...d, departureDate: e.target.value }))} />
                </label>
              </div>
              <div className="fest-trip-meta">
                <div><strong>{totalDays || "—"}</strong><span>Total days</span></div>
                <div><strong>{totalDays ? nights : "—"}</strong><span>Nights</span></div>
                <div><strong>{selectedFestivals.length}</strong><span>Festivals</span></div>
              </div>

              <div className="fest-compat">
                <h4>Festival date compatibility</h4>
                {!selectedFestivals.length && <p className="fest-muted">Add festivals to check compatibility with your dates.</p>}
                {selectedFestivals.length > 0 && (!draft.arrivalDate || !draft.departureDate) && <p className="fest-muted">Choose arrival and departure dates to evaluate compatibility.</p>}
                {compatibility.map((c, i) => (
                  <div key={selectedFestivals[i]?.id || i} className={`fest-compat__item ${c.ok ? "is-ok" : "is-warn"}`}>
                    {c.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                    <span>{c.note || "Select dates to check compatibility."}</span>
                  </div>
                ))}
              </div>

              <div className="fest-planner__actions">
                <button type="button" className="fest-btn fest-btn--solid" onClick={onGenerate}><CalendarDays size={16} /> Done — Generate My Travel Plan</button>
                <button type="button" className="fest-btn fest-btn--ghost" onClick={onSavePlan} disabled={!generated}>Save Plan</button>
              </div>
            </div>

            <div className="fest-panel">
              <h3>Saved plans</h3>
              {savedPlans.length === 0 ? (
                <p className="fest-muted">No saved plans yet. Generate and save a plan to reopen, edit or delete it later.</p>
              ) : (
                <ul className="fest-saved">
                  {savedPlans.map((p) => (
                    <li key={p.id} className={editingPlanId === p.id ? "is-editing" : ""}>
                      <div>
                        <strong>{p.name}</strong>
                        <span>{p.itinerary?.arrivalDate || p.draft?.arrivalDate || "—"} → {p.itinerary?.departureDate || p.draft?.departureDate || "—"} · {p.selectedIds?.length || 0} festivals</span>
                      </div>
                      <div className="fest-selected__actions">
                        <button type="button" className="fest-icon-btn" onClick={() => openPlan(p)}><Edit3 size={14} /> Open/Edit</button>
                        <button type="button" className="fest-icon-btn fest-icon-btn--danger" onClick={() => deletePlan(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="fest-muted fest-note">Demo persistence: plans are stored locally in your browser using the existing local storage pattern and can be migrated to backend storage later.</p>
            </div>
          </div>

          {generated && (
            <div className="fest-itinerary">
              <div className="fest-itinerary__head">
                <div>
                  <span className="fest-kicker">Generated itinerary</span>
                  <h3>Your festival travel plan</h3>
                  <p>{generated.arrivalDate} to {generated.departureDate} · {generated.totalDays} days / {generated.nights} nights · {selectedFestivals.length} selected festival(s)</p>
                </div>
              </div>

              {generated.warnings?.length > 0 && (
                <div className="fest-warnings">
                  {generated.warnings.map((w, i) => (
                    <div key={i} className={`fest-warning fest-warning--${w.type || "info"}`}>
                      <AlertTriangle size={16} />
                      <p>{w.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="fest-summary-grid">
                <div className="fest-summary-card">
                  <h4>Festival sequence</h4>
                  <ul>{generated.summary.festivals.map((f) => <li key={f.id}><strong>{f.name}</strong><span>{f.period} · {f.location}</span></li>)}</ul>
                </div>
                <div className="fest-summary-card">
                  <h4>Districts / locations</h4>
                  <ul>{generated.summary.districts.map((d) => <li key={d}><strong>{d}</strong><span>Suggested stop based on selected festivals</span></li>)}</ul>
                </div>
                <div className="fest-summary-card">
                  <h4>Practical notes</h4>
                  <ul>
                    <li><strong>Date checks</strong><span>Variable-date festivals should be confirmed for your exact travel year before booking.</span></li>
                    <li><strong>Travel pacing</strong><span>Allow buffer time for road transfers, crowds and weather, especially during major celebrations.</span></li>
                    <li><strong>Respectful travel</strong><span>Follow local guidance at religious/community events and ask before photographing people or rituals.</span></li>
                  </ul>
                </div>
              </div>

              <ol className="fest-days">
                {generated.days.map((day) => (
                  <li key={day.day} className="fest-day">
                    <div className="fest-day__head">
                      <span className="fest-day__num">Day {day.day}</span>
                      <div>
                        <h4>{day.title}</h4>
                        <p><CalendarDays size={14} /> {day.dateLabel} · <MapPin size={14} /> {day.location} · <Clock3 size={14} /> {day.suggestedDuration}</p>
                      </div>
                    </div>
                    <ul className="fest-day__activities">
                      {day.activities.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                    {day.notes?.length > 0 && <div className="fest-day__notes">{day.notes.map((n, i) => <p key={i}><strong>Note:</strong> {n}</p>)}</div>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      </div>

      {detail && <FestivalDetailModal festival={detail} selected={selectedIds.includes(detail.id)} onClose={() => setDetail(null)} onToggle={toggleFestival} />}
    </section>
  );
}

function FestivalDetailModal({ festival, selected, onClose, onToggle }) {
  const [img, setImg] = useState(festival.image);
  useEffect(() => setImg(festival.image), [festival]);
  return (
    <div className="fest-modal" role="dialog" aria-modal="true" aria-label={festival.name}>
      <button type="button" className="fest-modal__backdrop" onClick={onClose} aria-label="Close details" />
      <div className="fest-modal__panel">
        <button type="button" className="fest-modal__close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="fest-modal__media">
          <img src={img} alt={festival.name} onError={() => setImg(festival.fallbackImage || HERO_FALLBACK)} />
        </div>
        <div className="fest-modal__body">
          <span className="fest-card__badge">{festival.categoryLabel}</span>
          <h2>{festival.name}</h2>
          <p className="fest-modal__lead">{festival.description}</p>
          <div className="fest-detail-grid">
            <DetailBlock label="Festival overview" value={festival.culturalSignificance} />
            <DetailBlock label="History and cultural significance" value={festival.culturalSignificance} />
            <DetailBlock label="Who celebrates it" value={festival.community} />
            <DetailBlock label="When it is celebrated" value={festival.celebrationPeriod} />
            <DetailBlock label="Annual date variability" value={`${festival.annualDate} (${festival.dateVariability === "fixed" ? "Fixed annual date" : festival.dateVariability === "approximate" ? "Approximate period each year" : "Variable each year; verify annual date"})`} />
            <DetailBlock label="Districts and important locations" value={festival.locations.join(", ")} />
            <DetailBlock label="Traditional rituals" value={festival.rituals.join("; ")} />
            <DetailBlock label="Traditional clothing, music and dance" value={festival.musicDance || festival.clothingFood} />
            <DetailBlock label="Food and special attractions" value={festival.clothingFood} />
            <DetailBlock label="Tourist experience" value={festival.touristExperience} />
            <DetailBlock label="Recommended visit duration" value={festival.recommendedDuration} />
            <DetailBlock label="Travel tips" value={`Plan around ${festival.celebrationPeriod}. ${festival.dateVariability !== "fixed" ? "Confirm exact dates for your travel year and book transport/stays early for popular events." : "Book stays early if visiting major venues."} Respect local customs, dress appropriately for religious/community settings, and allow extra time for crowds.`} />
          </div>
          <div className="fest-modal__actions">
            <button type="button" className={`fest-btn ${selected ? "fest-btn--saved" : "fest-btn--solid"}`} onClick={() => onToggle(festival)}>
              {selected ? <><CheckCircle2 size={15} /> Saved to My Trip</> : <><Plus size={15} /> Save to My Trip</>}
            </button>
            <button type="button" className="fest-btn fest-btn--ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ label, value }) {
  if (!value) return null;
  return (
    <div className="fest-detail-block">
      <h4>{label}</h4>
      <p>{value}</p>
    </div>
  );
}
