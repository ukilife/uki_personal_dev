import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeHero } from "@/components/home/HomeHero";
import { JourneyMap } from "@/components/home/JourneyMap";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <HomeHero />
        <HowItWorks />
        <JourneyMap />
      </main>
      <SiteFooter />
    </>
  );
}
