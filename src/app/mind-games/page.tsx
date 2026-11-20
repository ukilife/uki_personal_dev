import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { HowToUse, MindGamesHero } from "@/components/mindgames/Hero";
import { MindGamesHub } from "@/components/mindgames/Hub";

export const metadata: Metadata = {
  title: "Mind Games — Unfold",
  description:
    "20 quick interactive brain breaks for between lessons. Each game trains a real quality: focus, memory, planning, patience, teamwork and more.",
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
