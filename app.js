const STORAGE_KEY = "local-five-rankings-v2";
const CONFIG = {
  ownerEmail: "mishaberman@gmail.com",
  gaMeasurementId: "",
  metaPixelId: "",
  siteUrl: "",
  ...(window.MILD_TAKES_CONFIG || {}),
  ...(window.LOCAL_FIVE_CONFIG || {})
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
let authClient = null;
let authSession = null;
let authUser = null;
let authReady = false;
const IMPORTED_SEED = window.LOCAL_FIVE_IMPORTED_SEED || {
  places: [],
  sources: [],
  creatorRankings: { creators: [], rankings: [] },
  normalizedCreatorRows: []
};
const importedSourceById = new Map((IMPORTED_SEED.sources || []).map((source) => [source.sourceId, source]));
const SHOW_UNVERIFIED_CREATOR_NAMES = false;
const categoryAliases = {
  date_night: "date-night",
  doughnuts: "donuts",
  fried_chicken: "fried-chicken",
  ramen: "ramen-noodles",
  noodles: "ramen-noodles"
};
const launchCategoryLabels = {
  pizza: "Pizza",
  teriyaki: "Teriyaki",
  tacos: "Tacos",
  bbq: "BBQ",
  burgers: "Burgers",
  coffee: "Coffee",
  bakery: "Bakery",
  brunch: "Brunch",
  pho: "Pho",
  "ramen-noodles": "Ramen + Noodles",
  "date-night": "Date Night",
  sandwiches: "Sandwiches",
  donuts: "Donuts",
  "fried-chicken": "Fried Chicken",
  "chicken-sandwiches": "Chicken Sandwiches",
  cookies: "Cookies",
  bagels: "Bagels"
};
const placeIdAliases = {};

const cities = [
  {
    id: "seattle",
    name: "Seattle",
    state: "WA",
    tagline: "The first Local Five city",
    description: "Rank the food spots locals actually argue about."
  }
];

const categories = [
  {
    slug: "pizza",
    name: "Pizza",
    day: "Featured",
    description: "The easiest local food argument to start.",
    accent: "#d95f43"
  },
  {
    slug: "teriyaki",
    name: "Teriyaki",
    day: "Wednesday",
    description: "Seattle comfort food with neighborhood loyalty.",
    accent: "#c9862f"
  },
  {
    slug: "tacos",
    name: "Tacos",
    day: "Friday",
    description: "Quick stops, sit-down favorites, and late-night answers.",
    accent: "#c7563d"
  },
  { slug: "bbq", name: "BBQ", day: "Smoke day", description: "Brisket, ribs, sides, and strong opinions.", accent: "#8f5a3f" },
  { slug: "pho", name: "Pho", day: "Rainy day", description: "Broth-first local comfort.", accent: "#9f7a36" },
  { slug: "burgers", name: "Burgers", day: "Weekend", description: "Classic, smash, fancy, and late-night.", accent: "#8d5f42" },
  { slug: "donuts", name: "Donuts", day: "Treat run", description: "Glazed loyalty and pastry arguments.", accent: "#b56e8d" },
  {
    slug: "fried-chicken",
    name: "Fried Chicken",
    day: "Crunch time",
    description: "Crunchy, juicy, spicy, saucy, and not subtle.",
    accent: "#c67730"
  },
  {
    slug: "chicken-sandwiches",
    name: "Chicken Sandwiches",
    day: "Lunch fight",
    description: "Crispy sandwiches that become group-chat evidence.",
    accent: "#bd7542"
  },
  { slug: "cookies", name: "Cookies", day: "Sweet take", description: "Tiny dessert, huge certainty.", accent: "#9e6b47" },
  { slug: "bagels", name: "Bagels", day: "Morning take", description: "The boiled-and-baked Seattle debate.", accent: "#a8794c" },
  { slug: "coffee", name: "Coffee", day: "Morning", description: "The regular spots people defend.", accent: "#6d6756" },
  { slug: "brunch", name: "Brunch", day: "Sunday", description: "Worth the wait, or not.", accent: "#b97844" },
  { slug: "bakery", name: "Bakery", day: "Treat run", description: "Pastries, bread, and sweet opinions.", accent: "#a86758" },
  { slug: "ramen-noodles", name: "Ramen + Noodles", day: "Cold night", description: "Bowls that fix the weather.", accent: "#8f6fb0" },
  {
    slug: "date-night",
    name: "Date Night",
    day: "Thursday",
    description: "Low-pressure restaurants that still feel considered.",
    accent: "#4b75bb"
  }
];

let places = [
  p("moto", "Moto Pizza", "pizza", "West Seattle"),
  p("delancey", "Delancey", "pizza", "Ballard"),
  p("big-marios", "Big Mario's", "pizza", "Capitol Hill"),
  p("stevies-famous", "Stevie's Famous", "pizza", "Beacon Hill"),
  p("dinos", "Dino's Tomato Pie", "pizza", "Capitol Hill"),
  p("bar-del-corso", "Bar del Corso", "pizza", "Beacon Hill"),
  p("serious-pie", "Serious Pie", "pizza", "Downtown"),
  p("lupo", "Lupo", "pizza", "Fremont"),
  p("roccos", "Rocco's", "pizza", "Belltown"),
  p("blotto", "Blotto", "pizza", "Capitol Hill"),
  p("windy-city-pie", "Windy City Pie", "pizza", "Phinney Ridge"),
  p("sunny-hill", "Sunny Hill", "pizza", "Ballard"),
  p("tutta-bella", "Tutta Bella", "pizza", "Multiple"),
  p("supreme", "Supreme", "pizza", "West Seattle"),
  p("proletariat", "Proletariat Pizza", "pizza", "White Center"),
  p("pagliacci", "Pagliacci Pizza", "pizza", "Multiple"),
  p("humble-pie", "Humble Pie", "pizza", "Central District"),
  p("post-alley-pizza", "Post Alley Pizza", "pizza", "Downtown"),

  p("toshis-grill", "Toshi's Teriyaki Grill", "teriyaki", "Mill Creek"),
  p("grillbird", "Grillbird", "teriyaki", "West Seattle"),
  p("yasukos", "Yasuko's Teriyaki", "teriyaki", "Interbay"),
  p("nikko", "Nikko Teriyaki", "teriyaki", "West Seattle"),
  p("nasai", "Nasai Teriyaki", "teriyaki", "University District"),
  p("toshios", "Toshio's Teriyaki", "teriyaki", "Central District"),
  p("rainier-teriyaki", "Rainier Teriyaki", "teriyaki", "Rainier Valley"),
  p("ichiban-teriyaki", "Ichiban Teriyaki", "teriyaki", "Queen Anne"),
  p("midori-teriyaki", "Midori Teriyaki", "teriyaki", "Lake City"),
  p("mikas-teriyaki", "Mika's Teriyaki", "teriyaki", "Ballard"),
  p("teriyaki-first", "Teriyaki First", "teriyaki", "Capitol Hill"),
  p("bento-world", "Bento World", "teriyaki", "Greenwood"),
  p("okinawa-teriyaki", "Okinawa Teriyaki", "teriyaki", "Queen Anne"),
  p("katsu-burger", "Katsu Burger", "teriyaki", "Georgetown"),
  p("i-love-teriyaki", "I Love Teriyaki", "teriyaki", "Multiple"),
  p("hana-teriyaki", "Hana Teriyaki", "teriyaki", "Belltown"),

  p("carmelos", "Carmelo's Tacos", "tacos", "Capitol Hill"),
  p("tacos-chukis", "Tacos Chukis", "tacos", "Multiple"),
  p("maiz", "Maiz", "tacos", "Pike Place"),
  p("el-moose", "El Moose", "tacos", "Ballard"),
  p("la-fondita", "La Fondita", "tacos", "White Center"),
  p("taco-street", "Taco Street", "tacos", "Othello"),
  p("fogones", "Fogon Cocina Mexicana", "tacos", "Capitol Hill"),
  p("asadero", "Asadero", "tacos", "Ballard"),
  p("taqueria-el-rinconsito", "Taqueria El Rinconsito", "tacos", "Multiple"),
  p("birrieria-tijuana", "Birrieria Tijuana", "tacos", "Burien"),
  p("frelard-tamales", "Frelard Tamales", "tacos", "Green Lake"),
  p("el-camion", "El Camion", "tacos", "Multiple"),
  p("sazon-d-k", "Sazon D'Kache", "tacos", "Renton"),
  p("carnitas-michoacan", "Carnitas Michoacan", "tacos", "Beacon Hill"),
  p("la-carta-de-oaxaca", "La Carta de Oaxaca", "tacos", "Ballard"),

  p("pho-bac", "Pho Bac Sup Shop", "pho", "Little Saigon"),
  p("pho-viet-anh", "Pho Viet Anh", "pho", "Lower Queen Anne"),
  p("pho-99", "Pho 99", "pho", "White Center"),
  p("ba-bar", "Ba Bar", "pho", "Capitol Hill"),
  p("than-brothers", "Pho Than Brothers", "pho", "Multiple"),
  p("rise-and-shine", "Rise and Shine", "pho", "South Lake Union"),
  p("lotus-pond", "Lotus Pond", "pho", "Rainier Valley"),
  p("pho-ha", "Pho Ha", "pho", "Shoreline"),

  p("dicks", "Dick's Drive-In", "burgers", "Multiple"),
  p("red-mill", "Red Mill Burgers", "burgers", "Phinney Ridge"),
  p("uneeda", "Uneeda Burger", "burgers", "Fremont"),
  p("lil-woodys", "Li'l Woody's", "burgers", "Multiple"),
  p("pick-quick", "Pick-Quick Drive In", "burgers", "SoDo"),
  p("burb", "Burb's Burgers", "burgers", "Montlake"),
  p("familyfriend", "Familyfriend", "burgers", "Beacon Hill"),
  p("8oz", "8oz Burger", "burgers", "Capitol Hill"),

  p("vivace", "Espresso Vivace", "coffee", "Capitol Hill"),
  p("milstead", "Milstead & Co.", "coffee", "Fremont"),
  p("victrola", "Victrola Coffee", "coffee", "Capitol Hill"),
  p("anchorhead", "Anchorhead Coffee", "coffee", "Downtown"),
  p("elm", "Elm Coffee Roasters", "coffee", "Pioneer Square"),
  p("caffe-ladro", "Caffe Ladro", "coffee", "Multiple"),
  p("boon-boona", "Boon Boona Coffee", "coffee", "Capitol Hill"),
  p("root", "Root", "coffee", "Ballard"),

  p("london-plane", "The London Plane", "brunch", "Pioneer Square"),
  p("geraldines", "Geraldine's Counter", "brunch", "Columbia City"),
  p("portage-bay", "Portage Bay Cafe", "brunch", "Multiple"),
  p("fat-hen", "The Fat Hen", "brunch", "Ballard"),
  p("lolas", "Lola", "brunch", "Downtown"),
  p("toulouse", "Toulouse Petit", "brunch", "Queen Anne"),
  p("oddfellows", "Oddfellows Cafe", "brunch", "Capitol Hill"),
  p("watson-counter", "Watson's Counter", "brunch", "Ballard"),

  p("bakery-nouveau", "Bakery Nouveau", "bakery", "Multiple"),
  p("sea-wolf", "Sea Wolf Bakers", "bakery", "Fremont"),
  p("fuji", "Fuji Bakery", "bakery", "International District"),
  p("saint-bread", "Saint Bread", "bakery", "University District"),
  p("crumble-flake", "Crumble & Flake", "bakery", "Capitol Hill"),
  p("rosellini", "Cafe Besalu", "bakery", "Ballard"),
  p("three-girls", "Three Girls Bakery", "bakery", "Pike Place"),
  p("fresh-flours", "Fresh Flours", "bakery", "Multiple"),

  p("ooink", "Ooink", "ramen", "Capitol Hill"),
  p("betsutenjin", "Ramen Danbo", "ramen", "Capitol Hill"),
  p("kizuki", "Kizuki Ramen", "ramen", "Multiple"),
  p("samurai-noodle", "Samurai Noodle", "ramen", "University District"),
  p("arashi", "Arashi Ramen", "ramen", "Ballard"),
  p("menya-musashi", "Menya Musashi", "ramen", "Capitol Hill"),
  p("yoroshiku", "Yoroshiku", "ramen", "Wallingford"),
  p("kamonegi", "Kamonegi", "ramen", "Fremont"),

  p("spinasse", "Spinasse", "date-night", "Capitol Hill"),
  p("walrus", "The Walrus and the Carpenter", "date-night", "Ballard"),
  p("canlis", "Canlis", "date-night", "Queen Anne"),
  p("musang", "Musang", "date-night", "Beacon Hill"),
  p("il-nido", "Il Nido", "date-night", "West Seattle"),
  p("homer", "Homer", "date-night", "Beacon Hill"),
  p("rockcreek", "RockCreek", "date-night", "Fremont"),
  p("the-pink-door", "The Pink Door", "date-night", "Pike Place")
];

let creators = [
  {
    slug: "sample-maya",
    displayName: "Maya Chen",
    handle: "@sample.seattlebites",
    city: "Seattle",
    bio: "Sample creator profile for testing food ranking pages.",
    optInStatus: "mock",
    publicAttributionEnabled: false,
    displayFallback: "Local Five seed list A",
    specialties: ["Pizza", "Teriyaki", "Coffee"]
  },
  {
    slug: "sample-jordan",
    displayName: "Jordan Lee",
    handle: "@sample.southendfood",
    city: "Seattle",
    bio: "Sample South Seattle food personality used for product prototyping.",
    optInStatus: "mock",
    publicAttributionEnabled: false,
    displayFallback: "Local Five seed list B",
    specialties: ["Tacos", "Pho", "Burgers"]
  },
  {
    slug: "sample-ava",
    displayName: "Ava Patel",
    handle: "@sample.weekendplates",
    city: "Seattle",
    bio: "Sample weekend guide profile for brunch, bakeries, and date-night lists.",
    optInStatus: "mock",
    publicAttributionEnabled: false,
    displayFallback: "Local Five seed list C",
    specialties: ["Brunch", "Bakery", "Date Night"]
  }
];

let seedRankings = [
  r("seed-pizza-1", "pizza", "sample-maya", ["moto", "delancey", "bar-del-corso", "dinos", "lupo"]),
  r("seed-pizza-2", "pizza", "sample-jordan", ["proletariat", "moto", "big-marios", "stevies-famous", "dinos"]),
  r("seed-pizza-3", "pizza", "admin", ["delancey", "moto", "serious-pie", "roccos", "sunny-hill"]),
  r("seed-pizza-4", "pizza", "sample-ava", ["bar-del-corso", "blotto", "delancey", "lupo", "post-alley-pizza"]),
  r("seed-pizza-5", "pizza", "admin", ["big-marios", "dinos", "moto", "windy-city-pie", "tutta-bella"]),
  r("seed-pizza-6", "pizza", "sample-maya", ["moto", "stevies-famous", "delancey", "supreme", "humble-pie"]),

  r("seed-teriyaki-1", "teriyaki", "sample-maya", ["grillbird", "yasukos", "toshios", "nasai", "nikko"]),
  r("seed-teriyaki-2", "teriyaki", "sample-jordan", ["rainier-teriyaki", "toshios", "toshis-grill", "mikas-teriyaki", "midori-teriyaki"]),
  r("seed-teriyaki-3", "teriyaki", "admin", ["toshis-grill", "grillbird", "yasukos", "nasai", "ichiban-teriyaki"]),
  r("seed-teriyaki-4", "teriyaki", "admin", ["nikko", "teriyaki-first", "okinawa-teriyaki", "bento-world", "i-love-teriyaki"]),

  r("seed-tacos-1", "tacos", "sample-jordan", ["carmelos", "tacos-chukis", "maiz", "la-fondita", "taco-street"]),
  r("seed-tacos-2", "tacos", "admin", ["el-moose", "carmelos", "asadero", "el-camion", "fogones"]),
  r("seed-tacos-3", "tacos", "sample-maya", ["maiz", "tacos-chukis", "birrieria-tijuana", "la-fondita", "carnitas-michoacan"]),
  r("seed-tacos-4", "tacos", "sample-jordan", ["taco-street", "carmelos", "taqueria-el-rinconsito", "sazon-d-k", "el-camion"]),

  r("seed-pho-1", "pho", "sample-jordan", ["pho-bac", "pho-viet-anh", "pho-99", "ba-bar", "than-brothers"]),
  r("seed-pho-2", "pho", "admin", ["pho-bac", "pho-99", "rise-and-shine", "lotus-pond", "pho-ha"]),
  r("seed-burgers-1", "burgers", "sample-jordan", ["dicks", "uneeda", "red-mill", "lil-woodys", "familyfriend"]),
  r("seed-coffee-1", "coffee", "sample-maya", ["vivace", "milstead", "boon-boona", "elm", "anchorhead"]),
  r("seed-brunch-1", "brunch", "sample-ava", ["geraldines", "fat-hen", "watson-counter", "portage-bay", "oddfellows"]),
  r("seed-bakery-1", "bakery", "sample-ava", ["bakery-nouveau", "sea-wolf", "saint-bread", "fuji", "fresh-flours"]),
  r("seed-ramen-1", "ramen", "admin", ["ooink", "betsutenjin", "menya-musashi", "kizuki", "arashi"]),
  r("seed-date-night-1", "date-night", "sample-ava", ["spinasse", "walrus", "musang", "il-nido", "homer"])
];

let drafts = {};
let nativeDrag = null;
let pointerDrag = null;

function p(id, name, category, neighborhood) {
  const normalizedCategory = normalizeCategorySlug(category);
  return {
    id,
    name,
    city: "seattle",
    category: normalizedCategory,
    categorySlugs: [normalizedCategory],
    neighborhood,
    description: "Seed place for Local Five launch testing.",
    why: "Useful seed candidate for local Top 5 debates.",
    tags: [normalizedCategory],
    styleTags: [],
    textureTags: [],
    vibeTags: [],
    bestFor: [],
    creatorMentionedBy: [],
    creatorSignals: [],
    verificationStatus: "seed_candidate_verify_with_places_api",
    safeToPublishCopy: "yes",
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Seattle, WA`)}`,
    officialUrl: "",
    sourceUrl: "",
    note: "Seed place for Local Five launch testing."
  };
}

function r(id, category, creatorSlug, placeIds) {
  const normalizedCategory = normalizeCategorySlug(category);
  return {
    id,
    city: "seattle",
    category: normalizedCategory,
    creatorSlug,
    source: creatorSlug === "admin" ? "admin_seed" : "creator_seed",
    visibility: "public",
    createdAt: "2026-05-25T00:00:00.000Z",
    placeIds
  };
}

function normalizeCategorySlug(slug = "") {
  const normalized = slug
    .toLowerCase()
    .trim()
    .replaceAll("&", "and")
    .replaceAll("+", " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return categoryAliases[slug] || categoryAliases[normalized] || normalized;
}

function normalizeName(value = "") {
  return value
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitPipe(value = "") {
  return value
    .split("|")
    .map((item) => normalizeCategorySlug(item))
    .filter(Boolean);
}

function titleCaseSlug(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function addCategoryIfMissing(slug, label = titleCaseSlug(slug)) {
  const normalized = normalizeCategorySlug(slug);
  if (!launchCategoryLabels[normalized]) return;
  if (categories.some((category) => category.slug === normalized)) return;
  categories.push({
    slug: normalized,
    name: launchCategoryLabels[normalized] || label,
    day: "New",
    description: "A new Local Five food debate from the imported seed pack.",
    accent: "#7b6bb2"
  });
}

function getPublicCreatorName(creator) {
  if (!creator) return "Curated local foodie list";
  if (creator.publicAttributionEnabled || SHOW_UNVERIFIED_CREATOR_NAMES) return creator.displayName;
  return creator.displayFallback || "Curated local foodie list";
}

function getCreatorBadgeLabel(slug) {
  const creator = getCreator(slug);
  if (!creator) return "Foodie pick";
  if (creator.publicAttributionEnabled || SHOW_UNVERIFIED_CREATOR_NAMES) {
    return `${creator.displayName.split(" ")[0]} pick`;
  }
  return "Foodie pick";
}

function getSourceInfo(place) {
  const source = importedSourceById.get(place.sourceName) || importedSourceById.get(place.sourceId);
  return {
    label: source?.sourceName || (place.sourceName ? titleCaseSlug(place.sourceName) : "Discovery source"),
    url: place.sourceUrl || source?.url || ""
  };
}

function routeForPlace(placeId) {
  return `/places/${encodeURIComponent(resolvePlaceId(placeId))}`;
}

function resolvePlaceId(id) {
  return placeIdAliases[id] || id;
}

function mapImportedPlace(row) {
  const categorySlugs = unique([
    normalizeCategorySlug(row.primaryCategory),
    ...splitPipe(row.secondaryCategories),
    ...splitPipe(row.suggestedPromptSlugs)
  ]);
  categorySlugs.forEach((slug) => {
    if (["closed-reference", "closed_reference"].includes(slug)) return;
    addCategoryIfMissing(slug);
  });
  const tags = unique([...splitPipe(row.secondaryCategories), ...splitPipe(row.suggestedPromptSlugs)]).slice(0, 10);
  return {
    id: row.placeId,
    name: row.placeName,
    city: "seattle",
    category: normalizeCategorySlug(row.primaryCategory),
    categorySlugs,
    neighborhood: row.neighborhoodOrArea || "Seattle",
    description: row.oneLineDescription || "Seed place for Local Five launch testing.",
    why: row.whyItMattersForRankbites || "Useful seed candidate for local Top 5 debates.",
    tags,
    styleTags: tags.filter((tag) => !["pizza", "tacos", "bbq", "burgers", "coffee"].includes(tag)),
    textureTags: tags.filter((tag) => /(crispy|crunchy|airy|flaky|buttery|crust|juicy)/.test(tag)),
    vibeTags: tags.filter((tag) => /(hidden|classic|late|date|patio|family|drive|neighborhood)/.test(tag)),
    bestFor: tags.slice(0, 3),
    creatorMentionedBy: [],
    creatorSignals: [],
    addressHint: row.addressHint,
    officialUrl: row.officialUrl,
    mapUrl: row.googleMapsQueryUrl,
    sourceId: row.primarySourceName,
    sourceName: row.primarySourceName,
    sourceUrl: row.primarySourceUrl,
    sourceNote: row.sourceRecencyOrNote,
    verificationStatus: row.verificationStatus,
    safeToPublishCopy: row.safeToPublishCopy,
    usageNotes: row.codexUsageNotes,
    isImported: true
  };
}

function mergeImportedSeed() {
  const importedPlaces = IMPORTED_SEED.places.map(mapImportedPlace);
  const importedByName = new Map();

  importedPlaces.forEach((place) => {
    place.categorySlugs.forEach((slug) => importedByName.set(`${normalizeName(place.name)}|${slug}`, place.id));
  });

  places.forEach((place) => {
    const richId = importedByName.get(`${normalizeName(place.name)}|${normalizeCategorySlug(place.category)}`);
    if (richId) placeIdAliases[place.id] = richId;
  });

  const filteredFallbackPlaces = places.filter((place) => {
    const key = `${normalizeName(place.name)}|${normalizeCategorySlug(place.category)}`;
    return !importedByName.has(key);
  });

  places = [...importedPlaces, ...filteredFallbackPlaces];

  (IMPORTED_SEED.normalizedCreatorRows || []).forEach((row) => {
    if (getPlace(row.placeId)) return;
    const category = normalizeCategorySlug(row.categorySlug);
    addCategoryIfMissing(category, row.categoryLabel);
    const tags = unique([category, ...(row.tasteTags || "").split("|").map(normalizeCategorySlug)]);
    places.push({
      id: row.placeId,
      name: row.canonicalPlaceName || row.originalPlaceNameFromUpload,
      city: "seattle",
      category,
      categorySlugs: unique([category]),
      neighborhood: row.neighborhoodOrAreaHint || "Seattle",
      description: row.placeDetailSummaryFromUpload || "Imported creator-ranking seed place.",
      why: row.creatorFeedbackSummary || "Appears in an imported Local Five creator comparison seed.",
      tags,
      styleTags: unique((row.recommendationAttributes || "").split("|").map(normalizeCategorySlug)),
      textureTags: tags.filter((tag) => /(crispy|crunchy|airy|flaky|buttery|crust|juicy)/.test(tag)),
      vibeTags: tags.filter((tag) => /(hidden|classic|hype|late|neighborhood|creator|institution)/.test(tag)),
      bestFor: tags.slice(0, 3),
      creatorMentionedBy: [],
      creatorSignals: [],
      officialUrl: "",
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.canonicalPlaceName || row.originalPlaceNameFromUpload} Seattle, WA`)}`,
      sourceName: "user_uploaded_creator_seed",
      sourceUrl: "",
      verificationStatus: "needs_creator_source_and_places_verification",
      safeToPublishCopy: "yes",
      isImported: true
    });
  });

  const creatorSeed = IMPORTED_SEED.creatorRankings || { creators: [], rankings: [] };
  creatorSeed.creators.forEach((creator, index) => {
    if (creators.some((item) => item.slug === creator.creator_id)) return;
    creators.push({
      slug: creator.creator_id,
      displayName: creator.display_name,
      handle: creator.handle_to_verify || "",
      city: "Seattle",
      bio: creator.disclaimer,
      optInStatus: creator.opt_in_status,
      publicAttributionEnabled: Boolean(SHOW_UNVERIFIED_CREATOR_NAMES),
      specialties: creatorSeed.rankings
        .filter((ranking) => ranking.creator_id === creator.creator_id)
        .map((ranking) => getCategory(normalizeCategorySlug(ranking.category_slug)).name),
      displayFallback: `Curated foodie list ${index + 1}`
    });
  });

  creatorSeed.rankings.forEach((ranking) => {
    const categorySlug = normalizeCategorySlug(ranking.category_slug);
    addCategoryIfMissing(categorySlug, ranking.category_label);
    const placeIds = ranking.items.map((item) => item.place_id).filter((placeId) => getPlace(placeId)).slice(0, 5);
    if (!placeIds.length) return;
    seedRankings.push({
      id: `imported-${ranking.creator_id}-${categorySlug}`,
      city: "seattle",
      category: categorySlug,
      creatorSlug: ranking.creator_id,
      source: "creator_seed_imported",
      visibility: "public",
      createdAt: IMPORTED_SEED.creatorRankings.generated_at || "2026-05-25T00:00:00.000Z",
      placeIds,
      items: ranking.items
    });
  });

  (IMPORTED_SEED.normalizedCreatorRows || []).forEach((row) => {
    const place = getPlace(row.placeId);
    if (!place) return;
    const tags = unique([...(place.tags || []), ...(row.tasteTags || "").split("|").map(normalizeCategorySlug)]);
    place.tags = tags;
    place.styleTags = unique([...(place.styleTags || []), ...(row.recommendationAttributes || "").split("|").map(normalizeCategorySlug)]);
    place.textureTags = unique([...(place.textureTags || []), ...tags.filter((tag) => /(crispy|crunchy|airy|flaky|buttery|crust|juicy)/.test(tag))]);
    place.vibeTags = unique([...(place.vibeTags || []), ...tags.filter((tag) => /(hidden|classic|hype|late|neighborhood|creator|institution)/.test(tag))]);
    place.creatorMentionedBy = unique([...(place.creatorMentionedBy || []), row.creatorId]);
    place.creatorSignals = [
      ...(place.creatorSignals || []),
      {
        creatorId: row.creatorId,
        category: normalizeCategorySlug(row.categorySlug),
        rankPosition: row.rankPosition ? Number(row.rankPosition) : null,
        rankStatus: row.rankStatusRaw,
        summary: row.creatorFeedbackSummary
      }
    ];
    if (!place.description && row.placeDetailSummaryFromUpload) place.description = row.placeDetailSummaryFromUpload;
  });
}

mergeImportedSeed();

function initAnalytics() {
  if (CONFIG.gaMeasurementId && !window.gtag) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.gaMeasurementId)}`;
    document.head.append(gaScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.gaMeasurementId);
  }

  if (CONFIG.metaPixelId && !window.fbq) {
    window.fbq = function fbq() {
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
    };
    window.fbq.queue = [];
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    const pixelScript = document.createElement("script");
    pixelScript.async = true;
    pixelScript.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.append(pixelScript);
    window.fbq("init", CONFIG.metaPixelId);
    window.fbq("track", "PageView");
  }
}

function track(eventName, params = {}) {
  if (window.gtag) window.gtag("event", eventName, params);
  if (window.fbq) window.fbq("trackCustom", eventName, params);
}

function defaultStore() {
  return { submissions: [], suggestions: [], saved: [], drafts: {}, tone: "spicy" };
}

function userStorageKey(userId) {
  return `${STORAGE_KEY}:user:${userId}`;
}

function activeStoreKey() {
  return authUser?.id ? userStorageKey(authUser.id) : STORAGE_KEY;
}

function readStoreKey(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return { ...defaultStore(), ...parsed, drafts: { ...defaultStore().drafts, ...(parsed?.drafts || {}) } };
  } catch {
    return defaultStore();
  }
}

function writeStoreKey(key, next) {
  localStorage.setItem(key, JSON.stringify({ ...defaultStore(), ...next }));
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function mergeAnonymousStoreIntoProfile() {
  if (!authUser?.id) return;
  const anonymous = readStoreKey(STORAGE_KEY);
  const userKey = userStorageKey(authUser.id);
  const profile = readStoreKey(userKey);
  const merged = {
    ...profile,
    submissions: uniqueById([...profile.submissions, ...anonymous.submissions]),
    suggestions: uniqueById([...profile.suggestions, ...anonymous.suggestions]),
    saved: uniqueById([...profile.saved, ...anonymous.saved]),
    drafts: { ...anonymous.drafts, ...profile.drafts },
    tone: profile.tone || anonymous.tone || "spicy"
  };
  writeStoreKey(userKey, merged);
}

function loadStore() {
  return readStoreKey(activeStoreKey());
}

function saveStore(next) {
  writeStoreKey(activeStoreKey(), next);
}

function setAuthSession(session) {
  const previousUserId = authUser?.id;
  authSession = session;
  authUser = session?.user || null;
  if (authUser?.id) mergeAnonymousStoreIntoProfile();
  if (previousUserId !== authUser?.id) drafts = {};
}

async function initAuth() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || !window.supabase?.createClient) {
    authReady = true;
    render();
    return;
  }

  try {
    authClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data } = await authClient.auth.getSession();
    setAuthSession(data.session);
    authReady = true;
    if (window.location.hash.includes("access_token")) {
      window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
    }
    authClient.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      authReady = true;
      render();
    });
  } catch {
    authReady = true;
  }
  render();
}

async function signInWithGoogle() {
  if (!authClient) {
    showToast("Google sign-in is still loading.");
    return;
  }
  const redirectTo = new URL(window.location.href);
  redirectTo.hash = "";
  const { error } = await authClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectTo.toString() }
  });
  if (error) showToast(error.message || "Could not start Google sign-in.");
}

async function signOut() {
  if (!authClient) return;
  await authClient.auth.signOut();
  setAuthSession(null);
  showToast("Signed out.");
  render();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCategory(slug) {
  const normalized = normalizeCategorySlug(slug);
  return (
    categories.find((category) => category.slug === normalized) || {
      slug: normalized,
      name: launchCategoryLabels[normalized] || titleCaseSlug(normalized),
      day: "Seed",
      description: "Imported seed category.",
      accent: "#7b6bb2"
    }
  );
}

function getPlace(id) {
  const resolved = resolvePlaceId(id);
  return places.find((place) => place.id === resolved);
}

function getCreator(slug) {
  return creators.find((creator) => creator.slug === slug);
}

function getPlacesFor(categorySlug) {
  const normalized = normalizeCategorySlug(categorySlug);
  const owner = isOwnerMode();
  return places
    .filter((place) => place.city === "seattle" && (place.categorySlugs || [place.category]).includes(normalized))
    .filter((place) => place.verificationStatus !== "exclude_closed")
    .filter((place) => owner || place.safeToPublishCopy !== "needs_review");
}

function getDraft(categorySlug) {
  const normalized = normalizeCategorySlug(categorySlug);
  if (!drafts[normalized]) {
    const savedDraft = loadStore().drafts?.[normalized] || {};
    drafts[normalized] = {
      query: savedDraft.query || "",
      selected: (savedDraft.selected || []).map(resolvePlaceId).filter((placeId) => getPlace(placeId)).slice(0, 5)
    };
  }
  return drafts[normalized];
}

function persistDraft(categorySlug) {
  const normalized = normalizeCategorySlug(categorySlug);
  const draft = getDraft(normalized);
  const store = loadStore();
  saveStore({
    ...store,
    drafts: {
      ...(store.drafts || {}),
      [normalized]: {
        query: draft.query,
        selected: draft.selected.map(resolvePlaceId)
      }
    }
  });
}

function getAllSubmissions() {
  return [...seedRankings, ...loadStore().submissions];
}

function encodeShareSubmission(submission) {
  const payload = {
    v: 1,
    city: submission.city,
    category: submission.category,
    placeIds: submission.placeIds.map(resolvePlaceId),
    createdAt: submission.createdAt
  };
  return btoa(JSON.stringify(payload)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeShareSubmission(submissionId) {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("s");
  if (!encoded) return null;
  try {
    const padded = encoded.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded));
    if (!Array.isArray(payload.placeIds) || payload.placeIds.length !== 5) return null;
    const category = normalizeCategorySlug(payload.category);
    const placeIds = payload.placeIds.map(resolvePlaceId).filter((placeId) => getPlace(placeId));
    if (placeIds.length !== 5) return null;
    return {
      id: submissionId,
      city: payload.city || "seattle",
      category,
      creatorSlug: null,
      source: "shared_url",
      visibility: "public",
      createdAt: payload.createdAt || new Date().toISOString(),
      placeIds
    };
  } catch {
    return null;
  }
}

function getSubmissionById(submissionId) {
  return getAllSubmissions().find((item) => item.id === submissionId) || decodeShareSubmission(submissionId);
}

function shareUrlFor(submission) {
  return absoluteUrl(`/rank/${submission.id}?s=${encodeShareSubmission(submission)}`);
}

function getSubmissionsFor(categorySlug, options = {}) {
  const normalized = normalizeCategorySlug(categorySlug);
  return getAllSubmissions().filter(
    (submission) =>
      submission.city === "seattle" &&
      normalizeCategorySlug(submission.category) === normalized &&
      (!options.excludeId || submission.id !== options.excludeId)
  );
}

function getAggregate(categorySlug, options = {}) {
  const score = new Map();
  getSubmissionsFor(categorySlug, options).forEach((submission) => {
    submission.placeIds.forEach((placeId, index) => {
      const resolvedId = resolvePlaceId(placeId);
      const place = getPlace(resolvedId);
      if (!place) return;
      const item = score.get(resolvedId) || {
        place,
        totalPoints: 0,
        rankCount: 0,
        firstPlaceCount: 0,
        rankTotal: 0,
        topThreeCount: 0
      };
      item.totalPoints += 5 - index;
      item.rankCount += 1;
      item.rankTotal += index + 1;
      if (index === 0) item.firstPlaceCount += 1;
      if (index < 3) item.topThreeCount += 1;
      score.set(resolvedId, item);
    });
  });

  return [...score.values()]
    .map((item) => ({
      ...item,
      averageRank: item.rankTotal / item.rankCount,
      controversyScore: item.firstPlaceCount + item.topThreeCount - item.rankCount / 2
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints || b.firstPlaceCount - a.firstPlaceCount || a.averageRank - b.averageRank)
    .map((item, index) => ({ ...item, cityRank: index + 1 }));
}

function getSubmissionStats(submission) {
  const consensus = getAggregate(submission.category, { excludeId: submission.id });
  const rankMap = new Map(consensus.map((item) => [item.place.id, item.cityRank]));
  const topFive = consensus.slice(0, 5).map((item) => item.place.id);
  const resolvedPlaceIds = submission.placeIds.map(resolvePlaceId);
  const overlap = resolvedPlaceIds.filter((placeId) => topFive.includes(placeId)).length;
  const exact = resolvedPlaceIds.filter((placeId, index) => topFive[index] === placeId).length;
  const maxRank = Math.max(consensus.length + 1, 10);
  const rankedPicks = resolvedPlaceIds.map((placeId, index) => {
    const place = getPlace(placeId);
    const cityRank = rankMap.get(placeId) || maxRank;
    return {
      place,
      userRank: index + 1,
      cityRank,
      boldGap: cityRank - (index + 1)
    };
  });
  const boldest = rankedPicks.sort((a, b) => b.boldGap - a.boldGap)[0];
  const twin = getTasteTwin(submission);
  const creatorMatches = getCreatorMatches(submission);
  const creatorConsensusMiss = getCreatorConsensusMiss(submission);
  const score = Math.round((overlap / 5) * 90 + (exact / 5) * 10);
  return { consensus, overlap, exact, boldest, twin, score, creatorMatches, creatorConsensusMiss };
}

function getTasteTwin(submission) {
  const candidates = seedRankings.filter((item) => item.category === submission.category && item.id !== submission.id);
  const userIds = submission.placeIds.map(resolvePlaceId);
  let best = null;
  candidates.forEach((candidate) => {
    const candidateIds = candidate.placeIds.map(resolvePlaceId);
    const overlap = userIds.filter((placeId) => candidateIds.includes(placeId)).length;
    const exact = userIds.filter((placeId, index) => candidateIds[index] === placeId).length;
    const score = overlap * 10 + exact * 7;
    if (!best || score > best.score) best = { ...candidate, overlap, exact, score };
  });
  return best;
}

function getCreatorMatches(submission) {
  const userIds = submission.placeIds.map(resolvePlaceId);
  const bestByCreator = new Map();
  seedRankings
    .filter((ranking) => ranking.creatorSlug && ranking.creatorSlug !== "admin")
    .filter((ranking) => ranking.category === normalizeCategorySlug(submission.category))
    .forEach((ranking) => {
      const creatorIds = ranking.placeIds.map(resolvePlaceId);
      const overlapIds = userIds.filter((placeId) => creatorIds.includes(placeId));
      const exact = userIds.filter((placeId, index) => creatorIds[index] === placeId).length;
      const near = overlapIds.filter((placeId) => Math.abs(userIds.indexOf(placeId) - creatorIds.indexOf(placeId)) <= 1).length;
      if (!overlapIds.length) return;
      const match = {
        ranking,
        creator: getCreator(ranking.creatorSlug),
        overlapIds,
        overlap: overlapIds.length,
        exact,
        score: overlapIds.length * 20 + exact * 10 + near * 4
      };
      const previous = bestByCreator.get(ranking.creatorSlug);
      if (!previous || match.score > previous.score) bestByCreator.set(ranking.creatorSlug, match);
    });

  return [...bestByCreator.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function getCreatorConsensusPicks(categorySlug) {
  const counts = new Map();
  seedRankings
    .filter((ranking) => ranking.creatorSlug && ranking.creatorSlug !== "admin")
    .filter((ranking) => ranking.category === normalizeCategorySlug(categorySlug))
    .forEach((ranking) => {
      ranking.placeIds.map(resolvePlaceId).forEach((placeId, index) => {
        const item = counts.get(placeId) || { placeId, mentions: 0, firsts: 0, creators: new Set() };
        item.mentions += 1;
        if (index === 0) item.firsts += 1;
        item.creators.add(ranking.creatorSlug);
        counts.set(placeId, item);
      });
    });
  return [...counts.values()]
    .filter((item) => item.mentions >= 2 || item.firsts > 0)
    .sort((a, b) => b.mentions + b.firsts - (a.mentions + a.firsts));
}

function getCreatorConsensusMiss(submission) {
  const userIds = new Set(submission.placeIds.map(resolvePlaceId));
  return getCreatorConsensusPicks(submission.category).find((item) => !userIds.has(item.placeId));
}

function getTasteVerdict(submission, stats, tone = loadStore().tone || "spicy") {
  const category = getCategory(submission.category);
  const creatorMissPlace = stats.creatorConsensusMiss ? getPlace(stats.creatorConsensusMiss.placeId) : null;
  const boldest = stats.boldest?.place;
  const safePicks = stats.overlap >= 4;
  const chaos = Math.max(0, 100 - stats.score);

  let title = "Respectably Debatable";
  let roast = `Your ${category.name.toLowerCase()} list has enough consensus to be useful and enough personality to start one group chat argument.`;
  let badges = ["Useful list", "Some debate"];
  let shareLine = `I ranked Seattle ${category.name.toLowerCase()} and survived the Local Five verdict.`;

  if (safePicks) {
    title = "Suspiciously Correct";
    roast = "You matched the city a little too well. This is either excellent taste or you built this list by asking five people already standing in line.";
    badges = ["City-approved", "Low chaos", "Safe but solid"];
    shareLine = `I ranked Seattle ${category.name.toLowerCase()} and apparently I am annoyingly reasonable.`;
  } else if (stats.overlap <= 1) {
    title = "Food Court Defendant";
    roast = "Your list disagrees with Seattle and probably at least one person currently yelling in a comment section. It is not boring, though.";
    badges = ["Chaos pick", "Contrarian", "Argument starter"];
    shareLine = `I ranked Seattle ${category.name.toLowerCase()} and the city may need to intervene.`;
  } else if (creatorMissPlace) {
    title = "Creator Consensus Violation";
    roast = `Skipping ${creatorMissPlace.name} is a choice. Not necessarily a good one, but definitely a choice.`;
    badges = ["Missed foodie pick", "Bold omission"];
    shareLine = `I skipped a Local Five foodie favorite and lived to tell the tale.`;
  } else if (boldest && stats.boldest.cityRank >= 10) {
    title = "Brave, Possibly Wrong";
    roast = `Putting ${boldest.name} at #${stats.boldest.userRank} while the city has it at #${stats.boldest.cityRank} is the kind of confidence this app was built to document.`;
    badges = ["Bold take", "High conviction"];
    shareLine = `My Local Five list contains one deeply documented food opinion.`;
  }

  if (tone === "mild") {
    roast = roast.replace("wrong", "debatable").replace("intervene", "discuss this").replace("Food Court Defendant", "Independent Thinker");
  }

  if (tone === "unhinged_safe") {
    roast += " The spreadsheet is concerned, but the bit is working.";
    badges = [...badges, "Drama seasoning"];
  }

  return { title, roast, scoreLabel: "Chaos score", scoreValue: chaos, badges, shareLine, tone };
}

