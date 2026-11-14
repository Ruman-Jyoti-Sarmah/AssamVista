/**
 * Communities of Assam and their traditional dances.
 *
 * Editorial rules for this file:
 *  - Never invent a dance name or attach a dance to a community without a
 *    source. Where the record is thin, the entry says so explicitly.
 *  - `status: "verification"` renders as "Information under verification".
 *  - Official categories and broader cultural identities are distinguished
 *    with `scope`.
 *  - References point to government, tourism, academic or encyclopaedic
 *    sources. The directory is not an exhaustive official list.
 */

export const VERIFICATION_LABEL = "Information under verification";

const commons = (fileName) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    fileName
  )}?width=900`;

const imageSearch = (query) =>
  `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

export const DANCE_SOURCES = {
  govCulture: {
    label: "Government of Assam — Culture of Assam",
    url: "https://assam.gov.in/about-us/391",
  },
  govFestivals: {
    label: "Government of Assam — Fairs and Festivals",
    url: "https://assam.gov.in/about-us/399",
  },
  folkDances: {
    label: "Wikipedia — Folk dances of Assam",
    url: "https://en.wikipedia.org/wiki/Folk_dances_of_Assam",
  },
  bihu: {
    label: "Wikipedia — Bihu dance",
    url: "https://en.wikipedia.org/wiki/Bihu_dance",
  },
  bagurumba: {
    label: "Wikipedia — Bagurumba",
    url: "https://en.wikipedia.org/wiki/Bagurumba",
  },
  aliAyeLigang: {
    label: "Wikipedia — Ali-Aye-Ligang",
    url: "https://en.wikipedia.org/wiki/Ali-Aye-Ligang",
  },
  karbiRongker: {
    label: "Utsav (Ministry of Tourism) — Rongker Festival, Karbi",
    url: "https://utsav.gov.in/view-event/rongker-festival-karbi-1",
  },
  bododimasa: {
    label: "Bodo and Dimasa Digital Heritage Archive — Dance",
    url: "https://www.bododimasaarchive.org/digital-heritage/community/2/category/dance",
  },
  rabhaBaikho: {
    label: "The Spring Time Festival Baikho in Rabha Culture (academic paper)",
    url: "https://www.ignited.in/index.php/jasrae/article/download/11527/22857/57107",
  },
  tiwaWanshuwa: {
    label: "Wikipedia — Wanshuwa Festival",
    url: "https://en.wikipedia.org/wiki/Wanshuwa_Festival",
  },
  deoriBisu: {
    label: "A Discourse on the Traditions and Cultural Identity of the Deori Community",
    url: "https://thecreativelauncher.com/index.php/tcl/article/download/402/385/382",
  },
  deodhani: {
    label: "A Critical Study of Deodhani Dance (ResearchGate)",
    url: "https://www.researchgate.net/publication/376377048_A_Critical_study_of_Deodhani_Dance",
  },
  taiAhom: {
    label: "Integration of Martial Arts in the Dance Forms of the Tai Ahom (IJRCS)",
    url: "https://ijrcs.org/wp-content/uploads/IJRCS202509012-min.pdf",
  },
  bhaona: {
    label: "Wikipedia — Bhaona",
    url: "https://en.wikipedia.org/wiki/Bhaona",
  },
  meghalayaDance: {
    label: "Meghalaya Tourism — Traditional Dance",
    url: "https://www.meghalayatourism.in/meghalaya-mosaic/traditional-dance/",
  },
  garoFestivals: {
    label: "Meghalaya Arts and Culture — Garo Festivals",
    url: "https://www.megartsculture.gov.in/festivals-garo.html",
  },
  hajongLewatana: {
    label: "Agro-Based Cultural Program of Hajong People (IJRESM)",
    url: "https://journal.ijresm.com/index.php/ijresm/article/download/203/186/378",
  },
  hajongPusna: {
    label: "Wikipedia — Pusnâ",
    url: "https://en.wikipedia.org/wiki/Pusn%C3%A2",
  },
  santhalDances: {
    label: "A Study among the Santhal Tribe of Jharkhand (IJFMR)",
    url: "https://www.ijfmr.com/papers/2026/3/77586.pdf",
  },
  karmaDance: {
    label: "Sahapedia — The Karma Festival and Its Songs",
    url: "https://www.sahapedia.org/sites/default/files/The%20Karma%20Festival%20and%20Its%20Songs.pdf",
  },
  kurukh: {
    label: "Wikipedia — Kurukh people (Oraon)",
    url: "https://en.wikipedia.org/wiki/Kurukh_people",
  },
  hoDances: {
    label: "Jharkhand Culture — Ho Dance",
    url: "https://jharkhandculture.com/node/36",
  },
  bengaliBarak: {
    label: "The Folk Culture of Barak Valley (Assam University)",
    url: "http://idr.aus.ac.in/jspui/bitstream/21011994/1034/9/09_chapter%202.pdf",
  },
  nepaliMaruni: {
    label: "Wikipedia — Maruni",
    url: "https://en.wikipedia.org/wiki/Maruni",
  },
  manipuriDance: {
    label: "Wikipedia — Manipuri dance",
    url: "https://en.wikipedia.org/wiki/Manipuri_dance",
  },
  chakmaBizu: {
    label: "IWGA — The Celebration of the New Year among Chakma Communities",
    url: "https://www.iwgia.org/en/articles/the-celebration-of-the-new-year-among-chakma-communities?lang=en",
  },
  hmarSikpui: {
    label: "Virthli — Sikpui Ruoi (Sikpui Festival)",
    url: "https://www.virthli.in/2011/02/sikpui-ruoi-sikpui-festival-festival.html",
  },
  kukiKut: {
    label: "The Times of India — Chavang Kut celebrations in Assam",
    url: "https://timesofindia.indiatimes.com/city/guwahati/dibrugarh-celebrates-chavang-kut-fest-with-rich-display-of-traditions/articleshow/125015061.cms",
  },
  nagaDances: {
    label: "BookMyDance — Dances of Nagaland",
    url: "https://bookmydance.in/nagaland/",
  },
  taiKhamtiNamsai: {
    label: "Namsai District — Tai-Khampti",
    url: "https://namsai.nic.in/tai-khampti/",
  },
  singphoManau: {
    label: "Utsav (Ministry of Tourism) — Shapawng Yawng Manau Poi",
    url: "https://utsav.gov.in/view-event/42nd-shapawng-yawng-manau-poi",
  },
  taiPhakeFolk: {
    label: "A Study of Folk Culture of the Tai Phake Tribe in Assam",
    url: "https://www.academia.edu/44360479/A_Study_of_Folk_culture_of_the_Tai_Phake_tribe_in_Assam",
  },
  taiAiton: {
    label: "Tai Aiton (Assam, India) — language and community study",
    url: "https://www.lddjournal.org/article/1218/galley/2462/download/",
  },
  taiKhamyang: {
    label: "Sahapedia — Tai Khamyangs of Assam: History and Folk Traditions",
    url: "http://www.sahapedia.org/tai-khamyangs-assam-history-and-folk-traditions",
  },
};

