/**
 * A readable guide to Assam's living communities.
 *
 * This is the single catalogue used by the Communities page. Each entry brings
 * together the community's story, foods, languages, traditions, places and
 * traditional dance. Dance records live in `communityDances.js` so that their
 * sources and verification notes stay in one editorial place.
 *
 * Editorial rules:
 *  - Never invent a dance name or attach a dance to a community without a
 *    source. Records marked "verification" render as
 *    "Information under verification".
 *  - Community practice varies by place and family, so descriptions stay
 *    deliberately general.
 *  - Photos are served from Wikimedia Commons where a suitable file exists;
 *    otherwise a local or clearly labelled fallback image is used.
 */
import {
  COMMUNITY_DANCES,
  DANCE_CATEGORY_ORDER,
  VERIFICATION_LABEL,
} from "./communityDances.js";

const commons = (fileName) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    fileName
  )}?width=900`;

const search = (query) =>
  `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

const danceById = new Map(
  COMMUNITY_DANCES.map((record) => [record.id, record])
);

/**
 * Editorial profile for every community in the catalogue. `danceId` lets a
 * profile reuse a dance record whose id differs (currently khamti → tai-khamti).
 */
const PROFILES = [
  {
    id: "bodo",
    name: "Bodo (Boro) community",
    altNames: ["Boro", "Bodo"],
    category: "bodoKachari",
    region: "Kokrajhar, Chirang, Baksa and Udalguri",
    craft: "Dokhona, aronai, cotton and eri weaving",
    imageUrl: "https://i.pinimg.com/736x/90/75/bf/9075bf9db334e6fdf561b8cae35bf9a6.jpg",
    fallbackImage: "/images/culture/gamosa-assam.jpg",
    summary:
      "Bodo identity is expressed through language, weaving, music and a strong connection to the land.",
    story:
      "Boro is a major language of the region and the community's woven dokhona and aronai are prominent parts of everyday and ceremonial dress. Bwisagu welcomes the new year and spring, while Bathou is an important religious tradition for many Bodo people.",
    foods: ["Oma bedor (pork)", "Narzi (fermented jute leaves)", "Onla and rice dishes"],
    languages: ["Boro (Bodo)", "Assamese"],
    traditions: ["Bwisagu", "Bathou practice", "Aronai as a gesture of welcome"],
    places: ["Kokrajhar", "Chirang and Baksa villages", "Bodoland cultural events"],
    query: "Bodo Boro people traditional dress Kokrajhar Assam",
    photoAlt: "Two Bodo girls in traditional dokhona and aronai",
  },
  {
    id: "mising",
    name: "Mising (Miri) community",
    altNames: ["Miri", "Mishing"],
    category: "brahmaputra",
    region: "Majuli, Dhemaji, Lakhimpur and riverine areas of Upper Assam",
    craft: "Handloom textiles, bamboo homes, baskets and fishing tools",
    imageFile: "Mising women in traditional dress.jpg",
    fallbackImage: "/images/culture/ali-aye-ligang.jpg",
    summary:
      "Mising life along the Brahmaputra is reflected in raised homes, distinctive weaving and seasonal festivals.",
    story:
      "Mising families are known for chang ghar, raised homes suited to flood-prone areas, and for textiles woven on household looms. Ali-Aye-Ligang marks the start of the agricultural season; Solung is another major festival, with songs, dance and community gatherings.",
    foods: ["Poro apong (rice beer)", "Purang apin (rice cooked in leaves)", "Fish and smoked foods"],
    languages: ["Mising", "Assamese"],
    traditions: ["Ali-Aye-Ligang", "Solung", "Oinitom songs and dances"],
    places: ["Majuli", "Dhemaji villages", "Lakhimpur river plains"],
    query: "Mising Miri people traditional dress Assam",
    photoAlt: "Mising women in traditional handwoven dress",
  },
  {
    id: "karbi",
    name: "Karbi community",
    altNames: ["Mikir"],
    category: "hills",
    region: "Karbi Anglong and West Karbi Anglong",
    craft: "Woven garments, bamboo and cane work, beadwork",
    imageUrl: "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2017/07/01/Pictures/india-festival_4e6a54ea-5e7f-11e7-a18d-042ec35e3331.jpg",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Karbi community life is shaped by the hills, agriculture, textile traditions and village festivals.",
    story:
      "Karbi women weave garments such as pini and pekok, while bamboo and cane are used for practical household objects. Rongker is a community ritual for wellbeing and protection, and Chomangkan is an important post-funeral ceremony honouring the dead.",
    foods: ["Rice and locally grown greens", "Bamboo-shoot dishes", "Smoked or fermented foods"],
    languages: ["Karbi", "Assamese"],
    traditions: ["Rongker", "Chomangkan", "Hacha-Kekan dances"],
    places: ["Diphu", "Karbi Anglong villages", "West Karbi Anglong"],
    query: "Karbi people traditional dress Karbi Anglong Assam",
    photoAlt: "Bamboo and cane craft from Assam",
  },
  {
    id: "rabha",
    name: "Rabha community",
    altNames: ["Rabha"],
    category: "brahmaputra",
    region: "Goalpara, Kamrup, Kokrajhar and western Assam",
    craft: "Cotton weaving, bamboo work, music and dance",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj3kj7LyVhYAN2Or-01YD4Jf_3Flej8LK-I0ZV0WO84sBAQpApyZx2GXRb&s=10",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Rabha culture brings together village life, weaving, oral traditions and seasonal celebrations.",
    story:
      "Rabha communities include distinct groups with varied customs and speech. Handwoven clothing, songs and dances remain important expressions of identity; Baikho is a major seasonal festival associated with prayers for wellbeing and a good harvest.",
    foods: ["Rice and seasonal vegetables", "Fish and locally gathered greens", "Pitha and other rice-based foods"],
    languages: ["Rabha varieties", "Assamese"],
    traditions: ["Baikho", "Folk songs and dances", "Handloom weaving"],
    places: ["Goalpara villages", "Western Assam", "Baikho gatherings"],
    query: "Rabha people traditional dress Goalpara Assam",
    photoAlt: "A Rabha woman in traditional dress",
  },
  {
    id: "dimasa",
    name: "Dimasa community",
    altNames: ["Dimasa Kachari"],
    category: "bodoKachari",
    region: "Dima Hasao and parts of Cachar and the Barak Valley",
    craft: "Risha and other woven garments, bamboo and cane work",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_tC7MAgBkOGipe2ja9aFhCUV8S8HijZM-UMGP7uXsqg&s=10",
    fallbackImage: "/images/culture/sualkuchi-handloom.jpg",
    summary:
      "Dimasa culture is rooted in the hill country, with a rich textile vocabulary and community festivals.",
    story:
      "Dimasa women make distinctive handwoven garments, including the risha, and weaving skills are passed through families. Busu Dima is a major harvest festival celebrated with food, music and dance, though customs vary between local communities.",
    foods: ["Rice and fish", "Bamboo-shoot dishes", "Pork and seasonal vegetables"],
    languages: ["Dimasa", "Assamese"],
    traditions: ["Busu Dima", "Traditional dance and music", "Handloom weaving"],
    places: ["Haflong", "Dima Hasao villages", "Cachar foothills"],
    query: "Dimasa people traditional dress Assam",
    photoAlt: "Dimasa people in traditional dress",
  },
  {
    id: "sonowal-kachari",
    name: "Sonowal Kachari community",
    altNames: ["Sonowal Kachari"],
    category: "bodoKachari",
    region: "Dibrugarh, Tinsukia, Lakhimpur and Upper Assam",
    craft: "Handloom cotton and eri textiles, bamboo craft",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Sonowal_Kachari_Leseri_Bisu_troupe.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
    fallbackImage: "/images/culture/sualkuchi-handloom.jpg",
    summary:
      "Sonowal Kachari communities carry forward Upper Assam's agricultural, handloom and festival traditions.",
    story:
      "Community life is closely connected with farming, family looms and local celebrations. Bihu is widely observed, alongside community customs and rituals; local practice and self-identification can differ from one settlement to another.",
    foods: ["Rice and fish", "Khar", "Pitha and laru"],
    languages: ["Assamese", "Local community speech"],
    traditions: ["Bihu", "Agricultural observances", "Handloom weaving"],
    places: ["Dibrugarh", "Tinsukia", "Lakhimpur and Upper Assam villages"],
    query: "Sonowal Kachari people traditional dress Assam",
    photoAlt: "Handloom weaving in Assam",
  },
  {
    id: "deori",
    name: "Deori community",
    altNames: ["Deori Chutiya"],
    category: "bodoKachari",
    region: "Lakhimpur, Dhemaji, Tinsukia and other Upper Assam districts",
    craft: "Handwoven garments, bamboo work and ceremonial objects",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuIwcHePwZqvTlnDKM5t87E67mIBWDN2iytGYtuwPZ94JvMFE4f4mzlAE&s=10",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Deori community traditions are maintained through their language, weaving and village festivals.",
    story:
      "Deori is a distinct language, and traditional weaving remains an important household skill. Bisu (Bohaggiyo Bisu) is a major spring festival celebrated with music, dance and community feasts; observances differ among Deori groups.",
    foods: ["Rice and fish", "Seasonal greens", "Fermented and locally prepared foods"],
    languages: ["Deori", "Assamese"],
    traditions: ["Bisu", "Traditional dance and music", "Handloom weaving"],
    places: ["Lakhimpur", "Dhemaji", "Deori villages in Upper Assam"],
    query: "Deori people traditional dress Assam",
    photoAlt: "Bamboo and cane craft from Assam",
  },
  {
    id: "tiwa",
    name: "Tiwa (Lalung) community",
    altNames: ["Lalung"],
    category: "brahmaputra",
    region: "Morigaon, Nagaon, Kamrup and the Karbi Anglong hills",
    craft: "Woven garments, bamboo and cane work",
    imageFile: "A Tiwa Women Preparing food.jpg",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Tiwa traditions connect hill and plains settlements through agriculture, craft and shared festivals.",
    story:
      "Tiwa communities include both hill and plains groups, whose customs and dialects can differ. Wanshuwa, Sagra Misawa and other seasonal observances bring people together; the Jonbeel Mela is also a well-known gathering in the region.",
    foods: ["Rice-based meals", "Bamboo-shoot dishes", "Pitha and seasonal produce"],
    languages: ["Tiwa", "Assamese"],
    traditions: ["Wanshuwa", "Sagra Misawa", "Jonbeel Mela"],
    places: ["Morigaon", "Jonbeel area", "Tiwa villages in central Assam"],
    query: "Tiwa Lalung people traditional dress Assam",
    photoAlt: "A Tiwa woman in traditional dress preparing food",
  },
  {
    id: "garo",
    name: "Garo community",
    altNames: ["Achik", "A·chik"],
    category: "hills",
    region: "Goalpara and western Assam, adjoining the Garo Hills",
    craft: "Dakmanda and other handwoven textiles, bamboo and cane craft",
    imageUrl: "https://tribia.info/wp-content/uploads/2023/06/Garo-tribe-4.jpeg",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Garo (A·chik) culture is known for community celebrations, weaving and a close relationship with the land.",
    story:
      "Garo families live across the Assam-Meghalaya region, and customs vary among local groups. Wangala, the post-harvest festival, is celebrated with drums and dance; weaving and community music are also important parts of cultural life.",
    foods: ["Rice", "Nakham (dried or fermented fish)", "Meat and leafy vegetables"],
    languages: ["Garo (A·chik)", "Assamese and other regional languages"],
    traditions: ["Wangala", "Community drumming and dance", "Handloom weaving"],
    places: ["Goalpara", "Western Assam villages", "Garo Hills border region"],
    query: "Garo people traditional dress Assam Meghalaya",
    photoAlt: "Garo people in traditional dress",
  },
  {
    id: "hajong",
    name: "Hajong community",
    altNames: ["Hajong"],
    category: "brahmaputra",
    region: "Goalpara and neighbouring areas of western Assam",
    craft: "Patin and other handwoven clothing, agriculture",
    imageFile: "পৰম্পৰাগতভাৱে পোছাক পিন্ধা হাজং সংস্কৃতি গোট.jpg",
    fallbackImage: "/images/culture/sualkuchi-handloom.jpg",
    summary:
      "Hajong culture combines distinctive woven dress, agricultural customs and a rich festival calendar.",
    story:
      "The Hajong community is spread across parts of Assam and neighbouring regions. Women are known for weaving garments such as the patin; Pusna is a harvest observance, and religious practices reflect both local and wider regional influences.",
    foods: ["Rice and fish", "Pitha", "Seasonal vegetables and locally prepared dishes"],
    languages: ["Hajong", "Assamese and other regional languages"],
    traditions: ["Pusna", "Agricultural observances", "Patin weaving"],
    places: ["Goalpara", "Western Assam settlements", "Hajong cultural gatherings"],
    query: "Hajong people traditional dress Assam",
    photoAlt: "Hajong cultural group in traditional dress",
  },
  {
    id: "hmar",
    name: "Hmar community",
    altNames: ["Hmar"],
    category: "barak",
    region: "Barak Valley and southern Assam, adjoining Mizoram and Manipur",
    craft: "Handwoven puan, bamboo and cane craft",
    imageFile: "Hmar people in Traditional Attire.png",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Hmar identity is expressed through language, handwoven puan, music and community celebrations.",
    story:
      "Hmar communities live across the Barak Valley and neighbouring states, with local variations in custom and speech. Sikpui Ruoi is a major Hmar festival, while weaving and choral music remain visible parts of community life.",
    foods: ["Rice", "Bamboo shoots", "Smoked meat and leafy vegetables"],
    languages: ["Hmar", "Assamese and other regional languages"],
    traditions: ["Sikpui Ruoi", "Community songs and dances", "Puan weaving"],
    places: ["Cachar", "Hailakandi", "Barak Valley settlements"],
    query: "Hmar people traditional dress Assam",
    photoAlt: "Hmar people in traditional attire",
  },
  {
    id: "khasi",
    name: "Khasi community",
    altNames: ["Khasi"],
    category: "hills",
    region: "Assam-Meghalaya border areas and settlements in southern Assam",
    craft: "Handloom textiles, cane and bamboo work",
    imageFile: "Khasi Traditional Dress..jpg",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Khasi communities in Assam share deep cultural ties with the wider Khasi Hills region.",
    story:
      "Khasi communities are diverse, and many Khasi people live in Meghalaya and across the border regions. Khasi society is widely known for matrilineal kinship; festivals such as Shad Suk Mynsiem and Nongkrem are celebrated in the wider Khasi region.",
    foods: ["Rice", "Jadoh and other local rice dishes", "Fish, meat and seasonal greens"],
    languages: ["Khasi", "Assamese and other regional languages"],
    traditions: ["Shad Suk Mynsiem", "Nongkrem festival", "Matrilineal kinship traditions"],
    places: ["Assam-Meghalaya border settlements", "Cachar", "Khasi Hills cultural centres"],
    query: "Khasi people traditional dress Assam",
    photoAlt: "Khasi people in traditional dress",
  },
  {
    id: "chakma",
    name: "Chakma community",
    altNames: ["Chakma"],
    category: "barak",
    region: "Southern Assam and the wider Barak Valley region",
    craft: "Handwoven pinon and hadi, bamboo work",
    imageFile: "Chakma girls in traditional dress.jpg",
    fallbackImage: "/images/culture/namphake-buddhist-temple.jpg",
    summary:
      "Chakma culture brings together Buddhist traditions, weaving and a strong heritage of community festivals.",
    story:
      "Chakma communities live in several parts of Northeast India and neighbouring Bangladesh. Bizu, celebrated around the new year, includes visiting, music and shared food; Buddhist practice is central for many Chakma families.",
    foods: ["Rice and fish", "Bamboo-shoot dishes", "Pajon, a mixed-vegetable dish"],
    languages: ["Chakma", "Assamese and other regional languages"],
    traditions: ["Bizu", "Buddhist observances", "Pinon and hadi weaving"],
    places: ["Southern Assam settlements", "Barak Valley", "Regional Buddhist temples"],
    query: "Chakma people traditional dress Assam",
    photoAlt: "Chakma girls in traditional dress",
  },
  {
    id: "mech",
    name: "Mech community",
    altNames: ["Mech"],
    category: "bodoKachari",
    region: "Western Assam and the Assam–North Bengal border region",
    craft: "Dokhona and aronai weaving, bamboo craft",
    imageFile: "A Boro woman in traditional dress.jpg",
    fallbackImage: "/images/culture/gamosa-assam.jpg",
    summary:
      "Mech is a community identity of western Assam, closely related to broader Boro/Bodo histories.",
    story:
      "The terms Mech and Boro/Bodo have been used differently across regions and historical sources, and community self-identification is not uniform. Language and cultural practices overlap with Boro traditions, including weaving and seasonal festivals.",
    foods: ["Rice and locally grown vegetables", "Fish and meat dishes", "Seasonal rice-based foods"],
    languages: ["Boro and related local varieties", "Assamese"],
    traditions: ["Bwisagu and related seasonal observances", "Handloom weaving", "Community music and dance"],
    places: ["Western Assam", "Kokrajhar and neighbouring districts", "Assam–North Bengal border communities"],
    query: "Mech people traditional dress Assam Boro",
    photoAlt: "A woman in Boro-style traditional dress",
  },
  {
    id: "kuki",
    name: "Kuki community",
    altNames: ["Kuki-Zo", "Chin-Kuki-Mizo"],
    category: "barak",
    scope: "Umbrella identity",
    region: "Hill districts and Barak Valley areas of southern Assam",
    craft: "Woven puan and shawls, bamboo and cane craft",
    imageFile: "Kuki family in traditional attire at the Mim Kut festival, Nagaland.jpg",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Kuki communities are diverse, with cultural life shaped by village traditions, weaving and music.",
    story:
      "Kuki is an umbrella identity for related but distinct communities across Northeast India. Chavang Kut is a major post-harvest festival for many Kuki groups; languages, dress and customs vary between communities and localities.",
    foods: ["Rice", "Smoked meat and fish", "Bamboo shoots and seasonal greens"],
    languages: ["Kuki-Chin languages", "Assamese and other regional languages"],
    traditions: ["Chavang Kut", "Community songs and dances", "Handloom weaving"],
    places: ["Dima Hasao", "Karbi Anglong", "Barak Valley settlements"],
    query: "Kuki people traditional dress Assam",
    photoAlt: "Kuki family in traditional attire at the Mim Kut festival",
  },
  {
    id: "naga",
    name: "Naga communities",
    altNames: ["Naga"],
    category: "himalayanNaga",
    scope: "Umbrella identity",
    region: "Assam's hill and border areas adjoining Nagaland",
    craft: "Distinctive woven shawls, basketry and woodcraft",
    imageFile: "Aao Naga man and woman.jpg",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Naga is an umbrella term for many communities, each with its own language, dress and customs.",
    story:
      "Naga communities live across several Northeast Indian states, including Assam's border and hill areas. Festivals and ceremonial clothing are specific to individual Naga peoples; harvest celebrations, weaving, music and community feasts are important across many communities.",
    foods: ["Rice", "Smoked or fermented foods", "Bamboo shoots and local greens"],
    languages: ["Naga languages (varies by community)", "Assamese and other regional languages"],
    traditions: ["Community-specific harvest festivals", "Traditional weaving", "Music and dance"],
    places: ["Assam–Nagaland border areas", "Karbi Anglong and Dima Hasao", "Naga cultural centres"],
    query: "Naga people traditional dress Assam",
    photoAlt: "Ao Naga man and woman in traditional dress",
  },
  {
    id: "singpho",
    name: "Singpho community",
    altNames: ["Jinghpaw"],
    category: "tai",
    region: "Tinsukia and eastern Upper Assam near the Arunachal border",
    craft: "Traditional tea cultivation, bamboo work and handwoven clothing",
    imageFile: "Singpho Dress..jpg",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Singpho heritage is part of eastern Assam's cultural landscape and its early tea history.",
    story:
      "The Singpho are related to the Jinghpaw peoples of the wider region. Singpho communities are associated with early tea cultivation in Assam, and local identity is maintained through language, village traditions and Buddhist practice among many families.",
    foods: ["Rice", "Fish and seasonal greens", "Locally prepared tea and fermented foods"],
    languages: ["Singpho (Jinghpaw)", "Assamese"],
    traditions: ["Community New Year observances", "Buddhist practice", "Tea-growing heritage"],
    places: ["Tinsukia", "Margherita", "Eastern Assam villages"],
    query: "Singpho people traditional dress Assam",
    photoAlt: "Singpho traditional dress",
  },
  {
    id: "khamti",
    danceId: "tai-khamti",
    name: "Khamti (Tai Khamti) community",
    altNames: ["Khamti", "Tai Khamti"],
    category: "tai",
    region: "Eastern Assam and settlements around Sadiya and Tinsukia",
    craft: "Tai manuscripts, handloom textiles, bamboo and woodwork",
    imageUrl: "https://www.discovereast.in/wp-content/uploads/2020/08/IMG_20200807_194735.jpg",
    fallbackImage: "/images/culture/namphake-buddhist-temple.jpg",
    summary:
      "Tai Khamti culture is marked by its language, Theravada Buddhist traditions and community festivals.",
    story:
      "Khamti communities in the Assam-Arunachal region preserve Tai language and Buddhist heritage. Sangken, the water festival marking the Tai new year, is celebrated with visits, prayer and community gatherings; customs vary between settlements.",
    foods: ["Rice and fish", "Herb-rich dishes", "Fermented foods and seasonal vegetables"],
    languages: ["Tai Khamti", "Assamese and other regional languages"],
    traditions: ["Sangken", "Theravada Buddhist observances", "Tai manuscript traditions"],
    places: ["Sadiya", "Tinsukia", "Eastern Assam Buddhist monasteries"],
    query: "Tai Khamti people traditional dress Assam",
    photoAlt: "Tai Khamti people in traditional attire",
  },
  {
    id: "thengal-kachari",
    name: "Thengal Kachari community",
    altNames: ["Thengal Kachari"],
    category: "bodoKachari",
    region: "Jorhat, Golaghat and Upper Assam",
    craft: "Handloom weaving, agriculture and household craft",
    imageUrl: "https://morungexpress.com/sites/default/files/field/image/1caption%20take.jpg",
    fallbackImage: "/images/culture/sualkuchi-handloom.jpg",
    summary:
      "The Thengal Kachari are an Upper Assam Kachari community whose Bihu songs and spring observances are part of their public identity.",
    story:
      "The Thengal Kachari trace their roots to the wider Kachari groups of Assam and have lived for generations in the Jorhat–Golaghat region. Tora Chira Bihu, observed shortly before Bohag Bihu, is a distinctive community tradition in which the tora plant is collected and celebrated with songs and dance.",
    foods: ["Rice and fish", "Pitha and laru", "Seasonal greens and bamboo shoot"],
    languages: ["Assamese", "Thengal Kachari speech (under verification)"],
    traditions: ["Tora Chira Bihu", "Bohag Bihu", "Handloom weaving"],
    places: ["Jorhat", "Golaghat", "Upper Assam villages"],
    query: "Thengal Kachari Assam community",
    photoAlt: "Thengal Kachari people in traditional dress",
  },
  {
    id: "hojai",
    name: "Hojai community",
    altNames: ["Hojai"],
    category: "bodoKachari",
    region: "Hojai, Nagaon and central Assam",
    craft: "Agriculture, weaving and small-scale craft",
    imageUrl: "https://nedaindia.wordpress.com/wp-content/uploads/2021/08/hio.jpg?w=630",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "The Hojai are an Assamese-speaking Muslim community of central Assam, closely linked with the history of the Hojai region.",
    story:
      "The Hojai community has deep roots in the Nagaon–Hojai area of central Assam. Community life shares much with wider Assamese traditions, including Bihu, religious observance and Assamese-language cultural expression. A distinct Hojai dance tradition could not be verified from the sources consulted.",
    foods: ["Rice and fish", "Meat and seasonal vegetables", "Pitha and other rice-based foods"],
    languages: ["Assamese", "Local speech varieties"],
    traditions: ["Bohag Bihu", "Religious observances", "Community feasting"],
    places: ["Hojai", "Nagaon", "Central Assam"],
    query: "Hojai community Assam culture",
    photoAlt: "Bihu dance, a shared Assamese tradition",
  },
  {
    id: "chutia",
    name: "Chutia community",
    altNames: ["Chutiya"],
    category: "bodoKachari",
    region: "Sivasagar, Jorhat, Dibrugarh, Lakhimpur and Upper Assam",
    craft: "Handloom weaving, silk and cotton textiles",
    imageFile: "Women of Chutia tribe preparing pithas.jpg",
    fallbackImage: "/images/culture/assamese-pitha.jpg",
    summary:
      "Chutia heritage is associated with the medieval Chutia kingdom and with Deodhani, a ritual dance in honour of the serpent goddess Manasa.",
    story:
      "The Chutia are one of the older communities of Upper Assam, with a history linked to the Chutia kingdom centred in the Sadiya region. Their cultural life includes handloom weaving, rice-based festival foods and the Deodhani ritual performed during Manasa Puja.",
    foods: ["Rice and fish", "Pitha and rice cakes", "Seasonal greens and bamboo shoot"],
    languages: ["Assamese", "Chutia (historical speech, under verification)"],
    traditions: ["Deodhani", "Manasa Puja", "Bohag Bihu"],
    places: ["Sivasagar", "Jorhat", "Sadiya and Upper Assam"],
    query: "Chutia people Assam traditional dress",
    photoAlt: "Chutia women preparing pithas",
  },
  {
    id: "tai-ahom",
    name: "Tai Ahom community",
    altNames: ["Ahom", "Tai Ahom"],
    category: "tai",
    region: "Sivasagar, Jorhat, Dibrugarh, Golaghat and Upper Assam",
    craft: "Handloom weaving, Tai manuscripts and metalwork heritage",
    imageFile: "Ahom dress 2.jpg",
    fallbackImage: "/images/culture/rang-ghar.jpg",
    summary:
      "Tai Ahom heritage shaped Assam's medieval kingdom and survives in language revival, weaving, Me-Dam-Me-Phi and community dance.",
    story:
      "The Tai Ahom entered Assam in the 13th century and established a kingdom that lasted for nearly six centuries. Their legacy includes the Tai Ahom language and script, royal chronicles, architecture such as the Rang Ghar, and observances such as Me-Dam-Me-Phi, when ancestors are remembered.",
    foods: ["Rice and fish", "Pork and smoked meats", "Traditional rice-based dishes"],
    languages: ["Assamese", "Tai Ahom (revived, under verification)"],
    traditions: ["Me-Dam-Me-Phi", "Bohag Bihu", "Lai Lung Kham dance"],
    places: ["Sivasagar", "Jorhat", "Dibrugarh and Upper Assam"],
    query: "Tai Ahom people traditional dress Assam",
    photoAlt: "Tai Ahom people in traditional dress",
  },
  {
    id: "moran",
    name: "Moran community",
    altNames: ["Moran"],
    category: "bodoKachari",
    region: "Tinsukia, Dibrugarh, Sivasagar and Upper Assam",
    craft: "Handloom weaving and agriculture",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/42/Moran_Bihu_Dance.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "The Moran are an Upper Assam community known for Rati Bihu, a night-time Bihu tradition with songs and dance.",
    story:
      "The Moran have long been part of the social and cultural landscape of Upper Assam. Rati Bihu, performed at night around Bohag Bihu, is their best-known dance tradition, while weaving, rice cultivation and Assamese-language cultural life remain central.",
    foods: ["Rice and fish", "Pitha and laru", "Seasonal vegetables"],
    languages: ["Assamese", "Moran speech (under verification)"],
    traditions: ["Rati Bihu", "Bohag Bihu", "Handloom weaving"],
    places: ["Tinsukia", "Dibrugarh", "Sivasagar"],
    query: "Moran community Assam culture",
    photoAlt: "Bihu dance, a shared Assamese tradition",
  },
  {
    id: "matak",
    name: "Matak community",
    altNames: ["Muttuck", "Moamoria"],
    category: "bodoKachari",
    region: "Dibrugarh, Tinsukia and Upper Assam",
    craft: "Weaving, agriculture and Vaishnavite craft traditions",
    imageUrl: "https://northeastindiawiki.wordpress.com/wp-content/uploads/2020/06/fb_img_1592801801853.jpg?w=640",
    fallbackImage: "/images/culture/bordowa-than.jpg",
    summary:
      "The Matak are a Vaishnavite community of Upper Assam whose religious life is closely tied to Bhaona and satra traditions.",
    story:
      "The Matak, also called Moamoria, are associated with the Neo-Vaishnavite movement of Assam and with the historic Moamoria rebellion. Bhaona, devotional theatre with dance and music, is central to their religious performance culture, though a distinct Matak community dance could not be verified.",
    foods: ["Rice and fish", "Vegetarian satra-style meals", "Seasonal greens"],
    languages: ["Assamese"],
    traditions: ["Bhaona", "Vaishnavite observances", "Satra festivals"],
    places: ["Dibrugarh", "Tinsukia", "Upper Assam satras"],
    query: "Matak Moamoria Assam community",
    photoAlt: "Historical portrait of Moamoria or Muttuck people of Assam",
  },
  {
    id: "koch-rajbongshi",
    name: "Koch-Rajbongshi community",
    altNames: ["Koch Rajbongshi", "Rajbongshi"],
    category: "bodoKachari",
    region: "Dhubri, Kokrajhar, Bongaigaon, Goalpara and western Assam",
    craft: "Handloom weaving, pottery and agriculture",
    imageFile: "Koch Rajbongshi Community in Assam,India.jpg",
    fallbackImage: "/images/culture/sualkuchi-handloom.jpg",
    summary:
      "Koch-Rajbongshi culture is linked to the Koch dynasty and is known for Goalini Nritya, a graceful dance of milkmaids.",
    story:
      "The Koch-Rajbongshi trace their heritage to the Koch kingdom of western Assam and neighbouring regions. Goalini Nritya, performed by women, depicts the daily life of milkmaids, while Kartika Puja and Bihu remain important community celebrations.",
    foods: ["Rice and fish", "Pitha and rice cakes", "Milk-based sweets"],
    languages: ["Rajbongshi (Kamatapuri)", "Assamese"],
    traditions: ["Goalini Nritya", "Kartika Puja", "Bohag Bihu"],
    places: ["Dhubri", "Kokrajhar", "Goalpara and western Assam"],
    query: "Koch Rajbongshi people Assam traditional dress",
    photoAlt: "Koch-Rajbongshi community members in Assam",
  },
  {
    id: "jaintia",
    name: "Jaintia (Pnar) community",
    altNames: ["Pnar", "Jaintia"],
    category: "hills",
    region: "Assam–Meghalaya border, especially around Jowai and the Jaintia Hills",
    craft: "Handloom weaving, cane and bamboo work",
    imageFile: "Behdienkhlam Festival in Jaintia Hills 5.jpg",
    fallbackImage: "/images/culture/cane-bamboo-crafts.jpg",
    summary:
      "Jaintia (Pnar) cultural life is known for Behdienkhlam and the lively Lahoo dance.",
    story:
      "The Jaintia or Pnar are closely related to the Khasi and live across the Jaintia Hills and the Assam–Meghalaya border. Behdienkhlam, a major festival seeking protection from disease and misfortune, is celebrated with the Lahoo dance; Chad Sukra is another important observance.",
    foods: ["Rice", "Fish and meat", "Local greens and bamboo shoot"],
    languages: ["Pnar (Jaintia)", "Khasi", "Assamese"],
    traditions: ["Behdienkhlam", "Chad Sukra", "Lahoo dance"],
    places: ["Jowai", "Jaintia Hills", "Assam–Meghalaya border"],
    query: "Jaintia Pnar people traditional dress",
    photoAlt: "Behdienkhlam festival in the Jaintia Hills",
  },
  {
    id: "tea-tribes",
    name: "Tea Tribes / Adivasi communities",
    altNames: ["Tea garden communities", "Adivasi"],
    category: "adivasi",
    scope: "Umbrella identity",
    region: "Tea-growing districts of Upper and Central Assam",
    craft: "Tea cultivation, weaving and household craft",
    imageFile: "Tea Tribe Dance of Assam.jpg",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Tea Tribes or Adivasi is an umbrella identity for communities brought to Assam's tea gardens, whose shared Jhumur dance is a symbol of labour and belonging.",
    story:
      "From the 19th century, labourers from present-day Jharkhand, Odisha, Chhattisgarh and West Bengal were brought to work in Assam's tea gardens. Their descendants form Assam's Tea Tribes/Adivasi communities, with distinct languages and festivals but a shared history and the Jhumur dance tradition.",
    foods: ["Rice and dal", "Seasonal vegetables", "Tea and rice-based snacks"],
    languages: ["Sadri", "Hindi", "Assamese", "Community languages such as Santhali, Mundari and Kurukh"],
    traditions: ["Jhumur", "Karam", "Tusu", "Bohag Bihu"],
    places: ["Dibrugarh", "Tinsukia", "Sivasagar and tea-growing districts"],
    query: "Tea tribes Adivasi Assam Jhumur dance",
    photoAlt: "Tea tribe dance of Assam",
  },
  {
    id: "santhal",
    name: "Santhal community",
    altNames: ["Santal"],
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    craft: "Weaving, agriculture and household craft",
    imageFile: "Baha Dance by Santhal tribe.jpg",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Santhal cultural life follows the agricultural year, with Sohrai, Baha and Karam dances.",
    story:
      "The Santhal are one of the largest Adivasi communities in eastern India, and many Santhal families live in Assam's tea-growing districts. Their festivals follow the agricultural and forest calendar, and group dances with drums and flutes are central to community celebrations.",
    foods: ["Rice", "Fish and meat", "Seasonal greens and tubers"],
    languages: ["Santhali", "Assamese", "Hindi"],
    traditions: ["Sohrai", "Baha", "Karam"],
    places: ["Tea gardens of Upper Assam", "Adivasi settlements", "Central Assam"],
    query: "Santhal tribe Assam dance",
    photoAlt: "Baha dance by Santhal tribe",
  },
  {
    id: "munda",
    name: "Munda community",
    altNames: ["Munda"],
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    craft: "Agriculture, weaving and basketry",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRxikF0GCaBSDSJd6j3eG0EKxwMfDKfi6sudQquEGcP2c8F2jGPuUktBA&s=10",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Karam is the central dance festival of the Munda, honouring the Karam spirit and seeking a good harvest.",
    story:
      "The Munda are an Adivasi community with roots in the Chotanagpur region, and many Munda families live in Assam's tea garden areas. The Karam festival, with its circle dances and songs, is a major expression of Munda cultural life.",
    foods: ["Rice", "Dal and seasonal vegetables", "Fish or meat on festival days"],
    languages: ["Mundari", "Assamese", "Hindi"],
    traditions: ["Karam", "Sohrai", "Community dance and music"],
    places: ["Tea gardens of Assam", "Adivasi settlements", "Central Assam"],
    query: "Munda tribe Assam dance",
    photoAlt: "Munda woman in traditional dress",
  },
  {
    id: "oraon",
    name: "Oraon (Kurukh) community",
    altNames: ["Kurukh", "Oraon"],
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    craft: "Agriculture, weaving and household craft",
    imageFile: "Kurukh dance of Oraons .jpg",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Oraon (Kurukh) traditions include Karma, Sarhul and Phagu dances tied to the agricultural year.",
    story:
      "The Oraon, who speak Kurukh, have roots in the Chotanagpur plateau and a long presence in Assam's tea-growing districts. Sarhul welcomes spring, Karma honours the Karam spirit, and Phagu marks the seasonal cycle with dance and song.",
    foods: ["Rice", "Dal and greens", "Fish or meat on festival days"],
    languages: ["Kurukh (Oraon)", "Assamese", "Hindi"],
    traditions: ["Karma", "Sarhul", "Phagu"],
    places: ["Tea gardens of Assam", "Adivasi settlements", "Central Assam"],
    query: "Oraon Kurukh tribe Assam dance",
    photoAlt: "Kurukh dance of the Oraon people",
  },
  {
    id: "kharia",
    name: "Kharia community",
    altNames: ["Kharia"],
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    craft: "Agriculture, weaving and basketry",
    imageFile: "Kharia Tribal ladies.jpg",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Karam is the best-documented Kharia dance tradition, with local variations across villages.",
    story:
      "The Kharia are an Adivasi community with roots in eastern India, and Kharia families are part of Assam's tea garden society. Karam is their best-documented dance festival, though details vary between villages and need further documentation.",
    foods: ["Rice", "Dal and seasonal vegetables", "Fish or meat on festival days"],
    languages: ["Kharia", "Assamese", "Hindi"],
    traditions: ["Karam", "Sohrai", "Village festivals"],
    places: ["Tea gardens of Assam", "Adivasi settlements", "Central Assam"],
    query: "Kharia tribe Assam dance",
    photoAlt: "Kharia tribal women in traditional dress",
  },
  {
    id: "ho",
    name: "Ho community",
    altNames: ["Ho"],
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    craft: "Agriculture, weaving and household craft",
    imageFile: "Ho people.jpg",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Mage, Sohrai and Dasang are among the dance traditions of the Ho community.",
    story:
      "The Ho are an Adivasi community with roots in the Kolhan region of eastern India, and Ho families live in Assam's tea-growing districts. Mage, a spring festival, and Sohrai, a harvest observance, are marked with group dance and song.",
    foods: ["Rice", "Dal and greens", "Fish or meat on festival days"],
    languages: ["Ho", "Assamese", "Hindi"],
    traditions: ["Mage", "Sohrai", "Dasang"],
    places: ["Tea gardens of Assam", "Adivasi settlements", "Central Assam"],
    query: "Ho tribe Assam dance",
    photoAlt: "Ho people in traditional dress",
  },
  {
    id: "bhumij",
    name: "Bhumij community",
    altNames: ["Bhumij"],
    category: "adivasi",
    region: "Tea gardens and Adivasi settlements across Assam",
    craft: "Agriculture, weaving and household craft",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Firkal_slowly_decaying_martial_dance_of_ChotaNagpur_of_Jharkhand_performed_at_Central_Park_Delhi_IMG_0934_02.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Bhumij communities share Karam and Sohrai dance traditions with neighbouring Adivasi groups, while specific details need further documentation.",
    story:
      "The Bhumij are an Adivasi community with roots in the Chotanagpur region and a presence in Assam's tea garden areas. Karam and Sohrai are shared festival traditions, and Bhumij-specific dance documentation remains limited.",
    foods: ["Rice", "Dal and seasonal vegetables", "Fish or meat on festival days"],
    languages: ["Bhumij", "Assamese", "Hindi"],
    traditions: ["Karam", "Sohrai", "Village festivals"],
    places: ["Tea gardens of Assam", "Adivasi settlements", "Central Assam"],
    query: "Bhumij tribe Assam dance",
    photoAlt: "Bhumij household worship",
  },
  {
    id: "bengali",
    name: "Bengali community",
    altNames: ["Bengali Hindu", "Bengali Muslim"],
    category: "barak",
    scope: "Linguistic community",
    region: "Barak Valley (Cachar, Karimganj, Hailakandi) and other parts of Assam",
    craft: "Weaving, pottery and agriculture",
    imageUrl: "https://www.shutterstock.com/shutterstock/videos/1109181167/thumb/1.jpg?ip=x480",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Bengali cultural life in Assam spans language, literature, Durga Puja and folk dances such as Bou Nach, Dhamail and Gambhira.",
    story:
      "Bengali is a major language of the Barak Valley and is also spoken in other parts of Assam. Community life includes Durga Puja and other festivals, a strong literary tradition, and folk performance forms such as Bou Nach, Dhamail and Gambhira.",
    foods: ["Rice and fish", "Dal and vegetables", "Sweets and pitha"],
    languages: ["Bengali", "Assamese"],
    traditions: ["Durga Puja", "Bou Nach", "Dhamail", "Gambhira"],
    places: ["Cachar", "Karimganj", "Hailakandi and the Barak Valley"],
    query: "Bengali community Assam culture",
    photoAlt: "Bengali folk martial dance Raibenshe",
  },
  {
    id: "nepali",
    name: "Nepali / Gorkha community",
    altNames: ["Gorkha", "Nepali"],
    category: "himalayanNaga",
    scope: "Linguistic community",
    region: "Sonitpur, Nagaon, Karbi Anglong, Tinsukia and other districts",
    craft: "Agriculture, weaving and dairy farming",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYJET4iTFNXTfyVYGiuafSZS4yTSK3KpcojJjWnL9dKtxrInHuVx1Sll8D&s=10",
    fallbackImage: "/images/culture/bihu-dance.jpg",
    summary:
      "Nepali/Gorkha cultural life in Assam is known for Maruni and Dohori, along with Dashain and Tihar.",
    story:
      "Nepali-speaking Gorkha families have lived in Assam for generations, especially in Sonitpur, Nagaon, Karbi Anglong and Tinsukia. Maruni, performed with the madal, and Dohori, a conversational song and dance, are central to festival and wedding celebrations.",
    foods: ["Rice and dal", "Momo and thukpa", "Seasonal greens and dairy"],
    languages: ["Nepali", "Assamese"],
    traditions: ["Dashain", "Tihar", "Maruni", "Dohori"],
    places: ["Sonitpur", "Nagaon", "Karbi Anglong and Tinsukia"],
    query: "Nepali Gorkha community Assam culture",
    photoAlt: "Maruni dance",
  },
  {
    id: "manipuri",
    name: "Manipuri community",
    altNames: ["Meitei", "Bishnupriya Manipuri"],
    category: "barak",
    region: "Cachar, Hailakandi, Karimganj and the Barak Valley",
    craft: "Handloom weaving, dance and music traditions",
    imageFile: "Rasa Lila in Manipuri dance style.jpg",
    fallbackImage: "/images/culture/sattriya-performance.jpg",
    summary:
      "Manipuri communities in Assam preserve Ras Leela, Pung Cholom and Thang-Ta as living classical traditions.",
    story:
      "Manipuri communities, including Meitei and Bishnupriya Manipuri families, live across the Barak Valley and other parts of Assam. Their cultural life is known for Ras Leela, the devotional drum dance Pung Cholom, and the martial art Thang-Ta.",
    foods: ["Rice and fish", "Vegetables and herbs", "Traditional Manipuri dishes"],
    languages: ["Manipuri (Meitei)", "Bishnupriya Manipuri", "Assamese"],
    traditions: ["Ras Leela", "Pung Cholom", "Thang-Ta", "Ras festivals"],
    places: ["Cachar", "Hailakandi", "Karimganj and the Barak Valley"],
    query: "Manipuri community Assam dance",
    photoAlt: "Rasa Lila in Manipuri dance style",
  },
  {
    id: "tai-phake",
    name: "Tai Phake community",
    altNames: ["Tai Phake", "Phakial"],
    category: "tai",
    region: "Dibrugarh, Tinsukia and eastern Assam",
    craft: "Handloom weaving, agriculture and bamboo work",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMm7HK3EGOcDxNevZUq6cKOuy139uNmjf5ydLSAAuCovx6BCsKBV397E1F&s=10",
    fallbackImage: "/images/culture/namphake-buddhist-temple.jpg",
    summary:
      "Tai Phake cultural life centres on Theravada Buddhism and the Poi Sangken new year festival, with community music and dance.",
    story:
      "The Tai Phake are one of the smaller Tai communities of Assam, with villages such as Namphake near Dibrugarh. Theravada Buddhism shapes their calendar, and Poi Sangken, the water festival, is celebrated with prayer, music and community gatherings. A specific Tai Phake dance name could not be verified.",
    foods: ["Rice and fish", "Herb-rich dishes", "Fermented and seasonal foods"],
    languages: ["Tai Phake", "Assamese"],
    traditions: ["Poi Sangken", "Theravada Buddhist observances", "Poi Lu-fra"],
    places: ["Namphake", "Dibrugarh", "Tinsukia"],
    query: "Tai Phake community Assam",
    photoAlt: "Namphake Buddhist Temple in Assam",
  },
  {
    id: "tai-aiton",
    name: "Tai Aiton community",
    altNames: ["Tai Aiton", "Aiton"],
    category: "tai",
    region: "Jorhat, Golaghat, Sivasagar and eastern Assam",
    craft: "Handloom weaving, agriculture and bamboo work",
    imageUrl: "https://media.assettype.com/homegrown/import/book/11194-tbclwkrjen-1554906288.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true",
    fallbackImage: "/images/culture/namphake-buddhist-temple.jpg",
    summary:
      "The Tai Aiton preserve Tai language and Theravada Buddhist festivals; a distinct traditional dance name could not be verified.",
    story:
      "The Tai Aiton are one of Assam's smaller Tai communities, with villages in the Jorhat–Golaghat–Sivasagar belt. They maintain Tai speech and Theravada Buddhist practice, and festivals such as Sangken include community music and dance. A distinct Aiton dance name could not be confirmed.",
    foods: ["Rice and fish", "Herb-rich dishes", "Seasonal vegetables"],
    languages: ["Tai Aiton", "Assamese"],
    traditions: ["Sangken", "Buddhist observances", "Community music and dance"],
    places: ["Jorhat", "Golaghat", "Sivasagar"],
    query: "Tai Aiton community Assam",
    photoAlt: "Buddhist monastery in a Tai village in Assam",
  },
  {
    id: "tai-turung",
    name: "Tai Turung community",
    altNames: ["Tai Turung", "Turung"],
    category: "tai",
    region: "Jorhat, Golaghat and eastern Assam",
    craft: "Handloom weaving, agriculture and bamboo work",
    imageFile: "Tai Turung Community,Assam,India.jpg",
    fallbackImage: "/images/culture/namphake-buddhist-temple.jpg",
    summary:
      "The Tai Turung are one of Assam's Tai communities, maintaining Buddhist festivals and community music; a distinct dance name could not be verified.",
    story:
      "The Tai Turung are a small Tai community of eastern Assam. Their cultural life includes Theravada Buddhist festivals and community music, while specific dance traditions need further documentation.",
    foods: ["Rice and fish", "Herb-rich dishes", "Seasonal vegetables"],
    languages: ["Tai Turung", "Assamese"],
    traditions: ["Buddhist festivals", "Community music", "Handloom weaving"],
    places: ["Jorhat", "Golaghat", "Eastern Assam"],
    query: "Tai Turung community Assam",
    photoAlt: "Tai Turung community members in Assam",
  },
  {
    id: "tai-khamyang",
    name: "Tai Khamyang community",
    altNames: ["Tai Khamyang", "Khamyang"],
    category: "tai",
    region: "Sivasagar, Jorhat, Tinsukia and eastern Assam",
    craft: "Handloom weaving, agriculture and bamboo work",
    imageFile: "Khamyang men.jpg",
    fallbackImage: "/images/culture/namphake-buddhist-temple.jpg",
    summary:
      "Tai Khamyang cultural life is centred on Theravada Buddhism and festivals such as Poi Maiko Sumfai and Sangken.",
    story:
      "The Tai Khamyang are a small Tai community of eastern Assam with a distinct language and Theravada Buddhist heritage. Poi Maiko Sumfai and Sangken include music, dance and community feasting; a specific Khamyang dance name could not be verified.",
    foods: ["Rice and fish", "Herb-rich dishes", "Seasonal vegetables"],
    languages: ["Tai Khamyang", "Assamese"],
    traditions: ["Poi Maiko Sumfai", "Sangken", "Buddhist observances"],
    places: ["Sivasagar", "Jorhat", "Tinsukia"],
    query: "Tai Khamyang community Assam",
    photoAlt: "Khamyang men in traditional dress",
  },
];