function getRecommendations(submission, stats) {
  const selectedIds = new Set(submission.placeIds.map(resolvePlaceId));
  const selectedPlaces = submission.placeIds.map(getPlace).filter(Boolean);
  const selectedTags = new Set(
    selectedPlaces.flatMap((place) => [
      ...(place.tags || []),
      ...(place.styleTags || []),
      ...(place.textureTags || []),
      ...(place.vibeTags || [])
    ])
  );
  const selectedNeighborhoods = new Set(selectedPlaces.map((place) => place.neighborhood).filter(Boolean));
  const consensusRanks = new Map(stats.consensus.map((item) => [item.place.id, item.cityRank]));

  return getPlacesFor(submission.category)
    .filter((place) => !selectedIds.has(place.id))
    .map((place) => {
      const placeTags = unique([...(place.tags || []), ...(place.styleTags || []), ...(place.textureTags || []), ...(place.vibeTags || [])]);
      const shared = placeTags.filter((tag) => selectedTags.has(tag));
      const creatorConsensusBonus = (place.creatorMentionedBy || []).length >= 2 ? 2 : 0;
      const neighborhoodDiversityBonus = selectedNeighborhoods.has(place.neighborhood) ? 0 : 0.5;
      const cityPopularityBonus = consensusRanks.has(place.id) ? Math.max(0.2, (8 - consensusRanks.get(place.id)) / 10) : 0;
      const score = 4 + shared.length * 1.6 + creatorConsensusBonus + neighborhoodDiversityBonus + cityPopularityBonus;
      return {
        place,
        score,
        shared,
        reason: recommendationReason(place, selectedPlaces, shared, creatorConsensusBonus)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function recommendationReason(place, selectedPlaces, shared, creatorConsensusBonus) {
  const anchors = selectedPlaces.slice(0, 2).map((item) => item.name).join(" and ");
  if (shared.length) {
    return `Because you picked ${anchors}, you seem to like ${shared.slice(0, 3).map(titleCaseSlug).join(", ")}. ${place.name} fits that lane.`;
  }
  if (creatorConsensusBonus) {
    return `${place.name} has creator-overlap energy, which makes it the next logical argument.`;
  }
  return `${place.name} gives your list a different neighborhood and a new data point for the next debate.`;
}

function getRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);
  if (path === "/") return { name: "home" };
  if (parts[0] === "seattle" && !parts[1]) return { name: "city" };
  if (parts[0] === "seattle" && parts[1]) return { name: "category", categorySlug: parts[1] };
  if (parts[0] === "rank" && parts[1]) return { name: "rank", submissionId: parts[1] };
  if (parts[0] === "creator" && parts[1]) return { name: "creator", creatorSlug: parts[1], categorySlug: parts[2] };
  if ((parts[0] === "place" || parts[0] === "places") && parts[1]) return { name: "place", placeId: parts[1] };
  if (parts[0] === "account") return { name: "account" };
  if (parts[0] === "admin") return { name: "admin" };
  return { name: "home" };
}

function navigate(path) {
  window.history.pushState({}, "", path);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function absoluteUrl(path = window.location.pathname) {
  const base = (CONFIG.siteUrl || window.location.origin).replace(/\/+$/, "");
  return `${base}${path}`;
}

function setMeta(title, description) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
}

function isOwnerMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("owner") === "1") localStorage.setItem("local-five-owner", "1");
  return localStorage.getItem("local-five-owner") === "1";
}

