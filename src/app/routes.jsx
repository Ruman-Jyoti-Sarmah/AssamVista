import { lazy } from "react";

import Homepage from "@/pages/Culture/Homepage";

const SpiritualDestinations = lazy(() => import("@/pages/Culture/SpiritualDestinations"));
const FoodAndCuisine = lazy(() => import("@/pages/Culture/FoodAndCuisine"));
const Adventure = lazy(() => import("@/pages/Culture/Adventure"));
const YogaAndWellness = lazy(() => import("@/pages/Culture/YogaAndWellness"));
const CultureAndFestivals = lazy(() => import("@/pages/Culture/CultureAndFestivals"));
const ImageCredits = lazy(() => import("@/pages/Culture/ImageCredits"));
const HeritageAndKings = lazy(() => import("@/pages/Culture/HeritageAndKings"));
const AssamCommunities = lazy(() => import("@/pages/Culture/AssamCommunities"));
const HandicraftsAndSilk = lazy(() => import("@/pages/Culture/HandicraftsAndSilk"));
const AssamArtists = lazy(() => import("@/pages/Culture/AssamArtists"));
const AssamFacts = lazy(() => import("@/pages/Culture/AssamFacts"));
const StateSymbols = lazy(() => import("@/pages/Culture/StateSymbols"));
const Marketplace = lazy(() => import("@/pages/Culture/Marketplace"));
const MarketplaceCategory = lazy(() => import("@/pages/Culture/MarketplaceCategory"));
const MarketplaceProduct = lazy(() => import("@/pages/Culture/MarketplaceProduct"));
const MarketplaceCart = lazy(() => import("@/pages/Culture/MarketplaceCart"));
const MarketplaceWishlist = lazy(() => import("@/pages/Culture/MarketplaceWishlist"));
const MarketplaceCheckout = lazy(() => import("@/pages/Culture/MarketplaceCheckout"));
const MarketplaceOrders = lazy(() => import("@/pages/Culture/MarketplaceOrders"));
const LoginPage = lazy(() => import("@/pages/Auth/Login"));
const SignupPage = lazy(() => import("@/pages/Auth/Signup"));
const AccountPage = lazy(() => import("@/pages/Account/Account"));
const PrivacyPage = lazy(() => import("@/pages/Legal/Privacy"));
const TermsPage = lazy(() => import("@/pages/Legal/Terms"));

const TravelHomepage = lazy(() => import("@/pages/Travel/Homepage"));
const DistrictDetails = lazy(() => import("@/pages/Travel/DistrictDetails"));
const Districts = lazy(() => import("@/pages/Travel/Districts"));
const Stays = lazy(() => import("@/pages/Travel/Stays"));
const Visit = lazy(() => import("@/pages/Travel/Visit"));
const Admin = lazy(() => import("@/components/common/Admin"));
const JourneyPlanner = lazy(() => import("@/pages/Travel/JourneyPlanner"));
const Wildlife = lazy(() => import("@/pages/Travel/Wildlife"));
const TravelGuide = lazy(() => import("@/pages/Travel/TravelGuide"));
const MyTrip = lazy(() => import("@/pages/Travel/MyTrip"));
const TravelDetails = lazy(() => import("@/pages/Travel/TravelDetails"));
const Itinerary = lazy(() => import("@/pages/Travel/Itinerary"));
const Rivers = lazy(() => import("@/pages/Travel/Rivers"));
const RiverDetails = lazy(() => import("@/pages/Travel/RiverDetails"));

const HOME_HASHES = new Set(["", "#", "#top", "#home", "#/", "#/culture", "#/culture/"]);

const route = (name, Component, extra = {}) => ({ name, Component, ...extra });

/**
 * The application uses a small hash router instead of a routing dependency.
 * Keeping route matching in one place makes the page shell easy to read and
 * prevents route priority bugs when new Culture or Travel pages are added.
 */