export const DANCE_CATEGORY_ORDER = [
  "bodoKachari",
  "brahmaputra",
  "hills",
  "tai",
  "adivasi",
  "barak",
  "himalayanNaga",
];

const dance = ({
  name,
  alternateNames = [],
  status = "verified",
  description,
  significance = VERIFICATION_LABEL,
  occasion = VERIFICATION_LABEL,
  clothing = VERIFICATION_LABEL,
}) => ({
  name,
  alternateNames,
  status,
  description,
  significance,
  occasion,
  clothing,
});

const community = ({
  id,
  name,
  altNames = [],
  category,
  scope = "Community",
  region,
  summary,
  dances,
  clothing = VERIFICATION_LABEL,
  photoFile,
  photoAlt,
  photoCredit = "Wikimedia Commons",
  sources = [],
}) => ({
  id,
  name,
  altNames,
  category,
  scope,
  region,
  summary,
  dances,
  clothing,
  photo: photoFile
    ? {
        src: commons(photoFile),
        alt: photoAlt || `${name} in traditional dress`,
        credit: photoCredit,
      }
    : null,
  imageSearchUrl: imageSearch(`${name} Assam traditional dance`),
  references: sources.map((key) => DANCE_SOURCES[key]).filter(Boolean),
});

export const COMMUNITY_DANCES = [
  community({
    id: "bodo",
    name: "Bodo (Boro)",
    altNames: ["Boro", "Bodo"],
    category: "bodoKachari",
    region: "Kokrajhar, Chirang, Baksa, Udalguri and Bodoland",
    summary:
      "Bagurumba, the butterfly-like dance of Bodo women, is the community's best-known dance and a symbol of Bodo identity.",
    dances: [
      dance({
        name: "Bagurumba",
        alternateNames: ["Bardwisikhla"],
        description:
          "A graceful group dance of Bodo women, often called the butterfly dance for its light, swaying steps and extended arm movements. Dancers move in a circle to the rhythm of the kham and other instruments.",
        significance:
          "Celebrates spring, nature and community solidarity, and is a widely recognised marker of Bodo cultural identity.",
        occasion: "Bwisagu (spring new year) and cultural festivals.",
        clothing:
          "Dokhona (wrapped skirt), aronai (shawl) and gamsa, often with traditional ornaments.",
      }),
    ],
    clothing: "Dokhona, aronai and gamsa.",
    photoFile: "Two Bodo girls in traditional dresses at Kokrajhar.jpg",
    photoAlt: "Two Bodo girls in traditional dokhona and aronai",
    sources: ["bagurumba", "folkDances", "govCulture"],
  }),
  community({
    id: "mising",
    name: "Mising (Miri)",
    altNames: ["Miri", "Mishing"],
    category: "brahmaputra",
    region: "Majuli, Dhemaji, Lakhimpur and riverine Upper Assam",
    summary:
      "Gumrag, the circle dance of the Mising, is performed at Ali-Aye-Ligang to mark the sowing season.",
    dances: [
      dance({
        name: "Gumrag",
        alternateNames: ["Gumrag Soman"],
        description:
          "Young men and women dance in circles with quick, rhythmic steps, moving to the beat of drums and the sound of the gong. The dance echoes the movement of birds and the flow of the river.",
        significance:
          "A prayer for a good harvest and a celebration of Mising identity along the Brahmaputra.",
        occasion:
          "Ali-Aye-Ligang (February), the Mising sowing festival; also performed at Solung and Bihu celebrations.",
        clothing:
          "Ege-gasor (wrap), ri:bi (skirt) and gadu (shawl), woven by Mising women.",
      }),
    ],
    clothing: "Ege-gasor, ri:bi and gadu.",
    photoFile: "Mising women in traditional dress.jpg",
    photoAlt: "Mising women in traditional handwoven dress",
    sources: ["govCulture", "folkDances", "aliAyeLigang"],
  }),
  community({
    id: "karbi",
    name: "Karbi",
    altNames: ["Mikir"],
    category: "hills",
    region: "Karbi Anglong and West Karbi Anglong",
    summary:
      "Karbi dance traditions include Nimso Kerung, Ritnong Chingdi and Hacha Kekan, performed at festivals and harvest gatherings.",
    dances: [
      dance({
        name: "Nimso Kerung",
        description:
          "A community dance performed in a circle, with dancers holding hands or arms and moving in a steady rhythm. It is often described as a dance of unity.",
        significance: "Expresses social cohesion and Karbi identity.",
        occasion:
          "Rongker, Chomangkan, the Karbi Youth Festival and village celebrations.",
        clothing:
          "Pini (women's wrap) and pekok (shawl), with woven men's garments.",
      }),
      dance({
        name: "Ritnong Chingdi",
        description:
          "A symbolic sowing dance that depicts the agricultural cycle followed by Karbi farmers.",
        significance: "Honours agricultural labour and prays for a good crop.",
        occasion: "Rongker and the agricultural season.",
        clothing: "Traditional Karbi woven dress.",
      }),
      dance({
        name: "Hacha Kekan",
        description: "A harvest dance performed by the Karbi.",
        significance: "Celebrates the harvest and community labour.",
        occasion: "Harvest season and village festivals.",
        clothing: "Traditional Karbi woven dress.",
      }),
      dance({
        name: "Lengpum Sokchon",
        description: "A traditional Karbi folk dance performed at cultural gatherings.",
        significance: "Carries Karbi stories, music and community memory.",
        occasion: "Cultural festivals and community programmes.",
        clothing: "Traditional Karbi woven dress.",
      }),
    ],
    clothing: "Pini, pekok and woven men's garments.",
    sources: ["karbiRongker", "folkDances", "govCulture"],
  }),
  community({
    id: "dimasa",
    name: "Dimasa",
    altNames: ["Dimasa Kachari"],
    category: "bodoKachari",
    region: "Dima Hasao, Cachar and the Barak Valley foothills",
    summary:
      "Baidima is the best-known Dimasa dance, performed during the Busu Dima harvest festival.",
    dances: [
      dance({
        name: "Baidima",
        description:
          "A group dance of men and women in traditional Dimasa dress, accompanied by drums, flutes and cymbals. Dancers move in lines and circles with measured steps.",
        significance:
          "A thanksgiving after the harvest and a celebration of Dimasa unity.",
        occasion: "Busu Dima (January) and community festivals.",
        clothing:
          "Risha (shawl) and rijamphain (women's wrap); men wear a woven dhoti and shawl.",
      }),
    ],
    clothing: "Risha and rijamphain.",
    photoFile: "Traditional Dress of Dimasa Tribe.jpg",
    photoAlt: "Dimasa people in traditional dress",
    sources: ["govCulture", "folkDances", "bododimasa"],
  }),
  community({
    id: "rabha",
    name: "Rabha",
    category: "brahmaputra",
    region: "Goalpara, Kamrup, Kokrajhar and western Assam",
    summary:
      "Hamjar and the Baikho dances are central to Rabha festival life in western Assam.",
    dances: [
      dance({
        name: "Hamjar",
        description:
          "A lively folk dance performed by Rabha women during festivals, with rhythmic footwork and swaying movements accompanied by drums and flutes.",
        significance:
          "Celebrates community life, fertility and the agricultural cycle.",
        occasion: "Baikho (pre-harvest, June) and other Rabha festivals.",
        clothing:
          "Colourful handwoven Rabha wrappers and shawls; specific garment names are under verification.",
      }),
      dance({
        name: "Bar Nak-Kai",
        description:
          "A dance associated with the Baikho festival. Some accounts also describe a fire-test dance as part of Baikho observances.",
        significance: "Ritual thanksgiving and protection of the community.",
        occasion: "Baikho.",
        clothing: "Traditional Rabha festival dress.",
      }),
    ],
    clothing:
      "Handwoven Rabha wrappers and shawls; specific garment names are under verification.",
    photoFile: "A Rabha tribal lady.jpg",
    photoAlt: "A Rabha woman in traditional dress",
    sources: ["rabhaBaikho", "folkDances", "govCulture"],
  }),
  community({
    id: "tiwa",
    name: "Tiwa (Lalung)",
    altNames: ["Lalung"],
    category: "brahmaputra",
    region: "Morigaon, Nagaon, Kamrup and the Karbi Anglong foothills",
    summary:
      "Sagra Misawa, Wanshuwa and Langkhon Misawa are among the Tiwa dances tied to seasonal and religious festivals.",
    dances: [
      dance({
        name: "Sagra Misawa",
        alternateNames: ["Sogra Misawa"],
        description:
          "A communal dance festival in which Tiwa men and women dance together, often in long lines or circles, to the beat of the khram drum.",
        significance:
          "Thanksgiving to the deities for the harvest and a prayer for prosperity.",
        occasion: "Sagra Misawa and Wanshuwa.",
        clothing:
          "Traditional Tiwa handwoven dress; specific garment names are under verification.",
      }),
      dance({
        name: "Wanshuwa",
        description:
          "A religious festival dance performed to the rhythm of the khram, accompanied by songs and community feasting.",
        significance: "Seeks divine favour and strengthens community bonds.",
        occasion: "Wanshuwa (January).",
        clothing: "Traditional Tiwa dress.",
      }),
      dance({
        name: "Langkhon Misawa",
        description: "A dance performed to Langkhon songs in Tiwa villages.",
        significance: "Part of Tiwa musical and dance heritage.",
        occasion: "Community festivals.",
        clothing: "Traditional Tiwa dress.",
      }),
    ],
    clothing:
      "Traditional Tiwa handwoven dress; specific garment names are under verification.",
    photoFile: "A Tiwa Women Preparing food.jpg",
    photoAlt: "A Tiwa woman in traditional dress preparing food",
    sources: ["tiwaWanshuwa", "folkDances", "govCulture"],
  }),
  community({
    id: "sonowal-kachari",
    name: "Sonowal Kachari",
    category: "bodoKachari",
    region: "Dibrugarh, Tinsukia, Lakhimpur and Upper Assam",
    summary:
      "Log Bihu and Haidang are distinctive Sonowal Kachari traditions within Assam's Bihu culture.",
    dances: [
      dance({
        name: "Log Bihu",
        description:
          "A traditional folk dance and festival of the Sonowal Kachari, performed with drums, cymbals and flutes. Dancers move in brisk Bihu-style steps.",
        significance:
          "Marks the agricultural cycle and celebrates community identity.",
        occasion: "Log Bihu festival and Bohag Bihu.",
        clothing:
          "Mekhela sador and chador; specific ceremonial details are under verification.",
      }),
      dance({
        name: "Haidang",
        description:
          "A Sonowal Kachari folk song tradition often accompanied by dance; the term is also used for a genre of community songs.",
        significance:
          "Carries oral history, courtship and community memory.",
        occasion: "Bihu and village gatherings.",
        clothing: "Traditional Assamese-style dress.",
      }),
    ],
    clothing:
      "Mekhela sador and chador; specific ceremonial details are under verification.",
    sources: ["bihu", "folkDances", "govCulture"],
  }),
  community({
    id: "thengal-kachari",
    name: "Thengal Kachari",
    category: "bodoKachari",
    region: "Jorhat, Golaghat and Upper Assam",
    summary:
      "Tora Chira Bihu is a pre-Bihu observance of the Thengal Kachari, with songs and dance.",
    dances: [
      dance({
        name: "Tora Chira Bihu",
        description:
          "A pre-Bihu festival in which the community collects the tora plant and celebrates with Bihu songs and dance.",
        significance:
          "Marks the approach of Bohag Bihu and reinforces community identity.",
        occasion: "Tora Chira Bihu, shortly before Bohag Bihu.",
        clothing: "Mekhela sador; details under verification.",
      }),
      dance({
        name: "Bihu",
        description:
          "Thengal Kachari dancers also perform Bihu within the wider Assamese tradition.",
        significance: "Celebrates spring and fertility.",
        occasion: "Bohag Bihu.",
        clothing: "Mekhela sador, chador and traditional ornaments.",
      }),
    ],
    clothing: "Mekhela sador; details under verification.",
    sources: ["bihu", "folkDances", "govCulture"],
  }),
  community({
    id: "deori",
    name: "Deori",
    altNames: ["Deori Chutiya"],
    category: "bodoKachari",
    region: "Lakhimpur, Dhemaji, Tinsukia, Sivasagar and Upper Assam",
    summary:
      "The Bisu dance of the Deori is performed at Bohagiyo Bisu, the community's major spring festival.",
    dances: [
      dance({
        name: "Bisu",
        alternateNames: ["Bohagiyo Bisu dance", "Deori Bihu"],
        description:
          "Young men and women perform the Bisu dance to the beat of the dhol and the melody of the flute during the seven-day Bohagiyo Bisu festival.",
        significance:
          "Marks the new year and the sowing season, and is a central expression of Deori identity.",
        occasion: "Bohagiyo Bisu (April) and Magiyo Bisu (January).",
        clothing:
          "Traditional Deori handwoven dress; specific garment names are under verification.",
      }),
    ],
    clothing:
      "Traditional Deori handwoven dress; specific garment names are under verification.",
    sources: ["bihu", "folkDances", "govCulture", "deoriBisu"],
  }),
  community({
    id: "hojai",
    name: "Hojai",
    category: "bodoKachari",
    region: "Nagaon and central Assam",
    summary:
      "A distinct Hojai dance tradition could not be verified from the sources consulted; Hojai cultural life shares much with wider Assamese traditions.",
    dances: [
      dance({
        name: VERIFICATION_LABEL,
        status: "verification",
        description:
          "No community-specific Hojai dance could be confirmed from the sources consulted. Hojai people participate in wider Assamese Bihu and devotional traditions.",
        significance: VERIFICATION_LABEL,
        occasion: VERIFICATION_LABEL,
        clothing: VERIFICATION_LABEL,
      }),
    ],
    clothing: VERIFICATION_LABEL,
    sources: ["govCulture", "folkDances"],
  }),
  community({
    id: "chutia",
    name: "Chutia",
    altNames: ["Chutiya"],
    category: "bodoKachari",
    region: "Sivasagar, Jorhat, Dibrugarh, Lakhimpur and Upper Assam",
    summary:
      "Deodhani, a ritual dance in honour of the serpent goddess Manasa, is the dance most often associated with Chutia heritage.",
    dances: [
      dance({
        name: "Deodhani",
        description:
          "A ritual dance performed by a Deodhani, often a woman, in a trance-like state, with loose hair and rapid movements, to the beat of drums and cymbals.",
        significance:
          "Invokes the serpent goddess Manasa for protection, healing and fertility.",
        occasion: "Manasa Puja and community rituals.",
        clothing:
          "Traditional Assamese or Chutia mekhela sador; ritual dress details are under verification.",
      }),
      dance({
        name: "Bihu",
        description:
          "Chutia dancers also participate in the wider Bihu tradition.",
        significance: "Celebrates spring and agricultural renewal.",
        occasion: "Bohag Bihu.",
        clothing: "Mekhela sador.",
      }),
    ],
    clothing:
      "Traditional Assamese or Chutia mekhela sador; ritual dress details are under verification.",
    sources: ["deodhani", "govCulture", "bihu"],
  }),
  community({
    id: "mech",
    name: "Mech",
    category: "bodoKachari",
    region: "Western Assam and the Assam–North Bengal border",
    summary:
      "Mech cultural life overlaps with Boro traditions; a distinct Mech dance could not be verified from the sources consulted.",
    dances: [
      dance({
        name: VERIFICATION_LABEL,
        status: "verification",
        description:
          "Mech communities share Bwisagu and other seasonal observances with Boro traditions. A distinct Mech dance name could not be confirmed from the sources consulted.",
        significance: VERIFICATION_LABEL,
        occasion: "Bwisagu and related seasonal observances.",
        clothing: VERIFICATION_LABEL,
      }),
    ],
    clothing: VERIFICATION_LABEL,
    sources: ["govCulture", "folkDances"],
  }),
  community({
    id: "tai-ahom",
    name: "Tai Ahom",
    altNames: ["Ahom"],
    category: "tai",
    region: "Sivasagar, Jorhat, Dibrugarh, Golaghat and Upper Assam",
    summary:
      "Lai Lung Kham is a Tai Ahom folk dance, while the Kachong umbrella dance is another visible part of Ahom performance culture.",
    dances: [
      dance({
        name: "Lai Lung Kham",
        description:
          "A Tai Ahom folk dance performed by women in traditional dress, with graceful hand movements and rhythmic steps.",
        significance:
          "Expresses Tai Ahom heritage and the community's courtly and agricultural traditions.",
        occasion: "Me-Dam-Me-Phi, Bihu and Tai cultural festivals.",
        clothing:
          "Mekhela sador and riha; Tai Ahom ceremonial dress details are under verification.",
      }),
      dance({
        name: "Kachong",
        description: "An umbrella dance of the Tai Ahom community.",
        significance:
          "A celebratory performance associated with Tai Ahom cultural events.",
        occasion: "Cultural festivals and Bihu.",
        clothing: "Traditional Tai Ahom dress.",
      }),
    ],
    clothing:
      "Mekhela sador and riha; Tai Ahom ceremonial dress details are under verification.",
    sources: ["folkDances", "govCulture", "bihu", "taiAhom"],
  }),
  community({
    id: "moran",
    name: "Moran",
    category: "bodoKachari",
    region: "Tinsukia, Dibrugarh, Sivasagar and Upper Assam",
    summary:
      "Rati Bihu, a night-time Bihu tradition, is the best-known dance and festival of the Moran community.",
    dances: [
      dance({
        name: "Rati Bihu",
        description:
          "A Bihu performance held at night, with Bihu songs, dance and traditional instruments. Moran dancers follow customary Bihu steps and formations.",
        significance:
          "Celebrates the spring new year and Moran cultural identity.",
        occasion: "Rati Bihu, around Bohag Bihu.",
        clothing:
          "Mekhela sador, traditionally with red-and-white combinations; details under verification.",
      }),
    ],
    clothing:
      "Mekhela sador, traditionally with red-and-white combinations; details under verification.",
    sources: ["bihu", "folkDances", "govCulture"],
  }),
  community({
    id: "matak",
    name: "Matak",
    category: "bodoKachari",
    region: "Dibrugarh, Tinsukia and Upper Assam",
    summary:
      "The Matak are a Vaishnavite community. Bhaona is central to their religious performance culture, but a distinct Matak dance could not be verified.",
    dances: [
      dance({
        name: "Bhaona (devotional theatre with dance)",
        status: "verification",
        description:
          "Bhaona is a Neo-Vaishnavite performing art with dance sequences such as krishna nas, gopi nas, ras nas and notua nas. It is central to Matak religious life, but it is not a community-specific Matak dance.",
        significance: "Devotional storytelling and religious instruction.",
        occasion: "Bhaona performances and Vaishnavite festivals.",
        clothing:
          "Traditional Assamese performance costume; details under verification.",
      }),
    ],
    clothing: VERIFICATION_LABEL,
    sources: ["govFestivals", "govCulture", "bhaona"],
  }),
  community({
    id: "koch-rajbongshi",
    name: "Koch-Rajbongshi",
    altNames: ["Koch Rajbongshi"],
    category: "bodoKachari",
    region: "Dhubri, Kokrajhar, Bongaigaon, Goalpara and western Assam",
    summary:
      "Goalini Nritya, a dance of milkmaids, is the signature folk dance of the Koch-Rajbongshi.",
    dances: [
      dance({
        name: "Goalini Nritya",
        description:
          "A graceful dance performed by women, depicting the daily life of milkmaids and farmers. Dancers move in measured steps with expressive hand gestures.",
        significance:
          "Reflects agrarian life, devotion and Koch-Rajbongshi identity.",
        occasion: "Kartika Puja, community festivals and cultural programmes.",
        clothing:
          "Mekhela and chador; the Goalini costume is under verification.",
      }),
      dance({
        name: "Kartika Nritya",
        description:
          "A devotional dance associated with the Kartika festival.",
        significance: "Expresses devotion and seasonal thanksgiving.",
        occasion: "Kartika Puja.",
        clothing: "Traditional Koch-Rajbongshi dress.",
      }),
    ],
    clothing: "Mekhela and chador; the Goalini costume is under verification.",
    sources: ["folkDances", "govCulture"],
  }),
  community({
    id: "garo",
    name: "Garo (A·chik)",
    altNames: ["Achik", "A·chik"],
    category: "hills",
    region: "Goalpara and the Assam–Meghalaya border",
    summary:
      "Wangala, the Garo harvest festival, is celebrated with the long drum and the Wangala dance; Chambil Mesara is a separate pomelo dance.",
    dances: [
      dance({
        name: "Wangala",
        description:
          "Men and women dance in lines to the beat of the dama (long drum) and other instruments, wearing colourful traditional dress and feathered headgear.",
        significance:
          "Thanksgiving to the Sun god Misi Saljong for the harvest.",
        occasion: "Wangala (October–November).",
        clothing:
          "Dakmanda (women's wrap skirt), daksari (blouse) and woven men's dress.",
      }),
      dance({
        name: "Chambil Mesara",
        alternateNames: ["Pomelo Dance"],
        description:
          "A solo dance in which a performer dangles a pomelo or another fruit from a cord around the waist and moves to keep it swinging.",
        significance: "A playful show of skill and balance at festivals.",
        occasion: "Wangala and community celebrations.",
        clothing: "Traditional Garo dress.",
      }),
    ],
    clothing: "Dakmanda and daksari for women; woven men's dress.",
    photoFile: "GARO TRADITIONAL DRESS-2.jpg",
    photoAlt: "Garo people in traditional dress",
    sources: ["meghalayaDance", "garoFestivals", "govCulture"],
  }),
  community({
    id: "khasi",
    name: "Khasi",
    category: "hills",
    region: "Assam–Meghalaya border and southern Assam",
    summary:
      "Shad Suk Mynsiem and Shad Nongkrem are the best-known Khasi dance festivals.",
    dances: [
      dance({
        name: "Shad Suk Mynsiem",
        description:
          "The dance of peaceful hearts is a spring festival dance in which men and women dance in concentric circles to drums, cymbals and the tangmuri.",
        significance:
          "Thanksgiving, fertility and the renewal of community life.",
        occasion: "April, at Shillong and other Khasi centres.",
        clothing:
          "Jainsem, dhara and tapmohkhlieh for women; men wear a traditional dhoti and coat.",
      }),
      dance({
        name: "Shad Nongkrem",
        description:
          "A harvest dance held at Smit, performed by dancers in traditional Khasi dress.",
        significance:
          "Honours the Syiem of Khyrim and gives thanks for the harvest.",
        occasion: "Nongkrem festival (October–November).",
        clothing: "Traditional Khasi dress.",
      }),
    ],
    clothing: "Jainsem, dhara and tapmohkhlieh.",
    photoFile: "Khasi Traditional Dress..jpg",
    photoAlt: "Khasi people in traditional dress",
    sources: ["meghalayaDance", "govCulture"],
  }),
  community({
    id: "jaintia",
    name: "Jaintia (Pnar)",
    altNames: ["Pnar", "Jaintia"],
    category: "hills",
    region: "Assam–Meghalaya border, especially around Jowai and the Jaintia Hills",
    summary:
      "Lahoo is the lively Pnar dance of Behdienkhlam and Chad Sukra.",
    dances: [
      dance({
        name: "Lahoo",
        alternateNames: ["Laho"],
        description:
          "A lively group dance in which men and women link arms and move in rhythm, traditionally performed during Behdienkhlam and Chad Sukra.",
        significance:
          "Thanksgiving, community solidarity and the start of the sowing season.",
        occasion: "Behdienkhlam (July) and Chad Sukra (April).",
        clothing: "Jainsem and dhara for women; traditional men's dress.",
      }),
    ],
    clothing: "Jainsem and dhara.",
    sources: ["meghalayaDance", "govCulture"],
  }),
  community({
    id: "hajong",
    name: "Hajong",
    category: "brahmaputra",
    region: "Goalpara and western Assam",
    summary:
      "Lewa-Tana, a Hajong Bihu-style dance, is performed during Chorkhela, while Pusna is the community's major harvest festival.",
    dances: [
      dance({
        name: "Lewa-Tana",
        description:
          "A Bihu-style dance of the Hajong, performed by women in colourful handwoven dress during the Chorkhela festival.",
        significance: "Celebrates the harvest and Hajong identity.",
        occasion: "Chorkhela and Pusna.",
        clothing: "Pathin (patin) and other handwoven Hajong garments.",
      }),
      dance({
        name: "Pusna dance",
        description:
          "Dance and music form part of the Pusna harvest celebrations.",
        significance: "Thanksgiving for the rice harvest.",
        occasion: "Pusna (mid-January).",
        clothing: "Traditional Hajong dress.",
      }),
    ],
    clothing: "Pathin (patin) and other handwoven Hajong garments.",
    photoFile: "পৰম্পৰাগতভাৱে পোছাক পিন্ধা হাজং সংস্কৃতি গোট.jpg",
    photoAlt: "Hajong cultural group in traditional dress",
    sources: ["hajongLewatana", "hajongPusna", "govCulture"],
  }),
  community({
    id: "tea-tribes",
    name: "Tea Tribes / Adivasi",
    altNames: ["Tea garden communities", "Adivasi"],
    category: "adivasi",
    scope: "Umbrella identity",
    region: "Tea-growing districts of Upper and Central Assam",
    summary:
      "Jhumur is the shared dance tradition of Assam's tea garden and Adivasi communities.",
    dances: [
      dance({
        name: "Jhumur",
        description:
          "A synthesised dance form of the tea garden communities, performed by women in a line or circle, sometimes with men, to the beat of the madal and the sound of flutes.",
        significance:
          "Expresses shared Adivasi identity, labour history and joy.",
        occasion:
          "Bihu, Karam, tea garden festivals and community gatherings.",
        clothing:
          "Red-bordered saree and dhoti; details under verification.",
      }),
    ],
    clothing: "Red-bordered saree and dhoti; details under verification.",
    sources: ["govCulture", "folkDances"],
  }),
  community({
    id: "santhal",
    name: "Santhal",
    altNames: ["Santal"],
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    summary:
      "Sohrai, Baha, Karam and Dasai are among the Santhal dances that mark the agricultural year.",
    dances: [
      dance({
        name: "Sohrai",
        description:
          "A harvest dance performed in groups with drums and flutes, often during the Sohrai festival.",
        significance: "Thanksgiving for the harvest and honouring cattle.",
        occasion: "Sohrai (October–November).",
        clothing: "Parhan (women's wrap), panchi (blouse) and gamchha.",
      }),
      dance({
        name: "Baha",
        description:
          "A spring dance associated with the Baha flower festival.",
        significance:
          "Celebrates the flowering of the sal tree and the start of spring.",
        occasion: "Baha (March).",
        clothing: "Traditional Santhal dress.",
      }),
      dance({
        name: "Karam",
        description:
          "A dance performed during the Karam festival in honour of Karam Devta.",
        significance:
          "Seeks fertility and protection for the community.",
        occasion: "Karam (September).",
        clothing: "Traditional Santhal dress.",
      }),
    ],
    clothing: "Parhan, panchi and gamchha.",
    sources: ["santhalDances", "karmaDance", "govCulture"],
  }),
  community({
    id: "munda",
    name: "Munda",
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    summary:
      "Karam is the central dance festival of the Munda, with several distinct Karam dance variations.",
    dances: [
      dance({
        name: "Karam",
        alternateNames: ["Karma"],
        description:
          "A group dance performed around the Karam branches, with men and women moving in circles to drums and songs. Munda tradition includes variations such as Lashna Karam.",
        significance:
          "Honours Karam Devta and seeks fertility, protection and a good harvest.",
        occasion: "Karam (September) and Sohrai.",
        clothing: "Parhan and panchi; details under verification.",
      }),
    ],
    clothing: "Parhan and panchi; details under verification.",
    sources: ["karmaDance", "govCulture"],
  }),
  community({
    id: "oraon",
    name: "Oraon",
    altNames: ["Kurukh"],
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    summary:
      "Karma, Sarhul and Phagu are the main Oraon dance traditions.",
    dances: [
      dance({
        name: "Karma",
        alternateNames: ["Karam dandi"],
        description:
          "A circle dance performed during the Karam festival, with men and women holding hands or sticks and moving to the beat of drums.",
        significance:
          "Seeks fertility and honours the Karam spirit.",
        occasion: "Karam (September).",
        clothing: "Parhan and panchi for women; dhoti for men.",
      }),
      dance({
        name: "Sarhul",
        description:
          "A spring dance associated with the Sarhul festival and the sal flower.",
        significance: "Celebrates nature's renewal and clan solidarity.",
        occasion: "Sarhul (March–April).",
        clothing: "Traditional Oraon dress.",
      }),
      dance({
        name: "Phagu",
        description:
          "A seasonal dance performed around the Phagu festival.",
        significance: "Marks the spring harvest and courtship.",
        occasion: "Phagu (February–March).",
        clothing: "Traditional Oraon dress.",
      }),
    ],
    clothing: "Parhan and panchi; dhoti for men.",
    sources: ["karmaDance", "kurukh", "govCulture"],
  }),
  community({
    id: "kharia",
    name: "Kharia",
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    summary:
      "Karam is the best-documented Kharia dance tradition; local variations exist.",
    dances: [
      dance({
        name: "Karam",
        description:
          "A group dance performed during the Karam festival, with songs and drumming. Kharia practice varies between villages.",
        significance: "Harvest thanksgiving and honouring ancestors.",
        occasion: "Karam (September).",
        clothing: VERIFICATION_LABEL,
      }),
    ],
    clothing: VERIFICATION_LABEL,
    sources: ["karmaDance", "govCulture"],
  }),
  community({
    id: "ho",
    name: "Ho",
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    summary:
      "Mage, Sohrai and Dasang are among the dance traditions of the Ho.",
    dances: [
      dance({
        name: "Mage",
        description:
          "A major Ho dance and song tradition performed during the Mage festival, with young men and women dancing in groups.",
        significance:
          "Marks the spring season and provides a space for courtship and community bonding.",
        occasion: "Mage (spring).",
        clothing: "Parhan and panchi; details under verification.",
      }),
      dance({
        name: "Sohrai",
        description:
          "A harvest dance performed during the Sohrai festival.",
        significance: "Thanksgiving for the harvest.",
        occasion: "Sohrai.",
        clothing: "Traditional Ho dress.",
      }),
    ],
    clothing: "Parhan and panchi; details under verification.",
    sources: ["hoDances", "govCulture"],
  }),
  community({
    id: "bhumij",
    name: "Bhumij",
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    summary:
      "Karam and Sohrai dance traditions are shared with neighbouring Adivasi communities; Bhumij-specific details need further documentation.",
    dances: [
      dance({
        name: "Karam",
        description:
          "A group dance performed during the Karam festival, with drums and communal singing.",
        significance: "Harvest thanksgiving and fertility.",
        occasion: "Karam (September).",
        clothing: VERIFICATION_LABEL,
      }),
      dance({
        name: "Sohrai",
        description:
          "A harvest dance associated with the Sohrai festival.",
        significance: "Thanksgiving and community celebration.",
        occasion: "Sohrai.",
        clothing: "Traditional Bhumij dress.",
      }),
    ],
    clothing: VERIFICATION_LABEL,
    sources: ["karmaDance", "govCulture"],
  }),
  community({
    id: "bengali",
    name: "Bengali",
    altNames: ["Bengali Hindu", "Bengali Muslim"],
    category: "barak",
    scope: "Linguistic community",
    region: "Barak Valley (Cachar, Karimganj, Hailakandi) and other parts of Assam",
    summary:
      "Bou Nach, Dhamail and Gambhira are Bengali folk dance traditions present in the Barak Valley and wider Assam.",
    dances: [
      dance({
        name: "Bou Nach",
        description:
          "A Barak Valley folk tradition in which the bou (daughter-in-law) performs, often with restricted footwork and expressive hand movements.",
        significance:
          "A women-centred performance tradition tied to family and community celebrations.",
        occasion: "Weddings and domestic rituals.",
        clothing: "Saree and traditional jewellery.",
      }),
      dance({
        name: "Dhamail",
        description:
          "A circle dance performed by women to the accompaniment of songs, often during weddings and festivals.",
        significance: "Devotional and social bonding.",
        occasion: "Weddings, Durga Puja and community festivals.",
        clothing: "Saree.",
      }),
      dance({
        name: "Gambhira",
        description:
          "A rhythmic song, dance and drama form popular in northern West Bengal and the Barak Valley.",
        significance: "Social satire and devotional performance.",
        occasion: "Gambhira festival (April) and cultural programmes.",
        clothing: "Traditional Bengali performance dress.",
      }),
    ],
    clothing: "Saree and dhoti.",
    sources: ["bengaliBarak", "govCulture"],
  }),
  community({
    id: "nepali",
    name: "Nepali / Gorkha",
    altNames: ["Gorkha", "Nepali"],
    category: "himalayanNaga",
    scope: "Linguistic community",
    region: "Sonitpur, Nagaon, Karbi Anglong, Tinsukia and other districts",
    summary:
      "Maruni is the best-known Nepali/Gorkha dance in Assam, performed with the madal at festivals and weddings.",
    dances: [
      dance({
        name: "Maruni",
        description:
          "A Nepali folk dance, originally associated with the Magar community, performed by women in colourful dress to the beat of the madal. Dancers move in a circle with lively steps.",
        significance:
          "Celebrates harvest, courtship and community identity.",
        occasion: "Dashain, Tihar and Nepali cultural festivals.",
        clothing: "Gunyu-cholo for women and daura-suruwal for men.",
      }),
      dance({
        name: "Dohori",
        description:
          "A conversational song and dance form in which men and women exchange verses.",
        significance: "Courtship, wit and social commentary.",
        occasion: "Festivals and community gatherings.",
        clothing: "Traditional Nepali dress.",
      }),
    ],
    clothing: "Gunyu-cholo and daura-suruwal.",
    sources: ["nepaliMaruni", "govCulture"],
  }),
  community({
    id: "manipuri",
    name: "Manipuri",
    altNames: ["Meitei", "Bishnupriya Manipuri"],
    category: "barak",
    region: "Cachar, Hailakandi, Karimganj and the Barak Valley",
    summary:
      "Manipuri dance includes Ras Leela, Pung Cholom and Thang-Ta, preserved by Manipuri communities in Assam's Barak Valley.",
    dances: [
      dance({
        name: "Ras Leela",
        description:
          "A classical devotional dance-drama depicting episodes from the life of Krishna, performed by women in the circular Ras mandal.",
        significance:
          "Vaishnavite devotion and Manipuri cultural identity.",
        occasion: "Ras festivals (November) and religious occasions.",
        clothing: "Kumil, potloi and phanek.",
      }),
      dance({
        name: "Pung Cholom",
        description:
          "A vigorous drum dance performed by men, combining rhythm, acrobatics and devotional energy.",
        significance: "A display of skill and devotion.",
        occasion: "Ras festivals and cultural programmes.",
        clothing: "Traditional Manipuri men's dress.",
      }),
      dance({
        name: "Thang-Ta",
        description:
          "A martial dance form using swords and spears.",
        significance: "Preserves Manipuri martial heritage.",
        occasion: "Cultural festivals and demonstrations.",
        clothing: "Traditional martial dress.",
      }),
    ],
    clothing: "Kumil, potloi and phanek; dhoti for men.",
    sources: ["manipuriDance", "govCulture"],
  }),
  community({
    id: "chakma",
    name: "Chakma",
    category: "barak",
    region: "Southern Assam and the Barak Valley",
    summary:
      "Bizu, the Chakma New Year festival, is celebrated with the Bizu dance.",
    dances: [
      dance({
        name: "Bizu dance",
        description:
          "A group dance performed during the three-day Bizu festival, with dancers in colourful pinon and hadi moving to traditional songs and drums.",
        significance:
          "Welcomes the new year, gives thanks and strengthens community ties.",
        occasion: "Bizu (April).",
        clothing: "Pinon, hadi and silum.",
      }),
    ],
    clothing: "Pinon, hadi and silum.",
    photoFile: "Chakma girls in traditional dress.jpg",
    photoAlt: "Chakma girls in traditional dress",
    sources: ["chakmaBizu", "govCulture"],
  }),
  community({
    id: "hmar",
    name: "Hmar",
    category: "barak",
    region: "Cachar, Hailakandi, Dima Hasao and the Barak Valley",
    summary:
      "Chawn Lâm is a Hmar dance associated with the Sikpui festival, the community's major post-harvest celebration.",
    dances: [
      dance({
        name: "Chawn Lâm",
        description:
          "A Hmar cultural dance usually associated with the Sikpui festival, performed by men and women in traditional puan.",
        significance:
          "Thanksgiving, ancestral remembrance and community solidarity.",
        occasion: "Sikpui Ruoi (December).",
        clothing: "Puan and traditional Hmar shawls.",
      }),
    ],
    clothing: "Puan and traditional Hmar shawls.",
    photoFile: "Hmar people in Traditional Attire.png",
    photoAlt: "Hmar people in traditional attire",
    sources: ["hmarSikpui", "govCulture"],
  }),
  community({
    id: "kuki",
    name: "Kuki",
    altNames: ["Kuki-Zo", "Chin-Kuki-Mizo"],
    category: "barak",
    scope: "Umbrella identity",
    region: "Dima Hasao, Karbi Anglong, Cachar and the Barak Valley",
    summary:
      "Chavang Kut, the autumn harvest festival, is celebrated with traditional Kuki dances.",
    dances: [
      dance({
        name: "Chavang Kut",
        description:
          "Group dances performed during Chavang Kut, with dancers in traditional puan and woven shawls moving to drums and songs.",
        significance:
          "Thanksgiving for the harvest and celebration of Kuki-Zo identity.",
        occasion: "Chavang Kut (1 November) and Mim Kut.",
        clothing: "Puan and woven shawls.",
      }),
    ],
    clothing: "Puan and woven shawls.",
    photoFile: "Kuki family in traditional attire at the Mim Kut festival, Nagaland.jpg",
    photoAlt: "Kuki family in traditional attire at the Mim Kut festival",
    sources: ["kukiKut", "govCulture"],
  }),
  community({
    id: "naga",
    name: "Naga communities",
    altNames: ["Naga"],
    category: "himalayanNaga",
    scope: "Umbrella identity",
    region: "Assam's hill and border areas adjoining Nagaland",
    summary:
      "Naga dance traditions vary by community. Chang Lo is a well-known example, and many Naga peoples have their own harvest and festival dances.",
    dances: [
      dance({
        name: "Chang Lo",
        alternateNames: ["Sua Lua"],
        description:
          "A traditional dance of the Chang Naga, performed at the Poangelam festival to celebrate victory and community strength.",
        significance:
          "Honours bravery, victory and community solidarity.",
        occasion: "Poangelam and Naga cultural festivals.",
        clothing:
          "Community-specific Naga shawls, wraps and headgear.",
      }),
      dance({
        name: "Community-specific harvest dances",
        description:
          "Many Naga communities perform their own harvest and festival dances, with distinct steps, songs and dress. These traditions are not interchangeable.",
        significance:
          "Expresses each community's history, status and relationship with the land.",
        occasion:
          "Sekrenyi, Moatsu, the Hornbill Festival and village festivals.",
        clothing: "Community-specific shawls and wraps.",
      }),
    ],
    clothing: "Community-specific Naga shawls and wraps.",
    photoFile: "Aao Naga man and woman.jpg",
    photoAlt: "Ao Naga man and woman in traditional dress",
    sources: ["nagaDances", "govCulture"],
  }),
  community({
    id: "tai-khamti",
    name: "Tai Khamti",
    altNames: ["Khamti"],
    category: "tai",
    region: "Sadiya, Tinsukia and eastern Assam",
    summary:
      "Kaa Kong Tou Kai, the cockfight dance, and Ka Pung, a Buddhist dance-drama, are the best-known Tai Khamti dances.",
    dances: [
      dance({
        name: "Kaa Kong Tou Kai",
        description:
          "A dance performed by two or four dancers wearing headgear shaped like a cock's head, accompanied by drumbeats. The movements imitate a cockfight.",
        significance:
          "A festive performance with ritual and entertainment value.",
        occasion: "Sangken (April) and Buddhist festivals.",
        clothing:
          "Traditional Tai Khamti dress; specific garment names are under verification.",
      }),
      dance({
        name: "Ka Pung",
        description:
          "A sacred dance-drama blending song, dance and storytelling to convey Buddhist teachings.",
        significance: "Religious instruction and cultural preservation.",
        occasion: "Buddhist festivals and monastery events.",
        clothing: "Traditional Tai Khamti performance dress.",
      }),
    ],
    clothing:
      "Traditional Tai Khamti dress; specific garment names are under verification.",
    photoFile: "Traditional Attire of the Khamti Community in Assam.jpg",
    photoAlt: "Tai Khamti people in traditional attire",
    sources: ["taiKhamtiNamsai", "govCulture"],
  }),
  community({
    id: "singpho",
    name: "Singpho",
    altNames: ["Jinghpaw"],
    category: "tai",
    region: "Tinsukia, Margherita and eastern Upper Assam",
    summary:
      "Manau, the sacred circle dance, is the central dance tradition of the Singpho.",
    dances: [
      dance({
        name: "Manau",
        description:
          "Dancers move in concentric circles around tall manau posts, to the beat of drums and gongs, during the Shapawng Yawng Manau Poi festival.",
        significance:
          "Honours the ancestor Shapawng Yawng and celebrates Singpho/Jinghpaw unity and prosperity.",
        occasion: "Shapawng Yawng Manau Poi (February).",
        clothing:
          "Traditional Singpho woven dress; details under verification.",
      }),
      dance({
        name: "Ora",
        description:
          "Another traditional Singpho dance performed at community festivals.",
        significance: "Celebration and social bonding.",
        occasion: "Manau and village festivals.",
        clothing: "Traditional Singpho dress.",
      }),
    ],
    clothing:
      "Traditional Singpho woven dress; details under verification.",
    photoFile: "Singpho Dress..jpg",
    photoAlt: "Singpho traditional dress",
    sources: ["singphoManau", "govCulture"],
  }),
  community({
    id: "tai-phake",
    name: "Tai Phake",
    category: "tai",
    region: "Dibrugarh, Tinsukia and eastern Assam",
    summary:
      "The Tai Phake celebrate Poi Sangken with music and dance; a specific dance name could not be verified.",
    dances: [
      dance({
        name: "Poi Sangken dance (name under verification)",
        status: "verification",
        description:
          "Communal music and dance are part of Poi Sangken, the Tai New Year water festival. A specific Tai Phake dance name could not be confirmed from the sources consulted.",
        significance: "Marks the new year and Buddhist merit-making.",
        occasion: "Poi Sangken (April) and Poi Lu-fra.",
        clothing:
          "Traditional Tai Phake dress; details under verification.",
      }),
    ],
    clothing:
      "Traditional Tai Phake dress; details under verification.",
    sources: ["taiPhakeFolk", "govCulture"],
  }),
  community({
    id: "tai-aiton",
    name: "Tai Aiton",
    category: "tai",
    region: "Jorhat, Golaghat, Sivasagar and eastern Assam",
    summary:
      "The Tai Aiton preserve Tai language and Theravada Buddhist festivals; a distinct traditional dance name could not be verified.",
    dances: [
      dance({
        name: VERIFICATION_LABEL,
        status: "verification",
        description:
          "The Tai Aiton celebrate Buddhist festivals such as Sangken with community music and dance. A distinct Tai Aiton dance name could not be confirmed from the sources consulted.",
        significance: "Cultural and religious preservation.",
        occasion: "Sangken and Buddhist festivals.",
        clothing: VERIFICATION_LABEL,
      }),
    ],
    clothing: VERIFICATION_LABEL,
    sources: ["taiAiton", "govCulture"],
  }),
  community({
    id: "tai-turung",
    name: "Tai Turung",
    category: "tai",
    region: "Jorhat, Golaghat and eastern Assam",
    summary:
      "The Tai Turung are one of Assam's Tai communities; a distinct traditional dance name could not be verified.",
    dances: [
      dance({
        name: VERIFICATION_LABEL,
        status: "verification",
        description:
          "Tai Turung cultural life includes Buddhist festivals and community music. A distinct Tai Turung dance name could not be confirmed from the sources consulted.",
        significance: "Tai cultural preservation.",
        occasion: "Buddhist festivals and community gatherings.",
        clothing: VERIFICATION_LABEL,
      }),
    ],
    clothing: VERIFICATION_LABEL,
    sources: ["govCulture", "folkDances"],
  }),
  community({
    id: "tai-khamyang",
    name: "Tai Khamyang",
    category: "tai",
    region: "Sivasagar, Jorhat, Tinsukia and eastern Assam",
    summary:
      "The Tai Khamyang celebrate Poi Maiko Sumfai and Sangken; a specific dance name could not be verified.",
    dances: [
      dance({
        name: VERIFICATION_LABEL,
        status: "verification",
        description:
          "Tai Khamyang festivals such as Poi Maiko Sumfai and Sangken include music, dance and community feasting. A specific Tai Khamyang dance name could not be confirmed from the sources consulted.",
        significance: "Tai Buddhist heritage and community identity.",
        occasion: "Poi Maiko Sumfai and Sangken.",
        clothing: VERIFICATION_LABEL,
      }),
    ],
    clothing: VERIFICATION_LABEL,
    sources: ["taiKhamyang", "govCulture"],
  }),
];

export default COMMUNITY_DANCES;
