"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const ease = [0.16, 1, 0.3, 1] as const;

type Lang = "en" | "es";

type Case = {
  name: string;
  redacted: boolean;
  status: "live" | "in-build";
  sector: string;
  body: string;
  metric: string;
};

const COPY: Record<
  Lang,
  {
    sectionLabel: string;
    headlineLine1: string;
    headlineLine2: string;
    intro: string;
    statusLive: string;
    statusInBuild: string;
    statusNda: string;
    cases: Case[];
  }
> = {
  en: {
    sectionLabel: "06 — Proof",
    headlineLine1: "Companies built",
    headlineLine2: "on the system.",
    intro:
      "Several of our deployments are protected by NDA. Where we cannot name a client, we describe the engagement. The companies below are live or in active production on the iKingdom architecture.",
    statusLive: "Live",
    statusInBuild: "In build",
    statusNda: "NDA",
    cases: [
      {
        name: "BuildCore Ai",
        redacted: false,
        status: "live",
        sector: "Construction Platform · San Diego",
        body: "iKingdom's productized construction vertical — a 97-agent CRM and operational platform built on the iKingdom architecture. Permit acquisition, lead intelligence, sales pipeline, and field crew coordination running as one autonomous layer.",
        metric: "97 agents · live",
      },
      {
        name: "Distinct Construction Solutions",
        redacted: false,
        status: "live",
        sector: "Construction · Southern California",
        body: "First production deployment of BuildCore Ai. Full operational stack — permit hunter, lead intelligence, sales pipeline, and field crew coordination — running on the iKingdom architecture.",
        metric: "Live · BuildCore",
      },
      {
        name: "Elite Control Group LLC",
        redacted: false,
        status: "live",
        sector: "Holding Company · California",
        body: "Centralized intelligence and finance layer across an operating portfolio. Shared agent infrastructure with per-entity isolation.",
        metric: "Live",
      },
      {
        name: "Kyros Global Capital",
        redacted: false,
        status: "live",
        sector: "Capital · Investment · California",
        body: "Bespoke deployment architecture for an investment firm. Deal flow intake, due diligence assistance, and reporting automation built into the iKingdom framework.",
        metric: "Live",
      },
      {
        name: "Structura Aeternum",
        redacted: false,
        status: "live",
        sector: "Architecture & Build · California / Texas",
        body: "Operational platform tailored to project-based work — bid intake, proposal generation, project tracking, and client communications running on the agent layer.",
        metric: "Live",
      },
      {
        name: "The world's first online mortgage brokerage",
        redacted: true,
        status: "in-build",
        sector: "Real Estate Finance · Global",
        body: "End-to-end transactional automation under construction. Lead intake, qualification, document handling, underwriting coordination, and post-close communications — engineered to run without a single human touchpoint on the standard path.",
        metric: "In active build",
      },
      {
        name: "A national moving & storage operator",
        redacted: true,
        status: "in-build",
        sector: "Logistics · West Coast",
        body: "Full 80-agent deployment under build. AI receptionist, instant quoting, GPS-verified crew tracking, automated dispatch, and a finance tier that closes the day's books before midnight.",
        metric: "In active build",
      },
      {
        name: "Terra Bella Nursery",
        redacted: false,
        status: "in-build",
        sector: "Horticulture & Retail",
        body: "Bespoke iKingdom deployment for horticulture and retail nursery operations. Inventory, customer intake, scheduling, and back office under one autonomous layer.",
        metric: "In active build",
      },
    ],
  },
  es: {
    sectionLabel: "06 — Pruebas",
    headlineLine1: "Compañías construidas",
    headlineLine2: "sobre el sistema.",
    intro:
      "Varios de nuestros despliegues están protegidos por NDA. Donde no podemos nombrar a un cliente, describimos el compromiso. Las compañías a continuación están en vivo o en producción activa sobre la arquitectura iKingdom.",
    statusLive: "En vivo",
    statusInBuild: "En construcción",
    statusNda: "NDA",
    cases: [
      {
        name: "BuildCore Ai",
        redacted: false,
        status: "live",
        sector: "Plataforma de Construcción · San Diego",
        body: "La vertical de construcción de iKingdom convertida en producto — una plataforma operacional y CRM de 97 agentes construida sobre la arquitectura iKingdom. Adquisición de permisos, inteligencia de prospectos, pipeline de ventas y coordinación de cuadrillas en campo operando como una capa autónoma única.",
        metric: "97 agentes · en vivo",
      },
      {
        name: "Distinct Construction Solutions",
        redacted: false,
        status: "live",
        sector: "Construcción · Sur de California",
        body: "Primer despliegue en producción de BuildCore Ai. Stack operacional completo — buscador de permisos, inteligencia de prospectos, pipeline de ventas y coordinación de cuadrillas — operando sobre la arquitectura iKingdom.",
        metric: "En vivo · BuildCore",
      },
      {
        name: "Elite Control Group LLC",
        redacted: false,
        status: "live",
        sector: "Sociedad Holding · California",
        body: "Capa centralizada de inteligencia y finanzas a través de un portafolio operativo. Infraestructura de agentes compartida con aislamiento por entidad.",
        metric: "En vivo",
      },
      {
        name: "Kyros Global Capital",
        redacted: false,
        status: "live",
        sector: "Capital · Inversión · California",
        body: "Arquitectura de despliegue a la medida para una firma de inversión. Recepción de flujo de oportunidades, asistencia en debida diligencia y automatización de reportes integrados al marco iKingdom.",
        metric: "En vivo",
      },
      {
        name: "Structura Aeternum",
        redacted: false,
        status: "live",
        sector: "Arquitectura y Construcción · California / Texas",
        body: "Plataforma operacional adaptada al trabajo basado en proyectos — recepción de licitaciones, generación de propuestas, seguimiento de proyectos y comunicaciones con clientes operando sobre la capa de agentes.",
        metric: "En vivo",
      },
      {
        name: "El primer brokerage hipotecario en línea del mundo",
        redacted: true,
        status: "in-build",
        sector: "Finanzas Inmobiliarias · Global",
        body: "Automatización transaccional de extremo a extremo en construcción. Recepción de prospectos, calificación, manejo de documentos, coordinación de suscripción y comunicaciones post-cierre — diseñada para operar sin un solo punto de contacto humano en el camino estándar.",
        metric: "En construcción activa",
      },
      {
        name: "Un operador nacional de mudanzas y almacenamiento",
        redacted: true,
        status: "in-build",
        sector: "Logística · Costa Oeste",
        body: "Despliegue completo de 80 agentes en construcción. Recepcionista de IA, cotización instantánea, seguimiento de cuadrillas verificado por GPS, despacho automatizado y un nivel financiero que cierra los libros del día antes de medianoche.",
        metric: "En construcción activa",
      },
      {
        name: "Terra Bella Nursery",
        redacted: false,
        status: "in-build",
        sector: "Horticultura y Retail",
        body: "Despliegue iKingdom a la medida para operaciones de horticultura y vivero retail. Inventario, recepción de clientes, programación y administración bajo una capa autónoma única.",
        metric: "En construcción activa",
      },
    ],
  },
};

