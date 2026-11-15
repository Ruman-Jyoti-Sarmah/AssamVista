/**
 * AssamVista Heritage Marketplace — editorial categories.
 *
 * These are navigation and discovery groupings, not claims that a product is
 * exclusive to a community or district. Each category points at the product
 * records in `products.js`; new categories can be added here without changing
 * the marketplace components.
 */

export const commons = (fileName, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    fileName
  )}?width=${width}`;

export const commonsPage = (fileName) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`;

export const imageSearch = (query) =>
  `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

export const CATEGORIES = [
  {
    id: "clothing",
    slug: "clothing",
    name: { en: "Traditional Clothing", as: "পৰম্পৰাগত পোছাক" },
    description: {
      en: "Mekhela sador, gamosa, dokhona and other garments woven and worn across Assam.",
      as: "মেখেলা চাদৰ, গামোচা, ডখনা আৰু অসমত বোৱা আৰু পৰিধান কৰা অন্যান্য বস্ত্ৰ।",
    },
    image: commons("Assam Muga Silk Sador Mekhela.jpg"),
    imageAlt: "Muga silk mekhela sador from Assam",
    subcategories: [
      "Mekhela Sador",
      "Gamosa",
      "Dokhona",
      "Aronai",
      "Mising Mekhela Chador",
    ],
  },
  {
    id: "textiles",
    slug: "textiles",
    name: { en: "Silk & Textiles", as: "পাট আৰু বস্ত্ৰশিল্প" },
    description: {
      en: "Muga, eri and pat silk, handwoven fabrics, shawls and stoles from Assam's looms.",
      as: "মুগা, এৰি আৰু পাট পাট, হাতেৰে বোৱা কাপোৰ, চাদৰ আৰু ষ্টোল।",
    },
    image: commons("Eri & Muga Silk Handloom Shawl.jpg"),
    imageAlt: "Eri and muga silk handloom shawl from Assam",
    subcategories: ["Muga Silk", "Eri Silk", "Pat Silk", "Handwoven Shawl", "Fabric"],
  },
  {
    id: "food",
    slug: "food",
    name: { en: "Traditional Food", as: "পৰম্পৰাগত খাদ্য" },
    description: {
      en: "Pitha, laru, jolpan and rice-based treats associated with Assamese homes and festivals.",
      as: "পিঠা, লাৰু, জলপান আৰু অসমীয়া ঘৰ আৰু উৎসৱৰ সৈতে জড়িত ভাত-ভিত্তিক খাদ্য।",
    },
    image: commons("Traditional Assamese Jolpan Thali.jpg"),
    imageAlt: "Traditional Assamese jolpan thali",
    subcategories: ["Jolpan", "Pitha", "Laru", "Bihu Sweets", "Tea"],
  },
  {
    id: "handicrafts",
    slug: "handicrafts",
    name: { en: "Handicrafts", as: "হস্তশিল্প" },
    description: {
      en: "Jaapi, bell metal, bamboo, cane and mask-making traditions from across Assam.",
      as: "জাপি, কাঁহ-পিতল, বাঁহ, বেত আৰু মুখাশিল্পৰ অসমৰ পৰম্পৰা।",
    },
    image: commons("Bell metal handicraft Sarthebari.jpg"),
    imageAlt: "Bell metal craft from Sarthebari, Assam",
    subcategories: ["Jaapi", "Bell Metal", "Bamboo & Cane", "Masks", "Xorai"],
  },
  {
    id: "jewellery",
    slug: "jewellery",
    name: { en: "Traditional Jewellery", as: "পৰম্পৰাগত অলংকাৰ" },
    description: {
      en: "Junbiri, gamkharu, thuriya and other ornaments in Assam's goldsmithing traditions.",
      as: "জুনবিৰি, গামখাৰু, থুৰিয়া আৰু অসমৰ সোণাৰি পৰম্পৰাৰ অলংকাৰ।",
    },
    image: commons("Assamese traditional jewellery.jpg"),
    imageAlt: "Assamese traditional jewellery",
    subcategories: ["Junbiri", "Gamkharu", "Thuriya", "Neckpiece", "Jewellery Set"],
  },
  {
    id: "home",
    slug: "home",
    name: { en: "Home & Lifestyle", as: "ঘৰ আৰু জীৱনশৈলী" },
    description: {
      en: "Bamboo and cane household objects, baskets and handmade home accessories.",
      as: "বাঁহ আৰু বেতৰ ঘৰুৱা সামগ্ৰী, ঝুৰি আৰু হাতেৰে নিৰ্মিত সজ্জা।",
    },
    image: commons("Innovative Bamboo Crafts of Assam.jpg"),
    imageAlt: "Bamboo crafts from Assam",
    subcategories: ["Bamboo Storage", "Cane Basket", "Home Decor"],
  },
  {
    id: "art",
    slug: "art",
    name: { en: "Art & Culture", as: "শিল্প আৰু সংস্কৃতি" },
    description: {
      en: "Majuli masks, pepa, dhol, gogona and objects tied to Assam's performance traditions.",
      as: "মাজুলীৰ মুখা, পেপা, ঢোল, গগণা আৰু অসমৰ পৰিবেশন পৰম্পৰাৰ সামগ্ৰী।",
    },
    image: commons("The Mask of Majuli - Hanuman-Monkey.jpg"),
    imageAlt: "A mask made in Majuli, Assam",
    subcategories: ["Masks", "Pepa", "Dhol", "Gogona", "Xutuli"],
  },
  {
    id: "regional",
    slug: "regional",
    name: { en: "Regional Products", as: "আঞ্চলিক সামগ্ৰী" },
    description: {
      en: "Assam tea, silk craft materials and other products with a documented regional origin.",
      as: "অসমৰ চাহ, পাটশিল্পৰ উপকৰণ আৰু প্ৰমাণিত আঞ্চলিক উৎসৰ সামগ্ৰী।",
    },
    image: commons("Assam-Tee SFTGFOP1.jpg"),
    imageAlt: "Assam tea leaves",
    subcategories: ["Assam Tea", "Silk Craft Materials"],
  },
];

export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((category) => [category.slug, category]));
export const CATEGORY_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category]));

export const getCategory = (slug) => CATEGORY_BY_SLUG.get(slug) || null;
