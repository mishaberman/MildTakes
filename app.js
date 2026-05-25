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
  useRemoteRounds: false,
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
    category: "Group chat court",
    sponsor: "Group chats are a premium habitat.",
    prompt: "Rank these group-chat moves from least annoying to most annoying.",
    left: "Least annoying",
    right: "Most annoying",
    cards: [
      { id: "react", icon: "+", title: "Only reacting, never replying", detail: "Technically present. Emotionally elsewhere.", score: 34 },
      { id: "k", icon: "K", title: 'Replying "k"', detail: "One letter with courtroom energy.", score: 58 },
      { id: "read", icon: "R", title: "Reading and disappearing", detail: "Everyone saw the receipt.", score: 66 },
      { id: "voice", icon: "V", title: "Sending a 4-minute voice note", detail: "A podcast with no speed control.", score: 76 },
      { id: "spoiler", icon: "!", title: "Spoiling a new episode", detail: "Now the group needs a recovery plan.", score: 96 }
    ]
  },
  {
    id: "weekend-luxury",
    category: "Tiny wins",
    sponsor: "A soft landing for your weekend brand.",
    prompt: "Rank these small weekend wins from nice to day-saving.",
    left: "Nice",
    right: "Day-saving",
    cards: [
      { id: "snack", icon: "N", title: "Finding a forgotten snack", detail: "Past-you left a tiny gift.", score: 30 },
      { id: "parking", icon: "P", title: "Getting the closest parking spot", detail: "A small public miracle.", score: 48 },
      { id: "coffee", icon: "C", title: "Making perfect coffee", detail: "The day starts with one good decision.", score: 64 },
      { id: "laundry", icon: "L", title: "Fresh sheets at bedtime", detail: "Hotel feeling, home budget.", score: 84 },
      { id: "silence", icon: "S", title: "No plans and no guilt", detail: "The calendar finally behaves.", score: 94 }
    ]
  },
  {
    id: "minor-chaos",
    category: "Daily drama",
    sponsor: "Chaos pairs well with breakfast.",
    prompt: "Rank these everyday problems from mildly annoying to day-ruining.",
    left: "Mildly annoying",
    right: "Day-ruining",
    cards: [
      { id: "crumbs", icon: "T", title: "Toast crumbs in bed", detail: "Bad, but localized.", score: 38 },
      { id: "lid", icon: "D", title: "Loose coffee lid", detail: "Your shirt enters the story.", score: 62 },
      { id: "charger", icon: "B", title: "Phone at 3%", detail: "Modern suspense in your pocket.", score: 72 },
      { id: "wifi", icon: "W", title: "Wi-Fi drops mid-call", detail: "You freeze at the worst possible face.", score: 84 },
      { id: "password", icon: "*", title: "Password reset loop", detail: "Identity denied by several screens.", score: 94 }
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
    prompt: "Rank these road trip moves from forgivable to car-wide mutiny.",
    left: "Forgivable",
    right: "Mutiny",
    cards: [
      { id: "snacks", icon: "S", title: "Opening loud snacks", detail: "Annoying for ten seconds, worth it later.", score: 34 },
      { id: "directions", icon: "D", title: "Questioning the GPS", detail: "The passenger becomes a prophet.", score: 56 },
      { id: "temperature", icon: "T", title: "Changing the car temperature", detail: "Climate politics in one cabin.", score: 68 },
      { id: "playlist", icon: "P", title: "Skipping songs after 20 seconds", detail: "DJ power with no restraint.", score: 78 },
      { id: "bathroom", icon: "B", title: "Needing a bathroom right after leaving", detail: "The road trip loses five minutes immediately.", score: 90 }
    ]
  },
  {
    id: "kid-birthday",
    category: "Party politics",
    sponsor: "Family brands can behave here.",
    prompt: "Rank these kid-party choices from sweet to too much.",
    left: "Sweet",
    right: "Too much",
    cards: [
      { id: "theme", icon: "Th", title: "Matching plates and napkins", detail: "A little effort, nobody gets hurt.", score: 22 },
      { id: "cake", icon: "C", title: "A second cake", detail: "Generous, but the sugar math changes.", score: 56 },
      { id: "gift", icon: "G", title: "A gift bigger than the kid", detail: "Now someone has to fit it in a car.", score: 72 },
      { id: "parents", icon: "P", title: "Parents are required to stay", detail: "The adults just lost their afternoon.", score: 86 },
      { id: "confetti", icon: "*", title: "Loose glitter or confetti", detail: "The house will remember this party forever.", score: 96 }
    ]
  },
  {
    id: "pet-behavior",
    category: "Pet owner panic",
    sponsor: "Pet brands can sponsor the verdict.",
    prompt: "Rank these pet-owner moments from cute problem to full panic.",
    left: "Cute problem",
    right: "Full panic",
    cards: [
      { id: "laundry", icon: "L", title: "Sleeping on clean laundry", detail: "Annoying, but unfairly adorable.", score: 18 },
      { id: "zoomies", icon: "Z", title: "Midnight zoomies", detail: "Loud, harmless athletics.", score: 36 },
      { id: "drink", icon: "D", title: "Knocking over a full drink", detail: "Now the floor is involved.", score: 58 },
      { id: "couch", icon: "C", title: "Scratching the couch arm", detail: "Furniture damage with eye contact.", score: 78 },
      { id: "vet", icon: "V", title: "Sudden limp at 10 PM", detail: "Everyone is Googling and nobody is calm.", score: 96 }
    ]
  },
  {
    id: "coffee-shop",
    category: "Coffee shop law",
    sponsor: "A natural home for local cafes.",
    prompt: "Rank these coffee shop behaviors from totally fine to please stop.",
    left: "Totally fine",
    right: "Please stop",
    cards: [
      { id: "beans", icon: "B", title: "Asking one menu question", detail: "Normal curiosity, quick answer.", score: 20 },
      { id: "laptop", icon: "L", title: "Working on a laptop for one hour", detail: "Fair if coffee is involved.", score: 42 },
      { id: "outlet", icon: "O", title: "Saving a table before ordering", detail: "A mild land grab.", score: 62 },
      { id: "custom", icon: "8", title: "Ordering eight custom changes", detail: "The drink becomes a spreadsheet.", score: 76 },
      { id: "call", icon: "C", title: "Taking a speakerphone call", detail: "The whole shop gets invited.", score: 94 }
    ]
  },
  {
    id: "holiday-hosting",
    category: "Hosting heat",
    sponsor: "Holiday brands can earn their keep.",
    prompt: "Rank these hosting problems from small fix to night-ruiner.",
    left: "Small fix",
    right: "Night-ruiner",
    cards: [
      { id: "ice", icon: "I", title: "Running out of ice", detail: "Fixable if someone will make the run.", score: 34 },
      { id: "chairs", icon: "Ch", title: "Not enough chairs", detail: "Dinner becomes musical chairs.", score: 58 },
      { id: "oven", icon: "O", title: "The oven is already full", detail: "Every dish needs the same 25 minutes.", score: 76 },
      { id: "guest", icon: "+1", title: "A surprise extra guest", detail: "The place settings have questions.", score: 84 },
      { id: "topic", icon: "T", title: "Someone starts a risky dinner topic", detail: "Now dessert needs security.", score: 96 }
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
  selectedCardId: "",
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
  promptTease: document.querySelector("#promptTease"),
  axisLeft: document.querySelector("#axisLeft"),
  axisRight: document.querySelector("#axisRight"),
  rankStartLabel: document.querySelector("#rankStartLabel"),
  rankEndLabel: document.querySelector("#rankEndLabel"),
  takeList: document.querySelector("#takeList"),
  submitButton: document.querySelector("#submitButton"),
  resetButton: document.querySelector("#resetButton"),
  resultPanel: document.querySelector("#resultPanel"),
  scoreValue: document.querySelector("#scoreValue"),
  meterFill: document.querySelector("#meterFill"),
  resultTitle: document.querySelector("#resultTitle"),
  resultText: document.querySelector("#resultText"),
  shareGrid: document.querySelector("#shareGrid"),
  shareLine: document.querySelector("#shareLine"),
  resultBurst: document.querySelector("#resultBurst"),
  shareButton: document.querySelector("#shareButton"),
  copyButton: document.querySelector("#copyButton"),
  socialShareRow: document.querySelector("#socialShareRow"),
  copyStatus: document.querySelector("#copyStatus"),
  shareTextArea: document.querySelector("#shareTextArea"),
  authStatus: document.querySelector("#authStatus"),
  signInButton: document.querySelector("#signInButton"),
  signOutButton: document.querySelector("#signOutButton"),
  adminButton: document.querySelector("#adminButton"),
  authDialog: document.querySelector("#authDialog"),
  authTitle: document.querySelector("#authTitle"),
  authDescription: document.querySelector("#authDescription"),
  closeAuth: document.querySelector("#closeAuth"),
  authMessage: document.querySelector("#authMessage"),
  oauthGrid: document.querySelector("#oauthGrid"),
  accountCard: document.querySelector("#accountCard"),
  accountAvatar: document.querySelector("#accountAvatar"),
  accountName: document.querySelector("#accountName"),
  accountEmail: document.querySelector("#accountEmail"),
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

let reorderSession = null;
let suppressNextCardClick = false;

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
  const savedResult = getSavedResultForPuzzle(saved, todayKey, puzzle);

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
  state.selectedCardId = "";
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

function getPuzzleContentKey(puzzle) {
  return [
    puzzle.id,
    puzzle.prompt,
    puzzle.left,
    puzzle.right,
    puzzle.cards.map((card) => `${card.id}:${card.title}:${card.score}`).join("|")
  ].join("::");
}

function getSavedResultForPuzzle(saved, key, puzzle) {
  const result = saved.results?.[key];
  return result?.contentKey === getPuzzleContentKey(puzzle) ? result : null;
}

function render() {
  const stats = getStats();
  els.dailyNumber.textContent = `#${String(state.dailyNumber).padStart(3, "0")}`;
  els.streakValue.textContent = stats.streak;
  els.bestValue.textContent = stats.best === null ? "--" : `${stats.best}%`;
  els.categoryLabel.textContent = state.puzzle.category;
  els.sponsorLine.textContent = state.puzzle.sponsor;
  els.promptTitle.textContent = state.puzzle.prompt;
  els.promptTease.textContent = `Put the card closest to "${state.puzzle.left}" in spot 1. Put the card closest to "${state.puzzle.right}" in spot 5.`;
  els.axisLeft.textContent = state.puzzle.left;
  els.axisRight.textContent = state.puzzle.right;
  els.rankStartLabel.textContent = state.puzzle.left;
  els.rankEndLabel.textContent = state.puzzle.right;
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
    item.className = `take-card ${state.selectedCardId === card.id ? "is-selected" : ""}`;
    item.draggable = false;
    item.dataset.id = card.id;

    const slot = document.createElement("span");
    slot.className = "rank-slot";
    slot.innerHTML = `<span>${index + 1}</span>`;

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

    item.append(slot, copy, controls);
    els.takeList.append(item);
  });
}

function moveCard(cardId, direction) {
  if (state.locked) return;
  const currentIndex = state.order.indexOf(cardId);
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.order.length) return;
  [state.order[currentIndex], state.order[nextIndex]] = [state.order[nextIndex], state.order[currentIndex]];
  state.selectedCardId = "";
  renderCards();
}

