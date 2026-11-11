"use client";

import { useCallback, useEffect, useState } from "react";

const PREFIX = "uki-journey:";

/**
 * useState that quietly persists to localStorage.
 * Journal answers live only in this browser — nothing is sent anywhere.
 */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  // state (not a ref) so the save effect only runs once the loaded value has been rendered
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* storage blocked — fall back to in-memory */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent("uki-store", { detail: key }));
    } catch {
      /* ignore */
    }
  }, [key, value, hydrated]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return [value, setValue, reset] as const;
}

/** Read-only snapshot of another section's saved state (re-reads when any section saves). */
export function useStoredSnapshot<T>(key: string, fallback: T): T {
  const [snap, setSnap] = useState<T>(fallback);
  useEffect(() => {
    const read = () => {
      try {
        const raw = window.localStorage.getItem(PREFIX + key);
        setSnap(raw ? (JSON.parse(raw) as T) : fallback);
      } catch {
        /* ignore */
      }
    };
    read();
    window.addEventListener("uki-store", read);
    return () => window.removeEventListener("uki-store", read);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return snap;
}

export function clearJourney() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