function authDisplayName() {
  return authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email || "Local Five user";
}

function authFirstName() {
  return authDisplayName().split(" ")[0] || "Account";
}

function authAvatarUrl() {
  return authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || "";
}

function avatarMarkup(name = "Local Five user", imageUrl = "", className = "") {
  if (imageUrl) {
    return `<span class="avatar ${className}"><img src="${escapeHtml(imageUrl)}" alt="" referrerpolicy="no-referrer" /></span>`;
  }
  return `<span class="avatar ${className}">${escapeHtml(initials(name))}</span>`;
}

function shell(mainHtml, options = {}) {
  const owner = isOwnerMode();
  const accountLabel = authUser ? authFirstName() : "Sign in";
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="/" data-link aria-label="Local Five home">
          <span class="brand-mark">L5</span>
          <span>
            <strong>Local Five</strong>
            <small>Your city's Top 5, judged by locals</small>
          </span>
        </a>
        <nav class="top-actions" aria-label="Primary">
          <a class="ghost-button" href="/seattle" data-link>Seattle</a>
          <a class="ghost-button" href="/creator/sample-maya" data-link>Creators</a>
          ${owner ? `<a class="ghost-button" href="/admin" data-link>Admin</a>` : ""}
          <a class="ghost-button account-nav" href="/account" data-link>${escapeHtml(accountLabel)}</a>
          <a class="primary-button" href="/seattle/pizza" data-link>${options.cta || "Play Pizza"}</a>
        </nav>
      </header>
      ${mainHtml}
    </div>
  `;
}

function renderHome() {
  setMeta(
    "Local Five | Rank your city's Top 5 food spots",
    "Pick your favorites, get roasted, compare with local foodies, and discover where to eat next."
  );
  const featured = getCategory("pizza");
  shell(`
    <main>
      <section class="hero-band">
        <div class="hero-layout">
          <div class="hero-copy">
            <p class="eyebrow">Seattle beta</p>
            <h1>Rank your city's Top 5 food spots.</h1>
            <p>Pick your favorites, get roasted, compare with local foodie lists, and discover where to eat next.</p>
            <div class="hero-actions">
              <a class="primary-button" href="/seattle/pizza" data-link>Play Seattle Pizza</a>
              <a class="ghost-link" href="/seattle" data-link>Explore Seattle rankings</a>
            </div>
          </div>
          <div class="feature-card" style="--accent: ${featured.accent}">
            <span class="feature-kicker">Today's challenge</span>
            <h2>Seattle's Best Pizza</h2>
            <p>Make your Top 5. Then get the verdict, the consensus, and places to try next.</p>
            ${miniConsensus("pizza")}
          </div>
        </div>
      </section>
      <section class="section-wrap">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Trending</p>
            <h2>Pick a food debate</h2>
          </div>
        </div>
        <div class="category-grid">
          ${categories.map(categoryCard).join("")}
        </div>
      </section>
      <section class="section-wrap split-section">
        <div class="info-panel">
          <p class="eyebrow">How it works</p>
          <h2>Make your Top 5. Compare. Share.</h2>
          <p>Local Five uses ranked lists instead of star ratings. Your #1 gets five points, your #5 gets one point, then the app judges the list and explains what to eat next.</p>
        </div>
        <div class="info-panel">
          <p class="eyebrow">No login wall</p>
          <h2>Play first, save later.</h2>
          <p>The MVP stores your ranking locally and creates a share link. Accounts and Supabase persistence can come after the loop feels good.</p>
        </div>
      </section>
    </main>
  `);
}

function renderCityHub() {
  setMeta(
    "Seattle Top 5 Food Rankings | Local Five",
    "Play Seattle food ranking prompts and see the local consensus."
  );
  shell(`
    <main>
      <section class="city-band">
        <div class="city-hero">
          <div>
            <p class="eyebrow">City hub</p>
            <h1>Seattle has opinions.</h1>
            <p>Start with pizza, then try teriyaki, tacos, coffee, burgers, brunch, and the rest of the food debates locals keep having.</p>
          </div>
          <a class="primary-button" href="/seattle/pizza" data-link>Play today's Top 5</a>
        </div>
      </section>
      <section class="section-wrap">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Prompts</p>
            <h2>Seattle food categories</h2>
          </div>
        </div>
        <div class="category-grid">
          ${categories.map(categoryCard).join("")}
        </div>
      </section>
      <section class="section-wrap dashboard-grid">
        <div class="info-panel">
          <p class="eyebrow">Leaderboard preview</p>
          <h2>Pizza consensus</h2>
          ${leaderboardPreview("pizza")}
        </div>
        <div class="info-panel">
          <p class="eyebrow">Creator lists</p>
          <h2>Compare your taste</h2>
          <div class="creator-stack">
            ${creators.map(creatorCard).join("")}
          </div>
        </div>
        <div class="info-panel">
          <p class="eyebrow">Spicy picks</p>
          <h2>Most controversial</h2>
          ${controversyPreview()}
        </div>
      </section>
    </main>
  `);
}

function renderCategoryPage(categorySlug) {
  const category = getCategory(categorySlug);
  setMeta(
    `Seattle's Best ${category.name}, Ranked by Locals | Local Five`,
    `Make your Top 5 ${category.name.toLowerCase()} spots in Seattle and see if the city agrees.`
  );
  shell(`
    <main>
      <section class="play-band" style="--accent: ${category.accent}">
        <div class="play-header">
          <div>
            <p class="eyebrow">Seattle food challenge</p>
            <h1>Seattle's Best ${escapeHtml(category.name)}</h1>
            <p>Make your Top 5. Then get roasted, compare with local foodie lists, and find your next spot.</p>
          </div>
          <div class="prompt-stat">
            <strong>${getSubmissionsFor(category.slug).length}</strong>
            <span>seed rankings</span>
          </div>
        </div>
      </section>
      <section class="play-layout">
        <div class="editor-panel">
          <div class="section-heading tight">
            <div>
              <p class="eyebrow">Your list</p>
              <h2>Choose exactly five places</h2>
            </div>
            <span class="progress-pill" id="progressPill">0 of 5</span>
          </div>
          <div id="rankEditor"></div>
        </div>
        <aside class="side-panel">
          <p class="eyebrow">City consensus</p>
          <h2>Current Top 5</h2>
          ${leaderboardPreview(category.slug)}
          ${methodologyNote()}
          <div class="method-card">
            <strong>Seed note</strong>
            <p>These place details are seed listings. Check hours and details before visiting.</p>
          </div>
        </aside>
      </section>
    </main>
  `);
  renderEditor(category.slug);
}

