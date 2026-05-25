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
  { slug: "pho", name: "Pho", day: "Rainy day", description: "Broth-first local comfort.", accent: "#9f7a36" },
  { slug: "burgers", name: "Burgers", day: "Weekend", description: "Classic, smash, fancy, and late-night.", accent: "#8d5f42" },
  { slug: "coffee", name: "Coffee", day: "Morning", description: "The regular spots people defend.", accent: "#6d6756" },
  { slug: "brunch", name: "Brunch", day: "Sunday", description: "Worth the wait, or not.", accent: "#b97844" },
  { slug: "bakery", name: "Bakery", day: "Treat run", description: "Pastries, bread, and sweet opinions.", accent: "#a86758" },
  { slug: "ramen", name: "Ramen", day: "Cold night", description: "Bowls that fix the weather.", accent: "#8f6fb0" },
  {
    slug: "date-night",
    name: "Date Night",
    day: "Thursday",
    description: "Low-pressure restaurants that still feel considered.",
    accent: "#4b75bb"
  }
];

const places = [
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

const creators = [
  {
    slug: "sample-maya",
    displayName: "Maya Chen",
    handle: "@sample.seattlebites",
    city: "Seattle",
    bio: "Sample creator profile for testing food ranking pages.",
    optInStatus: "mock",
    specialties: ["Pizza", "Teriyaki", "Coffee"]
  },
  {
    slug: "sample-jordan",
    displayName: "Jordan Lee",
    handle: "@sample.southendfood",
    city: "Seattle",
    bio: "Sample South Seattle food personality used for product prototyping.",
    optInStatus: "mock",
    specialties: ["Tacos", "Pho", "Burgers"]
  },
  {
    slug: "sample-ava",
    displayName: "Ava Patel",
    handle: "@sample.weekendplates",
    city: "Seattle",
    bio: "Sample weekend guide profile for brunch, bakeries, and date-night lists.",
    optInStatus: "mock",
    specialties: ["Brunch", "Bakery", "Date Night"]
  }
];

const seedRankings = [
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

const drafts = {};
let nativeDrag = null;
let pointerDrag = null;

function p(id, name, category, neighborhood) {
  return {
    id,
    name,
    city: "seattle",
    category,
    neighborhood,
    sourceUrl: "",
    note: "Seed place for Local Five launch testing."
  };
}

function r(id, category, creatorSlug, placeIds) {
  return {
    id,
    city: "seattle",
    category,
    creatorSlug,
    source: creatorSlug === "admin" ? "admin_seed" : "creator_seed",
    visibility: "public",
    createdAt: "2026-05-25T00:00:00.000Z",
    placeIds
  };
}

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

function loadStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { submissions: [], suggestions: [], saved: [], ...parsed };
  } catch {
    return { submissions: [], suggestions: [], saved: [] };
  }
}

function saveStore(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
  return categories.find((category) => category.slug === slug) || categories[0];
}

function getPlace(id) {
  return places.find((place) => place.id === id);
}

function getCreator(slug) {
  return creators.find((creator) => creator.slug === slug);
}

function getPlacesFor(categorySlug) {
  return places.filter((place) => place.city === "seattle" && place.category === categorySlug);
}

function getDraft(categorySlug) {
  if (!drafts[categorySlug]) drafts[categorySlug] = { query: "", selected: [] };
  return drafts[categorySlug];
}

function getAllSubmissions() {
  return [...seedRankings, ...loadStore().submissions];
}

function getSubmissionsFor(categorySlug, options = {}) {
  return getAllSubmissions().filter(
    (submission) =>
      submission.city === "seattle" &&
      submission.category === categorySlug &&
      (!options.excludeId || submission.id !== options.excludeId)
  );
}