function swapCards(firstId, secondId) {
  if (state.locked || firstId === secondId) return;
  const firstIndex = state.order.indexOf(firstId);
  const secondIndex = state.order.indexOf(secondId);
  if (firstIndex < 0 || secondIndex < 0) return;
  [state.order[firstIndex], state.order[secondIndex]] = [state.order[secondIndex], state.order[firstIndex]];
  state.selectedCardId = "";
  renderCards();
}

function resetReorderListeners() {
  window.removeEventListener("pointermove", updateReorderPointer);
  window.removeEventListener("pointerup", finishReorderPointer);
  window.removeEventListener("pointercancel", cancelReorderPointer);
}

function startReorderPointer(event) {
  if (reorderSession) return;
  if (state.locked || event.target.closest("[data-move]")) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const item = event.target.closest(".take-card");
  if (!item || !els.takeList.contains(item)) return;

  reorderSession = {
    dragging: false,
    id: item.dataset.id,
    item,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY
  };
  window.addEventListener("pointermove", updateReorderPointer, { passive: false });
  window.addEventListener("pointerup", finishReorderPointer);
  window.addEventListener("pointercancel", cancelReorderPointer);
}

function beginReorderDrag(event) {
  const session = reorderSession;
  if (!session) return;
  const rect = session.item.getBoundingClientRect();
  const placeholder = document.createElement("li");
  placeholder.className = "take-card drag-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  placeholder.style.height = `${rect.height}px`;
      placeholder.innerHTML = `
    <span class="rank-slot"><span>+</span></span>
    <span class="take-copy"><strong>Drop here</strong><span>Release to place this take.</span></span>
  `;

  session.dragging = true;
  session.offsetX = event.clientX - rect.left;
  session.offsetY = event.clientY - rect.top;
  session.placeholder = placeholder;
  session.item.after(placeholder);

  session.item.classList.add("is-dragging");
  Object.assign(session.item.style, {
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    position: "fixed",
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    zIndex: "1000"
  });
  document.body.append(session.item);
  document.body.classList.add("is-reordering");
  els.takeList.classList.add("is-reordering");
  state.selectedCardId = "";
  suppressNextCardClick = true;
}