function renderRankPage(submissionId) {
  const submission = getSubmissionById(submissionId);
  if (!submission) {
    setMeta("Ranking not found | Local Five", "Make your own Local Five ranking.");
    shell(`
      <main class="section-wrap">
        <div class="empty-state large">
          <h1>That ranking link is incomplete.</h1>
          <p>Make a fresh Top 5 and use the share button so the link includes the ranking data.</p>
          <a class="primary-button" href="/seattle/pizza" data-link>Make your Top 5</a>
        </div>
      </main>
    `);
    return;
  }

  const category = getCategory(submission.category);
  const stats = getSubmissionStats(submission);
  const verdict = getTasteVerdict(submission, stats);
  const recommendations = getRecommendations(submission, stats);
  const shareText = getShareText(submission);
  setMeta(
    `My Top 5 ${category.name} in Seattle | Local Five`,
    `I ranked my Top 5 ${category.name.toLowerCase()} spots in Seattle. See if your list matches mine.`
  );
  shell(`
    <main>
      <section class="result-band" style="--accent: ${category.accent}">
        <div class="result-layout">
          <div class="share-card-preview">
            <p>My Local Five</p>
            <h1>Top 5 ${escapeHtml(category.name)} in Seattle</h1>
            <ol>
              ${submission.placeIds
                .map((placeId) => getPlace(placeId))
                .filter(Boolean)
                .map((place) => `<li>${escapeHtml(place.name)}</li>`)
                .join("")}
            </ol>
          </div>
          <div class="result-copy">
            <p class="eyebrow">Taste verdict</p>
            <h1>${escapeHtml(verdict.title)}</h1>
            <p>${escapeHtml(verdict.roast)}</p>
            <div class="tag-row verdict-badges">
              ${verdict.badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join("")}
            </div>
            ${toneToggle(verdict.tone, submission.id)}
            <div class="score-grid">
              <div><strong>${stats.score}%</strong><span>taste score</span></div>
              <div><strong>${verdict.scoreValue}%</strong><span>${escapeHtml(verdict.scoreLabel)}</span></div>
              <div><strong>${stats.creatorMatches[0]?.overlap || 0}/5</strong><span>foodie match</span></div>
            </div>
            <div class="result-actions">
              <button class="primary-button" type="button" data-action="copy-share" data-submission-id="${submission.id}">Copy share link</button>
              <button class="ghost-button" type="button" data-action="native-share" data-submission-id="${submission.id}">Share</button>
              <a class="ghost-link" href="/seattle/${category.slug}" data-link>Challenge a friend</a>
            </div>
            <textarea class="share-textarea" readonly>${escapeHtml(shareText)}</textarea>
          </div>
        </div>
      </section>
      <section class="section-wrap dashboard-grid">
        <div class="info-panel">
          <p class="eyebrow">Your Top 5</p>
          <h2>${escapeHtml(category.name)} ranking</h2>
          ${submissionList(submission)}
        </div>
        <div class="info-panel">
          <p class="eyebrow">City consensus</p>
          <h2>Seattle's Top 5 ${escapeHtml(category.name)}</h2>
          ${leaderboardPreview(category.slug, submission.id)}
        </div>
        <div class="info-panel">
          <p class="eyebrow">Creator match</p>
          <h2>Foodie comparison</h2>
          ${creatorMatchPanel(stats)}
        </div>
      </section>
      <section class="section-wrap">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Try next</p>
            <h2>Recommendations based on your picks</h2>
          </div>
        </div>
        <div class="recommendation-grid">
          ${recommendationsPanel(recommendations)}
        </div>
      </section>
      <section class="section-wrap dashboard-grid">
        <div class="info-panel">
          <p class="eyebrow">Bold take</p>
          <h2>${escapeHtml(stats.boldest?.place?.name || "Your list")}</h2>
          <p>${boldestSentence(stats.boldest)}</p>
        </div>
        <div class="info-panel">
          <p class="eyebrow">Taste twin</p>
          <h2>${tasteTwinTitle(stats.twin)}</h2>
          <p>${tasteTwinSentence(stats.twin)}</p>
        </div>
      </section>
      <section class="section-wrap">
        ${methodologyNote()}
      </section>
    </main>
  `);
}

