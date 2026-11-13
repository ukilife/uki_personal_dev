"use client";

import { SESSIONS, SESSION_FOUR_MISSIONS, SESSION_ONE_MISSIONS, SESSION_THREE_MISSIONS, SESSION_TWO_MISSIONS } from "./sessions";
import { useStoredSnapshot } from "./useLocalState";

export type SessionState = "completed" | "current" | "upcoming";

/**
 * Journey states from what this student has actually done on this device.
 * Each session counts as completed once all their take-home missions are ticked.
 * Later sessions have no tracking yet, so they're never marked completed.
 * Nothing is locked: "upcoming" only changes the visual treatment.
 */
export function useJourneyStates(): SessionState[] {
  const missions = useStoredSnapshot<boolean[]>("s1-missions", []);
  const s1Done = missions.length >= SESSION_ONE_MISSIONS && missions.slice(0, SESSION_ONE_MISSIONS).every(Boolean);
  const m2 = useStoredSnapshot<boolean[]>("s2-missions", []);
  const s2Done = m2.length >= SESSION_TWO_MISSIONS && m2.slice(0, SESSION_TWO_MISSIONS).every(Boolean);
  const m3 = useStoredSnapshot<boolean[]>("s3-missions", []);
  const s3Done = m3.length >= SESSION_THREE_MISSIONS && m3.slice(0, SESSION_THREE_MISSIONS).every(Boolean);
  const m4 = useStoredSnapshot<boolean[]>("s4-missions", []);
  const s4Done = m4.length >= SESSION_FOUR_MISSIONS && m4.slice(0, SESSION_FOUR_MISSIONS).every(Boolean);
  const done: Record<number, boolean> = { 1: s1Done, 2: s2Done, 3: s3Done, 4: s4Done };
  const completed = SESSIONS.map((s) => done[s.number] ?? false);
  const current = completed.findIndex((c) => !c);
  return SESSIONS.map((_, i) => (completed[i] ? "completed" : i === current ? "current" : "upcoming"));
}

/** True when a saved journal value holds any real answer (non-empty text or a ticked box). */
export function hasContent(v: unknown): boolean {
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return false;
  if (Array.isArray(v)) return v.some(hasContent);
  if (v && typeof v === "object") return Object.values(v).some(hasContent);
  return false;
}