export function getRoute(hash = "") {
  const currentHash = hash || "";
  const routeHash = currentHash.split("?")[0];

  if (routeHash === "#/admin") return route("admin", Admin, { titleKey: "title_admin" });
  if (HOME_HASHES.has(currentHash)) return route("culture-home", Homepage, { titleKey: "title_culture_hub" });

  const cultureExperience = currentHash.match(/^#\/culture\/experiences\/([a-z-]+)/);
  if (cultureExperience) {
    const pages = {
      spiritual: SpiritualDestinations,
      cuisine: FoodAndCuisine,
      adventure: Adventure,
      yoga: YogaAndWellness,
    };
    const Page = pages[cultureExperience[1]] || SpiritualDestinations;
    return route("culture-experience", Page, { titleKey: "title_culture_experience" });
  }

  if (currentHash === "#/culture/festivals") return route("culture-festivals", CultureAndFestivals, { titleKey: "title_culture" });
  if (currentHash === "#/credits") return route("credits", ImageCredits, { titleKey: "title_culture" });

  /* ── Heritage Marketplace ───────────────────────────────────────────
     The landing page owns the shell; the dynamic pages reuse the same
     product/category data. Unknown slugs render a friendly in-page state. */
  if (routeHash === "#/culture/marketplace") return route("marketplace", Marketplace, { titleKey: "title_marketplace" });
  const marketplaceCategory = routeHash.match(/^#\/culture\/marketplace\/category\/([a-z0-9-]+)$/);
  if (marketplaceCategory) return route("marketplace-category", MarketplaceCategory, { slug: marketplaceCategory[1], titleKey: "title_marketplace" });
  const marketplaceProduct = routeHash.match(/^#\/culture\/marketplace\/product\/([a-z0-9-]+)$/);
  if (marketplaceProduct) return route("marketplace-product", MarketplaceProduct, { slug: marketplaceProduct[1], titleKey: "title_marketplace" });
  if (routeHash === "#/culture/marketplace/cart") return route("marketplace-cart", MarketplaceCart, { titleKey: "title_marketplace_cart" });
  if (routeHash === "#/culture/marketplace/wishlist") return route("marketplace-wishlist", MarketplaceWishlist, { titleKey: "title_marketplace_wishlist" });
  if (routeHash === "#/culture/marketplace/checkout") return route("marketplace-checkout", MarketplaceCheckout, { titleKey: "title_marketplace_checkout" });
  if (routeHash === "#/culture/marketplace/orders") return route("marketplace-orders", MarketplaceOrders, { titleKey: "title_marketplace_orders" });

  if (routeHash === "#/login") return route("login", LoginPage, { titleKey: "title_login" });
  if (routeHash === "#/signup") return route("signup", SignupPage, { titleKey: "title_signup" });
  if (routeHash === "#/account" || routeHash.startsWith("#/account/")) return route("account", AccountPage, { titleKey: "title_account" });
  if (routeHash === "#/privacy") return route("privacy", PrivacyPage, { titleKey: "title_privacy" });
  if (routeHash === "#/terms") return route("terms", TermsPage, { titleKey: "title_terms" });

  if (currentHash === "#/trip/itinerary") return route("trip-itinerary", Itinerary, { titleKey: "itin_title" });
  if (currentHash === "#/trip/plan") return route("trip-plan", TravelDetails, { titleKey: "plan_title" });
  if (currentHash === "#/trip") return route("trip-cart", MyTrip, { titleKey: "trip_title" });
  if (currentHash === "#/travel" || currentHash === "#/travel/") return route("travel-home", TravelHomepage, { titleKey: "title_journey" });

  if (currentHash === "#/visit") return route("visit", Visit, { titleKey: "title_visit" });

  const district = currentHash.match(/^#\/district\/([a-z0-9-]+)/);
  if (district) return route("district-detail", DistrictDetails, { slug: district[1] });

  if (routeHash === "#/districts") return route("districts", Districts, { titleKey: "title_districts" });
  if (currentHash === "#/stays") return route("stays", Stays, { titleKey: "title_stays" });
  if (currentHash === "#/journey") return route("journey", JourneyPlanner, { titleKey: "title_journey" });
  if (currentHash === "#/artists") return route("artists", AssamArtists, { titleKey: "title_artists" });
  if (currentHash === "#/wildlife") return route("wildlife", Wildlife, { titleKey: "title_wildlife" });
  if (currentHash === "#/facts") return route("facts", AssamFacts, { titleKey: "title_facts" });
  if (currentHash === "#/communities") return route("communities", AssamCommunities, { titleKey: "title_communities" });
  if (currentHash === "#/handicrafts") return route("handicrafts", HandicraftsAndSilk, { titleKey: "title_handicrafts" });
  if (currentHash === "#/guide") return route("guide", TravelGuide, { titleKey: "title_guide" });
  if (currentHash === "#/heritage") return route("heritage", HeritageAndKings, { titleKey: "title_heritage" });
  if (currentHash === "#/symbols") return route("symbols", StateSymbols, { titleKey: "title_symbols" });

  const river = currentHash.match(/^#\/rivers?\/([a-z0-9-]+)/);
  if (river) return route("river-detail", RiverDetails, { id: river[1] });
  if (currentHash === "#/rivers" || currentHash === "#/rivers/") return route("rivers", Rivers, { titleKey: "title_rivers" });

  // Preserve the old fallback: an unknown hash opens the Culture home.
  return route("culture-home", Homepage, { titleKey: "title_home" });
}
