import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../lib/storage";
import { getProduct } from "@/data/marketplace/products";
import { calculateShipping } from "@/data/marketplace/catalogue";

/**
 * Marketplace cart and wishlist state.
 *
 * Cart/wishlist are persisted to localStorage for guest browsing continuity.
 * Orders are stored server-side for authenticated users; this context no longer
 * keeps local demo order history.
 */
const CartCtx = createContext(null);

export const MAX_QUANTITY = 99;

const cleanQty = (value) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number(value) || 1)));

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("assamvista:marketplace-cart", []);
  const [wishlist, setWishlist] = useLocalStorage(
    "assamvista:marketplace-wishlist",
    []
  );

  const addItem = useCallback(
    (slug, qty = 1) => {
      if (!getProduct(slug)) return;
      setItems((current) => {
        const existing = current.find((line) => line.slug === slug);
        if (existing) {
          return current.map((line) =>
            line.slug === slug
              ? { ...line, qty: cleanQty(line.qty + Number(qty || 1)) }
              : line
          );
        }
        return [...current, { slug, qty: cleanQty(qty) }];
      });
    },
    [setItems]
  );

  const setQuantity = useCallback(
    (slug, qty) => {
      setItems((current) =>
        current.map((line) =>
          line.slug === slug ? { ...line, qty: cleanQty(qty) } : line
        )
      );
    },
    [setItems]
  );

  const removeItem = useCallback(
    (slug) => {
      setItems((current) => current.filter((line) => line.slug !== slug));
    },
    [setItems]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const toggleWishlist = useCallback(
    (slug) => {
      if (!getProduct(slug)) return;
      setWishlist((current) =>
        current.includes(slug)
          ? current.filter((item) => item !== slug)
          : [...current, slug]
      );
    },
    [setWishlist]
  );

  const removeFromWishlist = useCallback(
    (slug) => {
      setWishlist((current) => current.filter((item) => item !== slug));
    },
    [setWishlist]
  );

  const clearWishlist = useCallback(() => setWishlist([]), [setWishlist]);

  const cartLines = useMemo(
    () =>
      items
        .map((line) => {
          const product = getProduct(line.slug);
          if (!product) return null;
          return {
            ...line,
            product,
            subtotal: product.price * line.qty,
          };
        })
        .filter(Boolean),
    [items]
  );

  const subtotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.subtotal, 0),
    [cartLines]
  );
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const count = useMemo(
    () => items.reduce((sum, line) => sum + line.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      cartLines,
      count,
      subtotal,
      shipping,
      total,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      inCart: (slug) => items.some((line) => line.slug === slug),
      wishlist,
      wishlistProducts: wishlist
        .map((slug) => getProduct(slug))
        .filter(Boolean),
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      inWishlist: (slug) => wishlist.includes(slug),
    }),
    [
      items,
      cartLines,
      count,
      subtotal,
      shipping,
      total,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      wishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    ]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const context = useContext(CartCtx);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
