import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title:
    "La Primera Firma de Operaciones de IA | Automatización Empresarial | San Diego",
  description:
    "Desplegamos 80 agentes autónomos de IA en 9 niveles para automatizar tu empresa. Inversión desde $35K. San Diego, CA. Solo por solicitud.",
  keywords: [
    "operaciones de IA",
    "firma de operaciones de IA",
    "automatizacion empresarial",
    "automatizacion de IA",
    "consultoria de IA",
    "agentes autonomos de IA",
    "automatizacion de procesos de negocio",
    "despliegue de agentes de IA",
    "soluciones de IA empresarial",
    "IA para negocios",
    "empresa de IA San Diego",
  ],
  alternates: {
    canonical: "https://www.ikingdom.org/es",
    languages: {
      en: "https://www.ikingdom.org",
      es: "https://www.ikingdom.org/es",
    },
  },
  openGraph: {
    title: "iKingdom — La Primera Firma de Operaciones de IA del Mundo",
    description:
      "La primera firma de operaciones de IA del mundo. 80 agentes autonomos. 9 niveles operacionales. Construimos empresas que se operan solas. Inversion desde $35K. Solo por solicitud.",
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    url: "https://www.ikingdom.org/es",
    siteName: "iKingdom",
    images: [
      {
        url: "/og-image-es.png",
        width: 1200,
        height: 630,
        alt: "iKingdom — La primera firma de operaciones de IA del mundo. 80 agentes. 9 niveles. San Diego, CA.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iKingdom — La Primera Firma de Operaciones de IA del Mundo",
    description:
      "La primera firma de operaciones de IA. 80 agentes de IA. 9 niveles. Construimos empresas que se operan solas. San Diego, CA.",
    images: ["/og-image-es.png"],
  },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Diego",
    "geo.position": "32.7157;-117.1611",
    ICBM: "32.7157, -117.1611",
  },
};

export default function HomeES() {
  return (
    <>
      <EngagementTracker />
      <Nav lang="es" />
      <AgentTrace lang="es" />
      <PulseTicker />
      <main id="main-content" className="relative">
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
