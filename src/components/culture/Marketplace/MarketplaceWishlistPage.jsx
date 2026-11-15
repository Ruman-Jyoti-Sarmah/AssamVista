import { Heart } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useCart } from "@/store/CartContext";
import { Breadcrumbs, EmptyState, ProductGrid, ShopLinks } from "./MarketplaceUI";

export default function MarketplaceWishlistPage() {
  const { t } = useApp();
  const { wishlistProducts, clearWishlist } = useCart();

  return (
    <div className="mkt">
      <div className="mkt-wrap">
        <ShopLinks />
        <Breadcrumbs
          items={[
            { label: t("mkt_breadcrumb"), href: "#/culture/marketplace" },
            { label: t("mkt_wishlist") },
          ]}
        />

        <div className="mkt-page-head">
          <span className="label">{t("mkt_wishlist_kicker")}</span>
          <h1>{t("mkt_wishlist_title")}</h1>
          <p>{t("mkt_wishlist_sub")}</p>
        </div>

        {wishlistProducts.length ? (
          <>
            <div className="mkt-results__bar">
              <p>{t("mkt_wishlist_count", wishlistProducts.length)}</p>
              <button type="button" className="mkt-link-btn" onClick={clearWishlist}>
                {t("mkt_wishlist_clear")}
              </button>
            </div>
            <ProductGrid products={wishlistProducts} label={t("mkt_wishlist_title")} />
          </>
        ) : (
          <EmptyState
            icon={Heart}
            title={t("mkt_wishlist_empty")}
            body={t("mkt_wishlist_empty_hint")}
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
