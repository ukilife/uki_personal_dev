"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Check, Clock, MessageCircle, Shuffle, Sparkles, Users, User, X } from "lucide-react";
import { Button, Pill, Reveal } from "@/components/ui";
import { useLocalState } from "@/lib/useLocalState";
import { FAMILIES, MIND_GAMES, type GameFamily, type MindGame } from "@/lib/mindGames";
import { GAME_COMPONENTS } from "./registry";
import { pick } from "./kit";

type Played = Record<string, string>; // id → last result summary

const FAMILY_ORDER = Object.keys(FAMILIES) as GameFamily[];

function ModeTag({ mode }: { mode: MindGame["mode"] }) {
  if (mode === "class")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft">
        <Users size={13} /> Whole class
      </span>
    );
  if (mode === "solo")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft">
        <User size={13} /> Solo
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft">
      <Users size={13} /> Solo or class
    </span>
  );
}

function GameCard({ g, n, played, onOpen }: { g: MindGame; n: number; played?: string; onOpen: () => void }) {
  const fam = FAMILIES[g.family];
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6, rotate: n % 2 ? 1 : -1 }}
      onClick={onOpen}
      className="card-pop group relative flex h-full flex-col rounded-3xl border-2 border-ink bg-white p-5 text-left"
    >
      <span className="absolute top-4 right-4 font-display text-3xl font-bold text-ink/10">{String(n).padStart(2, "0")}</span>
      <span className={`grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink text-3xl ${fam.soft}`}>{g.emoji}</span>
      <h3 className="mt-3 text-2xl font-bold">{g.title}</h3>
      <span
        className="mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider text-white uppercase"
        style={{ background: fam.color }}
      >
        <Sparkles size={12} /> {g.quality}
      </span>
      <p className="mt-3 flex-1 text-sm text-ink-soft">{g.hook}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft">
            <Clock size={13} /> {g.minutes} min
          </span>
          <ModeTag mode={g.mode} />
        </span>
        {played ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft px-2 py-0.5 text-xs font-bold text-teal">
            <Check size={12} /> Played
          </span>
        ) : (
          <span className="font-display text-sm font-bold text-grape group-hover:underline">Play →</span>
        )}
      </div>
    </motion.button>
  );
}

