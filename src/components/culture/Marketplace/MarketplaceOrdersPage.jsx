import { PackageSearch, Trash2 } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useCart } from "@/store/CartContext";
import { formatDate, formatPrice } from "@/data/marketplace/catalogue";
import {
  Breadcrumbs,
  EmptyState,
  ProductImage,
  ShopLinks,
} from "./MarketplaceUI";

const STATUS_KEY = {
  "demo-placed": "mkt_status_demo",
};

const PAYMENT_KEY = {
  cod: "mkt_pay_cod",
  upi: "mkt_pay_upi",
  card: "mkt_pay_card",
};

export default function MarketplaceOrdersPage() {
  const { t } = useApp();
  const { orders, removeOrder, clearOrders } = useCart();

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

        {orders.length ? (
          <>
            <div className="mkt-results__bar">
              <p>{t("mkt_orders_count", orders.length)}</p>
              <button type="button" className="mkt-link-btn" onClick={clearOrders}>
                {t("mkt_orders_clear")}
              </button>
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
                        {formatDate(order.placedAt)}
                      </span>
                    </div>
                    <span className="mkt-order__status">
                      {t(STATUS_KEY[order.status] || "mkt_status_demo")}
                    </span>
                  </header>

                  <ul className="mkt-order__items">
                    {order.items.map((item) => (
                      <li key={item.slug}>
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
                        {order.customer?.district
                          ? `, ${order.customer.district}`
                          : ""}
                      </span>
                      <span>
                        {t("mkt_payment_method")}:{" "}
                        {t(PAYMENT_KEY[order.customer?.paymentMethod] || "mkt_status_demo")}
                      </span>
                    </div>
                    <div className="mkt-order__totals">
                      <span>{t("mkt_total")}</span>
                      <strong>{formatPrice(order.total)}</strong>
                    </div>
                    <button
                      type="button"
                      className="mkt-line__remove"
                      onClick={() => removeOrder(order.id)}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      {t("mkt_remove")}
                    </button>
                  </footer>

                  <p className="mkt-order__note">{order.note}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            icon={PackageSearch}
            title={t("mkt_orders_empty")}
            body={t("mkt_orders_empty_hint")}
            action={
              <a className="mkt-btn mkt-btn--solid" href="#/culture/marketplace/category/all">
                {t("mkt_browse_all")}
              </a>
            }
          />
        )}
      </div>
    </div>
  );
}