function renderCreatorPage(creatorSlug) {
  const creator = getCreator(creatorSlug) || creators[0];
  const creatorRankings = seedRankings.filter((ranking) => ranking.creatorSlug === creator.slug);
  const publicName = getPublicCreatorName(creator);
  const attributionLine =
    creator.publicAttributionEnabled || SHOW_UNVERIFIED_CREATOR_NAMES ? creator.handle : "Attribution hidden until verified";
  setMeta(`${publicName} on Local Five`, `Compare your taste with a Local Five seed ranking.`);
  shell(`
    <main>
      <section class="creator-band">
        <div class="creator-profile">
          <div class="avatar">${escapeHtml(initials(publicName))}</div>
          <div>
            <p class="eyebrow">Seed comparison profile</p>
            <h1>${escapeHtml(publicName)}</h1>
            <p>${escapeHtml(attributionLine)} · ${escapeHtml(creator.city)}</p>
            <p>${escapeHtml(creator.bio)}</p>
            <span class="notice-pill">Seed data, not an endorsement</span>
          </div>
        </div>
      </section>
      <section class="section-wrap">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Top 5 lists</p>
            <h2>Compare your taste</h2>
          </div>
        </div>
        <div class="category-grid">
          ${creatorRankings
            .map((ranking) => {
              const category = getCategory(ranking.category);
              return `
                <a class="category-card" href="/seattle/${category.slug}" data-link style="--accent: ${category.accent}">
                  <span>${escapeHtml(category.name)}</span>
                  <h3>${escapeHtml(publicName)} Top 5</h3>
                  <p>${ranking.placeIds
                    .slice(0, 3)
                    .map((placeId) => getPlace(placeId)?.name)
                    .filter(Boolean)
                    .join(", ")}</p>
                </a>
              `;
            })
            .join("")}
        </div>
      </section>
    </main>
  `);
}

