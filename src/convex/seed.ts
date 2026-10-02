import { mutation } from "./_generated/server";

type SeedPlace = {
  title: string;
  destination: string;
  category:
    | "history"
    | "nature"
    | "market"
    | "food"
    | "culture"
    | "spiritual"
    | "adventure"
    | "hidden";
  summary: string;
  description: string;
  tips: string[];
  budget: "free" | "budget" | "moderate" | "splurge";
  bestTime?: string;
  hiddenGem: boolean;
  ratingSum?: number;
  ratingCount?: number;
};

const places: SeedPlace[] = [
  // ── Varanasi ────────────────────────────────────────────────────────────
  {
    title: "Assi Ghat at Dawn",
    destination: "Varanasi",
    category: "spiritual",
    summary:
      "The sunrise aarti locals attend — boats, bhajans and breakfast on the steps.",
    description:
      "While Dashashwamedh performs for the crowds downstream, Assi Ghat keeps the older rhythm: boatmen singing at first light, students stretching on the stone, and an aarti led by the neighbourhood rather than a ticketed show. Stay for breakfast at the step-side stalls when the city wakes up.",
    tips: [
      "Be on the steps by 5:15 AM for subah-e-Banaras; it ends before the tour boats arrive.",
      "The kettle-wala beside the tulsi plant has been pouring chai on this ghat for decades.",
      "Row out from the north end — the mid-ghat boatmen quote double.",
    ],
    bestTime: "October to March, sunrise",
    budget: "free",
    hiddenGem: false,
    ratingSum: 9,
    ratingCount: 2,
  },
  {
    title: "Tulsi Ghat & Laburnum Lane",
    destination: "Varanasi",
    category: "culture",
    summary:
      "Poetry mehfil, an old maths college and a silk-worm farm behind the ghats.",
    description:
      "One lane back from the river, the city changes pace entirely. Laburnum Lane holds a 17th-century poet's ghat, a Sanskrit college where students still debate at dusk, and a family that has reared silk worms in the same courtyard for four generations.",
    tips: [
      "Sunday evenings host a mehfil (poetry recital) — ask at the ghat steps for the house number.",
      "Photograph the laburnum arch in bloom, but ask before shooting inside the courtyard.",
    ],
    bestTime: "February to April",
    budget: "free",
    hiddenGem: true,
  },
  {
    title: "Kashi Vishwanath Corridor",
    destination: "Varanasi",
    category: "spiritual",
    summary:
      "The rebuilt temple axis, and the old houses that reappeared around it.",
    description:
      "The corridor reopened the temple to the river with wide sandstone plazas. Walk it early and you'll see the other story too: the excavated foundations of the bathing ghats and the surviving havelis that the new axis uncovered.",
    tips: [
      "Locker rooms fill after 9 AM — go at opening with nothing but a phone and water.",
      "The rooftop cafes on the second terrace look straight down the corridor axis.",
    ],
    bestTime: "Year-round; avoid festival crowds",
    budget: "budget",
    hiddenGem: false,
  },
  {
    title: "Godowlia Chaat Lane",
    destination: "Varanasi",
    category: "food",
    summary: "Kachori-sabzi at 7 AM, tamari at noon, thandai after dark.",
    description:
      "A single lane that eats differently every few hours. Mornings belong to the kachori-sabzi stalls, midday to the tamari and litti sellers, and evenings to the thandai counters that only set up when the heat drops.",
    tips: [
      "Start at the corner stall with the steel kadhai — the queue is the menu.",
      "Ask for 'kam mirch' if you want the Banarasi mild, not the tourist-hot version.",
    ],
    bestTime: "September to March",
    budget: "budget",
    hiddenGem: false,
    ratingSum: 5,
    ratingCount: 1,
  },
  {
    title: "Sarai Mohana Weavers' Quarter",
    destination: "Varanasi",
    category: "market",
    summary: "Where the Banarasi silk actually gets woven, lane by lane.",
    description:
      "Showrooms quote the price; Sarai Mohana shows the work. Pit looms clatter inside low courtyards where families weave zari brocade, and you can watch a single saree take weeks — then buy it from the same household.",
    tips: [
      "Visit after 4 PM when the looms are running and the courtyards are open.",
      "Ask to see the 'kadwa' weave — the motif cut by hand, which is why it costs more.",
    ],
    bestTime: "October to March",
    budget: "budget",
    hiddenGem: true,
    ratingSum: 5,
    ratingCount: 1,
  },
  {
    title: "Ramnagar Fort & Boat Crossing",
    destination: "Varanasi",
    category: "history",
    summary:
      "The king's fortified island across the river — museum, stables and silence.",
    description:
      "A short boat ride upstream lands you at the 18th-century fort of the Kashi Nares. Inside: a cluttered museum of palanquins and vintage cars, a functioning temple, and the ramparts where the whole ghats line curves away behind you.",
    tips: [
      "Take the ferry from Assi side rather than a private boat — a tenth of the price.",
      "The fort museum is unlabelled; hire the caretaker as a guide for a small tip.",
    ],
    bestTime: "October to February",
    budget: "budget",
    hiddenGem: true,
  },

  // ── Hampi ───────────────────────────────────────────────────────────────
  {
    title: "Hemakuta Hill for Sunset",
    destination: "Hampi",
    category: "history",
    summary:
      "Pre-Vijayanagara temples on a boulder slope, facing the whole ruinscape.",
    description:
      "The slope behind the Virupaksha temple holds a cluster of older, simpler shrines and the best free view in Hampi: the granite sea, the market lane below, and Matanga Hill silhouetted as the light goes.",
    tips: [
      "Climb the steps on the temple's north side — most visitors stay by the archway.",
      "The stone behind the Kadalekalu Ganesha shrine is the classic wide-angle spot.",
    ],
    bestTime: "November to February, one hour before sunset",
    budget: "free",
    hiddenGem: false,
  },
  {
    title: "Anegundi Village Walk",
    destination: "Hampi",
    category: "culture",
    summary:
      "Kishkindha across the river: painted houses, cotton fields and Pampa's shrine.",
    description:
      "Hop the coracle to the north bank and Hampi's ruins give way to a living village — lime-washed houses with cattle painted on the walls, banana groves, and the ancient Pampadevi temple that the Vijayanagara kings worshipped at.",
    tips: [
      "Take the coracle from the Virupaksha bazaar steps; walk back via the dame bridge option.",
      "Visit the Ranganatha temple first — it's quietest before the village school lets out.",
    ],
    bestTime: "October to February",
    budget: "budget",
    hiddenGem: true,
  },
  {
    title: "Sanapur Lake & Boulder Rapids",
    destination: "Hampi",
    category: "adventure",
    summary:
      "A reservoir ringed by granite, with a cliff jump locals use on hot afternoons.",
    description:
      "Twenty minutes past the ruins, the irrigation reservoir folds into a gorge of stacked boulders. Locals swim from the flat rocks, jump from the low cliff, and dry off under the banyans — no ticket, no crowd, no rails.",
    tips: [
      "The jump rock is the second one downstream; check the depth after monsoon first.",
      "Carry water and fruit — the only stall closes by 5 PM.",
    ],
    bestTime: "October to March",
    budget: "free",
    hiddenGem: true,
  },
  {
    title: "Vijaya Vittala Temple & Stone Chariot",
    destination: "Hampi",
    category: "history",
    summary:
      "The musical pillars, the stone chariot and the finest sculpture of the empire.",
    description:
      "The jewel of Hampi: a mandapa whose granite columns ring different notes when tapped, a chariot carved complete with wheels and horses, and a courtyard that explains in one glance why Vijayanagara drew traders from across Asia.",
    tips: [
      "Enter at 8 AM — you'll have the pillars almost alone before the first buses.",
      "Tap the pillars gently with a knuckle, not a coin; the guards do ask.",
    ],
    bestTime: "November to February",
    budget: "moderate",
    hiddenGem: false,
    ratingSum: 10,
    ratingCount: 2,
  },
  {
    title: "Tungabhadra Coracle Crossing",
    destination: "Hampi",
    category: "adventure",
    summary:
      "Spin across the river in a round basket boat for a handful of rupees.",
    description:
      "The round coracles that ferry villagers across the Tungabhadra take four or five passengers and about ninety seconds. It is the fastest way to the north-bank ruins, and the most fun commute in Karnataka.",
    tips: [
      "Negotiate the round fare before boarding — one-way is the norm, not return.",
      "Sit on the rim facing forward; the spin is part of the ride.",
    ],
    bestTime: "October to February",
    budget: "budget",
    hiddenGem: true,
  },

  // ── Shillong ────────────────────────────────────────────────────────────
  {
    title: "Laitlum Canyons",
    destination: "Shillong",
    category: "nature",
    summary: "A grassed cliff edge where the Khasi hills fall away into cloud.",
    description:
      "Forty kilometres from town, the plateau simply stops. Laitlum's canyon rim walks you along wind-flattened grass with terraced villages far below and, on most afternoons, cloud pouring through the gap like slow water.",
    tips: [
      "Get there by 10 AM — mist closes the view most days by early afternoon.",
      "Take the stone steps down to the viewing ledge; the top rim alone undersells it.",
    ],
    bestTime: "September to November, clear mornings",
    budget: "free",
    hiddenGem: false,
    ratingSum: 4,
    ratingCount: 1,
  },
  {
    title: "Khyndai Lad Food Stalls",
    destination: "Shillong",
    category: "food",
    summary:
      "Tungrymbai, jadoh and smoked pork at the market the city eats lunch at.",
    description:
      "Above Madan Market, a row of tin-roofed stalls serves the Khasi working lunch: jadoh rice with meat, tungrymbai fermented soybean, dohneiiong with rice bread, all cooked in the morning and gone by two.",
    tips: [
      "Arrive 12:30–1:30 PM; several stalls sell out well before the office crowd lands.",
      "Point at what the queue is having — the menu boards are optional.",
    ],
    bestTime: "Year-round",
    budget: "budget",
    hiddenGem: true,
    ratingSum: 4,
    ratingCount: 1,
  },
  {
    title: "Umiam Lake at First Light",
    destination: "Shillong",
    category: "nature",
    summary:
      "A reservoir of a hundred islands, glass-flat before the city wakes.",
    description:
      "The road to Guwahati drops past Umiam just as dawn reaches the water. Kayaks slip out from the north shore, pine ridges stack behind the islands, and the whole valley holds still for about an hour.",
    tips: [
      "Stop at the viewpoint bend before the gate — the classic photo needs no ticket.",
      "Boat house rentals open at 9; earlier is for rowers and birdwatchers.",
    ],
    bestTime: "October to April",
    budget: "free",
    hiddenGem: false,
  },
  {
    title: "Don Bosco Museum of Tribal Culture",
    destination: "Shillong",
    category: "culture",
    summary:
      "Seven floors of Northeast craft, costume and song under one roof.",
    description:
      "The best single introduction to the region before you travel deeper into it: full-size tribal house reconstructions, textile looms, bamboo instruments, and a top-floor gallery whose windows frame the city's hills.",
    tips: [
      "Ask at the desk for the short film on the living-root bridges — it runs on request.",
      "Combine with the butterfly museum next door for a wet-afternoon plan.",
    ],
    bestTime: "Year-round",
    budget: "moderate",
    hiddenGem: false,
  },
  {
    title: "Mawphlang Sacred Grove",
    destination: "Shillong",
    category: "nature",
    summary:
      "A thousand-year forest the village never felled — moss, orchids and law kyntang.",
    description:
      "Four kilometres off the Mawsynram road, a living Khasi sacred grove where nothing may be taken and nothing has been cut for centuries. The forest floor is moss, the canopy is oak and rhododendron, and the village elder's stories explain why it survived.",
    tips: [
      "Hire the village guide at the entrance — entry without one isn't permitted.",
      "Leave the drone and the water bottle in the car; nothing enters the grove.",
    ],
    bestTime: "September to May",
    budget: "moderate",
    hiddenGem: true,
  },

  // ── Madurai ─────────────────────────────────────────────────────────────
  {
    title: "Meenakshi Amman Temple",
    destination: "Madurai",
    category: "spiritual",
    summary:
      "Four gopurams, a thousand pillars and a city built around a goddess.",
    description:
      "Madurai's 2,500-year-old temple is not a monument but the town's operating system: markets, marriages and morning processions still turn around the shrine. Go for the architecture, stay for the evening parrot oracle and the crowd's choreography.",
    tips: [
      "Enter through the east gopuram at 6 AM before the first rush of the day.",
      "The Hall of a Thousand Pillars is easiest to read with the free temple guide sheet.",
      "Phones go in the lockers — the rules are genuinely enforced.",
    ],
    bestTime: "October to March, early morning",
    budget: "free",
    hiddenGem: false,
    ratingSum: 9,
    ratingCount: 2,
  },
  {
    title: "Theppakulam Tank at Dusk",
    destination: "Madurai",
    category: "culture",
    summary:
      "A 16th-century festival tank where the whole neighbourhood walks after dinner.",
    description:
      "Built to store rainwater for the temple festivals, Theppakulam is now Madurai's living room: a stone mandapam at the centre, families circling the steps, and float festivals that light the water once a year.",
    tips: [
      "Go after 7 PM — the stone is cool and the parrot-sellers set up on the steps.",
      "Stand on the south steps for the mandapam silhouette at blue hour.",
    ],
    bestTime: "Year-round, evenings",
    budget: "free",
    hiddenGem: true,
  },
  {
    title: "Puthu Mandapam Market",
    destination: "Madurai",
    category: "market",
    summary:
      "Jasmine strings, block-print cotton and temple-town bargaining under one hall.",
    description:
      "Directly across from the temple's east gate, this hall is where the city shops: jasmine garlands by the metre, Mysore silk on rolls, and tailors stitching a blouse while you wait. Nothing here is priced for strangers — which is the point.",
    tips: [
      "Buy malligai jasmine before 9 AM while the flowers are still tight.",
      "The north aisle has the oldest tailors; the south aisle the cheapest.",
    ],
    bestTime: "Year-round",
    budget: "budget",
    hiddenGem: false,
  },
  {
    title: "Jigarthanda Trail",
    destination: "Madurai",
    category: "food",
    summary:
      "Madurai's cold dessert — almond gum, nannari syrup, ice cream, history.",
    description:
      "Jigarthanda exists because of Madurai's heat: almond gum, sarsaparilla syrup, badam pisin and a scoop of house ice cream, layered cold enough to slow you down. The original shops still queue out the door at noon.",
    tips: [
      "Ask for 'special' — it doubles the ice cream and the almond gum.",
      "Go before the afternoon rush; the best shops make one batch a day.",
    ],
    bestTime: "March to July (it's a summer drink)",
    budget: "budget",
    hiddenGem: false,
  },

  // ── Bhuj ────────────────────────────────────────────────────────────────
  {
    title: "Aina Mahal & Prag Mahal",
    destination: "Bhuj",
    category: "history",
    summary:
      "An 18th-century mirror palace and a Gothic clock tower next door.",
    description:
      "Built by a ruler who travelled to European courts and came home with chandeliers, Aina Mahal is lacquer, mirrors and marble in tight, glittering rooms. Walk straight through to Prag Mahal's courtyard and climb the tower for the old city rooftops.",
    tips: [
      "Buy the combined ticket at Aina Mahal — Prag Mahal alone misses the best rooms.",
      "The clock tower stair is narrow; leave the big bag with whoever waits below.",
    ],
    bestTime: "October to March",
    budget: "moderate",
    hiddenGem: false,
    ratingSum: 4,
    ratingCount: 1,
  },
  {
    title: "Bhujodi Weavers' Village",
    destination: "Bhuj",
    category: "culture",
    summary:
      "Vankar households weaving Kutchi shawls — and selling straight off the loom.",
    description:
      "Eight kilometres out of Bhuj, Bhujodi is a working craft village rather than a bazaar. Families dye, spin and weave on pit looms, and the front rooms are the shop: no middleman, no fixed price list, endless cups of chai.",
    tips: [
      "Ask to watch a full pattern being set — it takes longer than the sale.",
      "The Wednesday market day brings the villagers in; quieter days mean more attention.",
    ],
    bestTime: "November to February",
    budget: "budget",
    hiddenGem: false,
  },
  {
    title: "Kala Dungar (Black Hill)",
    destination: "Bhuj",
    category: "nature",
    summary:
      "Kutch's highest point, where jackals still come for a handout at noon.",
    description:
      "Seventy kilometres north, the road climbs to a ridge with the white Rann of Kutch spread out below. At noon a local temple feeds a troop of jackals that appear out of the scrub — one of the strangest daily rituals in Gujarat.",
    tips: [
      "Time arrival for 12 PM; the feeding lasts ten minutes and then they vanish.",
      "Carry a jacket — the ridge is windy even when Bhuj is baking.",
    ],
    bestTime: "November to February",
    budget: "budget",
    hiddenGem: true,
  },
  {
    title: "Old City Snack Walk",
    destination: "Bhuj",
    category: "food",
    summary: "Gathiya, samosa, khaman and mahedi chai across Shroff Bazaar.",
    description:
      "Bhuj's old city eats standing up. A loop through Shroff Bazaar and Gandhi Market takes in fresh-fried gathiya, the khaman stalls that steam at 4 PM, and the sweet shops that have kept the same recipes since before independence.",
    tips: [
      "Start at the corner near Hamirsar lake and walk east — the frying peaks at dusk.",
      "Ask for 'kacchi' style gathiya if you want it soft inside, not crisp.",
    ],
    bestTime: "October to March",
    budget: "budget",
    hiddenGem: true,
  },
];

