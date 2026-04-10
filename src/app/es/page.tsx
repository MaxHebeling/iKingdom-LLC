import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "iKingdom — La primera firma de operaciones de IA del mundo",
  description:
    "iKingdom diseña y despliega operaciones autónomas de IA para empresas ambiciosas. Ochenta agentes. Nueve niveles. Una empresa completamente automatizada. Solo por solicitud.",
  alternates: {
    canonical: "https://ikingdom.org/es",
    languages: {
      en: "https://ikingdom.org/",
      es: "https://ikingdom.org/es",
    },
  },
  openGraph: {
    title: "iKingdom — La primera firma de operaciones de IA del mundo",
    description:
      "Ochenta agentes. Nueve niveles. Una empresa completamente automatizada. Solo por solicitud.",
    type: "website",
    locale: "es_ES",
  },
};

export default function HomeES() {
  return (
    <>
      <EngagementTracker />
      <Nav lang="es" />
      <AgentTrace lang="es" />
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
