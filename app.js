const MS_PER_DAY = 86400000;
const START_DATE = new Date(2026, 0, 1);
const STORAGE_KEY = "mild-takes-state-v4";
const ANON_ID_KEY = "mild-takes-anon-id";
const CONFIG = {
  ownerEmail: "mishaberman@gmail.com",
  supabaseUrl: "",
  supabaseAnonKey: "",
  gaMeasurementId: "",
  metaPixelId: "",
  siteUrl: "",
  ...(window.MILD_TAKES_CONFIG || {})
};
const online = {
  client: null,
  enabled: false,
  session: null,
  profile: null,
  dailyStats: null,
  leaderboard: [],
  adminReady: false,
  remoteRoundLoaded: false
};

const puzzles = [
  {
    id: "group-chat-crimes",
    category: "Social survival",
    sponsor: "Group chats are a premium habitat.",
    prompt: "Sort these from quietly annoying to group-chat criminal.",
    left: "Forgivable",
    right: "Unforgivable",
    cards: [
      { id: "k", icon: "K", title: 'Replying "k"', detail: "Cold enough to change the room.", score: 58 },
      { id: "voice", icon: "♪", title: "A 4-minute voice note", detail: "The podcast nobody subscribed to.", score: 72 },
      { id: "read", icon: "R", title: "Reading and vanishing", detail: "Visible, silent, powerful.", score: 64 },
      { id: "spoiler", icon: "!", title: "Spoiling the finale", detail: "Friendship paperwork begins here.", score: 94 },
      { id: "react", icon: "+", title: "Only reacting with a thumb", detail: "Efficient or emotionally haunted?", score: 42 }
    ]
  },
  {
    id: "weekend-luxury",
    category: "Tiny luxury",
    sponsor: "A soft landing for your weekend brand.",
    prompt: "Sort these from nice to life-restoring.",
    left: "Nice",
    right: "Restorative",
    cards: [
      { id: "laundry", icon: "L", title: "Fresh sheets", detail: "Hotel brain, home budget.", score: 88 },
      { id: "coffee", icon: "C", title: "Perfect coffee", detail: "The day gets one good handshake.", score: 74 },
      { id: "silence", icon: "S", title: "An empty inbox", detail: "Suspicious, but gorgeous.", score: 92 },
      { id: "parking", icon: "P", title: "A front parking spot", detail: "A small civic miracle.", score: 56 },
      { id: "snack", icon: "N", title: "Finding a forgotten snack", detail: "Past-you did one thing right.", score: 48 }
    ]
  },
  {
    id: "minor-chaos",
    category: "Daily drama",
    sponsor: "Chaos pairs well with breakfast.",
    prompt: "Sort these from shrug to tiny disaster.",
    left: "Shrug",
    right: "Tiny disaster",
    cards: [
      { id: "charger", icon: "B", title: "Phone at 3%", detail: "Modern suspense.", score: 77 },
      { id: "wifi", icon: "W", title: "Wi-Fi drops mid-call", detail: "You freeze in your least flattering face.", score: 83 },
      { id: "lid", icon: "D", title: "Loose coffee lid", detail: "A sleeve-based emergency.", score: 70 },
      { id: "password", icon: "*", title: "Password reset loop", detail: "Identity denied by seven robots.", score: 91 },
      { id: "crumbs", icon: "T", title: "Toast crumbs in bed", detail: "A quiet structural failure.", score: 50 }
    ]
  },
  {
    id: "party-exits",
    category: "Exit strategy",
    sponsor: "Goodbyes with clean conversion.",
    prompt: "Sort these party exits from smooth to suspicious.",
    left: "Smooth",
    right: "Suspicious",
    cards: [
      { id: "coat", icon: "J", title: "The coat grab", detail: "Elegant, traditional, plausible.", score: 38 },
      { id: "bathroom", icon: "M", title: "The fake bathroom", detail: "A classic with legal risk.", score: 84 },
      { id: "early", icon: "A", title: "Announcing an early morning", detail: "Responsible, joyless, effective.", score: 45 },
      { id: "Irish", icon: "G", title: "Ghosting the whole room", detail: "Fast. Not admired.", score: 96 },
      { id: "ride", icon: "R", title: "Blaming your ride", detail: "The external villain helps.", score: 60 }
    ]
  },
  {
    id: "desk-snacks",
    category: "Snack court",
    sponsor: "Snackable attention, literally.",
    prompt: "Sort these desk snacks from harmless to dangerous.",
    left: "Harmless",
    right: "Dangerous",
    cards: [
      { id: "gum", icon: "G", title: "Gum", detail: "A utility item pretending to be food.", score: 24 },
      { id: "nuts", icon: "N", title: "Mixed nuts", detail: "Responsible until handful six.", score: 54 },
      { id: "chips", icon: "C", title: "Open chips", detail: "The bag has already won.", score: 80 },
      { id: "chocolate", icon: "H", title: "Chocolate squares", detail: "Mathematically impossible to stop.", score: 72 },
      { id: "orange", icon: "O", title: "A peeled orange", detail: "Bold scent footprint.", score: 62 }
    ]
  },
  {
    id: "text-energy",
    category: "Text energy",
    sponsor: "Short messages, long consequences.",
    prompt: "Sort these texts from calm to panic-inducing.",
    left: "Calm",
    right: "Panic",
    cards: [
      { id: "hey", icon: "H", title: "hey", detail: "Lowercase weather report.", score: 50 },
      { id: "call", icon: "?", title: "Can you call me?", detail: "A thunderclap in six words.", score: 94 },
      { id: "fine", icon: "F", title: "It's fine.", detail: "It is not fine.", score: 88 },
      { id: "seen", icon: "S", title: "Seen 2h ago", detail: "Time becomes architecture.", score: 66 },
      { id: "lol", icon: "L", title: "lol ok", detail: "The hallway lights flicker.", score: 76 }
    ]
  },
  {
    id: "errand-rage",
    category: "Errand meter",
    sponsor: "Local errands need local heroes.",
    prompt: "Sort these errands from fine to soul-taxing.",
    left: "Fine",
    right: "Soul-taxing",
    cards: [
      { id: "post", icon: "P", title: "Post office line", detail: "A room where clocks are rumors.", score: 83 },
      { id: "returns", icon: "R", title: "Returning one thing", detail: "Simple on paper. Never in life.", score: 67 },
      { id: "dmv", icon: "D", title: "DMV appointment", detail: "Bring documents and humility.", score: 96 },
      { id: "gas", icon: "F", title: "Getting gas", detail: "Annoying, but mercifully linear.", score: 42 },
      { id: "pharmacy", icon: "Rx", title: "Pharmacy pickup", detail: "The line knows your secrets.", score: 72 }
    ]
  },
  {
    id: "small-victories",
    category: "Tiny wins",
    sponsor: "Celebrate the small conversion.",
    prompt: "Sort these wins from pleasant to day-making.",
    left: "Pleasant",
    right: "Day-making",
    cards: [
      { id: "green", icon: "Go", title: "Hitting every green light", detail: "You are briefly chosen.", score: 86 },
      { id: "refund", icon: "$", title: "Unexpected refund", detail: "Money with a tiny cape.", score: 94 },
      { id: "fit", icon: "F", title: "Old jeans fit", detail: "A private parade.", score: 82 },
      { id: "cancelled", icon: "X", title: "A meeting gets canceled", detail: "Time returns from the sea.", score: 90 },
      { id: "weather", icon: "70", title: "Perfect weather", detail: "The city apologizes.", score: 66 }
    ]
  },
  {
    id: "house-sounds",
    category: "Night sounds",
    sponsor: "Sleepy people still click.",
    prompt: "Sort these night sounds from normal to nope.",
    left: "Normal",
    right: "Nope",
    cards: [
      { id: "fridge", icon: "F", title: "Fridge click", detail: "Domestic percussion.", score: 24 },
      { id: "pipe", icon: "P", title: "Pipe knock", detail: "The walls have opinions.", score: 55 },
      { id: "floor", icon: "_", title: "Floor creak", detail: "A full-body notification.", score: 78 },
      { id: "window", icon: "W", title: "Window tap", detail: "Absolutely not.", score: 96 },
      { id: "buzz", icon: "Z", title: "Mystery buzz", detail: "Tiny sound, huge investigation.", score: 67 }
    ]
  },
  {
    id: "vacation-flex",
    category: "Out of office",
    sponsor: "A sunny slot for travel money.",
    prompt: "Sort these vacation moments from good to unbeatable.",
    left: "Good",
    right: "Unbeatable",
    cards: [
      { id: "upgrade", icon: "U", title: "Free upgrade", detail: "Luxury by administrative accident.", score: 95 },
      { id: "view", icon: "V", title: "A real view", detail: "Not a parking lot wearing makeup.", score: 78 },
      { id: "nap", icon: "N", title: "The first nap", detail: "Your calendar exits the body.", score: 82 },
      { id: "meal", icon: "M", title: "Perfect first meal", detail: "The trip becomes official.", score: 72 },
      { id: "bag", icon: "B", title: "Bag arrives first", detail: "Airport theater with applause.", score: 66 }
    ]
  },
  {
    id: "office-omens",
    category: "Work weather",
    sponsor: "Workday attention without the meeting.",
    prompt: "Sort these office signs from harmless to bad omen.",
    left: "Harmless",
    right: "Bad omen",
    cards: [
      { id: "calendar", icon: "Cal", title: "Mystery calendar invite", detail: "No agenda, no peace.", score: 90 },
      { id: "printer", icon: "Pr", title: "Printer jam", detail: "A mechanical group project.", score: 52 },
      { id: "boss", icon: "B", title: "Boss says quick chat", detail: "The word quick is doing too much.", score: 96 },
      { id: "slack", icon: "@", title: "Three typing dots", detail: "Weather system forming.", score: 70 },
      { id: "coffee", icon: "C", title: "Empty coffee pot", detail: "Civilization thins.", score: 48 }
    ]
  },
  {
    id: "restaurant-tests",
    category: "Table stakes",
    sponsor: "A tasteful spot for food brands.",
    prompt: "Sort these restaurant moments from fine to unforgivable.",
    left: "Fine",
    right: "Unforgivable",
    cards: [
      { id: "water", icon: "W", title: "No water refill", detail: "Thirst becomes a subplot.", score: 61 },
      { id: "wobble", icon: "~", title: "Wobbly table", detail: "Dinner with physics.", score: 56 },
      { id: "cold", icon: "C", title: "Cold fries", detail: "A betrayal with salt.", score: 90 },
      { id: "wait", icon: "30", title: "Long wait after ordering", detail: "Hope leaves in courses.", score: 76 },
      { id: "split", icon: "%", title: "No split checks", detail: "Suddenly everyone is an accountant.", score: 68 }
    ]
  },
  {
    id: "airport-energy",
    category: "Airport energy",
    sponsor: "Travel brands fit here without blocking play.",
    prompt: "Sort these airport moments from calm to character-building.",
    left: "Calm",
    right: "Character-building",
    cards: [
      { id: "tsa-empty", icon: "T", title: "Empty TSA line", detail: "A civic hallucination.", score: 22 },
      { id: "gate-change", icon: "G", title: "Gate change", detail: "A walking tour nobody booked.", score: 70 },
      { id: "middle-seat", icon: "M", title: "Middle seat", detail: "Armrest diplomacy begins.", score: 86 },
      { id: "delay", icon: "D", title: "Rolling delay", detail: "Hope, refreshed every 20 minutes.", score: 92 },
      { id: "outlet", icon: "O", title: "Finding an outlet", detail: "Electricity as personal triumph.", score: 42 }
    ]
  },
  {
    id: "streaming-decisions",
    category: "Couch court",
    sponsor: "Streaming services live on tiny indecision.",
    prompt: "Sort these streaming habits from normal to chaotic.",
    left: "Normal",
    right: "Chaotic",
    cards: [
      { id: "trailer", icon: "Tr", title: "Watching trailers first", detail: "Due diligence with snacks.", score: 36 },
      { id: "rewatch", icon: "R", title: "Rewatching the same show", detail: "Comfort has a login.", score: 44 },
      { id: "skip", icon: "S", title: "Skipping recaps", detail: "Confidence or hubris.", score: 52 },
      { id: "browse", icon: "B", title: "Browsing for 40 minutes", detail: "The real feature film.", score: 88 },
      { id: "episode", icon: "E", title: "Starting at episode 3", detail: "A personality test.", score: 96 }
    ]
  },
  {
    id: "friendship-tests",
    category: "Friendship tests",
    sponsor: "A soft slot for social apps.",
    prompt: "Sort these friend behaviors from fine to we need to talk.",
    left: "Fine",
    right: "We need to talk",
    cards: [
      { id: "late", icon: "15", title: "Always 15 minutes late", detail: "Their timezone is emotional.", score: 72 },
      { id: "photos", icon: "Ph", title: "Posting bad photos", detail: "A public trust problem.", score: 84 },
      { id: "borrow", icon: "B", title: "Keeping borrowed stuff", detail: "Your hoodie has moved on.", score: 90 },
      { id: "cancel", icon: "C", title: "Canceling with notice", detail: "Sad, but honorable.", score: 42 },
      { id: "venmo", icon: "$", title: "Forgetting to pay back", detail: "Small money, large shadow.", score: 80 }
    ]
  },
  {
    id: "morning-signs",
    category: "Morning signs",
    sponsor: "Coffee brands may politely raise a hand.",
    prompt: "Sort these morning signs from promising to doomed.",
    left: "Promising",
    right: "Doomed",
    cards: [
      { id: "alarm", icon: "A", title: "Snoozed five times", detail: "The day is negotiating.", score: 78 },
      { id: "coffee-spill", icon: "C", title: "Coffee spill", detail: "The shirt takes the meeting.", score: 84 },
      { id: "keys", icon: "K", title: "Keys found instantly", detail: "Rare domestic alignment.", score: 20 },
      { id: "weather", icon: "W", title: "Rain with no jacket", detail: "Forecast ignored you back.", score: 72 },
      { id: "calendar", icon: "9", title: "No 9 AM meeting", detail: "A suspicious gift.", score: 32 }
    ]
  },
  {
    id: "delivery-drama",
    category: "Delivery drama",
    sponsor: "Food delivery can sponsor the recovery.",
    prompt: "Sort these delivery updates from fine to tragic.",
    left: "Fine",
    right: "Tragic",
    cards: [
      { id: "nearby", icon: "N", title: "Driver nearby forever", detail: "So close, spiritually distant.", score: 76 },
      { id: "wrong", icon: "W", title: "Wrong item", detail: "Dinner becomes improv.", score: 88 },
      { id: "missing", icon: "M", title: "Missing fries", detail: "The bag has betrayed you.", score: 92 },
      { id: "early", icon: "E", title: "Arrives early", detail: "A rare alert worth trusting.", score: 24 },
      { id: "photo", icon: "P", title: "Mystery door photo", detail: "A scavenger hunt with soup.", score: 82 }
    ]
  },
  {
    id: "fitness-excuses",
    category: "Workout math",
    sponsor: "Fitness brands, but keep it gentle.",
    prompt: "Sort these workout excuses from valid to deeply invented.",
    left: "Valid",
    right: "Invented",
    cards: [
      { id: "sore", icon: "S", title: "Still sore", detail: "The muscles filed a complaint.", score: 32 },
      { id: "laundry", icon: "L", title: "No clean socks", detail: "A real barrier, technically.", score: 66 },
      { id: "weather", icon: "W", title: "Weather is weird", detail: "Applicable 280 days a year.", score: 78 },
      { id: "tomorrow", icon: "T", title: "Tomorrow is better", detail: "The official motto.", score: 94 },
      { id: "charged", icon: "P", title: "Headphones not charged", detail: "Modern athletic collapse.", score: 84 }
    ]
  },
  {
    id: "shopping-signals",
    category: "Cart theory",
    sponsor: "Retailers can sponsor the basket.",
    prompt: "Sort these shopping signals from responsible to financially suspicious.",
    left: "Responsible",
    right: "Suspicious",
    cards: [
      { id: "coupon", icon: "%", title: "Using a coupon", detail: "A small victory with barcode energy.", score: 22 },
      { id: "free-ship", icon: "F", title: "Adding for free shipping", detail: "The cart wins by $12.", score: 76 },
      { id: "backup", icon: "2", title: "Buying a backup", detail: "Future-you has demands.", score: 64 },
      { id: "limited", icon: "L", title: "Limited edition", detail: "Scarcity pressed the button.", score: 86 },
      { id: "cart", icon: "C", title: "Abandoned cart return", detail: "The tab never really closed.", score: 58 }
    ]
  },
  {
    id: "weather-reactions",
    category: "Weather takes",
    sponsor: "Weather apps can enjoy the discourse.",
    prompt: "Sort these weather reactions from reasonable to dramatic.",
    left: "Reasonable",
    right: "Dramatic",
    cards: [
      { id: "umbrella", icon: "U", title: "Carrying an umbrella", detail: "Preparedness with a handle.", score: 28 },
      { id: "hoodie", icon: "H", title: "Hoodie in July", detail: "Personal climate system.", score: 58 },
      { id: "cancel", icon: "X", title: "Canceling over drizzle", detail: "Clouds held veto power.", score: 88 },
      { id: "shorts", icon: "S", title: "Shorts in winter", detail: "A declaration, not an outfit.", score: 82 },
      { id: "window", icon: "W", title: "Opening every window", detail: "Free air conditioning season.", score: 46 }
    ]
  },
  {
    id: "dating-apps",
    category: "Dating app court",
    sponsor: "A respectful slot for dating apps.",
    prompt: "Sort these profile moves from harmless to immediate left swipe.",
    left: "Harmless",
    right: "Left swipe",
    cards: [
      { id: "group", icon: "G", title: "Only group photos", detail: "A visual escape room.", score: 86 },
      { id: "fish", icon: "F", title: "Fish photo", detail: "The lake is a co-star.", score: 68 },
      { id: "empty", icon: "E", title: "Empty bio", detail: "Mystery as strategy.", score: 76 },
      { id: "dog", icon: "D", title: "Borrowed dog photo", detail: "Adorable, legally unclear.", score: 52 },
      { id: "negative", icon: "No", title: "List of dealbreakers", detail: "A warning label with hobbies.", score: 92 }
    ]
  },
  {
    id: "meeting-mayhem",
    category: "Meeting math",
    sponsor: "B2B ads belong after the score.",
    prompt: "Sort these meeting behaviors from fine to calendar villainy.",
    left: "Fine",
    right: "Villainy",
    cards: [
      { id: "mute", icon: "M", title: "Forgot to unmute", detail: "A rite of passage.", score: 36 },
      { id: "agenda", icon: "A", title: "No agenda", detail: "Everyone arrives spiritually barefoot.", score: 82 },
      { id: "over", icon: "+10", title: "Running ten minutes over", detail: "The next meeting starts bleeding.", score: 88 },
      { id: "camera", icon: "C", title: "Camera mysteriously off", detail: "Could be bandwidth. Could be breakfast.", score: 50 },
      { id: "friday", icon: "F", title: "Friday 4 PM invite", detail: "There are laws of nature.", score: 96 }
    ]
  },
  {
    id: "parent-texts",
    category: "Family texts",
    sponsor: "Phone plans, this one is yours.",
    prompt: "Sort these parent texts from sweet to alarming.",
    left: "Sweet",
    right: "Alarming",
    cards: [
      { id: "love", icon: "<3", title: "Love you", detail: "Pure, no notes.", score: 18 },
      { id: "question", icon: "?", title: "Question.", detail: "One word. Heavy weather.", score: 74 },
      { id: "news", icon: "N", title: "Saw this on the news", detail: "The link is already loading.", score: 82 },
      { id: "call", icon: "C", title: "Call me when free", detail: "Free is doing a lot.", score: 88 },
      { id: "emoji", icon: ":)", title: "Random emoji chain", detail: "Wholesome cryptography.", score: 42 }
    ]
  },
  {
    id: "home-maintenance",
    category: "Home alarms",
    sponsor: "A tidy slot for home services.",
    prompt: "Sort these home issues from later problem to fix it now.",
    left: "Later",
    right: "Now",
    cards: [
      { id: "bulb", icon: "B", title: "One bulb out", detail: "Aesthetic decay begins.", score: 30 },
      { id: "drip", icon: "D", title: "Slow faucet drip", detail: "A tiny metronome of guilt.", score: 72 },
      { id: "smoke", icon: "S", title: "Smoke alarm chirp", detail: "Every 43 seconds forever.", score: 92 },
      { id: "door", icon: "H", title: "Squeaky hinge", detail: "Haunted-house branding.", score: 46 },
      { id: "leak", icon: "L", title: "Ceiling spot", detail: "The house is texting in watercolor.", score: 98 }
    ]
  },
  {
    id: "road-trip",
    category: "Road trip law",
    sponsor: "Car snacks deserve a media plan.",
    prompt: "Sort these road trip moves from acceptable to mutiny.",
    left: "Acceptable",
    right: "Mutiny",
    cards: [
      { id: "playlist", icon: "P", title: "Skipping songs early", detail: "DJ power without restraint.", score: 76 },
      { id: "bathroom", icon: "B", title: "Bathroom after leaving", detail: "Timing as sabotage.", score: 84 },
      { id: "snacks", icon: "S", title: "Opening loud snacks", detail: "Crinkle-based ambience.", score: 48 },
      { id: "directions", icon: "D", title: "Questioning GPS", detail: "The passenger becomes a prophet.", score: 62 },
      { id: "temperature", icon: "T", title: "Changing temperature", detail: "Climate war in one cabin.", score: 70 }
    ]
  },
  {
    id: "kid-birthday",
    category: "Party politics",
    sponsor: "Family brands can behave here.",
    prompt: "Sort these kid-party moments from cute to too much.",
    left: "Cute",
    right: "Too much",
    cards: [
      { id: "theme", icon: "Th", title: "Full theme", detail: "Commitment with frosting.", score: 50 },
      { id: "gift", icon: "G", title: "Oversized gift", detail: "A living-room logistics issue.", score: 76 },
      { id: "cake", icon: "C", title: "Second cake", detail: "Joy, doubled and weaponized.", score: 68 },
      { id: "parents", icon: "P", title: "Parents must stay", detail: "Saturday is now booked.", score: 88 },
      { id: "confetti", icon: "*", title: "Loose confetti", detail: "A six-month cleanup decision.", score: 94 }
    ]
  },
  {
    id: "pet-behavior",
    category: "Pet jury",
    sponsor: "Pet brands can sponsor the verdict.",
    prompt: "Sort these pet behaviors from adorable to expensive.",
    left: "Adorable",
    right: "Expensive",
    cards: [
      { id: "zoomies", icon: "Z", title: "Midnight zoomies", detail: "Athletics with no calendar.", score: 42 },
      { id: "shoe", icon: "S", title: "Chewed shoe", detail: "Fashion becomes evidence.", score: 78 },
      { id: "couch", icon: "C", title: "Scratched couch", detail: "Interior design by claws.", score: 92 },
      { id: "stare", icon: "E", title: "Silent staring", detail: "Cute, then judicial.", score: 34 },
      { id: "vet", icon: "V", title: "Mystery limp", detail: "The invoice is already stretching.", score: 96 }
    ]
  },
  {
    id: "coffee-shop",
    category: "Coffee shop law",
    sponsor: "A natural home for local cafes.",
    prompt: "Sort these coffee shop moves from fine to main character.",
    left: "Fine",
    right: "Main character",
    cards: [
      { id: "laptop", icon: "L", title: "Laptop for hours", detail: "Rent paid in lattes.", score: 68 },
      { id: "call", icon: "C", title: "Taking a call", detail: "The whole shop joins briefly.", score: 82 },
      { id: "custom", icon: "12", title: "Huge custom order", detail: "A recipe with footnotes.", score: 74 },
      { id: "outlet", icon: "O", title: "Guarding an outlet", detail: "Power has a bodyguard.", score: 58 },
      { id: "beans", icon: "B", title: "Asking about every bean", detail: "Curiosity with a line behind it.", score: 62 }
    ]
  },
  {
    id: "holiday-hosting",
    category: "Hosting heat",
    sponsor: "Holiday brands can earn their keep.",
    prompt: "Sort these hosting moments from cozy to meltdown.",
    left: "Cozy",
    right: "Meltdown",
    cards: [
      { id: "chairs", icon: "Ch", title: "Not enough chairs", detail: "Architecture meets family politics.", score: 72 },
      { id: "oven", icon: "O", title: "Oven schedule conflict", detail: "Every dish wants the spotlight.", score: 86 },
      { id: "topic", icon: "T", title: "Dangerous dinner topic", detail: "Someone opened the group chat aloud.", score: 94 },
      { id: "playlist", icon: "P", title: "Perfect playlist", detail: "Mood management, achieved.", score: 28 },
      { id: "dessert", icon: "D", title: "Forgot dessert", detail: "The sweet ending filed a complaint.", score: 80 }
    ]
  }
];

