const STORAGE_KEY = "local-five-state-v1";
const CONFIG = {
  ownerEmail: "mishaberman@gmail.com",
  gaMeasurementId: "",
  metaPixelId: "",
  siteUrl: "",
  ...(window.MILD_TAKES_CONFIG || {}),
  ...(window.LOCAL_FIVE_CONFIG || {})
};

const cities = ["Seattle", "Portland", "Austin", "New York", "Los Angeles"];
const categories = [
  "Pizza",
  "Tacos",
  "Chicken",
  "Pho",
  "BBQ",
  "Toddler parks",
  "Hiking trails",
  "Date night",
  "Rainy day kids",
  "Coffee"
];

const seedLists = [
  {
    id: "sea-pizza-slice-map",
    city: "Seattle",
    category: "Pizza",
    title: "Top 5 pizza nights that work for groups",
    creator: "@raincitybites",
    platform: "TikTok",
    sourceUrl: "https://www.tiktok.com/",
    updated: "May 2026",
    summary:
      "A practical pizza list for when one person wants crisp crust, one wants booths, and one wants leftovers.",
    vibe: "Group dinner",
    color: "#e86d52",
    saves: 843,
    picks: [
      {
        name: "Moto Pizza",
        neighborhood: "West Seattle",
        note: "Detroit-style squares with the kind of toppings people keep talking about later."
      },
      {
        name: "Delancey",
        neighborhood: "Ballard",
        note: "The grown-up pizza night pick when crust matters more than speed."
      },
      {
        name: "Big Mario's",
        neighborhood: "Capitol Hill",
        note: "Late, loud, foldable, and easy to agree on."
      },
      {
        name: "Stevie's Famous",
        neighborhood: "Beacon Hill",
        note: "A newer-school slice stop with strong neighborhood energy."
      },
      {
        name: "Dino's Tomato Pie",
        neighborhood: "Capitol Hill",
        note: "Square slices, red booths, and no need to overthink the order."
      }
    ]
  },
  {
    id: "sea-pho-rain-plan",
    city: "Seattle",
    category: "Pho",
    title: "Top 5 pho bowls for a cold wet night",
    creator: "@seattlecomfortmap",
    platform: "Instagram",
    sourceUrl: "https://www.instagram.com/",
    updated: "May 2026",
    summary: "A cozy, broth-first list built for the nights when the weather wins.",
    vibe: "Rain cure",
    color: "#d59b36",
    saves: 621,
    picks: [
      {
        name: "Pho Bac Sup Shop",
        neighborhood: "Little Saigon",
        note: "A classic starting point with a room that feels made for soup weather."
      },
      {
        name: "Pho Viet Anh",
        neighborhood: "Lower Queen Anne",
        note: "Convenient, consistent, and easy to recommend to visitors."
      },
      {
        name: "Pho 99",
        neighborhood: "White Center",
        note: "A south-end staple when you want depth without ceremony."
      },
      {
        name: "Ba Bar",
        neighborhood: "Capitol Hill",
        note: "Not only pho, but an easy pick for a mixed table."
      },
      {
        name: "Pho Than Brothers",
        neighborhood: "Multiple",
        note: "Fast, familiar, and useful when the craving is urgent."
      }
    ]
  },
  {
    id: "sea-tacos-group-chat",
    city: "Seattle",
    category: "Tacos",
    title: "Top 5 taco plans for a picky group chat",
    creator: "@southsoundbites",
    platform: "Instagram",
    sourceUrl: "https://www.instagram.com/",
    updated: "May 2026",
    summary:
      "A practical taco list with sit-down, quick-stop, and late-night options so the whole group can say yes.",
    vibe: "Group-proof",
    color: "#cf6f32",
    saves: 687,
    picks: [
      {
        name: "Carmelo's Tacos",
        neighborhood: "Capitol Hill",
        note: "Fast, focused, and a useful answer when nobody wants a fussy plan."
      },
      {
        name: "Tacos Chukis",
        neighborhood: "Multiple",
        note: "The reliable crowd-pleaser that still feels local."
      },
      {
        name: "Maiz",
        neighborhood: "Pike Place",
        note: "Good for visitors who want something better than a random market snack."
      },
      {
        name: "El Moose",
        neighborhood: "Ballard",
        note: "Sit-down comfort when the table wants more than tacos."
      },
      {
        name: "La Fondita",
        neighborhood: "White Center",
        note: "Worth leaving the usual north-end loop."
      }
    ]
  },
  {
    id: "sea-chicken-crispy-circuit",
    city: "Seattle",
    category: "Chicken",
    title: "Top 5 crispy chicken fixes",
    creator: "@crispyseattle",
    platform: "TikTok",
    sourceUrl: "https://www.tiktok.com/",
    updated: "May 2026",
    summary:
      "Fried, saucy, spicy, and sandwich-shaped chicken picks for when the craving is very specific.",
    vibe: "Crispy mission",
    color: "#d79b2f",
    saves: 758,
    picks: [
      {
        name: "Sisters and Brothers",
        neighborhood: "Georgetown",
        note: "Nashville heat with enough personality to anchor the whole plan."
      },
      {
        name: "Milk Drunk",
        neighborhood: "Beacon Hill",
        note: "Chicken sandwich plus soft serve is a strong two-part argument."
      },
      {
        name: "Bok a Bok",
        neighborhood: "Multiple",
        note: "Korean-style comfort that travels well."
      },
      {
        name: "Cookie's Country Chicken",
        neighborhood: "Ballard",
        note: "A friendly fried-chicken answer with serious sandwich energy."
      },
      {
        name: "Chi Mac",
        neighborhood: "University District",
        note: "Saucy late-night chicken for a less polished, more fun plan."
      }
    ]
  },
  {
    id: "sea-bbq-smoke-tour",
    city: "Seattle",
    category: "BBQ",
    title: "Top 5 BBQ stops worth crossing town for",
    creator: "@pnwsmokeclub",
    platform: "YouTube",
    sourceUrl: "https://www.youtube.com/",
    updated: "April 2026",
    summary:
      "A meat-and-sides route for people who want a short list before committing to a weekend food plan.",
    vibe: "Weekend mission",
    color: "#7b5b48",
    saves: 392,
    picks: [
      {
        name: "Jack's BBQ",
        neighborhood: "SoDo",
        note: "Texas-style energy and the easiest first BBQ answer in town."
      },
      {
        name: "Wood Shop BBQ",
        neighborhood: "Central District",
        note: "A strong all-around pick when sides matter too."
      },
      {
        name: "Lil Red's Takeout",
        neighborhood: "Columbia City",
        note: "Jamaican and BBQ overlap in a way that makes the list less predictable."
      },
      {
        name: "Outsider BBQ",
        neighborhood: "Interbay",
        note: "A good add when you want a newer-school smoked meat stop."
      },
      {
        name: "Briley's BBQ",
        neighborhood: "Lake City",
        note: "North-end option that keeps showing up in local conversations."
      }
    ]
  },
  {
    id: "sea-toddler-parks-under-two",
    city: "Seattle",
    category: "Toddler parks",
    title: "Top 5 parks for toddlers under 2",
    creator: "@tinyseattleweekends",
    platform: "Instagram",
    sourceUrl: "https://www.instagram.com/",
    updated: "May 2026",
    summary:
      "Low-stress parks with short walks, stroller logic, and enough to do before nap time collapses the plan.",
    vibe: "Parent-tested",
    color: "#4d9d72",
    saves: 1184,
    picks: [
      {
        name: "Volunteer Park",
        neighborhood: "Capitol Hill",
        note: "Room to toddle, predictable paths, and easy bailout options."
      },
      {
        name: "Jefferson Park",
        neighborhood: "Beacon Hill",
        note: "Wide-open space and a playground setup that works for mixed ages."
      },
      {
        name: "Maple Leaf Reservoir Park",
        neighborhood: "Maple Leaf",
        note: "Flat loops and big sky without needing a long outing."
      },
      {
        name: "Carkeek Park",
        neighborhood: "Broadview",
        note: "Beach payoff if the day is going well, playground if it is not."
      },
      {
        name: "Oxbow Park",
        neighborhood: "Georgetown",
        note: "Short, odd, memorable, and good for a tiny adventure."
      }
    ]
  },
  {
    id: "sea-hikes-low-commitment",
    city: "Seattle",
    category: "Hiking trails",
    title: "Top 5 low-commitment hiking trails near Seattle",
    creator: "@afterworkoutside",
    platform: "Blog",
    sourceUrl: "https://example.com/",
    updated: "March 2026",
    summary: "The hikes people suggest when the group chat wants views but not a full expedition.",
    vibe: "Easy escape",
    color: "#3f7f85",
    saves: 734,
    picks: [
      {
        name: "Discovery Park Loop",
        neighborhood: "Magnolia",
        note: "Feels bigger than the effort, especially when you add the bluff."
      },
      {
        name: "Twin Falls",
        neighborhood: "North Bend",
        note: "Classic waterfall payoff without needing to plan all day around it."
      },
      {
        name: "Rattlesnake Ledge",
        neighborhood: "North Bend",
        note: "Popular for a reason, best when you can beat the peak crowd."
      },
      {
        name: "Coal Creek Falls",
        neighborhood: "Newcastle",
        note: "Useful shoulder-season pick with forest and manageable mileage."
      },
      {
        name: "Washington Park Arboretum",
        neighborhood: "Madison Valley",
        note: "Not a hike-hike, but perfect when the plan needs to stay in town."
      }
    ]
  },
  {
    id: "sea-date-night-low-pressure",
    city: "Seattle",
    category: "Date night",
    title: "Top 5 low-pressure date nights",
    creator: "@seattledatenotes",
    platform: "TikTok",
    sourceUrl: "https://www.tiktok.com/",
    updated: "May 2026",
    summary:
      "Ideas that feel considered without turning the night into a reservation spreadsheet.",
    vibe: "Easy chemistry",
    color: "#7462b7",
    saves: 529,
    picks: [
      {
        name: "Drinks in Ballard, walk to dessert",
        neighborhood: "Ballard",
        note: "Enough structure to feel intentional, enough options to stay flexible."
      },
      {
        name: "Ferry ride at sunset",
        neighborhood: "Waterfront",
        note: "A tiny trip without actually leaving the city."
      },
      {
        name: "Bookstore plus coffee",
        neighborhood: "Capitol Hill",
        note: "Good for conversation and a clean exit if the chemistry is not there."
      },
      {
        name: "Georgetown art walk",
        neighborhood: "Georgetown",
        note: "A little weird in the right way."
      },
      {
        name: "Golden Gardens fire pit attempt",
        neighborhood: "Ballard",
        note: "High upside if the logistics behave."
      }
    ]
  },
  {
    id: "la-tacos-weekend-starter",
    city: "Los Angeles",
    category: "Tacos",
    title: "Top 5 LA taco stops for a first weekend",
    creator: "@latacofile",
    platform: "TikTok",
    sourceUrl: "https://www.tiktok.com/",
    updated: "May 2026",
    summary: "A starter map for visitors who want legendary without spending the whole trip in line.",
    vibe: "Visitor starter",
    color: "#be4f3d",
    saves: 1431,
    picks: [
      { name: "Mariscos Jalisco", neighborhood: "Boyle Heights", note: "Shrimp tacos that make the list feel less generic." },
      { name: "Sonoratown", neighborhood: "Downtown", note: "Flour tortillas and a clear point of view." },
      { name: "Leo's Taco Truck", neighborhood: "Multiple", note: "Al pastor theater with late-night usefulness." },
      { name: "Holbox", neighborhood: "Historic South Central", note: "Seafood that raises the ceiling of the whole route." },
      { name: "Tire Shop Taqueria", neighborhood: "South LA", note: "A high-payoff stop when the plan can travel." }
    ]
  },
  {
    id: "portland-coffee-first-timer",
    city: "Portland",
    category: "Coffee",
    title: "Top 5 coffee stops for a first Portland weekend",
    creator: "@pdxslowmorning",
    platform: "Instagram",
    sourceUrl: "https://www.instagram.com/",
    updated: "April 2026",
    summary: "A visitor-friendly coffee crawl with enough range to avoid five versions of the same morning.",
    vibe: "Weekend starter",
    color: "#8d6b53",
    saves: 458,
    picks: [
      { name: "Coava", neighborhood: "Central Eastside", note: "Clean, serious, and easy to anchor a day around." },
      { name: "Proud Mary", neighborhood: "Alberta", note: "Good when brunch is part of the assignment." },
      { name: "Heart", neighborhood: "Multiple", note: "A modern Portland coffee baseline." },
      { name: "Barista", neighborhood: "Pearl", note: "Convenient for downtown wandering." },
      { name: "Good Coffee", neighborhood: "Multiple", note: "Friendly, polished, and easy to recommend." }
    ]
  },
  {
    id: "austin-bbq-first-line",
    city: "Austin",
    category: "BBQ",
    title: "Top 5 BBQ calls when people ask what is worth the line",
    creator: "@austinsmokeindex",
    platform: "Blog",
    sourceUrl: "https://example.com/",
    updated: "May 2026",
    summary: "A line-tolerance ranking for visitors who only have one BBQ window.",
    vibe: "Worth the wait",
    color: "#a65d3f",
    saves: 904,
    picks: [
      { name: "Franklin Barbecue", neighborhood: "East Austin", note: "The famous answer, still the reference point." },
      { name: "La Barbecue", neighborhood: "East Austin", note: "A strong pick when the group wants the classic Austin arc." },
      { name: "Micklethwait", neighborhood: "East Austin", note: "Trailer charm and serious sides." },
      { name: "InterStellar BBQ", neighborhood: "North Austin", note: "Destination energy beyond the usual downtown map." },
      { name: "Leroy and Lewis", neighborhood: "South Austin", note: "New-school BBQ for people who want more than brisket." }
    ]
  },
  {
    id: "nyc-pizza-visiting-friends",
    city: "New York",
    category: "Pizza",
    title: "Top 5 pizza stops when friends visit",
    creator: "@slicecompass",
    platform: "TikTok",
    sourceUrl: "https://www.tiktok.com/",
    updated: "May 2026",
    summary: "A mix of classic, scenic, and easy-to-defend pizza answers.",
    vibe: "Visitor proof",
    color: "#c74e4e",
    saves: 1572,
    picks: [
      { name: "L'Industrie", neighborhood: "Williamsburg", note: "Modern slice hype with enough payoff." },
      { name: "Joe's Pizza", neighborhood: "Greenwich Village", note: "The classic simple answer." },
      { name: "Scarr's", neighborhood: "Lower East Side", note: "A slice stop with a point of view." },
      { name: "Lucali", neighborhood: "Carroll Gardens", note: "When the night can revolve around pizza." },
      { name: "Mama's Too", neighborhood: "Upper West Side", note: "A square slice people remember." }
    ]
  }
];

