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

export default function Home() {
  return (
    <>
      <EngagementTracker />
      <Nav lang="en" />
      <AgentTrace lang="en" />
      <PulseTicker />
      <main className="relative">
        <Hero lang="en" />
        <Method lang="en" />
        <Capabilities lang="en" />
        <Continuity lang="en" />
        <Process lang="en" />
        <OperationsConsole lang="en" />
        <Proof lang="en" />
        <Application lang="en" />
      </main>
      <Footer lang="en" />
      <ChatWidget />
    </>
  );
}
