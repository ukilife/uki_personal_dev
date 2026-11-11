import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SessionRail } from "@/components/SessionRail";
import { SiteFooter } from "@/components/SiteFooter";
import { SESSION_ONE_STOPS } from "@/lib/sessions";
import { Hero } from "@/components/session1/Hero";
import { NameChain } from "@/components/session1/NameChain";
import { FindSomeone } from "@/components/session1/FindSomeone";
import { TwoEyes } from "@/components/session1/TwoEyes";
import { RealYouJournal } from "@/components/session1/RealYou";
import { ButtonChallenge } from "@/components/session1/ButtonChallenge";
import { Attention } from "@/components/session1/Attention";
import { Superpowers } from "@/components/session1/Superpowers";
import { NotYet } from "@/components/session1/NotYet";
import { Checkpoint } from "@/components/session1/Checkpoint";
import { TakeHome } from "@/components/session1/TakeHome";

export const metadata: Metadata = {
  title: "Session 1 · Who Am I? — Unfold",
  description: "Do you really know yourself? Play, draw, race and reflect your way to the answer.",
};

export default function WhoAmIPage() {
  return (
    <>
      <SiteNav sessionLabel="Session 01 · Who Am I?" />
      <SessionRail stops={SESSION_ONE_STOPS} />
      <main>
        <Hero />
        <NameChain />
        <FindSomeone />
        <TwoEyes />
        <RealYouJournal />
        <ButtonChallenge />
        <Attention />
        <Superpowers />
        <NotYet />
        <Checkpoint />
        <TakeHome />
      </main>
      <SiteFooter />
    </>
  );
}