type SeedReview = {
  targetType: "place" | "guide";
  targetKey: string; // place title or guide name, resolved after insert
  authorName: string;
  rating: number;
  comment: string;
};

const reviews: SeedReview[] = [
  {
    targetType: "place",
    targetKey: "Assi Ghat at Dawn",
    authorName: "Neha R.",
    rating: 5,
    comment:
      "Went at 5:30 AM on a local's advice and had half the ghat to myself. The aarti felt like a neighbourhood ritual, not a show.",
  },
  {
    targetType: "place",
    targetKey: "Assi Ghat at Dawn",
    authorName: "Thomas K.",
    rating: 4,
    comment:
      "Beautiful morning. Gets busy by 7, so earlier is genuinely better. Chai on the steps was the highlight.",
  },
  {
    targetType: "place",
    targetKey: "Vijaya Vittala Temple & Stone Chariot",
    authorName: "Meera P.",
    rating: 5,
    comment:
      "Reached at 8:15 and we were nearly alone in the courtyard. The pillars really do ring — ask the guard before tapping.",
  },
  {
    targetType: "place",
    targetKey: "Vijaya Vittala Temple & Stone Chariot",
    authorName: "Junaid S.",
    rating: 5,
    comment:
      "The best-preserved ruin in Hampi. Hire the guide at the gate, worth every rupee.",
  },
  {
    targetType: "place",
    targetKey: "Khyndai Lad Food Stalls",
    authorName: "Ifeoma A.",
    rating: 4,
    comment:
      "Pointed at what the queue was having and everything was excellent. Sold out of dohneiiong by 1:45.",
  },
  {
    targetType: "place",
    targetKey: "Meenakshi Amman Temple",
    authorName: "Devika M.",
    rating: 5,
    comment:
      "Go at 6 AM. By 9 it's a different experience entirely. The east gopuram at dawn is unforgettable.",
  },
  {
    targetType: "place",
    targetKey: "Meenakshi Amman Temple",
    authorName: "Claire B.",
    rating: 4,
    comment:
      "Stunning, but do read the locker rules before you queue — we got turned back for a phone.",
  },
  {
    targetType: "place",
    targetKey: "Laitlum Canyons",
    authorName: "Rohit D.",
    rating: 4,
    comment:
      "Cloud was lifting as we arrived and the view opened up for ten glorious minutes. Go early.",
  },
  {
    targetType: "place",
    targetKey: "Godowlia Chaat Lane",
    authorName: "Ananya V.",
    rating: 5,
    comment:
      "Ate my way down the lane over three hours. The kachori stall with the steel kadhai is the one.",
  },
  {
    targetType: "place",
    targetKey: "Aina Mahal",
    authorName: "Peter H.",
    rating: 3,
    comment:
      "Genuinely special rooms, though half the palace is under restoration right now. The tower climb more than makes up for it.",
  },
  {
    targetType: "place",
    targetKey: "Sarai Mohana Weavers' Quarter",
    authorName: "Kavya S.",
    rating: 5,
    comment:
      "Watched a saree being woven over two visits and bought directly from the family. A completely different price to the showrooms.",
  },
  {
    targetType: "guide",
    targetKey: "Ramesh Tiwari",
    authorName: "Anna L.",
    rating: 5,
    comment:
      "Ramesh took us through lanes we'd never have found and ended at his cousin's chai stall. Worth every minute.",
  },
  {
    targetType: "guide",
    targetKey: "Ramesh Tiwari",
    authorName: "Siddharth G.",
    rating: 5,
    comment:
      "Booked the sunrise boat. He knew every bird, every ghat, and every story behind them.",
  },
  {
    targetType: "guide",
    targetKey: "Lakshmi Sreenath",
    authorName: "Marco B.",
    rating: 5,
    comment:
      "The Anegundi walk was the best day of our trip. Lakshmi knows every villager by name.",
  },
  {
    targetType: "guide",
    targetKey: "Lakshmi Sreenath",
    authorName: "Priya N.",
    rating: 4,
    comment:
      "Very knowledgeable and patient with our questions. Start early to beat the heat.",
  },
  {
    targetType: "guide",
    targetKey: "Wanlarki Nongkynrih",
    authorName: "Hannah W.",
    rating: 5,
    comment:
      "Cooked with us in her kitchen and then led the walk. The fermented soybean recipe finally worked at home.",
  },
  {
    targetType: "guide",
    targetKey: "Arvindbhai Zala",
    authorName: "Ritu J.",
    rating: 5,
    comment:
      "Block printing demo in Bhujodi plus the desert route — perfectly organised, no rushing.",
  },
  {
    targetType: "guide",
    targetKey: "Meenakshi Sundaram",
    authorName: "Olivier D.",
    rating: 4,
    comment:
      "Explained the temple rituals clearly and respectfully. The food stop afterwards was superb.",
  },
];

