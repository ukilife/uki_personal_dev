"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ButtonLink, Reveal } from "@/components/ui";
import { FAMILIES, MIND_GAMES } from "@/lib/mindGames";

const PREVIEW = ["colour-clash", "tower-shift", "captain-says", "count-to-twenty", "hundred-uses", "breathe-bubble"];

export function MindGamesTeaser() {
  const games = PREVIEW.map((id) => MIND_GAMES.find((g) => g.id === id)!);
  return (
    <section id="mind-games" className="relative overflow-hidden border-y-2 border-ink bg-lilac">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-grape uppercase">Brain breaks</p>
          <h2 className="mt-3 text-4xl leading-tight font-bold sm:text-5xl">
            Energy low? Play a <span className="squiggle">Mind Game.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            {MIND_GAMES.length} quick games for between lessons. Every game trains one real quality — focus, memory, planning, self-control,
            creativity, teamwork and more — and ends with a question that turns play into a lesson.
          </p>
          <ButtonLink href="/mind-games/" variant="grape" className="mt-7">
            Open Mind Games <ArrowRight size={18} />
          </ButtonLink>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {games.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -6, rotate: i % 2 ? 2 : -2 }}
                className="card-pop h-full rounded-3xl border-2 border-ink bg-white"
              >
                <Link href={`/mind-games/#${g.id}`} className="block h-full p-4">
                  <span className="text-3xl">{g.emoji}</span>
                  <p className="mt-2 font-display text-lg leading-tight font-bold">{g.title}</p>
                  <p className="mt-1 text-xs font-bold tracking-wider uppercase" style={{ color: FAMILIES[g.family].color }}>
                    {g.quality}
                  </p>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