function moveReorderPlaceholder(clientY) {
  const session = reorderSession;
  if (!session?.placeholder) return;
  const cards = [...els.takeList.querySelectorAll(".take-card:not(.drag-placeholder)")];
  const nextCard = cards.find((card) => {
    const rect = card.getBoundingClientRect();
    return clientY < rect.top + rect.height / 2;
  });
  els.takeList.insertBefore(session.placeholder, nextCard || null);
}

function updateReorderPointer(event) {
  const session = reorderSession;
  if (!session || event.pointerId !== session.pointerId) return;
  const distance = Math.hypot(event.clientX - session.startX, event.clientY - session.startY);
  if (!session.dragging && distance < 8) return;
  event.preventDefault();

  if (!session.dragging) beginReorderDrag(event);
  if (!session.dragging) return;

  session.item.style.left = `${event.clientX - session.offsetX}px`;
  session.item.style.top = `${event.clientY - session.offsetY}px`;
  moveReorderPlaceholder(event.clientY);

  if (event.clientY < 72) window.scrollBy(0, -10);
  if (event.clientY > window.innerHeight - 72) window.scrollBy(0, 10);
}

function finishReorderPointer(event) {
  const session = reorderSession;
  if (!session || event.pointerId !== session.pointerId) return;
  resetReorderListeners();

  if (session.dragging) {
    const nextOrder = [...els.takeList.children]
      .map((item) => (item === session.placeholder ? session.id : item.dataset.id))
      .filter(Boolean);
    state.order = nextOrder;
    session.item.remove();
    session.placeholder.remove();
    document.body.classList.remove("is-reordering");
    els.takeList.classList.remove("is-reordering");
    renderCards();
    setTimeout(() => {
      suppressNextCardClick = false;
    }, 350);
  }

  reorderSession = null;
}