const els = {
  citySelect: document.querySelector("#citySelect"),
  categorySelect: document.querySelector("#categorySelect"),
  searchInput: document.querySelector("#searchInput"),
  trendRow: document.querySelector("#trendRow"),
  resultCount: document.querySelector("#resultCount"),
  sourceGrid: document.querySelector("#sourceGrid"),
  detailVisual: document.querySelector("#detailVisual"),
  detailMeta: document.querySelector("#detailMeta"),
  detailTitle: document.querySelector("#detailTitle"),
  detailSummary: document.querySelector("#detailSummary"),
  pickList: document.querySelector("#pickList"),
  sourceLink: document.querySelector("#sourceLink"),
  saveListButton: document.querySelector("#saveListButton"),
  shareListButton: document.querySelector("#shareListButton"),
  shareDialog: document.querySelector("#shareDialog"),
  closeShare: document.querySelector("#closeShare"),
  shareText: document.querySelector("#shareText"),
  copyConsensusButton: document.querySelector("#copyConsensusButton"),
  consensusGrid: document.querySelector("#consensusGrid"),
  submitSourceButton: document.querySelector("#submitSourceButton"),
  submitDialog: document.querySelector("#submitDialog"),
  submitForm: document.querySelector("#submitForm"),
  closeSubmit: document.querySelector("#closeSubmit"),
  creatorInput: document.querySelector("#creatorInput"),
  urlInput: document.querySelector("#urlInput"),
  submitCity: document.querySelector("#submitCity"),
  submitCategory: document.querySelector("#submitCategory"),
  notesInput: document.querySelector("#notesInput"),
  submitStatus: document.querySelector("#submitStatus"),
  savedButton: document.querySelector("#savedButton"),
  savedCount: document.querySelector("#savedCount"),
  savedDialog: document.querySelector("#savedDialog"),
  closeSaved: document.querySelector("#closeSaved"),
  savedList: document.querySelector("#savedList"),
  adminButton: document.querySelector("#adminButton"),
  adminDialog: document.querySelector("#adminDialog"),
  closeAdmin: document.querySelector("#closeAdmin"),
  queueList: document.querySelector("#queueList"),
  toast: document.querySelector("#toast")
};