const buildCommunity = (profile) => {
  const danceRecord = danceById.get(profile.danceId || profile.id);
  const dances = danceRecord?.dances || [];

  return {
    id: profile.id,
    name: profile.name,
    altNames: profile.altNames || danceRecord?.altNames || [],
    category: profile.category || danceRecord?.category || "brahmaputra",
    scope: profile.scope || danceRecord?.scope || "Community",
    region: profile.region || danceRecord?.region || "",
    craft: profile.craft,
    imageUrl:
      profile.imageUrl || (profile.imageFile ? commons(profile.imageFile) : ""),
    fallbackImage: profile.fallbackImage,
    imageSearchUrl: search(
      profile.query || `${danceRecord?.name || profile.name} Assam community culture`
    ),
    photoAlt:
      profile.photoAlt ||
      danceRecord?.photo?.alt ||
      `${profile.name} in traditional dress`,
    photoCredit: profile.photoCredit || "Wikimedia Commons",
    summary: profile.summary || danceRecord?.summary || "",
    story: profile.story,
    foods: profile.foods,
    languages: profile.languages,
    traditions: profile.traditions,
    places: profile.places,
    dances,
    clothing: danceRecord?.clothing || VERIFICATION_LABEL,
    references: danceRecord?.references || [],
    danceVerified: dances.every((item) => item.status !== "verification"),
  };
};

export const ASSAM_COMMUNITIES = PROFILES.map(buildCommunity);

export const COMMUNITY_CATEGORY_ORDER = DANCE_CATEGORY_ORDER;

export { VERIFICATION_LABEL };

export default ASSAM_COMMUNITIES;
