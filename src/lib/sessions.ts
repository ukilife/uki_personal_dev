export type SessionMeta = {
  number: number;
  slug: string;
  title: string;
  question: string;
  blurb: string;
  status: "open" | "next" | "locked";
  color: string;
};

export const SESSIONS: SessionMeta[] = [
  {
    number: 1,
    slug: "who-am-i",
    title: "Who Am I?",
    question: "Do you really know yourself?",
    blurb: "Name chains, mystery characters, a button showdown and your first Growth Journal pages.",
    status: "open",
    color: "#f7845e",
  },
  {
    number: 2,
    slug: "dreams-to-goals",
    title: "Dreams → Goals",
    question: "What if your dreams could become real goals?",
    blurb: "Unlocks after Session 1. Bring your take-home missions!",
    status: "next",
    color: "#1f9d8a",
  },
  {
    number: 3,
    slug: "session-3",
    title: "???",
    question: "A new mystery is loading…",
    blurb: "Keep growing to reveal it.",
    status: "locked",
    color: "#2f7fc1",
  },
  {
    number: 4,
    slug: "session-4",
    title: "???",
    question: "Top secret (for now).",
    blurb: "Keep growing to reveal it.",
    status: "locked",
    color: "#7b3fa0",
  },
  {
    number: 5,
    slug: "session-5",
    title: "???",
    question: "The final chapter… or is it?",
    blurb: "Keep growing to reveal it.",
    status: "locked",
    color: "#ffc93c",
  },
];

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
