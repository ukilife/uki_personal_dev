/** Interview questions for the two Session 4 conversations — shared by the cards and the presentation. */

export type Field = {
  id: string;
  label: string;
  ask: string;
  followUp?: string;
  ph: string;
  long?: boolean;
  optional?: boolean;
};

export const PERSON_FIELDS: Field[] = [
  { id: "name", label: "Name", ask: "May I know your name?", ph: "Mr. Ravi", optional: true },
  { id: "from", label: "From", ask: "Where are you from?", ph: "Jaffna" },
  { id: "age", label: "Age", ask: "If you don't mind me asking — how old are you?", ph: "about 60", optional: true },
  { id: "work", label: "What they do", ask: "What do you do every day?", ph: "Runs a tea stall for 30 years" },
  {
    id: "lessons",
    label: "Life lessons from hardship",
    ask: "What has life taught you through the hard times?",
    followUp: "Can you tell me about a moment that taught you that?",
    ph: "Nothing is permanent — good or bad times…",
    long: true,
  },
  {
    id: "hardship",
    label: "Most painful hardship",
    ask: "What was the hardest moment of your life — if you're comfortable sharing?",
    followUp: "How did you feel at that time?",
    ph: "Lost the shop in a flood…",
    long: true,
  },
  {
    id: "overcome",
    label: "How they overcame it",
    ask: "How did you get through it?",
    followUp: "Who or what helped you most?",
    ph: "Started again with a small cart, family helped…",
    long: true,
  },
  { id: "advice", label: "Advice for me", ask: "If you could give one piece of advice to someone my age, what would it be?", ph: "Respect your parents and save money…", long: true },
  { id: "surprise", label: "What surprised me", ask: "(Your own note) What surprised you most in this conversation?", ph: "I didn't expect him to laugh about it…", long: true, optional: true },
];

export const BUSINESS_FIELDS: Field[] = [
  { id: "business", label: "Business", ask: "What is the name of your business — and what do you sell?", ph: "Lakshmi Bakery — bread & short eats" },
  { id: "owner", label: "Owner", ask: "May I know your name? Are you the owner?", ph: "Mrs. Lakshmi, owner", optional: true },
  { id: "years", label: "How long", ask: "How long has the business been running?", ph: "12 years" },
  {
    id: "idea",
    label: "How the idea came",
    ask: "How did you get the idea to start this business?",
    followUp: "What made you finally take the first step?",
    ph: "Mother's recipes, people kept asking…",
    long: true,
  },
  { id: "start", label: "How they started", ask: "How did you start — with how much money, and what was the first step?", ph: "Small oven at home, sold to neighbours…", long: true },
  {
    id: "competition",
    label: "Competition",
    ask: "Who are your competitors? What makes customers choose you?",
    ph: "Three bakeries nearby; fresh every morning, friendly prices…",
    long: true,
  },
  {
    id: "survive",
    label: "How they survive hard times",
    ask: "What was the hardest time for the business, and how did you survive it?",
    followUp: "What would you do differently?",
    ph: "Covid lockdown — started home delivery by phone…",
    long: true,
  },
  {
    id: "advice",
    label: "Advice for a future entrepreneur",
    ask: "I'm planning to be an entrepreneur one day. What advice would you give me?",
    ph: "Start small, keep your promise to customers…",
    long: true,
  },
  { id: "surprise", label: "What surprised me", ask: "(Your own note) What surprised you most about this business?", ph: "They make only 20% profit…", long: true, optional: true },
];

export type Interview = Record<string, string>;
export const INTERVIEW_EMPTY: Interview = {};

export const answered = (fields: Field[], v: Interview) => fields.filter((f) => (v[f.id] ?? "").trim()).length;