const state = {
  puzzle: null,
  dailyNumber: 0,
  todayKey: "",
  remoteRoundId: "",
  order: [],
  locked: false,
  result: null,
  archiveMode: false
};

const els = {
  dateLabel: document.querySelector("#dateLabel"),
  dailyNumber: document.querySelector("#dailyNumber"),
  streakValue: document.querySelector("#streakValue"),
  bestValue: document.querySelector("#bestValue"),
  categoryLabel: document.querySelector("#categoryLabel"),
  sponsorLine: document.querySelector("#sponsorLine"),
  promptTitle: document.querySelector("#promptTitle"),
  axisLeft: document.querySelector("#axisLeft"),
  axisRight: document.querySelector("#axisRight"),
  takeList: document.querySelector("#takeList"),
  submitButton: document.querySelector("#submitButton"),
  resetButton: document.querySelector("#resetButton"),
  resultPanel: document.querySelector("#resultPanel"),
  scoreValue: document.querySelector("#scoreValue"),
  meterFill: document.querySelector("#meterFill"),
  resultTitle: document.querySelector("#resultTitle"),
  resultText: document.querySelector("#resultText"),
  shareGrid: document.querySelector("#shareGrid"),
  shareButton: document.querySelector("#shareButton"),
  copyButton: document.querySelector("#copyButton"),
  copyStatus: document.querySelector("#copyStatus"),
  shareTextArea: document.querySelector("#shareTextArea"),
  authStatus: document.querySelector("#authStatus"),
  signInButton: document.querySelector("#signInButton"),
  signOutButton: document.querySelector("#signOutButton"),
  adminButton: document.querySelector("#adminButton"),
  authDialog: document.querySelector("#authDialog"),
  closeAuth: document.querySelector("#closeAuth"),
  authMessage: document.querySelector("#authMessage"),
  onlineStatus: document.querySelector("#onlineStatus"),
  leaderboardList: document.querySelector("#leaderboardList"),
  publicMetrics: document.querySelector("#publicMetrics"),
  adminPanel: document.querySelector("#adminPanel"),
  adminEmail: document.querySelector("#adminEmail"),
  adminMetrics: document.querySelector("#adminMetrics"),
  adminRoundsTable: document.querySelector("#adminRoundsTable"),
  adminEventsTable: document.querySelector("#adminEventsTable"),
  adminNote: document.querySelector("#adminNote"),
  seedRoundsButton: document.querySelector("#seedRoundsButton"),
  refreshAdminButton: document.querySelector("#refreshAdminButton"),
  exportRoundsButton: document.querySelector("#exportRoundsButton"),
  revealList: document.querySelector("#revealList"),
  archiveRow: document.querySelector("#archiveRow"),
  helpDialog: document.querySelector("#helpDialog"),
  statsDialog: document.querySelector("#statsDialog"),
  playsStat: document.querySelector("#playsStat"),
  avgStat: document.querySelector("#avgStat"),
  bestStat: document.querySelector("#bestStat"),
  streakStat: document.querySelector("#streakStat")
};

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function prettyDate(date) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function dateFromStart(dayOffset) {
  return new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate() + dayOffset);
}

