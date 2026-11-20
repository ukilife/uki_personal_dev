import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { HowToUse, MindGamesHero } from "@/components/mindgames/Hero";
import { MindGamesHub } from "@/components/mindgames/Hub";

export const metadata: Metadata = {
  title: "Mind Games — Unfold",
  description:
    "30 interactive brain breaks for between lessons, including 10 harder Brain Boss challenges. Each game trains a real quality: focus, memory, planning, patience, teamwork and more.",
};

export default function MindGamesPage() {
  return (
    <>
      <SiteNav />
      <main>
        <MindGamesHero />
        <HowToUse />
        <MindGamesHub />
      </main>
      <SiteFooter />
    </>
  );
}
