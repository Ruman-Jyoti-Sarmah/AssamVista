/**
 * Food & Cuisine categories.
 *
 * The first eight cover the shared Assamese table; the last covers the small
 * community kitchens whose dishes are documented on the marketplace-style
 * detail pages. Labels are bilingual so the page switches with the app.
 */
export const CUISINE_CATEGORIES = [
  {
    id: "rice",
    icon: "Wheat",
    label: { en: "Rice & grains", as: "চাউল আৰু ধান" },
    blurb: {
      en: "Steamed, sticky, flattened or cooked inside bamboo — the base of almost every meal.",
      as: "ভাপত, আঠা, চেপেটা বা বাঁহৰ ভিতৰত ৰন্ধা — প্ৰায় প্ৰতিটো ভোজৰ মূল।",
    },
  },
  {
    id: "khar",
    icon: "FlaskConical",
    label: { en: "Khar & tenga", as: "খাৰ আৰু টেঙা" },
    blurb: {
      en: "The alkaline and the sour — the two poles that frame an Assamese meal.",
      as: "ক্ষাৰ আৰু টেঙা — অসমীয়া ভোজৰ দুটা মূল স্তম্ভ।",
    },
  },
  {
    id: "fish",
    icon: "Fish",
    label: { en: "Fish & river food", as: "মাছ আৰু নদীৰ খাদ্য" },
    blurb: {
      en: "Fresh river fish, dried fish, fermented fish and the herbs cooked with them.",
      as: "সতেজ নদীৰ মাছ, শুকান মাছ, তেমি মাছ আৰু ইয়াৰ সৈতে ৰন্ধা বনৌষধি।",
    },
  },
  {
    id: "meat",
    icon: "Drumstick",
    label: { en: "Meat & poultry", as: "মাংস আৰু পক্ষী" },
    blurb: {
      en: "Pork, duck, chicken and smoked meat, usually with bamboo shoot or leafy greens.",
      as: "গাহৰি, হাঁহ, কুকুৰা আৰু ধোঁৱাত ৰখা মাংস, প্ৰায়ে বাঁহৰ কঁৰা বা শাকৰ সৈতে।",
    },
  },
  {
    id: "greens",
    icon: "Leaf",
    label: { en: "Greens & vegetables", as: "শাক আৰু পাচলি" },
    blurb: {
      en: "Foraged ferns, roselle, banana flower, bamboo shoot and the day's market vegetables.",
      as: "বনৰ ঢেকীয়া, টেঙামৰা, কলফুল, বাঁহৰ কঁৰা আৰু বজাৰৰ পাচলি।",
    },
  },
  {
    id: "pitika",
    icon: "Utensils",
    label: { en: "Mashes & chutneys", as: "পিটিকা আৰু চাটনী" },
    blurb: {
      en: "Roasted or boiled, then mashed with mustard oil, chilli and onion.",
      as: "ভজা বা ৰন্ধা, তাৰ পিছত সৰিয়হ তেল, জলকীয়া আৰু পিয়াজেৰে মিহি কৰা।",
    },
  },
  {
    id: "sweets",
    icon: "CakeSlice",
    label: { en: "Pitha & sweets", as: "পিঠা আৰু মিঠাই" },
    blurb: {
      en: "Rice-flour pitha, sesame and coconut laru, and the jolpan table of Bihu.",
      as: "চাউলৰ গুড়িৰ পিঠা, তিল আৰু নাৰিকলৰ লাৰু, আৰু বিহুৰ জল্পান।",
    },
  },
  {
    id: "drinks",
    icon: "CupSoda",
    label: { en: "Tea & drinks", as: "চাহ আৰু পানীয়" },
    blurb: {
      en: "Assam tea, smoked Singpho tea and the rice beers brewed by many communities.",
      as: "অসম চাহ, সিংফো ধোঁৱা চাহ আৰু বহু সমাজে বনোৱা চাউলৰ সাজ।",
    },
  },
  {
    id: "community",
    icon: "Users",
    label: { en: "Community kitchens", as: "সমাজৰ ৰান্ধনীঘৰ" },
    blurb: {
      en: "Signature dishes that carry a community's own name, technique and festival.",
      as: "সমাজৰ নিজৰ নাম, পদ্ধতি আৰু উৎসৱ কঢ়িয়াই অনা বিশেষ ব্যঞ্জন।",
    },
  },
];

export const CUISINE_CATEGORY_BY_ID = new Map(
  CUISINE_CATEGORIES.map((category) => [category.id, category]),
);

export const getCuisineCategory = (id) => CUISINE_CATEGORY_BY_ID.get(id) || null;
