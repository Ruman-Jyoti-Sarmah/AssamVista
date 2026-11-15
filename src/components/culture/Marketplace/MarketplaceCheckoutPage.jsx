import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";
import { useAuthFlow } from "@/store/AuthFlowContext";
import { setPendingAuthAction } from "@/lib/authFlow";
import { useCart } from "@/store/CartContext";
import { submitOrder } from "@/lib/api";
import { DISTRICTS } from "@/data/travel/districts";
import { formatPrice } from "@/data/marketplace/catalogue";
import {
  Breadcrumbs,
  EmptyState,
  ShopLinks,
} from "./MarketplaceUI";

const PAYMENT_METHODS = [
  { id: "cod", labelKey: "mkt_pay_cod", Icon: Truck },
  { id: "upi", labelKey: "mkt_pay_upi", Icon: Smartphone },
  { id: "card", labelKey: "mkt_pay_card", Icon: CreditCard },
];

const CHECKOUT_DRAFT_KEY = "assamvista:checkout:draft";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  pincode: "",
  notes: "",
};

function loadDraft() {
  try {
    const raw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function MarketplaceCheckoutPage() {
  const { t } = useApp();
  const { isAuthenticated, user } = useAuth();
  const { openLogin } = useAuthFlow();
  const { cartLines, subtotal, shipping, total, clearCart } = useCart();
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...(loadDraft()?.form || {}) }));
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState(() => loadDraft()?.payment || "cod");
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestId, setRequestId] = useState(() => loadDraft()?.requestId || `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const initialForm = useMemo(() => ({
    ...EMPTY_FORM,
    fullName: user?.name || "",
    email: user?.email || "",
  }), [user]);

  const formState = useMemo(() => ({
    ...initialForm,
    ...form,
    fullName: form.fullName || initialForm.fullName,
    email: form.email || initialForm.email,
  }), [form, initialForm]);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify({ form, payment, requestId, savedAt: Date.now() }));
    } catch {}
  }, [form, payment, requestId]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const validate = () => {
    const next = {};
    if (formState.fullName.trim().length < 2) next.fullName = t("mkt_err_name");
    if (!/^[0-9+\-\s]{8,15}$/.test(formState.phone.trim()))
      next.phone = t("mkt_err_phone");
    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim()))
      next.email = t("mkt_err_email");
    if (formState.address.trim().length < 6) next.address = t("mkt_err_address");
    if (formState.city.trim().length < 2) next.city = t("mkt_err_city");
    if (!formState.district) next.district = t("mkt_err_district");
    if (!/^[0-9]{6}$/.test(formState.pincode.trim())) next.pincode = t("mkt_err_pin");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    if (!isAuthenticated) {
      setPendingAuthAction({ type: "checkout", returnHash: "#/culture/marketplace/checkout" });
      openLogin({ message: "Log in or create an account to continue to checkout. Your cart and details are preserved." });
      return;
    }
    if (submitting || order) return;
    if (!validate()) {
      const firstError = document.querySelector(".mkt-field [aria-invalid='true']");
      firstError?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        clientRequestId: requestId,
        customer: { ...formState, paymentMethod: payment },
        items: cartLines.map((line) => ({ slug: line.product.slug, qty: line.qty })),
      };
      const res = await submitOrder(payload);
      const placed = res?.order || res;
      setOrder(placed);
      clearCart();
      try { localStorage.removeItem(CHECKOUT_DRAFT_KEY); } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err?.message || "Could not submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return (
      <div className="mkt">
        <div className="mkt-wrap">
          <ShopLinks />
          <div className="mkt-confirm">
            <CheckCircle2 size={44} aria-hidden="true" />
            <span className="label">{t("mkt_confirmation_kicker")}</span>
            <h1>{t("mkt_confirmation_title")}</h1>
            <p>{t("mkt_confirmation_body")}</p>
            <p className="mkt-confirm__id">
              {t("mkt_order_ref")}: <strong>{order.id}</strong>
            </p>
            <ul className="mkt-confirm__items">
              {(order.items || []).map((item) => (
                <li key={item.slug}>
                  <span>{item.name} × {item.qty}</span>
                  <strong>{formatPrice(item.subtotal)}</strong>
                </li>
              ))}
            </ul>
            <dl className="mkt-confirm__totals">
              <div><dt>{t("mkt_subtotal")}</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              <div><dt>{t("mkt_shipping")}</dt><dd>{order.shipping ? formatPrice(order.shipping) : t("mkt_free")}</dd></div>
              <div><dt>{t("mkt_total")}</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
            <p className="mkt-demo-note">
              <Lock size={15} aria-hidden="true" />
              Order saved to your account. Payment processing, fulfillment, and seller confirmation are not completed by this website unless explicitly arranged.
            </p>
            <div className="mkt-confirm__actions">
              <a className="mkt-btn mkt-btn--solid" href="#/account">{t("mkt_view_orders")} <ArrowRight size={16} aria-hidden="true" /></a>
              <a className="mkt-btn mkt-btn--line" href="#/culture/marketplace/category/all">{t("mkt_continue_shopping")}</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartLines.length) {
    return (
      <div className="mkt">
        <div className="mkt-wrap">
          <ShopLinks />
          <EmptyState
            icon={ShoppingBag}
            title={t("mkt_checkout_empty")}
            body={t("mkt_checkout_empty_hint")}
            action={<a className="mkt-btn mkt-btn--solid" href="#/culture/marketplace/category/all">{t("mkt_browse_all")}</a>}
          />
        </div>
      </div>
    );
  }

  const field = (name, label, options = {}) => (
    <label className={`mkt-field${errors[name] ? " has-error" : ""}`}>
      <span>{label}</span>
      <input
        name={name}
        type={options.type || "text"}
        value={formState[name]}
        onChange={update(name)}
        placeholder={options.placeholder}
        autoComplete={options.autoComplete}
        aria-invalid={errors[name] ? "true" : "false"}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] ? <em id={`${name}-error`} className="mkt-field__error">{errors[name]}</em> : null}
    </label>
  );

  return (
    <div className="mkt">
      <div className="mkt-wrap">
        <ShopLinks />
        <Breadcrumbs
          items={[
            { label: t("mkt_breadcrumb"), href: "#/culture/marketplace" },
            { label: t("mkt_cart"), href: "#/culture/marketplace/cart" },
            { label: t("mkt_checkout") },
          ]}
        />

        <div className="mkt-page-head">
          <span className="label">{t("mkt_checkout_kicker")}</span>
          <h1>{t("mkt_checkout_title")}</h1>
          <p>{t("mkt_checkout_sub")}</p>
        </div>

        <form className="mkt-checkout" onSubmit={submit} noValidate>
          <div className="mkt-checkout__main">
            <fieldset className="mkt-panel">
              <legend>{t("mkt_customer_details")}</legend>
              <div className="mkt-form-grid">
                {field("fullName", t("mkt_fld_name"), { autoComplete: "name", placeholder: t("mkt_ph_name") })}
                {field("phone", t("mkt_fld_phone"), { type: "tel", autoComplete: "tel", placeholder: t("mkt_ph_phone") })}
                {field("email", t("mkt_fld_email"), { type: "email", autoComplete: "email", placeholder: t("mkt_ph_email") })}
              </div>
            </fieldset>

            <fieldset className="mkt-panel">
              <legend>{t("mkt_delivery_address")}</legend>
              <div className="mkt-form-grid">
                <label className={`mkt-field mkt-field--wide${errors.address ? " has-error" : ""}`}>
                  <span>{t("mkt_fld_address")}</span>
                  <textarea
                    name="address"
                    rows="3"
                    value={formState.address}
                    onChange={update("address")}
                    placeholder={t("mkt_ph_address")}
                    autoComplete="street-address"
                    aria-invalid={errors.address ? "true" : "false"}
                  />
                  {errors.address ? <em className="mkt-field__error">{errors.address}</em> : null}
                </label>
                {field("city", t("mkt_fld_city"), { autoComplete: "address-level2", placeholder: t("mkt_ph_city") })}
                <label className={`mkt-field${errors.district ? " has-error" : ""}`}>
                  <span>{t("mkt_fld_district")}</span>
                  <select
                    name="district"
                    value={formState.district}
                    onChange={update("district")}
                    aria-invalid={errors.district ? "true" : "false"}
                  >
                    <option value="">{t("mkt_select_district")}</option>
                    {DISTRICTS.map((district) => (
                      <option key={district.name} value={district.name}>{district.name}</option>
                    ))}
                  </select>
                  {errors.district ? <em className="mkt-field__error">{errors.district}</em> : null}
                </label>
                {field("pincode", t("mkt_fld_pin"), { type: "text", autoComplete: "postal-code", placeholder: "781001" })}
                <label className="mkt-field mkt-field--wide">
                  <span>{t("mkt_fld_notes")}</span>
                  <textarea name="notes" rows="2" value={formState.notes} onChange={update("notes")} placeholder={t("mkt_ph_notes")} />
                </label>
              </div>
            </fieldset>

            <fieldset className="mkt-panel">
              <legend>{t("mkt_payment_method")}</legend>
              <p className="mkt-panel__hint">{t("mkt_payment_demo")}</p>
              <div className="mkt-payments">
                {PAYMENT_METHODS.map(({ id, labelKey, Icon }) => (
                  <label key={id} className={`mkt-payment${payment === id ? " is-active" : ""}`}>
                    <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} />
                    <Icon size={18} aria-hidden="true" />
                    <span>{t(labelKey)}</span>
                  </label>
                ))}
              </div>
              <p className="mkt-panel__hint"><Lock size={14} aria-hidden="true" /> {t("mkt_no_card_fields")}</p>
            </fieldset>
          </div>

          <aside className="mkt-summary">
            <h2>{t("mkt_order_summary")}</h2>
            <ul className="mkt-summary__items">
              {cartLines.map((line) => (
                <li key={line.product.slug}>
                  <span>{line.product.name} × {line.qty}</span>
                  <strong>{formatPrice(line.subtotal)}</strong>
                </li>
              ))}
            </ul>
            <dl>
              <div><dt>{t("mkt_subtotal")}</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div><dt>{t("mkt_shipping")}</dt><dd>{shipping ? formatPrice(shipping) : t("mkt_free")}</dd></div>
              <div className="mkt-summary__total"><dt>{t("mkt_total")}</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
            <button type="submit" className="mkt-btn mkt-btn--dark mkt-btn--block" disabled={submitting}>
              <Landmark size={16} aria-hidden="true" />
              {submitting ? "Placing order…" : t("mkt_place_order")}
            </button>
            {submitError ? <p className="mkt-demo-note mkt-demo-note--small" role="alert" style={{color: "#b42318"}}>{submitError}</p> : null}
            {!isAuthenticated ? (
              <p className="mkt-demo-note mkt-demo-note--small">
                <Lock size={14} aria-hidden="true" /> You’ll need to log in or create an account to place this order. Your cart and details will be preserved.
              </p>
            ) : (
              <p className="mkt-demo-note mkt-demo-note--small">Prices and totals are verified on the server when you place the order.</p>
            )}
          </aside>
        </form>
      </div>
    </div>
  );
}