function renderPlacePage(placeId) {
  const place = getPlace(decodeURIComponent(placeId));
  if (!place || place.verificationStatus === "exclude_closed") {
    setMeta("Place not found | Local Five", "Explore Local Five Seattle food rankings.");
    shell(`
      <main class="section-wrap">
        <div class="empty-state large">
          <h1>Place not found.</h1>
          <p>This place is not active in the public seed list.</p>
          <a class="primary-button" href="/seattle/pizza" data-link>Back to rankings</a>
        </div>
      </main>
    `);
    return;
  }

  const primaryCategory = getCategory(place.category);
  const related = getPlacesFor(place.category)
    .filter((item) => item.id !== place.id)
    .filter((item) => item.neighborhood === place.neighborhood || item.category === place.category)
    .slice(0, 4);
  const sourceInfo = getSourceInfo(place);
  setMeta(`${place.name} | Local Five`, `${place.name} in ${place.neighborhood || "Seattle"} for Local Five ${primaryCategory.name} rankings.`);

  shell(`
    <main>
      <section class="creator-band place-detail-band" style="--accent: ${primaryCategory.accent}">
        <div class="place-detail-hero">
          <div>
            <p class="eyebrow">Local Five place</p>
            <h1>${escapeHtml(place.name)}</h1>
            <p>${escapeHtml(place.neighborhood || "Seattle")} · ${escapeHtml(primaryCategory.name)}</p>
            <div class="tag-row">
              ${verificationBadge(place)}
              ${(place.tags || []).slice(0, 5).map((tag) => `<span>${escapeHtml(titleCaseSlug(tag))}</span>`).join("")}
            </div>
          </div>
          <a class="primary-button" href="/seattle/${primaryCategory.slug}" data-link>Add to my Top 5</a>
        </div>
      </section>
      <section class="section-wrap dashboard-grid">
        <div class="info-panel">
          <p class="eyebrow">Quick info</p>
          <h2>Why it is in Local Five</h2>
          <p>${escapeHtml(place.description || "Seed place for Local Five launch testing.")}</p>
          <p>${escapeHtml(place.why || "Useful seed candidate for local Top 5 debates.")}</p>
          <div class="place-link-row">
            ${place.mapUrl ? `<a class="ghost-link compact-link" href="${escapeHtml(place.mapUrl)}" target="_blank" rel="noreferrer">Map</a>` : ""}
            ${place.officialUrl ? `<a class="ghost-link compact-link" href="${escapeHtml(place.officialUrl)}" target="_blank" rel="noreferrer">Website</a>` : ""}
            ${sourceInfo.url ? `<a class="ghost-link compact-link" href="${escapeHtml(sourceInfo.url)}" target="_blank" rel="noreferrer">${escapeHtml(sourceInfo.label)}</a>` : ""}
          </div>
        </div>
        <div class="info-panel">
          <p class="eyebrow">Appears in</p>
          <h2>Ranking prompts</h2>
          <div class="tag-row prompt-tags">
            ${(place.categorySlugs || [place.category])
              .filter((slug) => launchCategoryLabels[slug])
              .slice(0, 8)
              .map((slug) => `<a href="/seattle/${slug}" data-link>${escapeHtml(getCategory(slug).name)}</a>`)
              .join("")}
          </div>
        </div>
        <div class="info-panel">
          <p class="eyebrow">Creator signals</p>
          <h2>Imported mentions</h2>
          ${place.creatorSignals?.length ? creatorSignalsList(place) : `<p>No imported creator signal yet.</p>`}
        </div>
      </section>
      <section class="section-wrap">
        <div class="method-card">
          <strong>Verification note</strong>
          <p>This is a seed listing. Hours, addresses, menus, ownership, and business status should be checked before visiting or marketing this page.</p>
        </div>
      </section>
      <section class="section-wrap">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Related</p>
            <h2>Nearby or similar places</h2>
          </div>
        </div>
        <div class="recommendation-grid">
          ${related.map((item) => placeMiniCard(item)).join("")}
        </div>
      </section>
    </main>
  `);
}

function renderAccount() {
  setMeta("Account | Local Five", "Sign in to save your Local Five rankings.");

  if (!authReady) {
    shell(`
      <main class="section-wrap">
        <div class="info-panel">
          <p class="eyebrow">Account</p>
          <h1>Loading your profile...</h1>
          <p>Checking your Google sign-in.</p>
        </div>
      </main>
    `);
    return;
  }

  if (!authUser) {
    shell(`
      <main>
        <section class="creator-band account-band">
          <div class="creator-profile account-profile">
            ${avatarMarkup("Local Five")}
            <div>
              <p class="eyebrow">Local Five account</p>
              <h1>Save your lists.</h1>
              <p>Sign in with Google to keep your drafts and finished rankings under one profile on this browser.</p>
              <button class="primary-button google-button" type="button" data-action="google-sign-in">
                <span class="google-mark" aria-hidden="true">G</span>
                Continue with Google
              </button>
            </div>
          </div>
        </section>
      </main>
    `);
    return;
  }

  const store = loadStore();
  const profileName = authDisplayName();
  const draftEntries = Object.entries(store.drafts || {}).filter(([, draft]) => draft?.selected?.length);
  const recentSubmissions = store.submissions.slice(0, 8);

  shell(`
    <main>
      <section class="creator-band account-band">
        <div class="creator-profile account-profile">
          ${avatarMarkup(profileName, authAvatarUrl(), "profile-avatar")}
          <div>
            <p class="eyebrow">Signed in</p>
            <h1>${escapeHtml(profileName)}</h1>
            <p>${escapeHtml(authUser.email || "")}</p>
            <div class="account-actions">
              <a class="primary-button" href="/seattle/pizza" data-link>Keep ranking</a>
              <button class="ghost-button" type="button" data-action="sign-out">Sign out</button>
            </div>
          </div>
        </div>
      </section>
      <section class="section-wrap dashboard-grid">
        <div class="info-panel">
          <p class="eyebrow">Saved drafts</p>
          <h2>In-progress lists</h2>
          <div class="table-list">
            ${
              draftEntries.length
                ? draftEntries
                    .map(([categorySlug, draft]) => {
                      const category = getCategory(categorySlug);
                      return `
                        <div>
                          <strong>${escapeHtml(category.name)}</strong>
                          <span>${draft.selected.length}/5 selected</span>
                          <a class="compact-link text-link" href="/seattle/${category.slug}" data-link>Continue</a>
                        </div>
                      `;
                    })
                    .join("")
                : `<div><strong>No drafts yet.</strong><span>Start a ranking and your picks will save automatically.</span></div>`
            }
          </div>
        </div>
        <div class="info-panel">
          <p class="eyebrow">Profile history</p>
          <h2>Finished rankings</h2>
          <div class="table-list">
            ${
              recentSubmissions.length
                ? recentSubmissions
                    .map((submission) => {
                      const category = getCategory(submission.category);
                      return `
                        <div>
                          <strong>${escapeHtml(category.name)} Top 5</strong>
                          <span>${new Date(submission.createdAt).toLocaleDateString()} · ${submission.placeIds
                        .map((placeId) => getPlace(placeId)?.name)
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(", ")}</span>
                          <a class="compact-link text-link" href="${new URL(shareUrlFor(submission)).pathname}${new URL(shareUrlFor(submission)).search}" data-link>Open</a>
                        </div>
                      `;
                    })
                    .join("")
                : `<div><strong>No finished rankings yet.</strong><span>Submit a Top 5 to build your profile.</span></div>`
            }
          </div>
        </div>
      </section>
    </main>
  `);
}

