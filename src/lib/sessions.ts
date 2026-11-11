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
    slug: "focus-and-dreams",
    title: "Focus & Dreams",
    destination: "The Dream Mountain",
    headline: "How Far Can Your Dreams Take You?",
    description:
      "Your dreams are waiting. Discover what you want, sharpen your focus and start turning imagination into real goals.",
    activities: ["Concentration Challenges", "Memory Games", "Focus Techniques", "Dreams vs Goals", "SMART Goals", "Dream Board Creation"],
    cta: "Explore My Dreams",
    scene: "mountain",
    color: "#7b3fa0",
    soft: "bg-lilac",
  },
  {
    number: 3,
    slug: "dreams-to-discipline",
    title: "From Dreams to Discipline",
    destination: "The Habit Forest",
    headline: "Can Small Habits Change Your Future?",
    description:
      "Big dreams need small daily actions. Discover your strengths, build better habits and turn your goals into progress.",
    activities: [
      "Personal SWOT Analysis",
      "Dream Board Presentations",
      "Understanding Discipline",
      "Habit Loop",
      "21-Day Habit Tracker",
      "Team Challenges",
    ],
    cta: "Build My Habits",
    scene: "forest",
    color: "#5aa832",
    soft: "bg-mint",
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
