import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import Capabilities from "@/components/Capabilities";
import Continuity from "@/components/Continuity";
import Process from "@/components/Process";
import OperationsConsole from "@/components/OperationsConsole";
import Proof from "@/components/Proof";
import Application from "@/components/Application";
import Footer from "@/components/Footer";
import AgentTrace from "@/components/AgentTrace";
import PulseTicker from "@/components/PulseTicker";
import ChatWidget from "@/components/ChatWidget";
import EngagementTracker from "@/components/EngagementTracker";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <EngagementTracker />
      <Nav />
      <AgentTrace />
      <PulseTicker />
      <main className="relative">
        <Hero />
        <SectionDivider number="01" label="Method" />
        <Method />
        <SectionDivider number="02" label="Capabilities" />
        <Capabilities />
        <SectionDivider number="03" label="Continuity" />
        <Continuity />
        <SectionDivider number="04" label="Process" />
        <Process />
        <SectionDivider number="05" label="Live System" />
        <OperationsConsole />
        <SectionDivider number="06" label="Proof" />
        <Proof />
        <SectionDivider number="07" label="Application" />
        <Application />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
