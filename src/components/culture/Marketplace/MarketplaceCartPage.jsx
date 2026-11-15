import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useCart } from "@/store/CartContext";
import { formatPrice, SHIPPING } from "@/data/marketplace/catalogue";
import {
  Breadcrumbs,
  EmptyState,
  ProductImage,
  ShopLinks,
} from "./MarketplaceUI";

export default function MarketplaceCartPage() {
  const { t } = useApp();
  const {
    cartLines,
    subtotal,
    shipping,
    total,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div className="mkt">
      <div className="mkt-wrap">
        <ShopLinks />
        <Breadcrumbs
          items={[
            { label: t("mkt_breadcrumb"), href: "#/culture/marketplace" },
            { label: t("mkt_cart") },
          ]}
        />

        <div className="mkt-page-head">
          <span className="label">{t("mkt_cart_kicker")}</span>
          <h1>{t("mkt_cart_title")}</h1>
          <p>{t("mkt_cart_sub")}</p>
        </div>

        {cartLines.length ? (
          <div className="mkt-cart">
            <div className="mkt-cart__lines">
              {cartLines.map((line) => (
                <article className="mkt-line" key={line.product.slug}>
                  <a
                    className="mkt-line__media"
                    href={`#/culture/marketplace/product/${line.product.slug}`}
                  >
                    <ProductImage
                      src={line.product.image}
                      alt={line.product.imageAlt || line.product.name}
                      className="mkt-line__img"
                      fallbackLabel={line.product.name}
                    />
                  </a>
                  <div className="mkt-line__body">
                    <span className="mkt-line__cat">{line.product.subcategory}</span>
                    <h2>
                      <a href={`#/culture/marketplace/product/${line.product.slug}`}>
                        {line.product.name}
                      </a>
                    </h2>
                    {line.product.localName ? (
                      <p className="mkt-line__local" lang="as">
                        {line.product.localName}
                      </p>
                    ) : null}
                    <span className="mkt-line__unit">
                      {formatPrice(line.product.price)}
                      {line.product.unit ? ` ${line.product.unit}` : ""}
                    </span>
                    <div className="mkt-line__controls">
                      <div className="mkt-qty">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.product.slug, line.qty - 1)}
                          aria-label={t("mkt_qty_decrease")}
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={line.qty}
                          onChange={(event) =>
                            setQuantity(
                              line.product.slug,
                              Math.min(99, Math.max(1, Number(event.target.value) || 1))
                            )
                          }
                          aria-label={`${t("mkt_quantity")}: ${line.product.name}`}
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(line.product.slug, line.qty + 1)}
                          aria-label={t("mkt_qty_increase")}
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="mkt-line__remove"
                        onClick={() => removeItem(line.product.slug)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        {t("mkt_remove")}
                      </button>
                    </div>
                  </div>
                  <span className="mkt-line__total">{formatPrice(line.subtotal)}</span>
                </article>
              ))}

              <div className="mkt-cart__tools">
                <a className="mkt-link-btn" href="#/culture/marketplace/category/all">
                  {t("mkt_continue_shopping")}
                </a>
                <button type="button" className="mkt-link-btn" onClick={clearCart}>
                  {t("mkt_clear_cart")}
                </button>
              </div>
            </div>

            <aside className="mkt-summary">
              <h2>{t("mkt_summary")}</h2>
              <dl>
                <div>
                  <dt>{t("mkt_subtotal")}</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div>
                  <dt>{t("mkt_shipping")}</dt>
                  <dd>{shipping ? formatPrice(shipping) : t("mkt_free")}</dd>
                </div>
                <div className="mkt-summary__total">
                  <dt>{t("mkt_total")}</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <p className="mkt-summary__note">
                {t("mkt_shipping_note", formatPrice(SHIPPING.freeAbove))}
              </p>
              <a className="mkt-btn mkt-btn--dark mkt-btn--block" href="#/culture/marketplace/checkout">
                {t("mkt_checkout")}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <p className="mkt-demo-note mkt-demo-note--small">
                <ShoppingBag size={14} aria-hidden="true" />
                {t("mkt_cart_note")}
              </p>
            </aside>
          </div>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title={t("mkt_cart_empty")}
            body={t("mkt_cart_empty_hint")}
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
