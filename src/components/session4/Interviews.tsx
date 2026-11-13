"use client";

import { InterviewCard } from "./InterviewCard";
import { BUSINESS_FIELDS, PERSON_FIELDS } from "./state";

export function PersonInterview() {
  return (
    <InterviewCard
      id="person"
      stop={5}
      storageKey="s4-person"
      fields={PERSON_FIELDS}
      kicker="Conversation 1 · A person"
      title={
        <>
          Their life, their <span className="text-coral">lessons</span> 🧓
        </>
      }
      intro="Talk to someone about their life: who they are, the hardest thing they've faced, how they got through it — and what they'd tell someone your age. Be gentle: they're trusting you with their story."
      tone="blush"
      accent="#f7845e"
      card="bg-blush"
      emoji="🧓"
    />
  );
}

export function BusinessInterview() {
  return (
    <InterviewCard
      id="business"
      stop={6}
      storageKey="s4-business"
      fields={BUSINESS_FIELDS}
      kicker="Conversation 2 · A business"
      title={
        <>
          From an idea to a <span className="text-teal">business</span> 🏪
        </>
      }
      intro="Find a small business — a shop, a stall, a workshop. You're a future entrepreneur doing research: how did the idea start, how do they beat the competition, how did they survive the hard times?"
      tone="mint"
      accent="#1f9d8a"
      card="bg-teal-soft"
      emoji="🏪"
    />
  );
}
