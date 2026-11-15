import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, RefreshCw, Printer, Save, Check, MapPin,
  Clock, CalendarDays, AlertTriangle, Users, Route, Send,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";
import { useTrip } from "@/store/TripContext";
import { submitTripPlan } from "@/lib/api";
import { setPendingAuthAction } from "@/lib/authFlow";
import { useAuthFlow } from "@/store/AuthFlowContext";
import { categoryLabel } from "@/data/travel/destinations";
import { getDistrict } from "@/data/travel/districtDetails";
import { pick as pickLang } from "@/lib/pick";

/**
 * ItineraryView — the final results page (route #/trip/itinerary).
 * Renders the rule-based plan from TripContext: overview, day-by-day timeline,
 * estimated costs, warnings, and actions (edit / regenerate / save / print / submit).
 * Costs & times are always labelled ESTIMATES; nothing here is a booking.
 */
export default function ItineraryView() {
  const { t, pick } = useApp();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthFlow();
  const {
    selected, selectedIds, details, itinerary, buildItinerary,
    submissionRequestId, setSubmissionRequestId, lastSubmission, setLastSubmission,
  } = useTrip();
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  const hash = window.location.hash || "";
  useEffect(() => {
    if (hash.includes("submitted=1")) {
      setSubmitMsg("Trip plan submitted successfully. You can view it in My Account.");
      try {
        const raw = sessionStorage.getItem("assamvista:trip:submit-result");
        if (raw) {
          const r = JSON.parse(raw);
          if (r?.ok && r.clientRequestId) setLastSubmission({ ok: true, clientRequestId: r.clientRequestId, at: r.at || Date.now() });
          sessionStorage.removeItem("assamvista:trip:submit-result");
        }
      } catch {}
    }
    if (hash.includes("submit_error=1")) {
      let msg = lastSubmission?.error || "Trip plan submission failed. Please try again.";
      try {
        const raw = sessionStorage.getItem("assamvista:trip:submit-result");
        if (raw) {
          const r = JSON.parse(raw);
          if (r?.error) msg = r.error;
          sessionStorage.removeItem("assamvista:trip:submit-result");
        }
      } catch {}
      setSubmitMsg(msg);
    }
  }, [hash]); // eslint-disable-line react-hooks/exhaustive-deps

  const travellers = (Number(details.adults) || 0) + (Number(details.children) || 0);
  const districtNames = [...new Set(selected.map((d) => d.district))].map((slug) => {
    const d = getDistrict(slug);
    return d ? pickLang(d.name) : slug;
  });

  const onSave = () => {
    try {
      localStorage.setItem("assamvista:trip:saved", JSON.stringify(itinerary));
      setSaved(true);
    } catch { /* storage unavailable — ignore */ }
  };

  const ensureRequestId = () => {
    if (submissionRequestId) return submissionRequestId;
    const id = `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSubmissionRequestId(id);
    return id;
  };

  const doSubmit = async () => {
    if (!itinerary || submitting) return;
    const clientRequestId = ensureRequestId();
    setSubmitting(true);
    setSubmitMsg("");
    try {
      const payload = {
        clientRequestId,
        destinations: selectedIds || [],
        details: details || {},
        itinerary,
      };
      await submitTripPlan(payload);
      setLastSubmission({ ok: true, clientRequestId, at: Date.now() });
      setSubmitMsg("Trip plan submitted successfully. You can view it in My Account.");
      try { window.history.replaceState(null, "", "#/trip/itinerary?submitted=1"); } catch {}
    } catch (err) {
      setLastSubmission({ ok: false, error: err?.message || "Submission failed", clientRequestId });
      setSubmitMsg(err?.message || "Trip plan submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async () => {
    if (!itinerary) return;
    if (!isAuthenticated) {
      const clientRequestId = ensureRequestId();
      setPendingAuthAction({
        type: "submit-trip",
        returnHash: "#/trip/itinerary",
        clientRequestId,
        payload: { destinations: selectedIds || [], details: details || {}, itinerary },
      });
      openLogin({ message: "Log in or create an account to submit your trip plan. Your trip details are preserved and will be submitted after sign-in." });
      return;
    }
    await doSubmit();
  };

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <section className="itin" id="top">
        <div className="itin__head">
          <a className="label itin__back" href="#/travel">← {t("itin_back_travel")}</a>
        </div>
        <div className="itin__empty" data-reveal>
          <Route size={30} aria-hidden="true" />
          <h2>{t("itin_empty")}</h2>
          <p>{t("itin_empty_body")}</p>
          <div className="itin__empty-actions">
            <a className="btn btn--solid" href="#/trip">{t("itin_empty_trip_cta")} <ArrowRight size={15} aria-hidden="true" /></a>
            <a className="btn btn--ghost" href="#/travel">{t("itin_back_travel")}</a>
          </div>
        </div>
      </section>
    );
  }

  const { days, costs, warnings, meta } = itinerary;
  const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <section className="itin" id="top">
      {/* ── header + actions ── */}
      <div className="itin__head">
        <a className="label itin__back" href="#/travel">← {t("itin_back_travel")}</a>
        <span className="label itin__kicker">{t("itin_kicker")}</span>
        <h1 className="itin__title">{t("itin_title")}</h1>
        <p className="itin__lede">{t("itin_overview_tip")}</p>

        <div className="itin__actions">
          <a className="itin__act" href="#/trip"><ArrowLeft size={15} aria-hidden="true" /> {t("itin_edit")}</a>
          <button type="button" className="itin__act" onClick={buildItinerary}>
            <RefreshCw size={15} aria-hidden="true" /> {t("itin_regenerate")}
          </button>
          <button type="button" className="itin__act" onClick={onSave} disabled={saved}>
            {saved ? <Check size={15} aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
            {saved ? t("itin_saved") : t("itin_save")}
          </button>
          <button type="button" className="itin__act itin__act--primary" onClick={onSubmit} disabled={submitting}>
            <Send size={15} aria-hidden="true" /> {submitting ? "Submitting…" : "Submit Trip Plan"}
          </button>
          <button type="button" className="itin__act" onClick={() => window.print()}>
            <Printer size={15} aria-hidden="true" /> {t("itin_print")}
          </button>
        </div>
        {submitMsg && <p className={`itin__submit-msg ${submitMsg.toLowerCase().includes("success") ? "is-ok" : "is-error"}`} role="status">{submitMsg}</p>}
      </div>

      {/* ── overview ── */}
      <div className="itin__overview" data-reveal>
        <h2 className="itin__h2">{t("itin_overview")}</h2>
        <dl className="itin__facts">
          <div><dt><CalendarDays size={13} aria-hidden="true" /> {t("itin_arrival")}</dt><dd>{details.arrivalDate || "—"}</dd></div>
          <div><dt><CalendarDays size={13} aria-hidden="true" /> {t("itin_departure")}</dt><dd>{details.departureDate || "—"}</dd></div>
          <div><dt><Users size={13} aria-hidden="true" /> {t("itin_travellers")}</dt><dd>{travellers}</dd></div>
          <div><dt><MapPin size={13} aria-hidden="true" /> {t("itin_start")}</dt><dd>{details.startLocation || "—"}</dd></div>
          <div><dt><Route size={13} aria-hidden="true" /> {t("itin_nights")}</dt><dd>{meta.nights}</dd></div>
          <div className="itin__fact--wide"><dt>{t("itin_districts")}</dt>
            <dd>{districtNames.length ? districtNames.join(" · ") : "—"}</dd></div>
        </dl>
      </div>

      {/* ── warnings ── */}
      {warnings.length > 0 && (
        <div className="itin__warnings" data-reveal>
          <h2 className="itin__h2"><AlertTriangle size={16} aria-hidden="true" /> {t("itin_warnings")}</h2>
          {warnings.map((w, i) => (
            <p key={i} className={`itin__warning itin__warning--${w.type}`}>{w.message}</p>
          ))}
        </div>
      )}

      {/* ── day by day ── */}
      <div className="itin__days">
        <h2 className="itin__h2">{t("itin_days")}</h2>
        <ol className="itin__timeline">
          {days.map((day) => (
            <li key={day.index} className="itday" data-reveal>
              <div className="itday__marker"><span>{t("itin_day")} {day.index}</span></div>
              <div className="itday__card">
                <div className="itday__meta">
                  <span className="itday__date"><CalendarDays size={13} aria-hidden="true" /> {day.date}</span>
                  {day.sameDay ? (
                    <span className="itday__tag itday__tag--combined">{t("itin_arrival_departure_day")}</span>
                  ) : (
                    <>
                      {day.isArrival && <span className="itday__tag">{t("itin_arrival_day")}</span>}
                      {day.isDeparture && <span className="itday__tag">{t("itin_departure_day")}</span>}
                    </>
                  )}
                  {!day.isArrival && !day.isDeparture && day.slots.length === 0 && (
                    <span className="itday__tag">{t("itin_free_day")}</span>
                  )}
                </div>

                {day.slots.length === 0 ? (
                  <p className="itday__free">{t("itin_free_body")}</p>
                ) : (
                  <ul className="itday__slots">
                    {day.slots.map((slot) => (
                      <li key={slot.destination.id} className="itslot">
                        <div className="itslot__time">
                          <span>{slot.start}</span>
                          <span className="itslot__end">– {slot.end}</span>
                        </div>
                        <div className="itslot__body">
                          <h3 className="itslot__name">{slot.destination.name}</h3>
                          <span className="label itslot__where">
                            <MapPin size={12} aria-hidden="true" /> {slot.destination.districtName}
                            <span className="itslot__sep" aria-hidden="true">·</span> {categoryLabel(slot.destination.category)}
                          </span>
                          {slot.destination.summary && <p className="itslot__sum">{slot.destination.summary}</p>}
                          <span className="itslot__dur"><Clock size={12} aria-hidden="true" /> {t("itin_est_duration")}: ~{slot.hours}h</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {day.notes && day.notes.includes("transfer") && (
                  <p className="itday__note"><Route size={13} aria-hidden="true" /> {t("itin_transfer_note")}</p>
                )}
                {day.notes && (day.notes.includes("uncertain_arrival") || day.notes.includes("uncertain_departure")) && (
                  <p className="itday__note itday__note--warn"><AlertTriangle size={13} aria-hidden="true" /> {t("itin_uncertain_time")}</p>
                )}
                {day.stayDistrict && (
                  <p className="itday__stay"><MapPin size={13} aria-hidden="true" /> {t("itin_stay")}: {day.stayDistrict}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* ── costs ── */}
      <div className="itin__costs" data-reveal>
        <h2 className="itin__h2">{t("itin_costs")}</h2>
        <p className="label itin__costs-note">{t("itin_costs_note")}</p>
        <ul className="itcost__list">
          {costs.breakdown.map((b) => (
            <li key={b.key} className="itcost__row">
              <span>{t(`cost_${b.key}`)}</span>
              <strong>{money(b.value)}</strong>
            </li>
          ))}
        </ul>
        <div className="itcost__total">
          <span>{t("itin_total")}</span>
          <strong>{money(costs.total)}</strong>
        </div>
      </div>

      {/* ── notes + disclaimer ── */}
      <div className="itin__notes" data-reveal>
        <h2 className="itin__h2">{t("itin_notes")}</h2>
        <ul className="itin__notelist">
          <li>{t("itin_overview_tip")}</li>
          {details.notes && <li>{details.notes}</li>}
          {details.accessibility && <li>{details.accessibility}</li>}
        </ul>
        <p className="itin__disclaimer">{t("itin_not_booking")}</p>
      </div>
    </section>
  );
}