function getAnonId() {
  let anonId = localStorage.getItem(ANON_ID_KEY);
  if (!anonId) {
    anonId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    localStorage.setItem(ANON_ID_KEY, anonId);
  }
  return anonId;
}

function isOwner() {
  const email = online.session?.user?.email || "";
  return email.toLowerCase() === CONFIG.ownerEmail.toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function compactNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return new Intl.NumberFormat(undefined, { notation: Number(value) >= 10000 ? "compact" : "standard" }).format(
    Number(value)
  );
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(items, seedText) {
  const random = mulberry32(hashSeed(seedText));
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

function loadSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { results: {} };
  } catch {
    return { results: {} };
  }
}

function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function getStats() {
  const saved = loadSavedState();
  const results = Object.values(saved.results || {});
  const scores = results.map((item) => item.score);
  const best = scores.length ? Math.max(...scores) : null;
  const average = scores.length
    ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
    : null;

  return {
    played: scores.length,
    average,
    best,
    streak: calculateStreak(saved.results || {})
  };
}

function calculateStreak(results) {
  const playedDays = new Set(Object.keys(results));
  let cursor = new Date();
  let streak = 0;

  while (playedDays.has(formatDateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  }

  return streak;
}

function setupDailyPuzzle(puzzleIndex = null) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dailyNumber = Math.floor((today - START_DATE) / MS_PER_DAY) + 1;
  const resolvedIndex = puzzleIndex ?? ((dailyNumber - 1) % puzzles.length);
  const puzzle = puzzles[((resolvedIndex % puzzles.length) + puzzles.length) % puzzles.length];
  const saved = loadSavedState();
  const todayKey = puzzleIndex === null ? formatDateKey(today) : `archive-${puzzle.id}`;
  const savedResult = saved.results?.[todayKey];

  state.puzzle = puzzle;
  state.dailyNumber = puzzleIndex === null ? dailyNumber : resolvedIndex + 1;
  state.todayKey = todayKey;
  state.remoteRoundId = puzzle.id;
  state.order =
    savedResult?.order ||
    seededShuffle(
      puzzle.cards.map((card) => card.id),
      `${todayKey}-${puzzle.id}`
    );
  state.locked = Boolean(savedResult);
  state.result = savedResult || null;
  state.archiveMode = puzzleIndex !== null;

  els.dateLabel.textContent = puzzleIndex === null ? prettyDate(today) : "Archive round";
  render();
}

