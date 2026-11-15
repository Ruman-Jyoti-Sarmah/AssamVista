import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useCart } from "@/store/CartContext";
import { useAuth } from "@/store/AuthContext";
import { useAuthFlow } from "@/store/AuthFlowContext";
import { setPendingAuthAction } from "@/lib/authFlow";
import {
  formatPrice,
  getCategory,
  getProduct,
  relatedProducts,
  verificationOf,
} from "@/data/marketplace/catalogue";
import {
  Breadcrumbs,
  EmptyState,
  ProductCard,
  ProductImage,
  ShopLinks,
  SourceList,
  VerificationBadge,
} from "./MarketplaceUI";

const list = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return value.filter(Boolean).join(" · ");
  return String(value);
};

const detailGroups = {
  food: [
    ["mkt_dt_ingredients", "ingredients"],
    ["mkt_dt_preparation", "preparation"],
    ["mkt_dt_cooking", "cooking"],
    ["mkt_dt_variations", "variations"],
    ["mkt_dt_storage", "storage"],
    ["mkt_dt_shelf_life", "shelfLife"],
    ["mkt_dt_allergens", "allergens"],
    ["mkt_dt_packaging", "packaging"],
  ],
  clothing: [
    ["mkt_dt_fabric", "fabric"],
    ["mkt_dt_technique", "technique"],
    ["mkt_dt_motifs", "motifs"],
    ["mkt_dt_meaning", "culturalMeaning"],
    ["mkt_dt_occasions", "occasions"],
    ["mkt_dt_sizes", "sizes"],
  ],
  craft: [
    ["mkt_dt_raw_materials", "rawMaterials"],
    ["mkt_dt_tools", "tools"],
    ["mkt_dt_technique", "technique"],
    ["mkt_dt_stages", "stages"],
    ["mkt_dt_uses", "traditionalUses"],
    ["mkt_dt_maintenance", "maintenance"],
  ],
  jewellery: [
    ["mkt_dt_materials", "materials"],
    ["mkt_dt_process", "process"],
    ["mkt_dt_design", "design"],
    ["mkt_dt_traditions", "traditions"],
    ["mkt_dt_care", "care"],
  ],
  music: [
    ["mkt_dt_instrument", "instrumentType"],
    ["mkt_dt_materials", "materials"],
    ["mkt_dt_making", "making"],
    ["mkt_dt_playing", "playing"],
    ["mkt_dt_occasions", "occasions"],
  ],
  regional: [
    ["mkt_dt_production", "production"],
    ["mkt_dt_regional_note", "regionalNote"],
    ["mkt_dt_packaging", "packaging"],
  ],
};

