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

export default function HomeES() {
  return (
    <>
      <EngagementTracker />
      <Nav lang="es" />
      <AgentTrace />
      <PulseTicker />
      <main className="relative">
        <Hero lang="es" />
        <Method lang="es" />
        <Capabilities lang="es" />
        <Continuity lang="es" />
        <Process lang="es" />
        <OperationsConsole lang="es" />
        <Proof lang="es" />
        <Application lang="es" />
      </main>
      <Footer lang="es" />
      <ChatWidget />
    </>
  );
}