function getCard(cardId) {
  return state.puzzle.cards.find((card) => card.id === cardId);
}

function getTargetOrder() {
  return [...state.puzzle.cards].sort((a, b) => a.score - b.score).map((card) => card.id);
}

function render() {
  const stats = getStats();
  els.dailyNumber.textContent = `#${String(state.dailyNumber).padStart(3, "0")}`;
  els.streakValue.textContent = stats.streak;
  els.bestValue.textContent = stats.best === null ? "--" : `${stats.best}%`;
  els.categoryLabel.textContent = state.puzzle.category;
  els.sponsorLine.textContent = state.puzzle.sponsor;
  els.promptTitle.textContent = state.puzzle.prompt;
  els.axisLeft.textContent = state.puzzle.left;
  els.axisRight.textContent = state.puzzle.right;
  els.submitButton.disabled = state.locked;
  els.resetButton.disabled = state.locked;
  els.submitButton.textContent = state.locked ? "Locked" : "Lock it in";

  renderCards();
  renderArchiveButtons();
  renderStats();
  renderOnlineWidgets();

  if (state.locked && state.result) {
    renderResult(state.result);
  } else {
    els.resultPanel.hidden = true;
    els.copyStatus.textContent = "";
    els.shareTextArea.hidden = true;
  }
}

