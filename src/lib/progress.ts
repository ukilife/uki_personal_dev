"use client";

import { SESSIONS, SESSION_ONE_MISSIONS } from "./sessions";
import { useStoredSnapshot } from "./useLocalState";

export type SessionState = "completed" | "current" | "upcoming";

/**
 * Journey states from what this student has actually done on this device.
 * Session 1 counts as completed once all its take-home missions are ticked.
 * Later sessions have no tracking yet, so they're never marked completed.
 * Nothing is locked: "upcoming" only changes the visual treatment.
 */
export function useJourneyStates(): SessionState[] {
  const missions = useStoredSnapshot<boolean[]>("s1-missions", []);
  const s1Done = missions.length >= SESSION_ONE_MISSIONS && missions.slice(0, SESSION_ONE_MISSIONS).every(Boolean);
  const completed = SESSIONS.map((s) => (s.number === 1 ? s1Done : false));
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
