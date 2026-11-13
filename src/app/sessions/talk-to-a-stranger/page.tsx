import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SessionRail } from "@/components/SessionRail";
import { SiteFooter } from "@/components/SiteFooter";
import { SESSION_FOUR_STOPS } from "@/lib/sessions";
import { Hero } from "@/components/session4/Hero";
import { WhyStrangers } from "@/components/session4/WhyStrangers";
import { Toolkit } from "@/components/session4/Toolkit";
import { Practice } from "@/components/session4/Practice";
import { Mission } from "@/components/session4/Mission";
import { BusinessInterview, PersonInterview } from "@/components/session4/Interviews";
import { Present } from "@/components/session4/Present";
import { Reflect } from "@/components/session4/Reflect";

export const metadata: Metadata = {
  title: "Session 4 · Talk to a Stranger — Unfold",
  description: "One hour in the real world: interview a stranger about their life and a business owner about their journey, then present what you learned.",
};

export default function TalkToAStrangerPage() {
  return (
    <>
      <SiteNav sessionLabel="Session 04 · Talk to a Stranger" />
      <SessionRail stops={SESSION_FOUR_STOPS} />
      <main>
        <Hero />
        <WhyStrangers />
        <Toolkit />
        <Practice />
        <Mission />
        <PersonInterview />
        <BusinessInterview />
        <Present />
        <Reflect />
      </main>
      <SiteFooter />
    </>
  );
}