function renderCards() {
  els.takeList.innerHTML = "";

  state.order.forEach((cardId, index) => {
    const card = getCard(cardId);
    const item = document.createElement("li");
    item.className = "take-card";
    item.draggable = !state.locked;
    item.dataset.id = card.id;

    const icon = document.createElement("span");
    icon.className = "rank-icon";
    icon.textContent = card.icon;

    const copy = document.createElement("span");
    copy.className = "take-copy";
    copy.innerHTML = `<strong>${card.title}</strong><span>${card.detail}</span>`;

    const controls = document.createElement("span");
    controls.className = "move-controls";
    controls.innerHTML = `
      <button class="move-button" type="button" data-move="up" aria-label="Move ${card.title} up">↑</button>
      <button class="move-button" type="button" data-move="down" aria-label="Move ${card.title} down">↓</button>
    `;

    const [upButton, downButton] = controls.querySelectorAll("button");
    upButton.disabled = state.locked || index === 0;
    downButton.disabled = state.locked || index === state.order.length - 1;

    item.append(icon, copy, controls);
    els.takeList.append(item);
  });
}

function moveCard(cardId, direction) {
  if (state.locked) return;
  const currentIndex = state.order.indexOf(cardId);
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.order.length) return;
  [state.order[currentIndex], state.order[nextIndex]] = [state.order[nextIndex], state.order[currentIndex]];
  renderCards();
}