function Player({ g, onClose, played, onDone }: { g: MindGame; onClose: () => void; played?: string; onDone: (s: string) => void }) {
  const Game = GAME_COMPONENTS[g.id];
  const fam = FAMILIES[g.family];
  const [justPlayed, setJustPlayed] = useState(false);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const done = useCallback(
    (s: string) => {
      setJustPlayed(true);
      onDone(s);
    },
    [onDone],
  );

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={g.title}
        initial={{ y: 40, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto my-4 w-[calc(100%-1rem)] max-w-6xl rounded-[2rem] border-2 border-ink bg-cream p-4 sm:my-8 sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-ink text-2xl ${fam.soft}`}>{g.emoji}</span>
            <div>
              <h2 className="text-2xl leading-tight font-bold sm:text-3xl">{g.title}</h2>
              <p className="text-sm font-semibold" style={{ color: fam.color }}>
                Trains: {g.quality}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close game" className="btn-pop grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-white">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
          <div>
            <Game onDone={done} />
            <p className="mt-3 text-sm text-ink-soft">
              <b>How to play:</b> {g.how}
            </p>
          </div>

          <aside className="space-y-3">
            <div className="rounded-3xl border-2 border-ink p-4 text-white" style={{ background: fam.color }}>
              <p className="text-xs font-bold tracking-[0.18em] uppercase opacity-90">The skill · {g.quality}</p>
              <p className="mt-2 font-display text-lg leading-snug font-semibold">{g.lesson}</p>
            </div>
            <div className="rounded-3xl border-2 border-ink bg-white p-4">
              <p className="text-xs font-bold tracking-[0.18em] text-ink-soft uppercase">Where you use it</p>
              <p className="mt-1 text-sm">{g.realLife}</p>
            </div>
            <motion.div
              animate={justPlayed ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 0.6 }}
              className={`rounded-3xl border-2 border-ink p-4 ${justPlayed ? "bg-sun" : "bg-sun-soft"}`}
            >
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase">
                <MessageCircle size={14} /> Talk about it
              </p>
              <p className="mt-1 font-display text-lg leading-snug font-semibold">{g.talk}</p>
            </motion.div>
            {played && (
              <p className="rounded-2xl border-2 border-dashed border-ink/30 bg-white/70 px-3 py-2 text-xs text-ink-soft">
                Last result on this device: <b className="text-ink">{played}</b>
              </p>
            )}
          </aside>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MindGamesHub() {
  const [filter, setFilter] = useState<GameFamily | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const [played, setPlayed] = useLocalState<Played>("mind-games:played", {});

  // deep links: /mind-games/#colour-clash opens that game
  useEffect(() => {
    const read = () => {
      const id = window.location.hash.slice(1);
      setOpen(MIND_GAMES.some((g) => g.id === id) ? id : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const openGame = (id: string) => {
    window.history.replaceState(null, "", `#${id}`);
    setOpen(id);
  };
  const close = useCallback(() => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setOpen(null);
  }, []);
  const markDone = useCallback((s: string) => {
    if (open) setPlayed((p) => ({ ...p, [open]: s }));
  }, [open, setPlayed]);

  const list = filter === "all" ? MIND_GAMES : MIND_GAMES.filter((g) => g.family === filter);
  const playedCount = MIND_GAMES.filter((g) => played[g.id]).length;
  const randomGame = () => {
    const pool = MIND_GAMES.filter((g) => !played[g.id]);
    const from = pool.length ? pool : MIND_GAMES;
    openGame(pick(from).id);
  };
  const current = MIND_GAMES.find((g) => g.id === open);

  return (
    <section id="games" className="relative scroll-mt-20 bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-8 md:py-24">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Pill className="bg-blush text-ink">20 games · 20 qualities</Pill>
            <h2 className="mt-4 text-4xl leading-tight font-bold sm:text-5xl">Pick a game. Train a skill.</h2>
            <p className="mt-3 text-lg text-ink-soft">
              Every game names the quality it builds, the lesson behind it, and one question to talk about afterwards.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <Button variant="grape" onClick={randomGame}>
              <Shuffle size={18} /> Surprise me
            </Button>
            <p className="text-sm font-semibold text-ink-soft">
              {playedCount} / {MIND_GAMES.length} played on this device
            </p>
            <div className="h-2.5 w-48 overflow-hidden rounded-full border-2 border-ink bg-white">
              <div className="h-full bg-gradient-to-r from-coral via-sun to-teal" style={{ width: `${(playedCount / MIND_GAMES.length) * 100}%` }} />
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter games">
          <button
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={`rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold transition ${filter === "all" ? "bg-ink text-cream" : "bg-white hover:bg-sun-soft"}`}
          >
            All 20
          </button>
          {FAMILY_ORDER.map((f) => {
            const n = MIND_GAMES.filter((g) => g.family === f).length;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold transition ${filter === f ? "text-white" : "bg-white hover:bg-sun-soft"}`}
                style={filter === f ? { background: FAMILIES[f].color } : undefined}
              >
                {FAMILIES[f].label} · {n}
              </button>
            );
          })}
        </div>
        {filter !== "all" && <p className="mt-3 text-ink-soft">{FAMILIES[filter].blurb}</p>}

        <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((g) => (
              <GameCard key={g.id} g={g} n={MIND_GAMES.indexOf(g) + 1} played={played[g.id]} onOpen={() => openGame(g.id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {current && <Player key={current.id} g={current} onClose={close} played={played[current.id]} onDone={markDone} />}
      </AnimatePresence>
    </section>
  );
}