type SeedGuide = {
  name: string;
  destination: string;
  headline: string;
  bio: string;
  languages: string[];
  expertise: string[];
  years: number;
  contact: string;
  ratingSum: number;
  ratingCount: number;
};

const guides: SeedGuide[] = [
  {
    name: "Ramesh Tiwari",
    destination: "Varanasi",
    headline: "Boatman and ghat storyteller",
    bio: "Fourth-generation boatman on the Varanasi riverfront. I take small groups out at dawn, then walk the lanes behind the ghats — the weavers, the math, the kitchens that open before the city. Ask me anything; I've heard every version of every story.",
    languages: ["Hindi", "English", "Bhojpuri"],
    expertise: ["Ghats & lanes", "Sunrise boats", "Folk music"],
    years: 14,
    contact: "+91 98765 40121",
    ratingSum: 10,
    ratingCount: 2,
  },
  {
    name: "Anjali Bhatt",
    destination: "Varanasi",
    headline: "Silk, streets and slow food in the old city",
    bio: "Textile researcher who grew up two lanes from Godowlia. I run handloom visits in Sarai Mohana and an eating walk that covers breakfast through thandai — about eight stops, all of them places my family still uses.",
    languages: ["Hindi", "English"],
    expertise: ["Handloom & silk", "Food walks", "Photography routes"],
    years: 5,
    contact: "anjalisetu@example.com",
    ratingSum: 0,
    ratingCount: 0,
  },
  {
    name: "Lakshmi Sreenath",
    destination: "Hampi",
    headline: "Ruins, coracles and Anegundi village life",
    bio: "Archaeology graduate based in Kamalapur. I guide the big monuments early, then take you across the river to Anegundi for the half of Hampi most visitors never see — village life, coracle crossings and the boulder lakes.",
    languages: ["Kannada", "English", "Hindi"],
    expertise: ["Archaeology", "Village walks", "Photography spots"],
    years: 12,
    contact: "+91 98450 21874",
    ratingSum: 9,
    ratingCount: 2,
  },
  {
    name: "Wanlarki Nongkynrih",
    destination: "Shillong",
    headline: "Khasi kitchens and living-root bridges",
    bio: "I cook, walk and talk — mostly in that order. Expect a market stop, a Khasi lunch at my place, and routes to Laitlum or Mawphlang timed so you beat the mist. English, Khasi and enough Hindi to get by anywhere in the northeast.",
    languages: ["Khasi", "English", "Hindi"],
    expertise: ["Local food", "Trekking", "Craft markets"],
    years: 7,
    contact: "+91 94361 10928",
    ratingSum: 5,
    ratingCount: 1,
  },
  {
    name: "Meenakshi Sundaram",
    destination: "Madurai",
    headline: "Temple ritual, Chettinad kitchens and gopuram stories",
    bio: "Born four streets from the temple. I guide early-morning visits when the gopurams are still cool, explain the rituals instead of just the sculpture, and finish with a Chettinad meal in a family house near Sellur.",
    languages: ["Tamil", "English", "Hindi"],
    expertise: ["Temple history", "Local cuisine", "Festival routes"],
    years: 9,
    contact: "+91 94430 55210",
    ratingSum: 5,
    ratingCount: 1,
  },
  {
    name: "Arvindbhai Zala",
    destination: "Bhuj",
    headline: "Kutchi crafts, desert routes and block printing",
    bio: "I've spent fifteen years between Bhujodi's looms and the Rann's edge. Village craft demos, the white desert at the right hour, and the little shrines and stepwells that don't make the guidebooks — all doable in a day from Bhuj.",
    languages: ["Gujarati", "Kutchi", "Hindi", "English"],
    expertise: ["Block printing", "Desert routes", "Stepwells & shrines"],
    years: 11,
    contact: "+91 99094 71263",
    ratingSum: 5,
    ratingCount: 1,
  },
];

