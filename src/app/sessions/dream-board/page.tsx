import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SessionRail } from "@/components/SessionRail";
import { SiteFooter } from "@/components/SiteFooter";
import { SESSION_THREE_STOPS } from "@/lib/sessions";
import { Hero } from "@/components/session3/Hero";
import { WhyBoard } from "@/components/session3/WhyBoard";
import { Dreams } from "@/components/session3/Dreams";
import { Values } from "@/components/session3/Values";
import { Personality } from "@/components/session3/Personality";
import { Strengths } from "@/components/session3/Strengths";
import { Goals } from "@/components/session3/Goals";
import { BoardPlanner } from "@/components/session3/BoardPlanner";
import { PaperBoard } from "@/components/session3/PaperBoard";
import { TakeHome } from "@/components/session3/TakeHome";

export const metadata: Metadata = {
  title: "Session 3 · My Dream Board — Unfold",
  description: "Gather your dreams, values, personality, strengths and future goals — then draw your dream board for the classroom wall.",
};

export default function DreamBoardPage() {
  return (
    <>
      <SiteNav sessionLabel="Session 03 · My Dream Board" />
      <SessionRail stops={SESSION_THREE_STOPS} />
      <main>
        <Hero />
        <WhyBoard />
        <Dreams />
        <Values />
        <Personality />
        <Strengths />
        <Goals />
        <BoardPlanner />
        <PaperBoard />
        <TakeHome />
      </main>
      <SiteFooter />
    </>
  );
}