const isOwnerMode =
  new URLSearchParams(window.location.search).get("owner") === "1" ||
  localStorage.getItem("local-five-owner") === "1";

if (isOwnerMode) {
  localStorage.setItem("local-five-owner", "1");
  els.adminButton.hidden = false;
}

const state = {
  city: "Seattle",
  category: "All",
  query: "",
  selectedId: seedLists[0].id
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { saved: [], queue: [] };
  } catch {
    return { saved: [], queue: [] };
  }
}

function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}

function fillSelect(select, values, includeAll = false) {
  select.innerHTML = "";
  const options = includeAll ? ["All", ...values] : values;
  options.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function matchesQuery(list) {
  const query = state.query.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    list.title,
    list.city,
    list.category,
    list.creator,
    list.summary,
    list.vibe,
    ...list.picks.flatMap((pick) => [pick.name, pick.neighborhood, pick.note])
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function getFilteredLists() {
  return seedLists
    .filter((list) => list.city === state.city)
    .filter((list) => state.category === "All" || list.category === state.category)
    .filter(matchesQuery)
    .sort((a, b) => b.saves - a.saves);
}

function getSelectedList(filtered = getFilteredLists()) {
  return filtered.find((list) => list.id === state.selectedId) || filtered[0] || seedLists[0];
}

function renderTrends() {
  const trends = [
    ["Seattle", "Toddler parks", "Under-2 parks"],
    ["Seattle", "Tacos", "Group tacos"],
    ["Seattle", "Chicken", "Crispy chicken"],
    ["Seattle", "Pho", "Rainy night pho"],
    ["Seattle", "Pizza", "Group pizza"],
    ["Seattle", "Hiking trails", "Low-commitment trails"],
    ["Austin", "BBQ", "Worth the line"],
    ["Los Angeles", "Tacos", "LA starter tacos"],
    ["New York", "Pizza", "Visitor pizza"]
  ];
  els.trendRow.innerHTML = trends
    .map(
      ([city, category, label]) => `
        <button class="trend-chip" type="button" data-city="${city}" data-category="${category}">
          <span>${escapeHtml(city)}</span>
          <strong>${escapeHtml(label)}</strong>
        </button>
      `
    )
    .join("");
}

function renderSourceGrid() {
  const filtered = getFilteredLists();
  els.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "list" : "lists"}`;

  if (!filtered.length) {
    els.sourceGrid.innerHTML = `
      <div class="empty-state">
        <strong>No lists yet.</strong>
        <span>Submit a source for ${escapeHtml(state.city)} ${escapeHtml(state.category.toLowerCase())}.</span>
      </div>
    `;
    return;
  }

  const current = getSelectedList(filtered);
  state.selectedId = current.id;

  els.sourceGrid.innerHTML = filtered
    .map(
      (list) => `
        <article class="source-card ${list.id === current.id ? "is-active" : ""}" data-list-id="${list.id}">
          <div class="source-photo" style="--card-color: ${list.color}">
            <span>${escapeHtml(list.category.slice(0, 2).toUpperCase())}</span>
          </div>
          <div class="source-card-copy">
            <p class="source-meta">${escapeHtml(list.creator)} on ${escapeHtml(list.platform)} · ${escapeHtml(
              list.updated
            )}</p>
            <h3>${escapeHtml(list.title)}</h3>
            <p>${escapeHtml(list.summary)}</p>
            <div class="tag-row">
              <span>${escapeHtml(list.vibe)}</span>
              <span>${list.saves.toLocaleString()} saves</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderDetail() {
  const list = getSelectedList();
  els.detailVisual.style.setProperty("--detail-color", list.color);
  els.detailMeta.textContent = `${list.city} · ${list.category} · ${list.creator}`;
  els.detailTitle.textContent = list.title;
  els.detailSummary.textContent = list.summary;
  els.sourceLink.href = list.sourceUrl;
  els.saveListButton.textContent = isSaved(list.id) ? "Saved" : "Save list";
  els.pickList.innerHTML = list.picks
    .map(
      (pick, index) => `
        <li>
          <span class="pick-rank">${index + 1}</span>
          <span>
            <strong>${escapeHtml(pick.name)}</strong>
            <small>${escapeHtml(pick.neighborhood)}</small>
            <em>${escapeHtml(pick.note)}</em>
          </span>
        </li>
      `
    )
    .join("");
}

function getConsensusItems() {
  const filtered = getFilteredLists();
  const scoreMap = new Map();

  filtered.forEach((list) => {
    list.picks.forEach((pick, index) => {
      const key = pick.name.toLowerCase();
      const existing = scoreMap.get(key) || {
        name: pick.name,
        neighborhoods: new Set(),
        mentions: 0,
        score: 0,
        creators: new Set(),
        notes: []
      };
      existing.mentions += 1;
      existing.score += 6 - index;
      existing.neighborhoods.add(pick.neighborhood);
      existing.creators.add(list.creator);
      existing.notes.push(pick.note);
      scoreMap.set(key, existing);
    });
  });

  return [...scoreMap.values()]
    .sort((a, b) => b.score - a.score || b.mentions - a.mentions)
    .slice(0, 5);
}

function renderConsensus() {
  const items = getConsensusItems();
  if (!items.length) {
    els.consensusGrid.innerHTML = `
      <div class="empty-state">
        <strong>No consensus yet.</strong>
        <span>Add more source lists to see which places keep coming up.</span>
      </div>
    `;
    return;
  }

  els.consensusGrid.innerHTML = items
    .map(
      (item, index) => `
        <article class="consensus-card">
          <span class="pick-rank">${index + 1}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml([...item.neighborhoods].join(", "))}</p>
          <strong>${item.mentions} mention${item.mentions === 1 ? "" : "s"}</strong>
          <small>${escapeHtml([...item.creators].join(" · "))}</small>
        </article>
      `
    )
    .join("");
}

function isSaved(id) {
  return loadState().saved.includes(id);
}

function updateSavedCount() {
  els.savedCount.textContent = loadState().saved.length;
}

function toggleSave() {
  const list = getSelectedList();
  const savedState = loadState();
  const saved = new Set(savedState.saved);
  if (saved.has(list.id)) {
    saved.delete(list.id);
    showToast("Removed from saved.");
  } else {
    saved.add(list.id);
    showToast("Saved to your local list.");
    track("save_list", { city: list.city, category: list.category, list_id: list.id });
  }
  saveState({ ...savedState, saved: [...saved] });
  updateSavedCount();
  renderDetail();
}

function getShareUrl() {
  return CONFIG.siteUrl || window.location.href.split("#")[0];
}

function getShareText(list = getSelectedList()) {
  const picks = list.picks.map((pick, index) => `${index + 1}. ${pick.name}`).join("\n");
  return `Local Five: ${list.city} ${list.category}\n${list.title}\n${picks}\n${getShareUrl()}`;
}

function getShareLinks(text, url) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  return {
    x: `https://twitter.com/intent/tweet?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}`
  };
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
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
    showToast(successMessage);
  }
}