export default function MarketplaceProductPage({ slug }) {
  const { t, pick } = useApp();
  const {
    addItem,
    toggleWishlist,
    inWishlist,
    cartLines,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthFlow();
  const product = getProduct(slug);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const related = useMemo(() => relatedProducts(product, 4), [product]);

  if (!product) {
    return (
      <div className="mkt mkt-wrap">
        <ShopLinks />
        <EmptyState
          title={t("mkt_product_missing")}
          body={t("mkt_product_missing_hint")}
          action={
            <a className="mkt-btn mkt-btn--solid" href="#/culture/marketplace/category/all">
              {t("mkt_browse_all")}
            </a>
          }
        />
      </div>
    );
  }

  const category = getCategory(product.category);
  const badge = verificationOf(product);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const categoryName = category ? pick(category.name) : product.category;
  const saved = inWishlist(product.slug);
  const cartLine = cartLines.find((line) => line.product.slug === product.slug);
  const details = product.categoryDetails || {};
  const careItems = Array.isArray(product.care)
    ? product.care
    : product.care
      ? [product.care]
      : [];
  const groups = (detailGroups[details.kind] || [])
    .map(([labelKey, field]) => ({
      label: t(labelKey),
      value: list(details[field]),
    }))
    .filter((group) => group.value);

  const add = () => {
    addItem(product.slug, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    addItem(product.slug, quantity);
    if (isAuthenticated) {
      window.location.hash = "#/culture/marketplace/checkout";
      return;
    }
    setPendingAuthAction({
      type: "checkout",
      returnHash: "#/culture/marketplace/checkout",
      from: `#/culture/marketplace/product/${product.slug}`,
    });
    openLogin({ message: "Log in or create an account to continue to checkout. Your cart is saved." });
  };

  return (
    <div className="mkt">
      <div className="mkt-wrap">
        <ShopLinks />
        <Breadcrumbs
          items={[
            { label: t("mkt_breadcrumb"), href: "#/culture/marketplace" },
            {
              label: categoryName,
              href: category
                ? `#/culture/marketplace/category/${category.slug}`
                : "#/culture/marketplace/category/all",
            },
            { label: product.name },
          ]}
        />

        <div className="mkt-product">
          <div className="mkt-gallery">
            <div className="mkt-gallery__main">
              <ProductImage
                src={gallery[activeImage]}
                alt={product.imageAlt || product.name}
                className="mkt-gallery__img"
                fallbackLabel={product.name}
              />
            </div>
            {gallery.length > 1 ? (
              <ul className="mkt-gallery__thumbs">
                {gallery.map((image, index) => (
                  <li key={`${image}-${index}`}>
                    <button
                      type="button"
                      className={index === activeImage ? "is-active" : ""}
                      onClick={() => setActiveImage(index)}
                      aria-pressed={index === activeImage}
                      aria-label={t("mkt_view_image", index + 1)}
                    >
                      <img src={image} alt="" loading="lazy" decoding="async" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {product.imageCredit ? (
              <p className="mkt-gallery__credit">
                {t("mkt_photo_credit")}: {product.imageCredit.author} ·{" "}
                {product.imageCredit.license}{" "}
                {product.imageCredit.source ? (
                  <a href={product.imageCredit.source} target="_blank" rel="noreferrer noopener">
                    {t("mkt_view_source")}
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ) : null}
              </p>
            ) : null}
          </div>

          <div className="mkt-buybox">
            <span className="mkt-buybox__cat">
              <a
                href={
                  category
                    ? `#/culture/marketplace/category/${category.slug}`
                    : "#/culture/marketplace/category/all"
                }
              >
                {categoryName}
              </a>
              <span>·</span>
              <span>{product.subcategory}</span>
            </span>

            <h1>{product.name}</h1>
            {product.localName ? (
              <p className="mkt-buybox__local" lang="as">
                {product.localName}
              </p>
            ) : null}
            <p className="mkt-buybox__type">{product.type}</p>

            <div className="mkt-buybox__badges">
              <VerificationBadge product={product} />
              <span className="mkt-pill">
                {t(
                  `mkt_avail_${String(product.availability).replace(/-/g, "_")}`
                )}
              </span>
              <span className="mkt-pill">
                {t(`mkt_made_${String(product.handmade).replace(/-/g, "_")}`)}
              </span>
            </div>

            <p className="mkt-buybox__price">
              {formatPrice(product.price)}
              {product.unit ? <em>{product.unit}</em> : null}
            </p>
            <p className="mkt-buybox__pricenote">{product.priceNote}</p>

            <p className="mkt-buybox__origin">
              {[product.origin?.locality, product.origin?.district, product.origin?.region]
                .filter(Boolean)
                .join(" · ")}
            </p>

            <div className="mkt-buybox__qty">
              <span>{t("mkt_quantity")}</span>
              <div className="mkt-qty">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label={t("mkt_qty_decrease")}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(Math.min(99, Math.max(1, Number(event.target.value) || 1)))
                  }
                  aria-label={t("mkt_quantity")}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                  aria-label={t("mkt_qty_increase")}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mkt-buybox__actions">
              <button type="button" className="mkt-btn mkt-btn--solid" onClick={add}>
                {added ? <Check size={17} aria-hidden="true" /> : <ShoppingCart size={17} aria-hidden="true" />}
                {added ? t("mkt_added") : t("mkt_add_to_cart")}
              </button>
              <button type="button" className="mkt-btn mkt-btn--dark" onClick={buyNow}>
                {t("mkt_buy_now")}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`mkt-btn mkt-btn--line${saved ? " is-saved" : ""}`}
                onClick={() => toggleWishlist(product.slug)}
                aria-pressed={saved}
              >
                <Heart size={16} aria-hidden="true" fill={saved ? "currentColor" : "none"} />
                {saved ? t("mkt_wishlist_remove") : t("mkt_wishlist_add")}
              </button>
            </div>

            {cartLine ? (
              <p className="mkt-buybox__incart">
                {t("mkt_incart_line", cartLine.qty)}{" "}
                <a href="#/culture/marketplace/cart">
                  {t("mkt_view_cart")}
                </a>
              </p>
            ) : null}

            <ul className="mkt-buybox__assurances">
              <li>
                <ShieldCheck size={15} aria-hidden="true" />
                {badge.note}
              </li>
              <li>
                <Truck size={15} aria-hidden="true" />
                {t("mkt_delivery_note")}
              </li>
            </ul>
          </div>
        </div>

        <div className="mkt-detail">
          <div className="mkt-detail__main">
            <section className="mkt-block">
              <h2>{t("mkt_about_product")}</h2>
              {(product.description || []).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            {product.history ? (
              <section className="mkt-block">
                <h2>{t("mkt_history")}</h2>
                <p>{product.history}</p>
              </section>
            ) : null}

            {product.significance ? (
              <section className="mkt-block">
                <h2>{t("mkt_significance")}</h2>
                <p>{product.significance}</p>
              </section>
            ) : null}

            {groups.length ? (
              <section className="mkt-block">
                <h2>{t("mkt_category_details")}</h2>
                <dl className="mkt-detail-list">
                  {groups.map((group) => (
                    <div key={group.label}>
                      <dt>{group.label}</dt>
                      <dd>{group.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {product.making ? (
              <section className="mkt-block">
                <h2>{t("mkt_making")}</h2>
                <div className="mkt-making">
                  <div>
                    <h3>{t("mkt_making_materials")}</h3>
                    <ul>
                      {(product.making.materials || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>{t("mkt_making_tools")}</h3>
                    <ul>
                      {(product.making.tools || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mkt-making__steps">
                    <h3>{t("mkt_making_steps")}</h3>
                    <ol>
                      {(product.making.steps || []).map((step, index) => (
                        <li key={step}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="mkt-making__meta">
                    {product.making.time ? (
                      <p>
                        <strong>{t("mkt_making_time")}</strong> {product.making.time}
                      </p>
                    ) : null}
                    {product.making.skill ? (
                      <p>
                        <strong>{t("mkt_making_skill")}</strong> {product.making.skill}
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="mkt-inline-note">{t("mkt_making_note")}</p>
              </section>
            ) : null}

            {careItems.length ? (
              <section className="mkt-block">
                <h2>{t("mkt_care")}</h2>
                <ul className="mkt-care">
                  {careItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList sources={product.sources} />

            <section className="mkt-seller">
              <h2>{t("mkt_seller")}</h2>
              <p>{product.seller?.note || t("mkt_seller_none")}</p>
              <p className="mkt-seller__status">
                <span>{t("mkt_status")}:</span> {product.seller?.status || "unverified"}
              </p>
            </section>
          </div>

          <aside className="mkt-detail__side">
            <section className="mkt-block">
              <h2>{t("mkt_specs")}</h2>
              <dl className="mkt-specs">
                {(product.specs || []).map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="mkt-block">
              <h2>{t("mkt_last_updated")}</h2>
              <p>{product.lastUpdated}</p>
              <p className="mkt-inline-note">{t("mkt_price_disclaimer")}</p>
            </section>
          </aside>
        </div>

        {related.length ? (
          <section className="mkt-section">
            <div className="mkt-section__head">
              <div>
                <span className="label">{t("mkt_related_kicker")}</span>
                <h2>{t("mkt_related_title")}</h2>
              </div>
            </div>
            <ul className="mkt-grid">
              {related.map((item) => (
                <li key={item.slug}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
