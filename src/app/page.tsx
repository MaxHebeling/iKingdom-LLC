import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Footer from "@/components/Footer";

// Heavy below-fold components loaded dynamically to reduce initial JS bundle
const Method = dynamic(() => import("@/components/Method"));
const Capabilities = dynamic(() => import("@/components/Capabilities"));
const Continuity = dynamic(() => import("@/components/Continuity"));
const Process = dynamic(() => import("@/components/Process"));
const OperationsConsole = dynamic(
  () => import("@/components/OperationsConsole"),
);
const Proof = dynamic(() => import("@/components/Proof"));
const Application = dynamic(() => import("@/components/Application"));
const AgentTrace = dynamic(() => import("@/components/AgentTrace"));
const PulseTicker = dynamic(() => import("@/components/PulseTicker"));
const ChatWidget = dynamic(() => import("@/components/ChatWidget"));
const EngagementTracker = dynamic(
  () => import("@/components/EngagementTracker"),
);

export default function Home() {
  return (
    <>
      <EngagementTracker />
      <Nav lang="en" />
      <AgentTrace lang="en" />
      <PulseTicker />
      <main id="main-content" className="relative">
        <Hero lang="en" />
        <ClientLogos lang="en" />
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