function renderSavedDialog() {
  const savedIds = loadState().saved;
  const savedLists = savedIds.map((id) => seedLists.find((list) => list.id === id)).filter(Boolean);
  els.savedList.innerHTML = savedLists.length
    ? savedLists
        .map(
          (list) => `
            <button class="compact-row" type="button" data-list-id="${list.id}">
              <strong>${escapeHtml(list.title)}</strong>
              <span>${escapeHtml(list.city)} · ${escapeHtml(list.category)} · ${escapeHtml(list.creator)}</span>
            </button>
          `
        )
        .join("")
    : `<div class="empty-state"><strong>No saves yet.</strong><span>Save lists you want to revisit.</span></div>`;
}

function renderShareDialog() {
  els.shareText.value = getShareText();
}

function renderQueueDialog() {
  const queue = loadState().queue || [];
  els.queueList.innerHTML = queue.length
    ? queue
        .map(
          (item) => `
            <article class="queue-row">
              <strong>${escapeHtml(item.creator)} · ${escapeHtml(item.city)} ${escapeHtml(item.category)}</strong>
              <a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.url)}</a>
              <span>${escapeHtml(item.notes || "No notes")}</span>
            </article>
          `
        )
        .join("")
    : `<div class="empty-state"><strong>Queue is empty.</strong><span>Submitted source links will appear here.</span></div>`;
}

