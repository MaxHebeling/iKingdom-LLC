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

export default function Home() {
  return (
    <>
      <Nav />
      <AgentTrace />
      <PulseTicker />
      <main className="relative">
        <Hero />
        <Method />
        <Capabilities />
        <Continuity />
        <Process />
        <OperationsConsole />
        <Proof />
        <Application />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