function renderAdmin() {
  const store = loadStore();
  setMeta("Admin Data | Local Five", "Local Five seed data dashboard.");
  shell(`
    <main class="section-wrap">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Owner data</p>
          <h1>Local Five admin</h1>
        </div>
      </div>
      <div class="admin-grid">
        ${metric("Cities", cities.length)}
        ${metric("Categories", categories.length)}
        ${metric("Places", places.length)}
        ${metric("Seed rankings", seedRankings.length)}
        ${metric("Local submissions", store.submissions.length)}
        ${metric("Suggestions", store.suggestions.length)}
      </div>
      <div class="admin-columns">
        <div class="info-panel">
          <p class="eyebrow">Categories</p>
          <h2>Seattle launch prompts</h2>
          <div class="table-list">
            ${categories
              .map(
                (category) => `
                  <div>
                    <strong>${escapeHtml(category.name)}</strong>
                    <span>${getPlacesFor(category.slug).length} places · ${getSubmissionsFor(category.slug).length} rankings</span>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="info-panel">
          <p class="eyebrow">Queue</p>
          <h2>Suggested places</h2>
          <div class="table-list">
            ${
              store.suggestions.length
                ? store.suggestions
                    .map(
                      (suggestion) => `
                        <div>
                          <strong>${escapeHtml(suggestion.name)}</strong>
                          <span>${escapeHtml(getCategory(suggestion.category).name)} · ${new Date(
                            suggestion.createdAt
                          ).toLocaleDateString()}</span>
                        </div>
                      `
                    )
                    .join("")
                : `<div><strong>No suggestions yet.</strong><span>User place suggestions will appear here.</span></div>`
            }
          </div>
        </div>
      </div>
    </main>
  `);
}

function render() {
  const route = getRoute();
  if (route.name === "home") renderHome();
  if (route.name === "city") renderCityHub();
  if (route.name === "category") renderCategoryPage(route.categorySlug);
  if (route.name === "rank") renderRankPage(route.submissionId);
  if (route.name === "creator") renderCreatorPage(route.creatorSlug);
  if (route.name === "place") renderPlacePage(route.placeId);
  if (route.name === "account") renderAccount();
  if (route.name === "admin") renderAdmin();
}

function categoryCard(category) {
  const aggregate = getAggregate(category.slug);
  const top = aggregate[0]?.place?.name || "Be first";
  return `
    <a class="category-card" href="/seattle/${category.slug}" data-link style="--accent: ${category.accent}">
      <span>${escapeHtml(category.day)}</span>
      <h3>Seattle ${escapeHtml(category.name)}</h3>
      <p>${escapeHtml(category.description)}</p>
      <strong>#1 right now: ${escapeHtml(top)}</strong>
    </a>
  `;
}

function creatorCard(creator) {
  const label = getPublicCreatorName(creator);
  return `
    <a class="creator-mini" href="/creator/${creator.slug}" data-link>
      <span class="avatar small">${escapeHtml(initials(label))}</span>
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(creator.publicAttributionEnabled || SHOW_UNVERIFIED_CREATOR_NAMES ? creator.handle : "Seed comparison list")}</small>
      </span>
    </a>
  `;
}

function placeSearchCard(place, categorySlug, disabled) {
  const tags = unique([...(place.tags || []), ...(place.creatorMentionedBy || []).map((creatorId) => getCreatorBadgeLabel(creatorId))]).slice(0, 4);
  return `
    <article class="place-card compact">
      <div class="place-card-main">
        <div class="place-title-row">
          <div>
            <strong>${escapeHtml(place.name)}</strong>
            <span>${escapeHtml(place.neighborhood || "Seattle")}</span>
          </div>
          ${verificationBadge(place)}
        </div>
        <p>${escapeHtml(place.description || place.note || "Seed place for Local Five launch testing.")}</p>
        <div class="tag-row">${tags.map((tag) => `<span>${escapeHtml(titleCaseSlug(tag))}</span>`).join("")}</div>
      </div>
      <div class="place-card-actions">
        <button type="button" class="place-add-button" data-action="add-place" data-category="${categorySlug}" data-place-id="${place.id}" ${
    disabled ? "disabled" : ""
  }>Add</button>
        <a class="place-detail-link" href="${routeForPlace(place.id)}" data-link>Details</a>
      </div>
    </article>
  `;
}

function verificationBadge(place) {
  if (place.verificationStatus === "verified_active") return `<span class="verify-badge verified">Verified</span>`;
  if (place.verificationStatus === "exclude_closed") return `<span class="verify-badge danger">Closed</span>`;
  return `<span class="verify-badge">Launch seed</span>`;
}

function renderEditor(categorySlug) {
  const editor = document.querySelector("#rankEditor");
  if (!editor) return;
  const draft = getDraft(categorySlug);
  const selectedPlaces = draft.selected.map(getPlace).filter(Boolean);
  const selectedSet = new Set(draft.selected.map(resolvePlaceId));
  const query = draft.query.trim().toLowerCase();
  const available = getPlacesFor(categorySlug)
    .filter((place) => !selectedSet.has(place.id))
    .filter(
      (place) =>
        !query ||
        `${place.name} ${place.neighborhood} ${place.description || ""} ${(place.tags || []).join(" ")}`
          .toLowerCase()
          .includes(query)
    )
    .slice(0, query ? 8 : 6);
  const canSubmit = selectedPlaces.length === 5;
  const progress = document.querySelector("#progressPill");
  if (progress) progress.textContent = `${selectedPlaces.length} of 5`;

  editor.innerHTML = `
    <div class="rank-list" aria-label="Selected ranking">
      ${
        selectedPlaces.length
          ? selectedPlaces
              .map(
                (place, index) => `
                  <article class="rank-item" draggable="true" data-place-id="${place.id}" data-category="${categorySlug}">
                    <button class="drag-handle" type="button" aria-label="Drag ${escapeHtml(place.name)} to reorder" title="Drag to reorder">
                      <span aria-hidden="true"></span>
                    </button>
                    <span class="rank-number">${index + 1}</span>
                    <span class="rank-copy">
                      <strong>${escapeHtml(place.name)}</strong>
                      <small>${escapeHtml(place.neighborhood)}</small>
                    </span>
                    <span class="rank-controls">
                      <button type="button" data-action="move-up" data-category="${categorySlug}" data-place-id="${place.id}" ${
                        index === 0 ? "disabled" : ""
                      }>Up</button>
                      <button type="button" data-action="move-down" data-category="${categorySlug}" data-place-id="${place.id}" ${
                        index === selectedPlaces.length - 1 ? "disabled" : ""
                      }>Down</button>
                      <button type="button" data-action="remove-place" data-category="${categorySlug}" data-place-id="${place.id}">Remove</button>
                    </span>
                  </article>
                `
              )
              .join("")
          : `<div class="empty-state"><strong>Your Top 5 starts here.</strong><span>Search for a place below, then add five favorites.</span></div>`
      }
    </div>
    <div class="search-box">
      <label>
        <span>Search places</span>
        <input data-place-search="${categorySlug}" value="${escapeHtml(draft.query)}" placeholder="Type a restaurant name or neighborhood" />
      </label>
      <div class="place-results">
        ${
          available.length
            ? available
                .map((place) => placeSearchCard(place, categorySlug, selectedPlaces.length >= 5))
                .join("")
            : `<button type="button" class="place-result suggest" data-action="suggest-place" data-category="${categorySlug}">
                <strong>Suggest "${escapeHtml(draft.query || "a missing place")}"</strong>
                <span>Add it to the owner review queue.</span>
              </button>`
        }
      </div>
    </div>
    <button class="primary-button submit-ranking" type="button" data-action="submit-ranking" data-category="${categorySlug}" ${
      canSubmit ? "" : "disabled"
    }>
      Submit my Top 5
    </button>
  `;
}

function miniConsensus(categorySlug) {
  return `
    <ol class="mini-list">
      ${getAggregate(categorySlug)
        .slice(0, 5)
        .map((item) => `<li><span>${item.cityRank}</span>${escapeHtml(item.place.name)}</li>`)
        .join("")}
    </ol>
  `;
}

function leaderboardPreview(categorySlug, excludeId) {
  const aggregate = getAggregate(categorySlug, { excludeId });
  if (!aggregate.length) return `<div class="empty-state"><strong>No rankings yet.</strong><span>Submit the first Top 5.</span></div>`;
  return `
    <ol class="leaderboard-list">
      ${aggregate
        .slice(0, 5)
        .map(
          (item) => `
            <li>
              <span class="rank-number">${item.cityRank}</span>
              <span>
                <strong>${escapeHtml(item.place.name)}</strong>
                <small>${escapeHtml(item.place.neighborhood)}</small>
              </span>
              <span class="score-badge">${item.totalPoints} pts</span>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

function submissionList(submission) {
  return `
    <ol class="leaderboard-list">
      ${submission.placeIds
        .map(getPlace)
        .filter(Boolean)
        .map(
          (place, index) => `
            <li>
              <span class="rank-number">${index + 1}</span>
              <span>
                <strong>${escapeHtml(place.name)}</strong>
                <small>${escapeHtml(place.neighborhood || "Seattle")}</small>
              </span>
              <a class="score-badge details-badge" href="${routeForPlace(place.id)}" data-link>Details</a>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

function toneToggle(activeTone, submissionId) {
  const tones = [
    ["mild", "Mild"],
    ["spicy", "Spicy"],
    ["unhinged_safe", "Unhinged"]
  ];
  return `
    <div class="tone-toggle" aria-label="Roast tone">
      ${tones
        .map(
          ([tone, label]) => `
            <button type="button" data-action="set-tone" data-tone="${tone}" data-submission-id="${submissionId}" class="${
            activeTone === tone ? "is-active" : ""
          }">${label}</button>
          `
        )
        .join("")}
    </div>
  `;
}

function creatorMatchPanel(stats) {
  if (!stats.creatorMatches.length) {
    return `<div class="empty-state"><strong>No creator overlap yet.</strong><span>Your list is doing its own thing.</span></div>`;
  }

  return `
    <div class="table-list">
      ${stats.creatorMatches
        .map((match) => {
          const creatorName = getPublicCreatorName(match.creator);
          const overlapNames = match.overlapIds
            .slice(0, 2)
            .map((placeId) => getPlace(placeId)?.name)
            .filter(Boolean)
            .join(", ");
          return `
            <div>
              <strong>${escapeHtml(creatorName)}: ${match.overlap}/5 match</strong>
              <span>${escapeHtml(overlapNames || "No exact overlap")} · seed data, not an endorsement</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function recommendationsPanel(recommendations) {
  if (!recommendations.length) {
    return `<div class="empty-state"><strong>No recommendations yet.</strong><span>Add more seed places for this category.</span></div>`;
  }

  return recommendations
    .map(
      ({ place, reason }) => `
        <article class="recommendation-card">
          <div class="place-title-row">
            <div>
              <h3>${escapeHtml(place.name)}</h3>
              <span>${escapeHtml(place.neighborhood || "Seattle")}</span>
            </div>
            ${verificationBadge(place)}
          </div>
          <p>${escapeHtml(reason)}</p>
          <div class="tag-row">${(place.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(titleCaseSlug(tag))}</span>`).join("")}</div>
          <a class="ghost-link compact-link" href="${routeForPlace(place.id)}" data-link>Details</a>
        </article>
      `
    )
    .join("");
}

function creatorSignalsList(place) {
  return `
    <div class="table-list">
      ${place.creatorSignals
        .slice(0, 5)
        .map(
          (signal) => `
            <div>
              <strong>${escapeHtml(getCreatorBadgeLabel(signal.creatorId))}${signal.rankPosition ? ` · #${signal.rankPosition}` : ""}</strong>
              <span>${escapeHtml(signal.summary || signal.rankStatus || "Imported seed mention")}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function placeMiniCard(place) {
  return `
    <article class="recommendation-card">
      <div class="place-title-row">
        <div>
          <h3>${escapeHtml(place.name)}</h3>
          <span>${escapeHtml(place.neighborhood || "Seattle")}</span>
        </div>
        ${verificationBadge(place)}
      </div>
      <p>${escapeHtml(place.description || "Seed place for Local Five launch testing.")}</p>
      <a class="ghost-link compact-link" href="${routeForPlace(place.id)}" data-link>Details</a>
    </article>
  `;
}

function controversyPreview() {
  const items = categories
    .flatMap((category) => getAggregate(category.slug).map((item) => ({ ...item, category })))
    .sort((a, b) => b.controversyScore - a.controversyScore)
    .slice(0, 5);
  return `
    <div class="table-list">
      ${items
        .map(
          (item) => `
            <div>
              <strong>${escapeHtml(item.place.name)}</strong>
              <span>${escapeHtml(item.category.name)} · ${item.firstPlaceCount} first-place vote${
                item.firstPlaceCount === 1 ? "" : "s"
              }</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function methodologyNote() {
  return `
    <div class="method-card">
      <strong>Methodology</strong>
      <p>#1 gets 5 points, #2 gets 4, #3 gets 3, #4 gets 2, and #5 gets 1. Seed rankings are sample data for launch testing.</p>
    </div>
  `;
}

function metric(label, value) {
  return `<div class="metric-card"><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`;
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function resultSentence(stats) {
  if (stats.overlap >= 4) return "You are extremely aligned with the current Seattle consensus.";
  if (stats.overlap >= 2) return "You have some consensus picks, plus enough personality to start a debate.";
  return "Seattle may disagree with you, which is exactly why this is fun.";
}

function boldestSentence(boldest) {
  if (!boldest?.place) return "Your list is too original for the current seed data.";
  if (boldest.cityRank >= 10) return `Your #${boldest.userRank}, ${boldest.place.name}, is outside the current city Top 10. Bold.`;
  return `Your #${boldest.userRank}, ${boldest.place.name}, is currently #${boldest.cityRank} citywide.`;
}

function tasteTwinTitle(twin) {
  const creator = getCreator(twin?.creatorSlug);
  return creator ? getPublicCreatorName(creator) : "Sample city list";
}

function tasteTwinSentence(twin) {
  const creator = getCreator(twin?.creatorSlug);
  const label = creator ? getPublicCreatorName(creator) : "a sample city list";
  return `You matched ${twin?.overlap || 0}/5 with ${label}. This is seed comparison data, not an endorsement.`;
}

function getShareText(submission) {
  const category = getCategory(submission.category);
  const picks = submission.placeIds
    .map((placeId, index) => `${index + 1}. ${getPlace(placeId)?.name || "Unknown place"}`)
    .join("\n");
  return `I ranked my Top 5 ${category.name} spots in Seattle.\n${picks}\nSee if your list matches mine: ${shareUrlFor(submission)}`;
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-999px";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast(message);
}

function movePlace(categorySlug, placeId, direction) {
  const draft = getDraft(categorySlug);
  const index = draft.selected.indexOf(placeId);
  if (index < 0) return;
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= draft.selected.length) return;
  const next = [...draft.selected];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  draft.selected = next;
  persistDraft(categorySlug);
  renderEditor(categorySlug);
}

function reorderPlace(categorySlug, placeId, targetId, insertAfter = false) {
  if (!targetId || placeId === targetId) return;
  const draft = getDraft(categorySlug);
  const from = draft.selected.indexOf(placeId);
  const to = draft.selected.indexOf(targetId);
  if (from < 0 || to < 0 || from === to) return;
  const next = [...draft.selected];
  const [moved] = next.splice(from, 1);
  let insertIndex = to + (insertAfter ? 1 : 0);
  if (from < insertIndex) insertIndex -= 1;
  next.splice(insertIndex, 0, moved);
  draft.selected = next;
  persistDraft(categorySlug);
  renderEditor(categorySlug);
}

function submitRanking(categorySlug) {
  const draft = getDraft(categorySlug);
  if (draft.selected.length !== 5) return;
  const submission = {
    id: `lf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    city: "seattle",
    category: categorySlug,
    creatorSlug: null,
    source: "user",
    visibility: "public",
    createdAt: new Date().toISOString(),
    placeIds: draft.selected.map(resolvePlaceId)
  };
  const store = loadStore();
  const normalized = normalizeCategorySlug(categorySlug);
  const nextDrafts = { ...(store.drafts || {}) };
  delete nextDrafts[normalized];
  saveStore({ ...store, submissions: [submission, ...store.submissions], drafts: nextDrafts });
  drafts[normalized] = { query: "", selected: [] };
  track("submit_ranking", { city: "seattle", category: categorySlug });
  navigate(`/rank/${submission.id}?s=${encodeShareSubmission(submission)}`);
}

function suggestPlace(categorySlug) {
  const draft = getDraft(categorySlug);
  const name = draft.query.trim();
  if (!name) {
    showToast("Type a place name first.");
    return;
  }
  const store = loadStore();
  saveStore({
    ...store,
    suggestions: [{ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`, name, category: categorySlug, createdAt: new Date().toISOString() }, ...store.suggestions]
  });
  draft.query = "";
  persistDraft(categorySlug);
  renderEditor(categorySlug);
  showToast("Suggested place added to the review queue.");
}

document.addEventListener("click", async (event) => {
  const link = event.target.closest("a[data-link]");
  if (link) {
    const url = new URL(link.href);
    if (url.origin === window.location.origin) {
      event.preventDefault();
      navigate(`${url.pathname}${url.search}`);
    }
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  const categorySlug = actionButton.dataset.category;
  const placeId = actionButton.dataset.placeId;

  if (action === "add-place") {
    const draft = getDraft(categorySlug);
    if (draft.selected.length >= 5 || draft.selected.includes(placeId)) return;
    draft.selected = [...draft.selected, placeId];
    draft.query = "";
    persistDraft(categorySlug);
    renderEditor(categorySlug);
  }

  if (action === "remove-place") {
    const draft = getDraft(categorySlug);
    draft.selected = draft.selected.filter((id) => id !== placeId);
    persistDraft(categorySlug);
    renderEditor(categorySlug);
  }

  if (action === "move-up") movePlace(categorySlug, placeId, "up");
  if (action === "move-down") movePlace(categorySlug, placeId, "down");
  if (action === "submit-ranking") submitRanking(categorySlug);
  if (action === "suggest-place") suggestPlace(categorySlug);

  if (action === "set-tone") {
    const store = loadStore();
    saveStore({ ...store, tone: actionButton.dataset.tone || "spicy" });
    render();
  }

  if (action === "google-sign-in") signInWithGoogle();
  if (action === "sign-out") signOut();

  if (action === "copy-share") {
    const submission = getSubmissionById(actionButton.dataset.submissionId);
    if (submission) copyText(getShareText(submission), "Share text copied.");
  }

  if (action === "native-share") {
    const submission = getSubmissionById(actionButton.dataset.submissionId);
    if (!submission) return;
    const text = getShareText(submission);
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Local Five", text, url: shareUrlFor(submission) });
      } catch {
        showToast("Share canceled.");
      }
    } else {
      copyText(text, "Share text copied.");
    }
  }
});

document.addEventListener("input", (event) => {
  const input = event.target.closest("[data-place-search]");
  if (!input) return;
  const categorySlug = input.dataset.placeSearch;
  getDraft(categorySlug).query = input.value;
  persistDraft(categorySlug);
  renderEditor(categorySlug);
  const nextInput = document.querySelector("[data-place-search]");
  if (nextInput) {
    nextInput.focus();
    nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
  }
});

document.addEventListener("dragstart", (event) => {
  const item = event.target.closest(".rank-item");
  if (!item) return;
  nativeDrag = { placeId: item.dataset.placeId, category: item.dataset.category };
  event.dataTransfer.effectAllowed = "move";
});

document.addEventListener("dragover", (event) => {
  if (event.target.closest(".rank-item")) event.preventDefault();
});

document.addEventListener("drop", (event) => {
  const target = event.target.closest(".rank-item");
  if (!target || !nativeDrag) return;
  event.preventDefault();
  const rect = target.getBoundingClientRect();
  reorderPlace(nativeDrag.category, nativeDrag.placeId, target.dataset.placeId, event.clientY > rect.top + rect.height / 2);
  nativeDrag = null;
});

document.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest(".drag-handle");
  if (!handle) return;
  const item = handle.closest(".rank-item");
  pointerDrag = { placeId: item.dataset.placeId, category: item.dataset.category };
  document.body.classList.add("is-reordering");
});

document.addEventListener("pointermove", (event) => {
  if (!pointerDrag) return;
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".rank-item");
  if (!target) return;
  const rect = target.getBoundingClientRect();
  reorderPlace(pointerDrag.category, pointerDrag.placeId, target.dataset.placeId, event.clientY > rect.top + rect.height / 2);
});

document.addEventListener("pointerup", () => {
  pointerDrag = null;
  document.body.classList.remove("is-reordering");
});

window.addEventListener("popstate", render);

initAnalytics();
render();
initAuth();
