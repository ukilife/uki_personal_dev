/** Saved shapes for Session 3 — every section reads the others to build the board. */

export type DreamsState = { picked: string[]; own: string[] };
export const DREAMS_EMPTY: DreamsState = { picked: [], own: [] };
export const DREAMS_MAX = 6;

export type ValuesState = { picked: string[]; top: string[] };
export const VALUES_EMPTY: ValuesState = { picked: [], top: [] };

export type PersonalityState = { sliders: Record<string, number>; words: string[] };
export const PERSONALITY_EMPTY: PersonalityState = { sliders: {}, words: [] };

export type StrengthsState = { picked: string[]; own: string[] };
export const STRENGTHS_EMPTY: StrengthsState = { picked: [], own: [] };

export type Horizon = "1 year" | "5 years" | "10 years";
export type Goal = { dream: string; goal: string; by: Horizon; step: string };
export const GOALS_EMPTY: Goal[] = [
  { dream: "", goal: "", by: "1 year", step: "" },
  { dream: "", goal: "", by: "5 years", step: "" },
  { dream: "", goal: "", by: "10 years", step: "" },
];

export type BoardState = { name: string; motto: string; word: string };
export const BOARD_EMPTY: BoardState = { name: "", motto: "", word: "" };

export const allDreams = (d: DreamsState) => [...new Set([...d.picked, ...d.own].map((x) => x.trim()).filter(Boolean))];
export const allStrengths = (s: StrengthsState) => [...new Set([...s.picked, ...s.own].map((x) => x.trim()).filter(Boolean))];
