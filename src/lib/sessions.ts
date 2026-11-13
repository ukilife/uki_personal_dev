export type SceneId = "island" | "mountain" | "forest" | "city";

export type SessionMeta = {
  number: number;
  slug: string;
  title: string;
  /** the place on the journey map */
  destination: string;
  /** the curiosity question */
  headline: string;
  description: string;
  activities: string[];
  cta: string;
  scene: SceneId;
  /** accent colour (hex) and soft background class */
  color: string;
  soft: string;
  /** only sessions that already have an interactive page */
  href?: string;
};

/** The four Unfold sessions — real curriculum, no extras. */
export const SESSIONS: SessionMeta[] = [
  {
    number: 1,
    slug: "who-am-i",
    title: "Who Am I?",
    destination: "The Discovery Island",
    headline: "Who Am I, Really?",
    description: "There's more to you than your name, age and hometown. Discover what makes you unique!",
    activities: [
      "Name Chain Challenge",
      "Two Eyes Character Challenge",
      "About Me",
      "Button Passing Challenge",
      "Understanding Concentration",
      "Discovering Strengths & Weaknesses",
      "Personal Reflection",
    ],
    cta: "Discover Myself",
    scene: "island",
    color: "#1f9d8a",
    soft: "bg-sky",
    href: "/sessions/who-am-i",
  },
  {
    number: 2,
    slug: "discipline-and-dreams",
    title: "Discipline & Dreams",
    destination: "The Dream Mountain",
    headline: "How Far Can Your Dreams Take You?",
    description:
      "Dreams need discipline to climb. Train your self-control, take on a 21-day challenge, map your SWOT and write the bucket list of your life.",
    activities: [
      "Strengths & Weaknesses, Part 2",
      "Why Discipline Matters",
      "Discipline Games",
      "21-Day Challenge",
      "Why Challenge Matters",
      "SWOT Analysis",
      "My Own SWOT",
      "Bucket List",
      "Figure Yourself (homework)",
    ],
    cta: "Climb the Mountain",
    scene: "mountain",
    color: "#7b3fa0",
    soft: "bg-lilac",
    href: "/sessions/discipline-and-dreams",
  },
  {
    number: 3,
    slug: "dream-board",
    title: "My Dream Board",
    destination: "The Vision Forest",
    headline: "What Does Your Future Look Like?",
    description:
      "Gather your dreams, values, personality, strengths and future goals — then draw them into a dream board for your classroom wall.",
    activities: [
      "Why a Dream Board?",
      "My Dreams",
      "My Values",
      "My Personality",
      "My Strengths",
      "My Future Goals",
      "Board Planner",
      "Draw It on Paper",
      "Classroom Gallery Walk",
    ],
    cta: "Build My Dream Board",
    scene: "forest",
    color: "#5aa832",
    soft: "bg-mint",
    href: "/sessions/dream-board",
  },
  {
    number: 4,
    slug: "talk-to-a-stranger",
    title: "Talk to a Stranger",
    destination: "The Courage City",
    headline: "What Happens When You Step Outside Your Comfort Zone?",
    description:
      "Every person has a story. Find your courage, start conversations, listen and discover a world beyond yourself.",
    activities: [
      "Speed Hellos",
      "Conversation Practice",
      "Real-World Stranger Challenge",
      "Story Collection",
      "Presenting Lessons Learned",
      "Personal Reflection",
    ],
    cta: "Unlock My Courage",
    scene: "city",
    color: "#f7845e",
    soft: "bg-blush",
  },
];

/** Number of take-home missions in Session 1 (see session1/TakeHome.tsx). */
export const SESSION_ONE_MISSIONS = 4;

/** The stops of Session 1, in teaching order (mirrors the facilitator deck). */
export const SESSION_ONE_STOPS = [
  { id: "start", label: "Who am I?", emoji: "🪞" },
  { id: "name-chain", label: "Name Chain", emoji: "🔗" },
  { id: "find-someone", label: "Find Someone Who", emoji: "🔍" },
  { id: "two-eyes", label: "Two Eyes", emoji: "👀" },
  { id: "real-you", label: "Meet the Real You", emoji: "📔" },
  { id: "button-challenge", label: "Button Challenge", emoji: "🔘" },
  { id: "attention", label: "Focus Power", emoji: "🎯" },
  { id: "superpowers", label: "Superpowers", emoji: "⚡" },
  { id: "not-yet", label: "Not YET", emoji: "🌱" },
  { id: "checkpoint", label: "Checkpoint", emoji: "🧘" },
  { id: "take-home", label: "Take-Home", emoji: "🎒" },
] as const;

/** Number of take-home missions in Session 2 (see session2/FigureYourself.tsx). */
export const SESSION_TWO_MISSIONS = 4;

/** The stops of Session 2, in teaching order. */
export const SESSION_TWO_STOPS = [
  { id: "start", label: "Discipline & Dreams", emoji: "⛰️" },
  { id: "strengths", label: "Strengths, Part 2", emoji: "⚖️" },
  { id: "discipline", label: "Why Discipline", emoji: "🧭" },
  { id: "discipline-games", label: "Discipline Games", emoji: "🎮" },
  { id: "21-days", label: "21-Day Challenge", emoji: "📅" },
  { id: "challenge", label: "Why Challenge", emoji: "🧗" },
  { id: "swot-intro", label: "SWOT Intro", emoji: "🧩" },
  { id: "my-swot", label: "My SWOT", emoji: "🗺️" },
  { id: "bucket-list", label: "Bucket List", emoji: "🪣" },
  { id: "take-home", label: "Figure Yourself", emoji: "🎒" },
] as const;

/** Number of take-home missions in Session 3 (see session3/TakeHome.tsx). */
export const SESSION_THREE_MISSIONS = 4;

/** The stops of Session 3, in teaching order. */
export const SESSION_THREE_STOPS = [
  { id: "start", label: "My Dream Board", emoji: "🌳" },
  { id: "why", label: "Why a Dream Board?", emoji: "💡" },
  { id: "dreams", label: "My Dreams", emoji: "🌟" },
  { id: "values", label: "My Values", emoji: "🧭" },
  { id: "personality", label: "My Personality", emoji: "🎭" },
  { id: "strengths", label: "My Strengths", emoji: "💪" },
  { id: "goals", label: "Future Goals", emoji: "🎯" },
  { id: "planner", label: "Board Planner", emoji: "🗺️" },
  { id: "paper", label: "Draw It", emoji: "🖍️" },
  { id: "take-home", label: "Take-Home", emoji: "🎒" },
] as const;
