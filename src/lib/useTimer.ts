"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playAlarm, primeAlarm, stopAlarm } from "./alarm";

export type TimerMode = "up" | "down";

/**
 * One timer, two modes:
 *  - "up": a stopwatch that counts up
 *  - "down": set a time, it counts down and rings an alarm at zero
 */
export function useTimer({
  mode: initialMode = "up",
  seconds: initialSeconds = 180,
  tick = 200,
  onAlarm,
}: { mode?: TimerMode; seconds?: number; tick?: number; onAlarm?: () => void } = {}) {
  const [mode, setModeState] = useState<TimerMode>(initialMode);
  const [target, setTargetState] = useState(initialSeconds);
  const [elapsed, setElapsed] = useState(0); // ms
  const [running, setRunning] = useState(false);
  const [ringing, setRinging] = useState(false);
  const base = useRef(0);
  const startedAt = useRef(0);
  const alarmCb = useRef(onAlarm);

  useEffect(() => {
    alarmCb.current = onAlarm;
  }, [onAlarm]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const e = base.current + Date.now() - startedAt.current;
      if (mode === "down" && e >= target * 1000) {
        base.current = target * 1000;
        setElapsed(target * 1000);
        setRunning(false);
        setRinging(true);
        playAlarm();
        alarmCb.current?.();
        return;
      }
      setElapsed(e);
    }, tick);
    return () => clearInterval(id);
  }, [running, mode, target, tick]);

  const reset = useCallback(() => {
    base.current = 0;
    setElapsed(0);
    setRunning(false);
    setRinging(false);
    stopAlarm();
  }, []);

  const start = useCallback(() => {
    primeAlarm();
    stopAlarm();
    setRinging(false);
    if (mode === "down" && base.current >= target * 1000) {
      base.current = 0;
      setElapsed(0);
    }
    startedAt.current = Date.now();
    setRunning(true);
  }, [mode, target]);

  const pause = useCallback(() => {
    if (!running) return;
    base.current += Date.now() - startedAt.current;
    setElapsed(base.current);
    setRunning(false);
  }, [running]);

  const toggle = useCallback(() => (running ? pause() : start()), [running, pause, start]);

  const setMode = useCallback(
    (m: TimerMode) => {
      reset();
      setModeState(m);
    },
    [reset],
  );

  const setTarget = useCallback(
    (s: number) => {
      reset();
      setTargetState(Math.max(10, Math.min(60 * 60, Math.round(s))));
    },
    [reset],
  );

  const shownMs = mode === "up" ? elapsed : Math.max(0, target * 1000 - elapsed);
  const progress = mode === "down" ? Math.min(1, elapsed / (target * 1000)) : 0;

  return {
    mode,
    setMode,
    target,
    setTarget,
    elapsed,
    shownMs,
    progress,
    running,
    ringing,
    started: elapsed > 0 || running,
    start,
    pause,
    toggle,
    reset,
    dismiss: () => {
      setRinging(false);
      stopAlarm();
    },
  };
}

export type Timer = ReturnType<typeof useTimer>;

/** mm:ss — or m:ss.t with tenths. Countdowns round up so "00:01" shows until the very end. */
export function formatTime(ms: number, { tenths = false, ceil = false }: { tenths?: boolean; ceil?: boolean } = {}) {
  if (tenths) {
    const whole = Math.floor(ms / 1000);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}.${Math.floor((ms % 1000) / 100)}`;
  }
  const whole = ceil ? Math.ceil(ms / 1000) : Math.floor(ms / 1000);
  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
}

export function timerLabel(t: Timer, tenths = false) {
  return formatTime(t.shownMs, { tenths, ceil: t.mode === "down" && !tenths });
}