function resetOrder() {
  if (state.locked) return;
  state.order = seededShuffle(
    state.puzzle.cards.map((card) => card.id),
    `${state.todayKey}-${state.puzzle.id}`
  );
  renderCards();
}

function scoreOrder() {
  const target = getTargetOrder();
  const maxDistance = 12;
  let distance = 0;
  let exact = 0;
  const diffs = state.order.map((cardId, index) => {
    const diff = Math.abs(index - target.indexOf(cardId));
    distance += diff;
    if (diff === 0) exact += 1;
    return diff;
  });
  const score = Math.max(0, Math.round((1 - distance / maxDistance) * 100));
  return { score, exact, diffs, target, order: [...state.order] };
}

async function lockIn() {
  if (state.locked) return;
  const result = scoreOrder();
  const saved = loadSavedState();
  const results = saved.results || {};
  results[state.todayKey] = {
    ...result,
    puzzleId: state.puzzle.id,
    playedAt: new Date().toISOString()
  };
  saveState({ ...saved, results });
  state.locked = true;
  state.result = results[state.todayKey];
  render();
  track("round_completed", {
    round_id: state.remoteRoundId || state.puzzle.id,
    play_date: state.todayKey,
    score: result.score,
    exact: result.exact
  });
  await persistPlay(result);
  await refreshLiveData();
  els.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resultTone(score) {
  if (score >= 92) {
    return ["Borderline psychic.", "You matched the room so cleanly it is almost suspicious."];
  }
  if (score >= 76) {
    return ["Very crowd-coded.", "Your instincts are lined up with the daily majority."];
  }
  if (score >= 55) {
    return ["Respectably unpredictable.", "You and the crowd agree enough to sit at the same table."];
  }
  if (score >= 34) {
    return ["A spicy independent.", "Your order has personal lore. The crowd may need time."];
  }
  return ["Gloriously ungovernable.", "You saw the same five cards and chose a different universe."];
}

function renderResult(result) {
  const [title, text] = resultTone(result.score);
  const circumference = 327;
  els.resultPanel.hidden = false;
  els.scoreValue.textContent = `${result.score}%`;
  els.meterFill.style.strokeDashoffset = String(circumference - (circumference * result.score) / 100);
  els.resultTitle.textContent = title;
  els.resultText.textContent = `${text} You placed ${result.exact} of 5 cards in the exact crowd spot.`;
  els.shareTextArea.hidden = true;
  els.shareTextArea.value = "";

  els.shareGrid.innerHTML = "";
  result.diffs.forEach((diff) => {
    const cell = document.createElement("span");
    cell.className = `share-cell ${diff === 0 ? "hit" : diff === 1 ? "close" : diff === 2 ? "warm" : "miss"}`;
    els.shareGrid.append(cell);
  });

  renderReveal(result);
}

function renderReveal(result) {
  els.revealList.innerHTML = "";
  result.target.forEach((cardId) => {
    const card = getCard(cardId);
    const item = document.createElement("li");
    item.className = "reveal-card";
    item.innerHTML = `
      <strong>${card.icon} ${card.title}</strong>
      <span>${card.detail}</span>
      <div class="heat-bar" aria-label="Crowd heat ${card.score}%"><span style="width: ${card.score}%"></span></div>
    `;
    els.revealList.append(item);
  });
}

function createShareText() {
  const result = state.result;
  const symbols = result.diffs.map((diff) => {
    if (diff === 0) return "🟩";
    if (diff === 1) return "🟨";
    if (diff === 2) return "🟧";
    return "⬛";
  });

  return [
    `Mild Takes ${els.dailyNumber.textContent} - ${result.score}% crowd match`,
    symbols.join(""),
    `${result.exact}/5 exact spots`,
    "Can you sort the daily take better?"
  ].join("\n");
}

async function shareResult() {
  if (!state.result) return;
  const text = createShareText();
  els.copyStatus.textContent = "";

  if (navigator.share) {
    try {
      await navigator.share({ title: "Mild Takes", text });
      trackShare("native_share");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  await copyResult();
}

async function copyResult() {
  if (!state.result) return;
  const text = createShareText();
  try {
    await navigator.clipboard.writeText(text);
    els.copyStatus.textContent = "Copied.";
    trackShare("copy");
  } catch {
    if (legacyCopy(text)) {
      els.copyStatus.textContent = "Copied.";
      trackShare("legacy_copy");
      return;
    }
    els.shareTextArea.value = text;
    els.shareTextArea.hidden = false;
    els.shareTextArea.focus();
    els.shareTextArea.select();
    els.copyStatus.textContent = "Copy is blocked here. Select the result below.";
  }
}

function legacyCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-999px";
  textArea.style.top = "0";
  document.body.append(textArea);
  textArea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textArea.remove();
  }
}

function renderArchiveButtons() {
  els.archiveRow.innerHTML = "";
  const todayIndex = puzzles.indexOf(state.puzzle);
  const indices = [todayIndex + 1, todayIndex + 2, todayIndex + 3].map((index) => index % puzzles.length);

  indices.forEach((index) => {
    const button = document.createElement("button");
    button.className = "archive-button";
    button.type = "button";
    button.textContent = puzzles[index].category;
    button.addEventListener("click", () => setupDailyPuzzle(index));
    els.archiveRow.append(button);
  });
}

function renderStats() {
  const stats = getStats();
  els.playsStat.textContent = stats.played;
  els.avgStat.textContent = stats.average === null ? "--" : `${stats.average}%`;
  els.bestStat.textContent = stats.best === null ? "--" : `${stats.best}%`;
  els.streakStat.textContent = stats.streak;
}

function hasSupabaseConfig() {
  return Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
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

async function initializeOnline() {
  initAnalytics();
  renderOnlineWidgets();

  if (!hasSupabaseConfig()) {
    els.authMessage.textContent = "Add Supabase keys in config.js to enable login and live data.";
    return;
  }

  if (!window.supabase?.createClient) {
    els.authMessage.textContent = "Supabase client did not load. Check the CDN script or bundle it locally.";
    return;
  }

  online.client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  online.enabled = true;
  els.onlineStatus.textContent = "Connecting";

  const { data } = await online.client.auth.getSession();
  online.session = data.session;
  await ensureProfile();
  await loadRemoteDailyRound();
  await refreshLiveData();
  await loadAdminReport();
  track("page_view", { play_date: state.todayKey, round_id: state.remoteRoundId || state.puzzle.id });

  online.client.auth.onAuthStateChange(async (_event, session) => {
    online.session = session;
    await ensureProfile();
    renderOnlineWidgets();
    await refreshLiveData();
    await loadAdminReport();
  });
}

async function ensureProfile() {
  if (!online.enabled || !online.session?.user) {
    online.profile = null;
    return;
  }

  const user = online.session.user;
  const profile = {
    id: user.id,
    email: user.email,
    display_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Player",
    avatar_url: user.user_metadata?.avatar_url || null,
    last_seen_at: new Date().toISOString()
  };

  const { error } = await online.client.from("profiles").upsert(profile);
  if (!error) online.profile = profile;
}

function normalizeRemoteRound(row) {
  return {
    id: row.id,
    category: row.category,
    sponsor: row.sponsor || "A sponsor can own this daily moment.",
    prompt: row.prompt,
    left: row.axis_left,
    right: row.axis_right,
    cards: Array.isArray(row.cards) ? row.cards : []
  };
}

async function loadRemoteDailyRound() {
  if (!online.enabled) return;
  const today = new Date();
  const playDate = formatDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const { data, error } = await online.client
    .from("rounds")
    .select("*")
    .eq("play_date", playDate)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    online.remoteRoundLoaded = false;
    return;
  }

  const saved = loadSavedState();
  const savedResult = saved.results?.[playDate];
  const puzzle = normalizeRemoteRound(data);
  state.puzzle = puzzle;
  state.dailyNumber = data.day_number;
  state.todayKey = data.play_date;
  state.remoteRoundId = data.id;
  state.order =
    savedResult?.order ||
    seededShuffle(
      puzzle.cards.map((card) => card.id),
      `${data.play_date}-${data.id}`
    );
  state.locked = Boolean(savedResult);
  state.result = savedResult || null;
  state.archiveMode = false;
  online.remoteRoundLoaded = true;
  els.dateLabel.textContent = prettyDate(new Date(`${data.play_date}T00:00:00`));
  render();
}

async function persistPlay(result) {
  if (!online.enabled || state.archiveMode) return;
  const payload = {
    round_id: state.remoteRoundId || state.puzzle.id,
    play_date: state.todayKey,
    user_id: online.session?.user?.id || null,
    anon_id: getAnonId(),
    score: result.score,
    exact: result.exact,
    order_ids: result.order,
    target_ids: result.target,
    diffs: result.diffs,
    source: "web"
  };

  const { error } = await online.client.from("plays").insert(payload);
  if (error) {
    els.onlineStatus.textContent = "Play saved locally";
    return;
  }
  els.onlineStatus.textContent = "Play saved";
}

async function refreshLiveData() {
  if (!online.enabled || state.archiveMode) {
    renderOnlineWidgets();
    return;
  }

  const [leaderboardResult, statsResult] = await Promise.all([
    online.client.rpc("get_daily_leaderboard", { p_play_date: state.todayKey }),
    online.client.rpc("get_public_round_stats", { p_play_date: state.todayKey })
  ]);

  if (!leaderboardResult.error) online.leaderboard = leaderboardResult.data || [];
  if (!statsResult.error) online.dailyStats = statsResult.data?.[0] || null;
  els.onlineStatus.textContent = leaderboardResult.error || statsResult.error ? "Run schema" : "Live";
  renderOnlineWidgets();
}

function renderOnlineWidgets() {
  if (!hasSupabaseConfig()) {
    els.authStatus.textContent = "Offline mode";
    els.onlineStatus.textContent = "Setup needed";
  } else if (!online.enabled) {
    els.authStatus.textContent = "Connecting";
    els.onlineStatus.textContent = "Connecting";
  } else if (online.session?.user?.email) {
    els.authStatus.textContent = online.session.user.email;
    els.signInButton.textContent = "Account";
  } else {
    els.authStatus.textContent = "Guest";
    els.signInButton.textContent = "Sign in";
  }

  els.signOutButton.hidden = !online.session;
  els.adminButton.hidden = !isOwner();
  els.adminEmail.textContent = CONFIG.ownerEmail;
  renderLeaderboard();
  renderPublicMetrics();
  renderAdminShell();
}

function renderLeaderboard() {
  els.leaderboardList.innerHTML = "";
  if (!online.enabled) {
    els.leaderboardList.innerHTML = `<li class="empty-row">Connect Supabase to show daily scores.</li>`;
    return;
  }
  if (!online.leaderboard.length) {
    els.leaderboardList.innerHTML = `<li class="empty-row">No live scores yet. Be the first one in.</li>`;
    return;
  }

  online.leaderboard.slice(0, 10).forEach((row) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="leader-rank">${row.rank}</span>
      <span class="leader-name">${escapeHtml(row.display_name || "Guest")}</span>
      <span class="leader-score">${row.score}%</span>
    `;
    els.leaderboardList.append(item);
  });
}

function renderPublicMetrics() {
  const stats = online.dailyStats;
  const values = [
    ["Plays", compactNumber(stats?.plays)],
    ["Avg", stats?.avg_score === null || stats?.avg_score === undefined ? "--" : `${Math.round(stats.avg_score)}%`],
    ["Best", stats?.best_score === null || stats?.best_score === undefined ? "--" : `${stats.best_score}%`],
    ["Shares", compactNumber(stats?.shares)]
  ];
  els.publicMetrics.innerHTML = values
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
}

function track(name, params = {}) {
  if (window.gtag) window.gtag("event", name, params);
  if (window.fbq) window.fbq("trackCustom", name, params);
  if (online.enabled) {
    online.client
      .from("events")
      .insert({
        event_name: name,
        round_id: params.round_id || state.remoteRoundId || state.puzzle?.id || null,
        play_date: params.play_date || state.todayKey || null,
        anon_id: getAnonId(),
        user_id: online.session?.user?.id || null,
        metadata: params
      })
      .then(() => {});
  }
}

function trackShare(method) {
  track("share_result", {
    method,
    score: state.result?.score,
    round_id: state.remoteRoundId || state.puzzle.id,
    play_date: state.todayKey
  });
  refreshLiveData();
}

async function signIn(provider) {
  if (!online.enabled) {
    els.authMessage.textContent = "Supabase is not configured yet. Add keys in config.js first.";
    return;
  }
  const redirectTo = new URL("/", CONFIG.siteUrl || window.location.origin).toString();
  const { error } = await online.client.auth.signInWithOAuth({
    provider,
    options: { redirectTo }
  });
  if (error) els.authMessage.textContent = error.message;
}

async function signOut() {
  if (!online.enabled) return;
  await online.client.auth.signOut();
  online.session = null;
  online.profile = null;
  renderOnlineWidgets();
}

function renderAdminShell() {
  if (!isOwner()) {
    els.adminPanel.hidden = true;
    return;
  }
  if (location.hash === "#admin") els.adminPanel.hidden = false;
}

function buildRoundRows() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return puzzles.map((puzzle, index) => {
    const playDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    const playDateKey = formatDateKey(playDate);
    const dayNumber = Math.floor((playDate - START_DATE) / MS_PER_DAY) + 1;
    return {
      id: `${playDateKey}-${puzzle.id}`,
      day_number: dayNumber,
      play_date: playDateKey,
      category: puzzle.category,
      prompt: puzzle.prompt,
      axis_left: puzzle.left,
      axis_right: puzzle.right,
      sponsor: puzzle.sponsor,
      cards: puzzle.cards,
      is_published: true
    };
  });
}

async function seedRounds() {
  if (!online.enabled || !isOwner()) return;
  els.adminNote.textContent = "Publishing starter rounds...";
  const { error } = await online.client.from("rounds").upsert(buildRoundRows(), { onConflict: "id" });
  els.adminNote.textContent = error ? error.message : "Starter rounds published.";
  await loadAdminReport();
  await loadRemoteDailyRound();
}

async function loadAdminReport() {
  if (!online.enabled || !isOwner()) return;
  const today = state.todayKey;
  const [roundsResult, eventsResult, totalPlays, todayPlays, usersResult, sharesResult] = await Promise.all([
    online.client.from("rounds").select("id, day_number, play_date, category, prompt, is_published, cards").order("play_date"),
    online.client.from("events").select("event_name, round_id, created_at").order("created_at", { ascending: false }).limit(25),
    online.client.from("plays").select("id", { count: "exact", head: true }),
    online.client.from("plays").select("id", { count: "exact", head: true }).eq("play_date", today),
    online.client.from("profiles").select("id", { count: "exact", head: true }),
    online.client.from("events").select("id", { count: "exact", head: true }).eq("event_name", "share_result")
  ]);

  if (roundsResult.error) {
    els.adminNote.textContent = `Admin report blocked: ${roundsResult.error.message}`;
    return;
  }

  renderAdminMetrics({
    totalPlays: totalPlays.count,
    todayPlays: todayPlays.count,
    users: usersResult.count,
    shares: sharesResult.count
  });
  renderAdminRounds(roundsResult.data || buildRoundRows());
  renderAdminEvents(eventsResult.data || []);
}

function renderAdminMetrics(metrics) {
  const values = [
    ["Total plays", compactNumber(metrics.totalPlays)],
    ["Today", compactNumber(metrics.todayPlays)],
    ["Users", compactNumber(metrics.users)],
    ["Shares", compactNumber(metrics.shares)]
  ];
  els.adminMetrics.innerHTML = values
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
}

function renderAdminRounds(rounds) {
  const source = rounds.length ? rounds : buildRoundRows();
  els.adminRoundsTable.innerHTML = source
    .slice(0, 80)
    .map(
      (round) => `
      <tr>
        <td>${round.day_number || "--"}</td>
        <td>${escapeHtml(round.category)}</td>
        <td>${escapeHtml(round.prompt)}</td>
        <td>${round.is_published ? "Live" : "Draft"}</td>
      </tr>`
    )
    .join("");
}

function renderAdminEvents(events) {
  els.adminEventsTable.innerHTML =
    events
      .map(
        (event) => `
      <tr>
        <td>${new Date(event.created_at).toLocaleString()}</td>
        <td>${escapeHtml(event.event_name)}</td>
        <td>${escapeHtml(event.round_id || "--")}</td>
      </tr>`
      )
      .join("") || `<tr><td colspan="3">No events yet.</td></tr>`;
}

function exportRounds() {
  const text = JSON.stringify(buildRoundRows(), null, 2);
  els.shareTextArea.value = text;
  els.shareTextArea.hidden = false;
  els.shareTextArea.focus();
  els.shareTextArea.select();
  els.copyStatus.textContent = "Round JSON is selected below the result panel.";
}

els.takeList.addEventListener("click", (event) => {
  const moveButton = event.target.closest("[data-move]");
  if (!moveButton) return;
  const item = moveButton.closest(".take-card");
  moveCard(item.dataset.id, moveButton.dataset.move === "up" ? -1 : 1);
});

els.takeList.addEventListener("dragstart", (event) => {
  if (state.locked) return;
  const item = event.target.closest(".take-card");
  if (!item) return;
  item.classList.add("is-dragging");
  event.dataTransfer.setData("text/plain", item.dataset.id);
});

els.takeList.addEventListener("dragend", (event) => {
  const item = event.target.closest(".take-card");
  item?.classList.remove("is-dragging");
  document.querySelectorAll(".is-over").forEach((node) => node.classList.remove("is-over"));
});

els.takeList.addEventListener("dragover", (event) => {
  if (state.locked) return;
  event.preventDefault();
  const item = event.target.closest(".take-card");
  document.querySelectorAll(".is-over").forEach((node) => node.classList.remove("is-over"));
  item?.classList.add("is-over");
});

els.takeList.addEventListener("drop", (event) => {
  if (state.locked) return;
  event.preventDefault();
  const target = event.target.closest(".take-card");
  const draggedId = event.dataTransfer.getData("text/plain");
  if (!target || !draggedId || target.dataset.id === draggedId) return;

  const nextOrder = state.order.filter((cardId) => cardId !== draggedId);
  const targetIndex = nextOrder.indexOf(target.dataset.id);
  nextOrder.splice(targetIndex, 0, draggedId);
  state.order = nextOrder;
  renderCards();
});

els.submitButton.addEventListener("click", lockIn);
els.resetButton.addEventListener("click", resetOrder);
els.shareButton.addEventListener("click", shareResult);
els.copyButton.addEventListener("click", copyResult);
els.signInButton.addEventListener("click", () => {
  els.authMessage.textContent = hasSupabaseConfig()
    ? "Continue with Google to save your streak and leaderboard spot."
    : "Add Supabase keys in config.js to enable login.";
  els.authDialog.showModal();
});
els.signOutButton.addEventListener("click", signOut);
els.closeAuth.addEventListener("click", () => els.authDialog.close());
els.authDialog.addEventListener("click", (event) => {
  const providerButton = event.target.closest("[data-provider]");
  if (providerButton) signIn(providerButton.dataset.provider);
});
els.adminButton.addEventListener("click", () => {
  els.adminPanel.hidden = !els.adminPanel.hidden;
  if (!els.adminPanel.hidden) {
    location.hash = "admin";
    loadAdminReport();
  }
});
els.seedRoundsButton.addEventListener("click", seedRounds);
els.refreshAdminButton.addEventListener("click", loadAdminReport);
els.exportRoundsButton.addEventListener("click", exportRounds);

document.querySelector("#helpButton").addEventListener("click", () => els.helpDialog.showModal());
document.querySelector("#statsButton").addEventListener("click", () => {
  renderStats();
  els.statsDialog.showModal();
});
document.querySelector("#closeHelp").addEventListener("click", () => els.helpDialog.close());
document.querySelector("#closeStats").addEventListener("click", () => els.statsDialog.close());

setupDailyPuzzle();
renderAdminRounds(buildRoundRows());
initializeOnline();