function cancelReorderPointer(event) {
  const session = reorderSession;
  if (!session || event.pointerId !== session.pointerId) return;
  resetReorderListeners();
  if (session.dragging) {
    session.item.remove();
    session.placeholder.remove();
    document.body.classList.remove("is-reordering");
    els.takeList.classList.remove("is-reordering");
    renderCards();
  }
  suppressNextCardClick = false;
  reorderSession = null;
}

function resetOrder() {
  if (state.locked) return;
  state.order = seededShuffle(
    state.puzzle.cards.map((card) => card.id),
    `${state.todayKey}-${state.puzzle.id}`
  );
  state.selectedCardId = "";
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
    contentKey: getPuzzleContentKey(state.puzzle),
    playedAt: new Date().toISOString()
  };
  saveState({ ...saved, results });
  state.locked = true;
  state.result = results[state.todayKey];
  state.selectedCardId = "";
  render();
  celebrateResult(result.score);
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
  els.shareLine.textContent =
    result.score >= 76
      ? "That is share-worthy. Make somebody defend their own ranking."
      : "This is a perfect challenge score: easy to argue with, easy to replay.";
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

function celebrateResult(score) {
  if (!els.resultBurst) return;
  els.resultBurst.innerHTML = "";
  const pieces = score >= 76 ? 16 : 10;

  for (let index = 0; index < pieces; index += 1) {
    const piece = document.createElement("span");
    piece.style.setProperty("--x", `${Math.round((Math.random() - 0.5) * 240)}px`);
    piece.style.setProperty("--y", `${Math.round(-40 - Math.random() * 150)}px`);
    piece.style.setProperty("--r", `${Math.round((Math.random() - 0.5) * 160)}deg`);
    piece.style.setProperty("--delay", `${Math.round(Math.random() * 160)}ms`);
    els.resultBurst.append(piece);
  }

  setTimeout(() => {
    els.resultBurst.innerHTML = "";
  }, 1500);
}