function getAggregate(categorySlug, options = {}) {
  const score = new Map();
  getSubmissionsFor(categorySlug, options).forEach((submission) => {
    submission.placeIds.forEach((placeId, index) => {
      const place = getPlace(placeId);
      if (!place) return;
      const item = score.get(placeId) || {
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
      score.set(placeId, item);
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
  const overlap = submission.placeIds.filter((placeId) => topFive.includes(placeId)).length;
  const exact = submission.placeIds.filter((placeId, index) => topFive[index] === placeId).length;
  const maxRank = Math.max(consensus.length + 1, 10);
  const rankedPicks = submission.placeIds.map((placeId, index) => {
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
  const score = Math.round((overlap / 5) * 90 + (exact / 5) * 10);
  return { consensus, overlap, exact, boldest, twin, score };
}

function getTasteTwin(submission) {
  const candidates = seedRankings.filter((item) => item.category === submission.category && item.id !== submission.id);
  let best = null;
  candidates.forEach((candidate) => {
    const overlap = submission.placeIds.filter((placeId) => candidate.placeIds.includes(placeId)).length;
    const exact = submission.placeIds.filter((placeId, index) => candidate.placeIds[index] === placeId).length;
    const score = overlap * 10 + exact * 7;
    if (!best || score > best.score) best = { ...candidate, overlap, exact, score };
  });
  return best;
}

function getRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);
  if (path === "/") return { name: "home" };
  if (parts[0] === "seattle" && !parts[1]) return { name: "city" };
  if (parts[0] === "seattle" && parts[1]) return { name: "category", categorySlug: parts[1] };
  if (parts[0] === "rank" && parts[1]) return { name: "rank", submissionId: parts[1] };
  if (parts[0] === "creator" && parts[1]) return { name: "creator", creatorSlug: parts[1], categorySlug: parts[2] };
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

function shell(mainHtml, options = {}) {
  const owner = isOwnerMode();
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="/" data-link aria-label="Local Five home">
          <span class="brand-mark">L5</span>
          <span>
            <strong>Local Five</strong>
            <small>Your city's Top 5, ranked by locals</small>
          </span>
        </a>
        <nav class="top-actions" aria-label="Primary">
          <a class="ghost-button" href="/seattle" data-link>Seattle</a>
          <a class="ghost-button" href="/creator/sample-maya" data-link>Creators</a>
          ${owner ? `<a class="ghost-button" href="/admin" data-link>Admin</a>` : ""}
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
    "Pick your favorites, compare with locals and creators, and share your Local Five list."
  );
  const featured = getCategory("pizza");
  shell(`
    <main>
      <section class="hero-band">
        <div class="hero-layout">
          <div class="hero-copy">
            <p class="eyebrow">Seattle beta</p>
            <h1>Rank your city's Top 5 food spots.</h1>
            <p>Pick your favorites, compare with locals and creators, and share your list.</p>
            <div class="hero-actions">
              <a class="primary-button" href="/seattle/pizza" data-link>Play Seattle Pizza</a>
              <a class="ghost-link" href="/seattle" data-link>Explore Seattle rankings</a>
            </div>
          </div>
          <div class="feature-card" style="--accent: ${featured.accent}">
            <span class="feature-kicker">Today's challenge</span>
            <h2>Seattle's Best Pizza</h2>
            <p>Make your Top 5. Then see if the city agrees.</p>
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
          <p>Local Five uses ranked lists instead of star ratings. Your #1 gets five points, your #5 gets one point, and the city scoreboard updates from those tradeoffs.</p>
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
            <p>Make your Top 5. Then see if the city agrees.</p>
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
        </aside>
      </section>
    </main>
  `);
  renderEditor(category.slug);
}

function renderRankPage(submissionId) {
  const submission = getAllSubmissions().find((item) => item.id === submissionId);
  if (!submission) {
    setMeta("Ranking not found | Local Five", "Make your own Local Five ranking.");
    shell(`
      <main class="section-wrap">
        <div class="empty-state large">
          <h1>That ranking is not on this device.</h1>
          <p>Local Five share pages are local in this MVP. Make a fresh Top 5 and the link will work here.</p>
          <a class="primary-button" href="/seattle/pizza" data-link>Make your Top 5</a>
        </div>
      </main>
    `);
    return;
  }

  const category = getCategory(submission.category);
  const stats = getSubmissionStats(submission);
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
            <p class="eyebrow">Result</p>
            <h1>You matched Seattle ${stats.overlap}/5.</h1>
            <p>${resultSentence(stats)}</p>
            <div class="score-grid">
              <div><strong>${stats.score}%</strong><span>taste score</span></div>
              <div><strong>${stats.exact}/5</strong><span>exact spots</span></div>
              <div><strong>${stats.boldest?.cityRank || "New"}</strong><span>boldest city rank</span></div>
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
          <p class="eyebrow">City consensus</p>
          <h2>Seattle's Top 5 ${escapeHtml(category.name)}</h2>
          ${leaderboardPreview(category.slug, submission.id)}
        </div>
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
  setMeta(`${creator.displayName} on Local Five`, `Compare your taste with ${creator.displayName}'s sample Local Five lists.`);
  shell(`
    <main>
      <section class="creator-band">
        <div class="creator-profile">
          <div class="avatar">${escapeHtml(initials(creator.displayName))}</div>
          <div>
            <p class="eyebrow">Sample creator profile</p>
            <h1>${escapeHtml(creator.displayName)}</h1>
            <p>${escapeHtml(creator.handle)} · ${escapeHtml(creator.city)}</p>
            <p>${escapeHtml(creator.bio)}</p>
            <span class="notice-pill">Mock profile, not an endorsement</span>
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
                  <h3>${escapeHtml(creator.displayName)}'s Top 5</h3>
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
  return `
    <a class="creator-mini" href="/creator/${creator.slug}" data-link>
      <span class="avatar small">${escapeHtml(initials(creator.displayName))}</span>
      <span>
        <strong>${escapeHtml(creator.displayName)}</strong>
        <small>${escapeHtml(creator.handle)} · sample profile</small>
      </span>
    </a>
  `;
}

function renderEditor(categorySlug) {
  const editor = document.querySelector("#rankEditor");
  if (!editor) return;
  const draft = getDraft(categorySlug);
  const selectedPlaces = draft.selected.map(getPlace).filter(Boolean);
  const selectedSet = new Set(draft.selected);
  const query = draft.query.trim().toLowerCase();
  const available = getPlacesFor(categorySlug)
    .filter((place) => !selectedSet.has(place.id))
    .filter((place) => !query || `${place.name} ${place.neighborhood}`.toLowerCase().includes(query))
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
                    <button class="drag-handle" type="button" aria-label="Drag ${escapeHtml(place.name)}">Grip</button>
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
                .map(
                  (place) => `
                    <button type="button" class="place-result" data-action="add-place" data-category="${categorySlug}" data-place-id="${place.id}" ${
                    selectedPlaces.length >= 5 ? "disabled" : ""
                  }>
                      <strong>${escapeHtml(place.name)}</strong>
                      <span>${escapeHtml(place.neighborhood)}</span>
                    </button>
                  `
                )
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
  return creator ? creator.displayName : "Sample city list";
}

function tasteTwinSentence(twin) {
  const creator = getCreator(twin?.creatorSlug);
  const label = creator ? `${creator.displayName}'s sample list` : "a sample city list";
  return `You matched ${twin?.overlap || 0}/5 with ${label}. Creator pages are mock until creators opt in.`;
}

function getShareText(submission) {
  const category = getCategory(submission.category);
  const picks = submission.placeIds
    .map((placeId, index) => `${index + 1}. ${getPlace(placeId)?.name || "Unknown place"}`)
    .join("\n");
  return `I ranked my Top 5 ${category.name} spots in Seattle.\n${picks}\nSee if your list matches mine: ${absoluteUrl(
    `/rank/${submission.id}`
  )}`;
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
    placeIds: [...draft.selected]
  };
  const store = loadStore();
  saveStore({ ...store, submissions: [submission, ...store.submissions] });
  drafts[categorySlug] = { query: "", selected: [] };
  track("submit_ranking", { city: "seattle", category: categorySlug });
  navigate(`/rank/${submission.id}`);
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
    renderEditor(categorySlug);
  }

  if (action === "remove-place") {
    const draft = getDraft(categorySlug);
    draft.selected = draft.selected.filter((id) => id !== placeId);
    renderEditor(categorySlug);
  }

  if (action === "move-up") movePlace(categorySlug, placeId, "up");
  if (action === "move-down") movePlace(categorySlug, placeId, "down");
  if (action === "submit-ranking") submitRanking(categorySlug);
  if (action === "suggest-place") suggestPlace(categorySlug);

  if (action === "copy-share") {
    const submission = getAllSubmissions().find((item) => item.id === actionButton.dataset.submissionId);
    if (submission) copyText(getShareText(submission), "Share text copied.");
  }

  if (action === "native-share") {
    const submission = getAllSubmissions().find((item) => item.id === actionButton.dataset.submissionId);
    if (!submission) return;
    const text = getShareText(submission);
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Local Five", text, url: absoluteUrl(`/rank/${submission.id}`) });
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