function submitSource(event) {
  event.preventDefault();
  const savedState = loadState();
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    creator: els.creatorInput.value.trim(),
    url: els.urlInput.value.trim(),
    city: els.submitCity.value,
    category: els.submitCategory.value,
    notes: els.notesInput.value.trim(),
    createdAt: new Date().toISOString()
  };
  saveState({ ...savedState, queue: [item, ...(savedState.queue || [])] });
  els.submitStatus.textContent = "Added to review queue.";
  els.submitForm.reset();
  fillSelect(els.submitCity, cities);
  fillSelect(els.submitCategory, categories);
  renderQueueDialog();
  track("submit_source", { city: item.city, category: item.category });
}

function setFilters(next) {
  Object.assign(state, next);
  els.citySelect.value = state.city;
  els.categorySelect.value = state.category;
  els.searchInput.value = state.query;
  const filtered = getFilteredLists();
  if (!filtered.some((list) => list.id === state.selectedId)) {
    state.selectedId = filtered[0]?.id || seedLists.find((list) => list.city === state.city)?.id || seedLists[0].id;
  }
  render();
}

function render() {
  renderSourceGrid();
  renderDetail();
  renderConsensus();
  updateSavedCount();
}

function init() {
  initAnalytics();
  fillSelect(els.citySelect, cities);
  fillSelect(els.categorySelect, categories, true);
  fillSelect(els.submitCity, cities);
  fillSelect(els.submitCategory, categories);
  renderTrends();
  render();

  els.citySelect.value = state.city;
  els.categorySelect.value = state.category;
}