function renderReveal(result) {
  els.revealList.innerHTML = "";
  result.target.forEach((cardId) => {
    const card = getCard(cardId);
    const item = document.createElement("li");
    item.className = "reveal-card";
    item.innerHTML = `
      <strong>${card.title}</strong>
      <span>${card.detail}</span>
      <div class="heat-bar" aria-label="Crowd heat ${card.score}%"><span style="width: ${card.score}%"></span></div>
    `;
    els.revealList.append(item);
  });
}

function getShareUrl() {
  return new URL("/", CONFIG.siteUrl || window.location.origin).toString();
}

function createShareTitle() {
  return `Mild Takes ${els.dailyNumber.textContent}`;
}

function createShareText(options = {}) {
  const result = state.result;
  const includeUrl = options.includeUrl !== false;
  const symbols = result.diffs.map((diff) => {
    if (diff === 0) return "🟩";
    if (diff === 1) return "🟨";
    if (diff === 2) return "🟧";
    return "⬛";
  });
  const exactLabel = result.exact === 1 ? "exact spot" : "exact spots";
  const lines = [
    createShareTitle(),
    `Crowd match: ${result.score}%`,
    symbols.join(""),
    `${result.exact}/5 ${exactLabel}`,
    "I ranked today's tiny social dilemma. Your turn:"
  ];

  if (includeUrl) lines.push(getShareUrl());
  return lines.join("\n");
}

