import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  ImageOff,
  Info,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useCart } from "@/store/CartContext";
import { formatPrice, verificationOf } from "@/data/marketplace/catalogue";

/** Image with a calm, labelled fallback instead of a broken-image icon. */
export function ProductImage({ src, alt, className = "", fallbackLabel }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <span className={`mkt-img-fallback ${className}`.trim()} role="img" aria-label={alt}>
        <ImageOff size={26} aria-hidden="true" />
        <span>{fallbackLabel || alt}</span>
      </span>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

/** Cart / wishlist / order links shared by every marketplace page. */
export function ShopLinks({ compact = false }) {
  const { t } = useApp();
  const { count, wishlist } = useCart();

  return (
    <nav
      className={`mkt-shoplinks${compact ? " mkt-shoplinks--compact" : ""}`}
      aria-label={t("mkt_shop_nav")}
    >
      <a className="mkt-shoplinks__home" href="#/culture/marketplace">
        <ArrowLeft size={15} aria-hidden="true" />
        <span>{t("mkt_shop_home")}</span>
      </a>
      <div className="mkt-shoplinks__tools">
        <a href="#/culture/marketplace/wishlist">
          <Heart size={16} aria-hidden="true" />
          <span>{t("mkt_wishlist")}</span>
          <em>{wishlist.length}</em>
        </a>
        <a href="#/culture/marketplace/orders">
          <ShoppingBag size={16} aria-hidden="true" />
          <span>{t("mkt_orders")}</span>
        </a>
        <a className="mkt-shoplinks__cart" href="#/culture/marketplace/cart">
          <ShoppingCart size={16} aria-hidden="true" />
          <span>{t("mkt_cart")}</span>
          <em>{count}</em>
        </a>
      </div>
    </nav>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="mkt-crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function VerificationBadge({ product, withNote = false }) {
  const badge = verificationOf(product);
  return (
    <div className={`mkt-verify mkt-verify--${badge.tone}`}>
      <ShieldCheck size={15} aria-hidden="true" />
      <span>{badge.label}</span>
      {withNote ? <p>{badge.note}</p> : null}
    </div>
  );
}

export function SourceList({ sources = [] }) {
  const { t } = useApp();
  if (!sources.length) return null;

  return (
    <section className="mkt-sources">
      <h2>{t("mkt_sources")}</h2>
      <p className="mkt-sources__note">{t("mkt_sources_note")}</p>
      <ul>
        {sources.map((source) => (
          <li key={source.url || source.title}>
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer noopener">
                {source.title}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            ) : (
              <span>{source.title}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EmptyState({ icon: Icon = Info, title, body, action }) {
  return (
    <div className="mkt-empty">
      <Icon size={30} aria-hidden="true" />
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
      {action}
    </div>
  );
}

export function OriginLine({ product, className = "" }) {
  const { origin } = product;
  const parts = [origin?.locality, origin?.district, origin?.region].filter(
    Boolean
  );
  if (!parts.length) return null;

  return (
    <p className={`mkt-origin ${className}`.trim()}>
      <MapPin size={14} aria-hidden="true" />
      <span>{parts.join(" · ")}</span>
    </p>
  );
}

/**
 * Product card used by the landing page, category pages, wishlist and related
 * rails. The image and title are links; the wishlist and cart controls are
 * real buttons outside those links so the markup stays valid.
 */
export function ProductCard({ product, categoryName, showAdd = true }) {
  const { t } = useApp();
  const { addItem, toggleWishlist, inWishlist, inCart } = useCart();
  const href = `#/culture/marketplace/product/${product.slug}`;
  const saved = inWishlist(product.slug);
  const added = inCart(product.slug);

  return (
    <article className="mkt-card">
      <div className="mkt-card__media">
        <a href={href} className="mkt-card__media-link" tabIndex={-1} aria-hidden="true">
          <ProductImage
            src={product.image}
            alt={product.imageAlt || product.name}
            className="mkt-card__img"
            fallbackLabel={product.name}
          />
        </a>
        <button
          type="button"
          className={`mkt-card__wish${saved ? " is-saved" : ""}`}
          onClick={() => toggleWishlist(product.slug)}
          aria-pressed={saved}
          aria-label={saved ? t("mkt_wishlist_remove") : t("mkt_wishlist_add")}
        >
          <Heart size={17} aria-hidden="true" fill={saved ? "currentColor" : "none"} />
        </button>
        {product.verification !== "verified" ? (
          <span className="mkt-card__flag">{t("mkt_needs_review")}</span>
        ) : null}
      </div>

      <div className="mkt-card__body">
        <span className="mkt-card__meta">
          {categoryName || t(`mkt_cat_${product.category}`)} · {product.subcategory}
        </span>
        <h3>
          <a href={href}>{product.name}</a>
        </h3>
        {product.localName ? (
          <p className="mkt-card__local" lang="as">
            {product.localName}
          </p>
        ) : null}
        <p className="mkt-card__desc">{product.shortDescription}</p>
        <OriginLine product={product} />
        <div className="mkt-card__foot">
          <span className="mkt-card__price">
            {formatPrice(product.price)}
            {product.unit ? <em>{product.unit}</em> : null}
          </span>
          {showAdd ? (
            <button
              type="button"
              className={`mkt-card__add${added ? " is-added" : ""}`}
              onClick={() => addItem(product.slug, 1)}
            >
              {added ? t("mkt_in_cart") : t("mkt_add_to_cart")}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, label }) {
  return (
    <ul className="mkt-grid" aria-label={label}>
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
