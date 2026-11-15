import { useEffect, useState } from "react";
import { PackageSearch, LogIn } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";
import { fetchMyOrders } from "@/lib/api";
import { formatDate, formatPrice } from "@/data/marketplace/catalogue";
import {
  Breadcrumbs,
  EmptyState,
  ProductImage,
  ShopLinks,
} from "./MarketplaceUI";

const PAYMENT_KEY = {
  cod: "mkt_pay_cod",
  upi: "mkt_pay_upi",
  card: "mkt_pay_card",
};

export default function MarketplaceOrdersPage() {
  const { t } = useApp();
  const { isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isAuthenticated) { setOrders([]); return; }
      setBusy(true);
      setError("");
      try {
        const data = await fetchMyOrders();
        if (!cancelled) setOrders(Array.isArray(data?.orders) ? data.orders : (Array.isArray(data) ? data : []));
      } catch (e) {
        if (!cancelled) setError(e?.message || "Could not load orders.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }
    if (!loading) load();
    return () => { cancelled = true; };
  }, [isAuthenticated, loading]);

  return (
    <div className="mkt">
      <div className="mkt-wrap">
        <ShopLinks />
        <Breadcrumbs
          items={[
            { label: t("mkt_breadcrumb"), href: "#/culture/marketplace" },
            { label: t("mkt_orders") },
          ]}
        />

        <div className="mkt-page-head">
          <span className="label">{t("mkt_orders_kicker")}</span>
          <h1>{t("mkt_orders_title")}</h1>
          <p>{t("mkt_orders_sub")}</p>
        </div>

        {loading || busy ? (
          <p>Loading orders…</p>
        ) : !isAuthenticated ? (
          <EmptyState
            icon={LogIn}
            title="Sign in to view your orders"
            body="Orders are linked to your account. Log in to see orders you have placed."
            action={<a className="mkt-btn mkt-btn--solid" href="#/login">Log in</a>}
          />
        ) : error ? (
          <p role="alert">{error}</p>
        ) : orders.length ? (
          <>
            <div className="mkt-results__bar">
              <p>{t("mkt_orders_count", orders.length)}</p>
              <a className="mkt-link-btn" href="#/account">View in My Account</a>
            </div>

            <ul className="mkt-orders">
              {orders.map((order) => (
                <li key={order.id} className="mkt-order">
                  <header className="mkt-order__head">
                    <div>
                      <span className="mkt-order__ref">
                        {t("mkt_order_ref")}: <strong>{order.id}</strong>
                      </span>
                      <span className="mkt-order__date">
                        {formatDate(order.createdAt || order.placedAt)}
                      </span>
                    </div>
                    <span className="mkt-order__status">{order.status || "placed"}</span>
                  </header>

                  <ul className="mkt-order__items">
                    {(order.items || []).map((item) => (
                      <li key={item.slug + String(item.qty)}>
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="mkt-order__img"
                          fallbackLabel={item.name}
                        />
                        <div>
                          <a href={`#/culture/marketplace/product/${item.slug}`}>
                            {item.name}
                          </a>
                          {item.localName ? <em lang="as">{item.localName}</em> : null}
                          <span>
                            {formatPrice(item.price)} × {item.qty}
                          </span>
                        </div>
                        <strong>{formatPrice(item.subtotal)}</strong>
                      </li>
                    ))}
                  </ul>

                  <footer className="mkt-order__foot">
                    <div>
                      <span>
                        {t("mkt_shipping_to")}: {order.customer?.city}
                        {order.customer?.district ? `, ${order.customer.district}` : ""}
                      </span>
                      <span>
                        {t("mkt_payment_method")}: {t(PAYMENT_KEY[order.customer?.paymentMethod] || "mkt_pay_cod")}
                      </span>
                    </div>
                    <div className="mkt-order__totals">
                      <span>{t("mkt_total")}</span>
                      <strong>{formatPrice(order.total)}</strong>
                    </div>
                  </footer>

                  <p className="mkt-order__note">
                    Order stored securely for your account. Payment, shipping fulfillment, and seller confirmation are not processed by this website unless explicitly arranged by the operator.
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            icon={PackageSearch}
            title={t("mkt_orders_empty")}
            body="Authenticated orders you place will appear here and in My Account."
            action={<a className="mkt-btn mkt-btn--solid" href="#/culture/marketplace/category/all">{t("mkt_browse_all")}</a>}
          />
        )}
      </div>
    </div>
  );
}