/** Contributors are attributed per destination — the seeded guide for that city. */
const contributorsByDestination: Record<string, string> = {
  Varanasi: "Anjali Bhatt",
  Hampi: "Lakshmi Sreenath",
  Shillong: "Wanlarki Nongkynrih",
  Madurai: "Meenakshi Sundaram",
  Bhuj: "Arvindbhai Zala",
};

/**
 * Seeds the demo destinations, guides and reviews exactly once.
 * Convex mutations run serially, so concurrent first loads can't double-seed.
 */
export const ensureSeed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("places").take(1);
    if (existing.length > 0) return;

    const now = Date.now();
    const resolvedPlaces = new Map<string, string>();
    for (const [i, place] of places.entries()) {
      const id = await ctx.db.insert("places", {
        title: place.title,
        destination: place.destination,
        category: place.category,
        summary: place.summary,
        description: place.description,
        tips: place.tips,
        budget: place.budget,
        bestTime: place.bestTime,
        hiddenGem: place.hiddenGem,
        contributorName:
          contributorsByDestination[place.destination] ?? "A local resident",
        ratingSum: place.ratingSum ?? 0,
        ratingCount: place.ratingCount ?? 0,
        createdAt: now - (places.length - i) * 60_000,
      });
      resolvedPlaces.set(place.title, id);
    }

    const resolvedGuides = new Map<string, string>();
    for (const [i, guide] of guides.entries()) {
      const id = await ctx.db.insert("guides", {
        name: guide.name,
        destination: guide.destination,
        headline: guide.headline,
        bio: guide.bio,
        languages: guide.languages,
        expertise: guide.expertise,
        years: guide.years,
        contact: guide.contact,
        verified: true,
        status: "active",
        ratingSum: guide.ratingSum,
        ratingCount: guide.ratingCount,
        createdAt: now - (guides.length - i) * 60_000,
      });
      resolvedGuides.set(guide.name, id);
    }

    for (const [i, review] of reviews.entries()) {
      const targetId =
        review.targetType === "place"
          ? resolvedPlaces.get(review.targetKey)
          : resolvedGuides.get(review.targetKey);
      if (!targetId) continue;
      await ctx.db.insert("reviews", {
        authorName: review.authorName,
        targetType: review.targetType,
        targetId,
        rating: review.rating,
        comment: review.comment,
        createdAt: now - (reviews.length - i) * 30_000,
      });
    }
  },
});
