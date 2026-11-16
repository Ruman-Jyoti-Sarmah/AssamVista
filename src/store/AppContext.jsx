import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../lib/storage";
import { STRINGS } from "../data/i18n";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [favourites, setFavourites] = useLocalStorage("assamvista:favs", []);
  const [bookings, setBookings] = useLocalStorage("assamvista:bookings", []);

  const value = useMemo(() => {
    const t = (k, ...a) => {
      const v = STRINGS.en[k];
      return typeof v === "function" ? v(...a) : v;
    };
    const pick = (v) => {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        return v.en ?? v ?? "";
      }
      return v;
    };
    const toggleFav = (slug) =>
      setFavourites((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]));
    const isFav = (slug) => favourites.includes(slug);
    const addBooking = (b) => setBookings((p) => [b, ...p]);
    return {
      lang: "en",
      t, pick,
      favourites, toggleFav, isFav,
      bookings, addBooking,
    };
  }, [favourites, setFavourites, bookings, setBookings]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => useContext(AppCtx);