els.citySelect.addEventListener("change", () => setFilters({ city: els.citySelect.value }));
els.categorySelect.addEventListener("change", () => setFilters({ category: els.categorySelect.value }));
els.searchInput.addEventListener("input", () => setFilters({ query: els.searchInput.value }));

els.trendRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-city]");
  if (!button) return;
  setFilters({ city: button.dataset.city, category: button.dataset.category, query: "" });
});

els.sourceGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-list-id]");
  if (!card) return;
  state.selectedId = card.dataset.listId;
  render();
});

els.saveListButton.addEventListener("click", toggleSave);
els.shareListButton.addEventListener("click", () => {
  renderShareDialog();
  els.shareDialog.showModal();
  track("share_list", { list_id: getSelectedList().id });
});
els.copyConsensusButton.addEventListener("click", () => {
  const text = getConsensusItems()
    .map((item, index) => `${index + 1}. ${item.name}`)
    .join("\n");
  const category = state.category === "All" ? "local lists" : state.category;
  copyText(`Local Five consensus for ${state.city} ${category}\n${text}\n${getShareUrl()}`, "Consensus copied.");
});

els.closeShare.addEventListener("click", () => els.shareDialog.close());
els.shareDialog.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-share]");
  if (!button) return;
  const list = getSelectedList();
  const text = getShareText(list);
  const url = getShareUrl();
  const shareType = button.dataset.share;

  if (shareType === "copy") {
    await copyText(text, "List copied for sharing.");
    return;
  }

  if (shareType === "native") {
    if (navigator.share) {
      try {
        await navigator.share({ title: list.title, text, url });
        showToast("Share sheet opened.");
      } catch {
        showToast("Share canceled.");
      }
    } else {
      await copyText(text, "Phone share is not available here. List copied instead.");
    }
    return;
  }

  const links = getShareLinks(text, url);
  window.open(links[shareType], "_blank", "noopener,noreferrer");
});

els.submitSourceButton.addEventListener("click", () => {
  els.submitStatus.textContent = "";
  els.submitDialog.showModal();
});
els.closeSubmit.addEventListener("click", () => els.submitDialog.close());
els.submitForm.addEventListener("submit", submitSource);

els.savedButton.addEventListener("click", () => {
  renderSavedDialog();
  els.savedDialog.showModal();
});
els.closeSaved.addEventListener("click", () => els.savedDialog.close());
els.savedList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-list-id]");
  if (!row) return;
  const list = seedLists.find((item) => item.id === row.dataset.listId);
  if (!list) return;
  els.savedDialog.close();
  setFilters({ city: list.city, category: list.category, query: "" });
  state.selectedId = list.id;
  render();
});

els.adminButton.addEventListener("click", () => {
  renderQueueDialog();
  els.adminDialog.showModal();
});
els.closeAdmin.addEventListener("click", () => els.adminDialog.close());

init();