export default function Proof({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".proof-headline", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="proof"
      aria-label={lang === "es" ? "Pruebas" : "Proof"}
      className="relative py-32 md:py-48 border-t border-[--color-line]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="flex items-center gap-3 mb-20"
        >
          <span className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
            {t.sectionLabel}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="proof-headline font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          {t.headlineLine1}
          <br />
          <span className="italic text-[--color-fg-muted]">
            {t.headlineLine2}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="mt-10 max-w-2xl text-sm md:text-base text-[--color-fg-muted] leading-relaxed"
        >
          {t.intro}
        </motion.p>

        <div className="mt-24 md:mt-32 grid md:grid-cols-2 gap-px bg-[--color-line-strong]">
          {t.cases.map((c, i) => (
            <motion.article
              key={c.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease, delay: (i % 2) * 0.1 }}
              className="bg-[--color-bg] p-10 md:p-14 hover:bg-[--color-bg-elevated] transition-colors duration-700 group flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
                  {c.sector}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.status === "live" ? (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[--color-bg] bg-[--color-fg] px-2 py-1 rounded-full font-medium">
                      {t.statusLive}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[--color-fg-muted] border border-[--color-line-strong] px-2 py-1 rounded-full">
                      {t.statusInBuild}
                    </span>
                  )}
                  {c.redacted && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[--color-fg-muted] border border-[--color-line-strong] px-2 py-1 rounded-full">
                      {t.statusNda}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-display text-2xl md:text-[34px] leading-[1.05] tracking-[-0.015em] text-[--color-fg] group-hover:text-[--color-accent] transition-colors duration-700">
                {c.name}
              </h3>

              <p className="mt-6 text-[15px] md:text-base text-[--color-fg-muted] leading-relaxed text-pretty flex-1">
                {c.body}
              </p>

              <div className="mt-10 pt-6 border-t border-[--color-line-strong] flex items-center justify-between">
                <span className="text-xs text-[--color-fg-muted] tabular-nums">
                  {c.metric}
                </span>
                <span className="h-px w-8 bg-[--color-accent] opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
