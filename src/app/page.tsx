import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeHero } from "@/components/home/HomeHero";
import { JourneyMap } from "@/components/home/JourneyMap";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CuriousQuestion } from "@/components/home/CuriousQuestion";
import { DiscoverYourself } from "@/components/home/DiscoverYourself";
import { GrowthJournal } from "@/components/home/GrowthJournal";
import { Achievements } from "@/components/home/Achievements";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <HomeHero />
        <CuriousQuestion q="Do you really know yourself?" emoji="🪞" tone="sun" />
        <JourneyMap />
        <HowItWorks />
        <CuriousQuestion q="What if your biggest weakness could become a strength?" emoji="🌱" tone="teal" />
        <DiscoverYourself />
        <CuriousQuestion q="How much can you discover in just one week?" emoji="🔍" tone="coral" />
        <GrowthJournal />
        <CuriousQuestion q="Are you in control of your attention?" emoji="🎯" tone="sun" />
        <Achievements />
        <CuriousQuestion q="What would you attempt if you weren't afraid?" emoji="🦁" tone="lilac" />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
