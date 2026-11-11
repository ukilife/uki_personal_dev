import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SessionRail } from "@/components/SessionRail";
import { SiteFooter } from "@/components/SiteFooter";
import { SESSION_TWO_STOPS } from "@/lib/sessions";
import { Hero } from "@/components/session2/Hero";
import { StrengthsPart2 } from "@/components/session2/StrengthsPart2";
import { Discipline } from "@/components/session2/Discipline";
import { DisciplineGames } from "@/components/session2/DisciplineGames";
import { TwentyOneDays } from "@/components/session2/TwentyOneDays";
import { Challenge } from "@/components/session2/Challenge";
import { SwotIntro } from "@/components/session2/SwotIntro";
import { MySwot } from "@/components/session2/MySwot";
import { BucketList } from "@/components/session2/BucketList";
import { FigureYourself } from "@/components/session2/FigureYourself";

export const metadata: Metadata = {
  title: "Session 2 · Discipline & Dreams — Unfold",
  description: "Train your self-control, take on a 21-day challenge, map your SWOT and write your bucket list.",
};

export default function DisciplineAndDreamsPage() {
  return (
    <>
      <SiteNav sessionLabel="Session 02 · Discipline & Dreams" />
      <SessionRail stops={SESSION_TWO_STOPS} />
      <main>
        <Hero />
        <StrengthsPart2 />
        <Discipline />
        <DisciplineGames />
        <TwentyOneDays />
        <Challenge />
        <SwotIntro />
        <MySwot />
        <BucketList />
        <FigureYourself />
      </main>
      <SiteFooter />
    </>
  );
}