async function shareResult() {
  if (!state.result) return;
  els.copyStatus.textContent = "";

  if (navigator.share) {
    try {
      await navigator.share({
        title: createShareTitle(),
        text: createShareText({ includeUrl: false }),
        url: getShareUrl()
      });
      trackShare("native_share");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  await copyResult();
}

function openShareWindow(url) {
  window.open(url, "_blank", "noopener,noreferrer,width=640,height=720");
}

async function shareToTarget(target) {
  if (!state.result) return;
  const url = getShareUrl();
  const text = createShareText();
  const textWithoutUrl = createShareText({ includeUrl: false });
  els.copyStatus.textContent = "";

  if (target === "x") {
    openShareWindow(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(textWithoutUrl)}&url=${encodeURIComponent(url)}`
    );
    els.copyStatus.textContent = "Opening X share.";
    trackShare("x");
    return;
  }

  if (target === "facebook") {
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(
        textWithoutUrl
      )}`
    );
    els.copyStatus.textContent = "Opening Facebook share.";
    trackShare("facebook");
    return;
  }

  if (target === "threads") {
    openShareWindow(`https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`);
    els.copyStatus.textContent = "Opening Threads share.";
    trackShare("threads");
    return;
  }

  if (target === "sms") {
    window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
    trackShare("sms");
    return;
  }

  if (target === "instagram") {
    await copyResult("instagram", "Copied for Instagram.");
  }
}

async function copyResult(method = "copy", successMessage = "Copied result.") {
  if (!state.result) return;
  const text = createShareText();
  try {
    await navigator.clipboard.writeText(text);
    els.copyStatus.textContent = successMessage;
    trackShare(method);
  } catch {
    if (legacyCopy(text)) {
      els.copyStatus.textContent = successMessage;
      trackShare(method === "copy" ? "legacy_copy" : `${method}_legacy_copy`);
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

function getAuthRedirectUrl() {
  return new URL("/", CONFIG.siteUrl || window.location.origin).toString();
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

  online.client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      persistSession: true
    }
  });
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
  if (!online.enabled || CONFIG.useRemoteRounds !== true) return;
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
  const puzzle = normalizeRemoteRound(data);
  const savedResult = getSavedResultForPuzzle(saved, playDate, puzzle);
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
  state.selectedCardId = "";
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

function getUserDisplayName() {
  const user = online.session?.user;
  return (
    online.profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Player"
  );
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function renderAuthDialogState() {
  const signedIn = Boolean(online.session?.user);
  const configured = hasSupabaseConfig();

  els.oauthGrid.hidden = signedIn || !configured;
  els.accountCard.hidden = !signedIn;
  els.signOutButton.hidden = !signedIn;

  if (signedIn) {
    const displayName = getUserDisplayName();
    els.authTitle.textContent = "Your account";
    els.authDescription.textContent = "Your plays, streak, and leaderboard spot are syncing with Mild Takes.";
    els.accountName.textContent = displayName;
    els.accountEmail.textContent = online.session.user.email || "";
    els.accountAvatar.textContent = getInitials(displayName) || "MT";
    els.authMessage.textContent = "Signed in.";
    return;
  }

  els.authTitle.textContent = "Save your streak";
  els.authDescription.textContent =
    "Sign in to persist your plays, appear on the leaderboard, and unlock owner reporting.";
  els.accountName.textContent = "Signed in";
  els.accountEmail.textContent = "";
  els.accountAvatar.textContent = "MT";
  els.authMessage.textContent = configured
    ? "Continue with Google to save your streak and leaderboard spot."
    : "Add Supabase keys in config.js to enable login.";
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
  renderAuthDialogState();
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
  const redirectTo = getAuthRedirectUrl();
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

els.takeList.addEventListener("pointerdown", startReorderPointer);

els.takeList.addEventListener("click", (event) => {
  if (suppressNextCardClick) {
    suppressNextCardClick = false;
    return;
  }

  const moveButton = event.target.closest("[data-move]");
  if (moveButton) {
    const item = moveButton.closest(".take-card");
    moveCard(item.dataset.id, moveButton.dataset.move === "up" ? -1 : 1);
    return;
  }

  const item = event.target.closest(".take-card");
  if (!item || state.locked) return;

  if (!state.selectedCardId) {
    state.selectedCardId = item.dataset.id;
    renderCards();
    return;
  }

  if (state.selectedCardId === item.dataset.id) {
    state.selectedCardId = "";
    renderCards();
    return;
  }

  swapCards(state.selectedCardId, item.dataset.id);
});

els.submitButton.addEventListener("click", lockIn);
els.resetButton.addEventListener("click", resetOrder);
els.shareButton.addEventListener("click", shareResult);
els.copyButton.addEventListener("click", () => copyResult());
els.socialShareRow.addEventListener("click", (event) => {
  const shareButton = event.target.closest("[data-share-target]");
  if (shareButton) shareToTarget(shareButton.dataset.shareTarget);
});
els.signInButton.addEventListener("click", () => {
  renderAuthDialogState();
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
